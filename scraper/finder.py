"""
finder.py — busca de candidatos a filme em domínio público, em Python.

Começou como uma porta pra Python de server/src/seed/tools/findCandidates.js
(mesmas quatro fontes originais), pra poder rodar como um serviço web
separado (ver app.py) acionado por um botão no /admin em vez de precisar
rodar `npm run find-movies` na mão. Depois ganhou mais duas fontes (ver
abaixo) descobertas numa leva manual de animação japonesa.

O QUE ISSO FAZ
---------------
Raspa seis fontes de filme em domínio público:
  - publicdomainmovie.net, archivewatch.org, emol.org, freemoviescinema.com
    (as quatro originais do findCandidates.js — resolve o identifier de
    cada título no archive.org via busca por texto)
  - retroflix.org (busca direto no archive.org pelo uploader fixo deles,
    upload@retroflix.org — já vem com archive_id certo, sem passo de
    resolução por título)
  - archive.org, coleções prelinger/usgovfilms diretamente (filtradas por
    licenseurl de domínio público explícito)
Verifica a duração real do vídeo (pra descartar trailer/clipe), remove
duplicata contra o catálogo atual (consultado via API, com o mesmo token de
admin usado pra disparar a busca) e contra o CSV de rodadas anteriores (se o
arquivo existir no checkout), e devolve uma lista de candidatos com status
ADICIONADO/DESCARTADO e o motivo de cada decisão.

O QUE ISSO NÃO FAZ
-------------------
Não julga risco de direito autoral além de duração + ano de corte (mesma
limitação documentada no findCandidates.js original) — isso continua exigindo
revisão manual depois, é trabalho editorial demais pra automatizar com
segurança. Também não escreve sinopse nem mexe no catálogo em produção.
"""

from __future__ import annotations

import csv
import html
import io
import json
import os
import re
import time
import unicodedata
from concurrent.futures import ThreadPoolExecutor, as_completed
from urllib.parse import quote, urljoin, urlparse

import requests

HTTP_HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
        "(KHTML, like Gecko) Chrome/120.0 Safari/537.36"
    )
}
REQUEST_TIMEOUT = 20
CONCURRENCY = 8

# Mesmo espírito do corte em findCandidates.js: acima disso, domínio público
# é exceção (não regra) e exige checagem manual caso a caso.
CANDIDATE_MAX_YEAR = 1966
# Abaixo disso, é trailer/clipe, não o filme completo.
MIN_MINUTES = 2
# Teto de segurança pra um único disparo via web não rodar por horas.
MAX_CANDIDATES_TO_VERIFY = int(os.environ.get("SCRAPER_MAX_CANDIDATES", "3000"))

BANNED_TITLE_RE = re.compile(
    r"\b(molest|jailbait|jail bait|kiddie sex|preteen|lolita\b(?!.*1962)|"
    r"snuff film|bestiality|incest\b|grindhouse compilation|double feature hell|"
    r"xxx\b|hardcore|porn)",
    re.IGNORECASE,
)
VIDEO_EXT_RE = re.compile(r"\.(mp4|ogv|mpeg|mpg|avi|mov|mkv|m4v|webm)$", re.IGNORECASE)

PAGE_LIMITS = {
    "publicdomainmovie": {
        "categories": [
            "feature_movies",
            "comedy_movies",
            "drama_and_romance",
            "science_fiction_and_horror",
            "cartoons",
        ],
        "max_pages_per_category": 220,
    },
    "freemoviescinema": {"max_pages": 60},
    "emol": {
        "pages": [
            "https://emol.org/movies/adventure/index.html",
            "https://emol.org/movies/comedy/index.html",
            "https://emol.org/movies/horror/index.html",
            "https://emol.org/movies/romance/index.html",
            "https://emol.org/movies/westerns/index.html",
            "https://emol.org/movies/bettyboop/index.html",
            "https://emol.org/movies/threestooges/index.html",
            "https://emol.org/movies/popeye/index.html",
            "https://emol.org/movies/felixthecat/index.html",
            "https://emol.org/movies/woodywoodpecker/index.html",
            "https://emol.org/movies/laurelandhardy/index.html",
            "https://emol.org/movies/mightymouse/index.html",
        ]
    },
    "archivewatch": {
        "index_url": "https://archivewatch.org/catalog-index.json",
        "shelves": [
            "silent-hall-of-fame",
            "silent-era",
            "film-noir",
            "scifi-horror",
            "comedy",
            "classic-cartoons",
            "vintage-cartoons",
            "animation-all",
            "german-cinema",
            "melies",
            "prelinger",
            "educational",
            "newsreels",
            "nasa",
            "video-cellar",
            "wikidata-pd",
            "community-favorites",
            "most-discussed",
            "hidden-gems",
        ],
        "allowed_content_types": {
            "feature-film",
            "silent-film",
            "short-film",
            "animation",
            "documentary",
            "newsreel",
        },
    },
    # RetroFlix.org — descoberto explorando fontes de animação japonesa
    # antiga: todo o catálogo deles (~3100 títulos) é enviado ao archive.org
    # por uma única conta (upload@retroflix.org), sempre com licenseurl de
    # domínio público explícito. Buscar direto no archive.org por esse
    # uploader é muito mais rápido e confiável do que raspar o site deles
    # título a título — e já vem com o archive_id certo, sem precisar do
    # passo de resolução por título (que é onde a maioria dos falsos
    # positivos acontece nas outras fontes).
    "retroflix": {
        "uploader": "upload@retroflix.org",
        "rows_per_page": 500,
    },
    # Coleções do próprio archive.org já usadas manualmente com sucesso em
    # levas anteriores deste catálogo (prelinger = Prelinger Archives, filmes
    # industriais/educativos/publicitários americanos; usgovfilms = produção
    # do governo federal dos EUA, domínio público por lei). Filtradas por
    # licenseurl de domínio público explícito — sem isso, cada coleção tem
    # dezenas de milhares de itens de todo tipo, não só filmes de verdade.
    "archive_collections": {
        "collections": ["prelinger", "usgovfilms"],
        "rows_per_page": 500,
    },
}

CSV_HEADER = [
    "titulo",
    "ano",
    "fonte",
    "archive_org_id",
    "duracao_verificada_min",
    "status",
    "motivo",
    "slug",
    "link",
]


def log(progress, message):
    """Anexa uma linha ao log do job e imprime no stdout (visível nos logs do Render)."""
    print(f"[finder] {message}", flush=True)
    if progress is not None:
        progress.push_log(message)


class ScrapeCancelled(Exception):
    """Levantada quando o usuário clica em "Cancelar busca" no meio do job."""


def check_cancel(progress):
    """Chamado nos pontos de checkpoint de cada loop (entre páginas, entre
    candidatos verificados, entre fontes) — levanta ScrapeCancelled se o
    admin pediu cancelamento. `progress` pode não ter esse método (ex: os
    scripts `_run_real.py`/`_anime_search.py` usam uma classe mais simples
    sem suporte a cancelamento) — nesse caso, nunca cancela."""
    if progress is not None and getattr(progress, "should_cancel", None) and progress.should_cancel():
        raise ScrapeCancelled()


def fetch_text(url, retries=2):
    last_err = None
    for attempt in range(retries + 1):
        try:
            res = requests.get(url, headers=HTTP_HEADERS, timeout=REQUEST_TIMEOUT)
            if res.status_code >= 400:
                raise requests.HTTPError(f"HTTP {res.status_code} for {url}")
            return res.text
        except Exception as e:  # noqa: BLE001 — queremos capturar qualquer falha de rede aqui
            last_err = e
            if attempt < retries:
                time.sleep(1.2 * (attempt + 1))
    raise last_err


def fetch_json(url):
    res = requests.get(url, headers=HTTP_HEADERS, timeout=REQUEST_TIMEOUT)
    res.raise_for_status()
    return res.json()


def decode_entities(s):
    return html.unescape(s or "")


def norm_title(s):
    t = decode_entities(s or "").lower()
    t = re.sub(r"^charlie chaplin'?s\s*", "", t)
    t = unicodedata.normalize("NFKD", t)
    t = re.sub(r"[^a-z0-9]+", " ", t).strip()
    return t


# ---------------------------------------------------------------------------
# Passo 1: catálogo atual (dedupe) — via API, com o mesmo token de admin
# usado pra disparar a busca. Não acessa o MongoDB diretamente.
# ---------------------------------------------------------------------------


def load_existing_catalog(backend_url, admin_token):
    # GET /api/movies limita `limit` a 2000 por página no backend (ver
    # movieController.js) — o catálogo já passou disso, então pagina até
    # esgotar em vez de confiar num único request. Errar aqui é grave: um
    # catálogo incompleto faz o dedupe deixar passar filme repetido.
    movies = []
    page = 1
    while True:
        res = requests.get(
            f"{backend_url}/api/movies",
            params={"limit": 2000, "page": page},
            headers={"Authorization": f"Bearer {admin_token}"},
            timeout=30,
        )
        res.raise_for_status()
        body = res.json()
        batch = body.get("data", [])
        movies.extend(batch)
        pagination = body.get("pagination") or {}
        if not batch or page >= (pagination.get("pages") or 1):
            break
        page += 1

    ids = {m["source"]["id"] for m in movies if m.get("source", {}).get("id")}
    titles = {norm_title(m["title"]) for m in movies if m.get("title")}
    return {"ids": ids, "titles": titles}


# ---------------------------------------------------------------------------
# Passo 1b: decisões de rodadas anteriores — lido direto do CSV do repositório,
# se o checkout tiver o arquivo (ver CATALOG_CSV_PATH em app.py). Opcional:
# se o arquivo não existir, só pulamos essa camada de dedupe.
# ---------------------------------------------------------------------------


def load_previous_csv_decisions(csv_path):
    ids, titles = set(), set()
    if not csv_path or not os.path.exists(csv_path):
        return {"ids": ids, "titles": titles}
    try:
        with open(csv_path, "r", encoding="utf-8-sig", newline="") as f:
            reader = csv.reader(f)
            next(reader, None)  # header
            for row in reader:
                if len(row) < 4:
                    continue
                titulo, _, _, archive_id = row[0], row[1], row[2], row[3]
                if archive_id:
                    ids.add(archive_id)
                if titulo:
                    titles.add(norm_title(titulo))
    except Exception as e:  # noqa: BLE001
        print(f"[finder] falha lendo CSV anterior ({csv_path}): {e}", flush=True)
    return {"ids": ids, "titles": titles}


# ---------------------------------------------------------------------------
# Passo 2: scrapers por site
# ---------------------------------------------------------------------------

_PDM_ROW_RE = re.compile(
    r'<a href="https://publicdomainmovie\.net/movie/[a-zA-Z0-9-]+"><img[^>]*></a></td><td[^>]*>'
    r'<div class="details"><div class="date"><a[^>]*>(\d{4})</a></div><h1><a[^>]*>([^<]+)</a></h1>'
)


def scrape_publicdomainmovie(progress):
    out = []
    cfg = PAGE_LIMITS["publicdomainmovie"]
    for cat in cfg["categories"]:
        log(progress, f"[publicdomainmovie.net] categoria {cat}: começando (até {cfg['max_pages_per_category']} páginas)")
        consecutive_failures = 0
        pages_fetched = 0
        for p in range(cfg["max_pages_per_category"]):
            check_cancel(progress)
            url = (
                f"https://publicdomainmovie.net/{cat}"
                if p == 0
                else f"https://publicdomainmovie.net/{cat}?page={p}"
            )
            try:
                text = fetch_text(url)
                pages_fetched += 1
                consecutive_failures = 0
                count = 0
                for m in _PDM_ROW_RE.finditer(text):
                    year = int(m.group(1))
                    title = decode_entities(m.group(2))
                    title = re.sub(r"^charlie chaplin'?s\s*", "", title, flags=re.IGNORECASE)
                    title = title.strip("\"'")
                    out.append({"title": title, "year": year, "source": "publicdomainmovie.net"})
                    count += 1
                if progress is not None and pages_fetched % 10 == 0:
                    progress.update(candidates_found=len(out))
                    log(progress, f"[publicdomainmovie.net] {cat}: {pages_fetched} páginas, {len(out)} candidatos até agora")
                if count == 0:
                    break
            except Exception as e:  # noqa: BLE001
                consecutive_failures += 1
                log(progress, f"[publicdomainmovie.net] {cat} pagina {p} falhou ({consecutive_failures}/3): {e}")
                if consecutive_failures >= 3:
                    break
        log(progress, f"[publicdomainmovie.net] categoria {cat}: concluída ({pages_fetched} páginas)")
    return out


# O tema antigo (grid com classe "gridmax-grid-post-thumbnail-link") saiu do
# ar — o site hoje é um WordPress padrão. Em vez de tentar acompanhar o HTML
# de listagem (que já mudou uma vez), usamos o sitemap.xml do WordPress
# (sempre no mesmo formato, gerado automaticamente) pra pegar a URL de cada
# post, e o título "limpo" de cada post individual sai do JSON-LD
# (`"@type":"WebPage","name":"Título (Ano): Subtítulo"`) que o tema injeta em
# toda página — mesmo padrão testado manualmente em várias posts do site.
_FMC_SITEMAP_URLS = [
    "https://freemoviescinema.com/post-sitemap1.xml",
    "https://freemoviescinema.com/post-sitemap2.xml",
]
_FMC_TITLE_RE = re.compile(r'"@type":"WebPage","name":"([^"]+)"')


def scrape_freemoviescinema(progress):
    urls = set()
    for sitemap_url in _FMC_SITEMAP_URLS:
        try:
            text = fetch_text(sitemap_url)
        except Exception as e:  # noqa: BLE001
            log(progress, f"[freemoviescinema.com] {sitemap_url} falhou: {e}")
            continue
        for loc in re.findall(r"<loc>([^<]+)</loc>", text):
            if loc.rstrip("/") != "https://freemoviescinema.com":
                urls.add(loc)

    out = []
    for url in sorted(urls):
        check_cancel(progress)
        try:
            text = fetch_text(url)
        except Exception as e:  # noqa: BLE001
            log(progress, f"[freemoviescinema.com] {url} falhou: {e}")
            continue
        m = _FMC_TITLE_RE.search(text)
        if not m:
            continue
        raw_title = decode_entities(m.group(1))
        if re.search(r"what is the public domain|visual archaeology|journey through|explainer", raw_title, re.IGNORECASE):
            continue
        year_match = re.search(r"\((\d{4})\)", raw_title)
        title = re.sub(r"\s*\(\d{4}\)\s*:?.*$", "", raw_title).strip()
        out.append(
            {
                "title": title,
                "year": int(year_match.group(1)) if year_match else None,
                "source": "freemoviescinema.com",
            }
        )
    return out


# O título nem sempre fica direto dentro do <a> — às vezes vem embrulhado em
# <font>/<strong> aninhados (ex: <a href="..."><font><strong>Título</strong>
# </font></a>) — por isso captura tudo até o </a> mais próximo (non-greedy)
# e limpa as tags internas depois, em vez de exigir texto puro.
_EMOL_ANCHOR_RE = re.compile(
    r'<a[^>]*href="(https://archive\.org/details/[a-zA-Z0-9_.\-]+)"[^>]*>(.*?)</a>',
    re.DOTALL,
)


def scrape_emol(progress):
    out = []
    for url in PAGE_LIMITS["emol"]["pages"]:
        check_cancel(progress)
        try:
            text = fetch_text(url)
            for m in _EMOL_ANCHOR_RE.finditer(text):
                archive_id = m.group(1).replace("https://archive.org/details/", "")
                inner = re.sub(r"<[^>]+>", "", m.group(2))
                raw_title = decode_entities(inner)
                year_match = re.search(r"\((\d{4})\)", raw_title)
                title = re.sub(r"\s*\(\d{4}\)\s*$", "", raw_title).strip()
                if not title:
                    continue
                out.append(
                    {
                        "title": title,
                        "year": int(year_match.group(1)) if year_match else None,
                        "source": "emol.org",
                        "archive_id": archive_id,
                    }
                )
        except Exception as e:  # noqa: BLE001
            log(progress, f"[emol.org] {url} falhou: {e}")
    return out


def scrape_archivewatch(progress):
    out = []
    cfg = PAGE_LIMITS["archivewatch"]
    try:
        data = fetch_json(cfg["index_url"])
        items = data.get("items", [])  # [id, title, year, contentType, poster, pro, search, backdrop]
        by_id = {it[0]: it for it in items}
        shelves = data.get("shelves", {})
        allowed_types = cfg["allowed_content_types"]

        seen_ids = set()
        for shelf_key in cfg["shelves"]:
            ids = shelves.get(shelf_key)
            if not isinstance(ids, list):
                log(progress, f'[archivewatch.org] prateleira "{shelf_key}" nao encontrada no indice atual — pulando')
                continue
            for item_id in ids:
                if item_id in seen_ids:
                    continue
                seen_ids.add(item_id)
                it = by_id.get(item_id)
                if not it:
                    continue
                item_id2, title, year, content_type = it[0], it[1], it[2], it[3]
                if content_type not in allowed_types:
                    continue
                out.append(
                    {
                        "title": title,
                        "year": year or None,
                        "source": "archivewatch.org",
                        "archive_id": item_id2,
                    }
                )
    except Exception as e:  # noqa: BLE001
        log(progress, f"[archivewatch.org] falha ao buscar catalog-index.json: {e}")
    return out


def _archive_search_all_pages(query, rows_per_page, progress, source_label):
    """Pagina o advancedsearch.php do archive.org até esgotar os resultados.
    Usado pelas fontes que buscam direto no archive.org (retroflix,
    archive_collections) — essas já vêm com archive_id, title, year e
    licenseurl prontos, sem precisar do passo de resolução por título."""
    out = []
    page = 1
    while True:
        check_cancel(progress)
        url = (
            "https://archive.org/advancedsearch.php?q="
            + quote(query)
            + "&fl[]=identifier&fl[]=title&fl[]=year&fl[]=licenseurl"
            + f"&rows={rows_per_page}&page={page}&output=json"
        )
        try:
            data = fetch_json(url)
        except Exception as e:  # noqa: BLE001
            log(progress, f"[{source_label}] página {page} falhou: {e}")
            break
        docs = (data.get("response") or {}).get("docs") or []
        if not docs:
            break
        for d in docs:
            out.append(
                {
                    "title": d.get("title") or d.get("identifier"),
                    "year": d.get("year"),
                    "source": source_label,
                    "archive_id": d.get("identifier"),
                }
            )
        if progress is not None and page % 3 == 0:
            log(progress, f"[{source_label}] {page * rows_per_page} itens percorridos até agora...")
        if len(docs) < rows_per_page:
            break
        page += 1
        time.sleep(0.3)  # educado com a API — advancedsearch não gosta de rajada
    return out


def scrape_retroflix(progress):
    cfg = PAGE_LIMITS["retroflix"]
    query = f'uploader:("{cfg["uploader"]}") AND mediatype:(movies)'
    return _archive_search_all_pages(query, cfg["rows_per_page"], progress, "retroflix.org")


def scrape_archive_collections(progress):
    out = []
    cfg = PAGE_LIMITS["archive_collections"]
    for coll in cfg["collections"]:
        query = f"collection:({coll}) AND mediatype:(movies) AND licenseurl:(*publicdomain*)"
        found = _archive_search_all_pages(query, cfg["rows_per_page"], progress, f"archive.org ({coll})")
        log(progress, f"[archive.org ({coll})] {len(found)} candidatos brutos")
        out.extend(found)
    return out


_TITLE_LINK_RE = re.compile(r'<a[^>]*href="[^"]*"[^>]*>([^<]{3,120})</a>')
_NAV_TEXT_RE = re.compile(
    r"^(home|about|contact|login|sign ?in|register|next|previous|more|menu|search|"
    r"privacy|terms|©|copyright|subscribe|donate|facebook|twitter|instagram)\b",
    re.IGNORECASE,
)


def scrape_custom(url, mode, progress):
    """Busca avulsa: um único site escolhido pelo admin na hora, em vez das
    fontes fixas. Não pagina automaticamente — só a URL exata fornecida (se
    o site tiver várias páginas, rode de novo com cada URL). Dois modos:
      - "links": só extrai link direto pro archive.org/details ou /embed já
        presente na página. Funciona em qualquer HTML, mas só acha alguma
        coisa se o site já linka pro archive.org diretamente (como
        emol.org) — não serve pra site que só cita o título do filme.
      - "text": também tenta ler o texto de cada link da página como
        possível título de filme, e resolve por busca no archive.org (igual
        publicdomainmovie.net). Bem menos preciso — sem estrutura fixa pra
        confiar, tende a dar bastante falso positivo em site genérico
        (título curto/comum casa com item errado).
    Filtro de palavra-chave é aplicado depois, em run_custom() — só depois
    de saber o título real do candidato (metadata do archive.org), pra
    também funcionar no modo "links" (que começa sem título nenhum).
    """
    source_label = urlparse(url).netloc or url
    check_cancel(progress)
    try:
        text = fetch_text(url)
    except Exception as e:  # noqa: BLE001
        log(progress, f"[{source_label}] falha ao buscar {url}: {e}")
        return []

    out = []
    seen_ids = set()
    for m in re.finditer(r"archive\.org/(?:details|embed)/([a-zA-Z0-9_.\-]+)", text):
        aid = m.group(1)
        if aid in seen_ids:
            continue
        seen_ids.add(aid)
        out.append(
            {
                "title": None,
                "year": None,
                "source": f"{source_label} (link direto)",
                "archive_id": aid,
                "needs_title_from_meta": True,
            }
        )
    log(progress, f"[{source_label}] {len(out)} link(s) direto(s) pro archive.org encontrados")

    if mode == "text":
        text_candidates = 0
        for m in _TITLE_LINK_RE.finditer(text):
            raw = decode_entities(m.group(1)).strip()
            raw = re.sub(r"\s+", " ", raw)
            if len(raw) < 3 or _NAV_TEXT_RE.match(raw):
                continue
            year_match = re.search(r"\((\d{4})\)", raw)
            title = re.sub(r"\s*\(\d{4}\)\s*$", "", raw).strip()
            if not title:
                continue
            out.append(
                {
                    "title": title,
                    "year": int(year_match.group(1)) if year_match else None,
                    "source": f"{source_label} (texto)",
                }
            )
            text_candidates += 1
        log(progress, f"[{source_label}] +{text_candidates} candidato(s) por texto de link (modo texto)")

    return out


def run_custom(progress, backend_url, admin_token, url, keywords=None, mode="links", catalog_csv_path=None):
    """Mesma orquestração de run(), mas com uma única fonte (a URL avulsa) e
    um filtro de palavra-chave aplicado no final, depois que cada candidato
    já tem título real (resolvido via metadata do archive.org — necessário
    porque no modo "links" o candidato começa sem título nenhum)."""
    already_done = []
    verified = []
    cancelled = False
    try:
        progress.update(phase="carregando_catalogo")
        log(progress, "carregando catálogo atual (dedupe)...")
        existing = load_existing_catalog(backend_url, admin_token)
        previous_csv = load_previous_csv_decisions(catalog_csv_path)

        progress.update(phase=f"raspando_{urlparse(url).netloc or url}")
        raw = scrape_custom(url, mode, progress)
        progress.update(candidates_found=len(raw))

        progress.update(phase="filtrando_duplicatas")
        filtered = dedupe_and_filter(raw, existing, previous_csv)
        to_resolve = [c for c in filtered if not c.get("skip_verify")]
        already_done = [c for c in filtered if c.get("skip_verify")]

        progress.update(phase="verificando_duracao", total_to_verify=len(to_resolve), verified_count=0)
        log(progress, "resolvendo/verificando duração real no archive.org...")
        verified = _verify_with_cancel(to_resolve, progress)
        check_cancel(progress)

        kws = [k.strip().lower() for k in (keywords or []) if k.strip()]
        if kws:
            progress.update(phase="filtrando_palavras_chave")
            before = len(verified)
            kept = []
            for r in verified:
                title_l = (r.get("title") or "").lower()
                if r.get("status") == "ADICIONADO" and not any(k in title_l for k in kws):
                    kept.append({**r, "status": "DESCARTADO", "motivo": f"não bate com nenhuma palavra-chave ({', '.join(kws)})"})
                else:
                    kept.append(r)
            verified = kept
            log(progress, f"filtro de palavra-chave aplicado a {before} candidatos verificados")
    except ScrapeCancelled:
        cancelled = True
        log(progress, "busca cancelada pelo usuário — gerando CSV com o que já foi encontrado até aqui")

    all_rows = already_done + verified
    added = sum(1 for r in all_rows if r.get("status") == "ADICIONADO")
    discarded = sum(1 for r in all_rows if r.get("status") == "DESCARTADO")
    log(
        progress,
        f"{'cancelado' if cancelled else 'concluído'}: {added} candidatos aprovados, {discarded} descartados",
    )

    csv_text = rows_to_csv(all_rows)
    progress.update(phase="cancelado" if cancelled else "concluido", added=added, discarded=discarded, cancelled=cancelled)
    return csv_text


# ---------------------------------------------------------------------------
# Passo 3: resolve o identifier do archive.org pra quem ainda não tem um
# ---------------------------------------------------------------------------


def resolve_archive_id(candidate):
    if candidate.get("archive_id"):
        return candidate
    q = quote(f'title:("{candidate["title"].replace(chr(34), "")}") AND mediatype:(movies)')
    url = f"https://archive.org/advancedsearch.php?q={q}&fl[]=identifier&fl[]=title&fl[]=year&rows=5&output=json"
    try:
        data = fetch_json(url)
        docs = (data.get("response") or {}).get("docs") or []
        if not docs:
            return {**candidate, "archive_id": None, "resolve_note": "NOT_FOUND_ON_ARCHIVE_SEARCH"}
        want_title = norm_title(candidate["title"])

        def sort_key(d):
            exact = 0 if norm_title(d.get("title", "")) == want_title else 1
            year_diff = abs((d.get("year") or 0) - candidate["year"]) if candidate.get("year") else 0
            return (exact, year_diff)

        docs.sort(key=sort_key)
        return {**candidate, "archive_id": docs[0]["identifier"], "archive_year": docs[0].get("year")}
    except Exception as e:  # noqa: BLE001
        return {**candidate, "archive_id": None, "resolve_note": f"SEARCH_ERROR: {e}"}


# ---------------------------------------------------------------------------
# Passo 4: duração real
# ---------------------------------------------------------------------------


def verify_duration(candidate):
    if not candidate.get("archive_id"):
        return {**candidate, "status": "DESCARTADO", "motivo": "nao encontrado no archive.org"}
    try:
        meta = fetch_json(f"https://archive.org/metadata/{quote(candidate['archive_id'])}")
    except Exception as e:  # noqa: BLE001
        return {**candidate, "status": "DESCARTADO", "motivo": f"falha ao consultar metadata do archive.org ({e})"}

    files = meta.get("files") or []
    if not files:
        return {**candidate, "status": "DESCARTADO", "motivo": "item sem arquivos no archive.org (identifier invalido ou removido)"}

    title = candidate.get("title")
    if (not title or candidate.get("needs_title_from_meta")) and meta.get("metadata", {}).get("title"):
        title = meta["metadata"]["title"]
    year = candidate.get("year")
    if not year and meta.get("metadata"):
        raw_year = meta["metadata"].get("year") or (meta["metadata"].get("date") or "")[:4]
        try:
            y = int(raw_year)
            if 1850 < y < 2100:
                year = y
        except (TypeError, ValueError):
            pass
    candidate = {**candidate, "title": title, "year": year}

    if year and year > CANDIDATE_MAX_YEAR:
        return {
            **candidate,
            "status": "DESCARTADO",
            "motivo": f"ano {year} acima do corte de dominio-publico provavel ({CANDIDATE_MAX_YEAR}) — precisa checagem manual",
        }

    videos = [f for f in files if VIDEO_EXT_RE.search(f.get("name", "") or "") and f.get("source") != "metadata"]
    max_seconds = 0.0
    for f in videos:
        try:
            length = float(f.get("length") or 0)
        except (TypeError, ValueError):
            length = 0.0
        max_seconds = max(max_seconds, length)
    minutes = round(max_seconds / 60, 1)

    if not videos:
        return {**candidate, "status": "DESCARTADO", "motivo": "nenhum arquivo de video encontrado no item do archive.org", "duracao_min": 0}
    if minutes < MIN_MINUTES:
        return {
            **candidate,
            "status": "DESCARTADO",
            "motivo": f"duracao incompativel ({minutes} min) — provavel trailer/clipe, nao o filme completo",
            "duracao_min": minutes,
        }
    return {**candidate, "status": "ADICIONADO", "motivo": "ok", "duracao_min": minutes}


def resolve_and_verify(candidate):
    return verify_duration(resolve_archive_id(candidate))


# ---------------------------------------------------------------------------
# Passo 5: dedupe
# ---------------------------------------------------------------------------


def dedupe_and_filter(candidates, existing, previous_csv):
    ranked = sorted(candidates, key=lambda c: 0 if c.get("archive_id") else 1)

    seen = set()
    deduped = []
    for c in ranked:
        key = (norm_title(c["title"]), c.get("year") or "")
        if key in seen:
            continue
        seen.add(key)
        deduped.append(c)

    out = []
    for c in deduped:
        if BANNED_TITLE_RE.search(c.get("title") or ""):
            out.append({**c, "status": "DESCARTADO", "motivo": "fora do escopo do catalogo (criterio de seguranca)", "skip_verify": True})
            continue
        if c.get("archive_id") and c["archive_id"] in existing["ids"]:
            out.append({**c, "status": "DESCARTADO", "motivo": "ja existia no catalogo (mesmo source.id)", "skip_verify": True})
            continue
        if norm_title(c["title"]) in existing["titles"]:
            out.append({**c, "status": "DESCARTADO", "motivo": "ja existia no catalogo (mesmo titulo)", "skip_verify": True})
            continue
        if (c.get("archive_id") and c["archive_id"] in previous_csv["ids"]) or (
            norm_title(c["title"]) in previous_csv["titles"]
        ):
            continue  # já avaliado numa rodada anterior — não julga de novo
        if c.get("year") and c["year"] > CANDIDATE_MAX_YEAR:
            out.append(
                {
                    **c,
                    "status": "DESCARTADO",
                    "motivo": f"ano {c['year']} acima do corte de dominio-publico provavel ({CANDIDATE_MAX_YEAR}) — precisa checagem manual",
                    "skip_verify": True,
                }
            )
            continue
        out.append(c)
    return out


# ---------------------------------------------------------------------------
# Passo 6: CSV
# ---------------------------------------------------------------------------


def archive_link(archive_id):
    return f"https://archive.org/details/{archive_id}" if archive_id else ""


def rows_to_csv(rows):
    buf = io.StringIO()
    writer = csv.writer(buf)
    writer.writerow(CSV_HEADER)
    for r in rows:
        writer.writerow(
            [
                r.get("title", ""),
                r.get("year", "") or "",
                r.get("source", ""),
                r.get("archive_id", "") or "",
                r.get("duracao_min", "") if r.get("duracao_min") is not None else "",
                r.get("status", ""),
                r.get("motivo", ""),
                "",  # slug — atribuído a mão quando a sinopse é escrita, igual ao fluxo atual
                archive_link(r.get("archive_id")),
            ]
        )
    return buf.getvalue()


# ---------------------------------------------------------------------------
# Orquestração — chamada pelo app.py num thread de background
# ---------------------------------------------------------------------------


def _verify_with_cancel(to_resolve, progress):
    """Mesma ideia do antigo executor.map(), mas checando cancelamento entre
    cada resultado — se cancelado, para de mandar trabalho novo pro pool
    (o que já estava em voo termina, mas nada novo começa) e devolve só o
    que já tinha sido verificado até ali."""
    verified = []
    with ThreadPoolExecutor(max_workers=CONCURRENCY) as executor:
        futures = {executor.submit(resolve_and_verify, c): c for c in to_resolve}
        try:
            for future in as_completed(futures):
                verified.append(future.result())
                if len(verified) % 25 == 0 or len(verified) == len(to_resolve):
                    progress.update(verified_count=len(verified))
                if getattr(progress, "should_cancel", None) and progress.should_cancel():
                    for f in futures:
                        f.cancel()
                    break
        finally:
            executor.shutdown(wait=False, cancel_futures=True)
    return verified


def run(progress, backend_url, admin_token, catalog_csv_path=None):
    """
    `progress` é um objeto com .push_log(str), .update(**kwargs) e
    (opcionalmente) .should_cancel() — ver app.py:JobProgress. Devolve o CSV
    final (string) quando termina ou quando é cancelado no meio (nesse caso,
    com o que já tinha sido encontrado/verificado até o cancelamento).
    """
    already_done = []
    verified = []
    cancelled = False
    try:
        progress.update(phase="carregando_catalogo")
        log(progress, "carregando catálogo atual (dedupe)...")
        existing = load_existing_catalog(backend_url, admin_token)
        previous_csv = load_previous_csv_decisions(catalog_csv_path)
        log(progress, f"catálogo atual: {len(existing['ids'])} ids, {len(existing['titles'])} títulos distintos")

        scrapers = [
            ("publicdomainmovie.net", scrape_publicdomainmovie),
            ("archivewatch.org", scrape_archivewatch),
            ("emol.org", scrape_emol),
            ("freemoviescinema.com", scrape_freemoviescinema),
            ("retroflix.org", scrape_retroflix),
            ("archive.org (prelinger/usgovfilms)", scrape_archive_collections),
        ]

        raw = []
        for name, fn in scrapers:
            check_cancel(progress)
            progress.update(phase=f"raspando_{name}")
            log(progress, f"raspando {name}...")
            try:
                found = fn(progress)
                log(progress, f"{name}: {len(found)} candidatos brutos")
                raw.extend(found)
            except ScrapeCancelled:
                raise
            except Exception as e:  # noqa: BLE001
                log(progress, f"{name} falhou por completo, pulando: {e}")
            progress.update(candidates_found=len(raw))

        progress.update(phase="filtrando_duplicatas")
        log(progress, f"{len(raw)} candidatos brutos no total, removendo duplicata...")
        filtered = dedupe_and_filter(raw, existing, previous_csv)
        to_resolve = [c for c in filtered if not c.get("skip_verify")]
        already_done = [c for c in filtered if c.get("skip_verify")]
        log(
            progress,
            f"{len(to_resolve)} candidatos precisam checagem no archive.org "
            f"({len(already_done)} já decididos — duplicata ou ano acima do corte)",
        )

        if len(to_resolve) > MAX_CANDIDATES_TO_VERIFY:
            log(
                progress,
                f"limitando a {MAX_CANDIDATES_TO_VERIFY} candidatos nesta rodada "
                f"({len(to_resolve) - MAX_CANDIDATES_TO_VERIFY} ficam de fora — rode de novo pra continuar)",
            )
            to_resolve = to_resolve[:MAX_CANDIDATES_TO_VERIFY]

        progress.update(phase="verificando_duracao", total_to_verify=len(to_resolve), verified_count=0)
        log(progress, "resolvendo identifiers + verificando duração real no archive.org...")
        verified = _verify_with_cancel(to_resolve, progress)
        check_cancel(progress)
    except ScrapeCancelled:
        cancelled = True
        log(progress, "busca cancelada pelo usuário — gerando CSV com o que já foi encontrado até aqui")

    all_rows = already_done + verified
    added = sum(1 for r in all_rows if r.get("status") == "ADICIONADO")
    discarded = sum(1 for r in all_rows if r.get("status") == "DESCARTADO")
    log(
        progress,
        f"{'cancelado' if cancelled else 'concluído'}: {added} candidatos aprovados, {discarded} descartados",
    )

    csv_text = rows_to_csv(all_rows)
    progress.update(phase="cancelado" if cancelled else "concluido", added=added, discarded=discarded, cancelled=cancelled)
    return csv_text
