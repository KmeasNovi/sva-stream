# Legendas em português — status (pausado)

## Pedido original

O público do CulStream é brasileiro; o catálogo é 100% filmes/curtas em inglês
sem legenda. Precisamos de legendas em pt-BR.

## Por que não é trivial

O player atual embute o player do próprio archive.org/YouTube via `<iframe>`.
Não dá pra injetar uma trilha de legenda nossa dentro de um iframe de outro
domínio — só quem controla o player (archive.org) pode adicionar legendas a
ele. Pra ter legenda nossa, o filme precisa ser tocado num `<video>` HTML
nativo, que a gente controla.

## O que já foi construído (infraestrutura, pronta pra usar)

Nada disso quebra o site atual — todo filme sem `subtitleUrl` continua usando
o player em iframe de sempre.

- **`server/src/models/Movie.js`** — dois campos novos, opcionais:
  - `subtitleUrl`: caminho do arquivo `.vtt` da legenda em pt-BR (ex:
    `/subtitles/nosferatu.vtt`)
  - `videoFileUrl`: URL direta do arquivo de vídeo no archive.org (resolvida
    manualmente por título, uma vez — não é uma regra genérica)
- **`server/src/app.js`** — serve arquivos estáticos em `/subtitles/*` a
  partir de `server/public/subtitles/` (pasta já criada, vazia)
- **`web/src/components/Player.jsx`** — se `videoFileUrl` **e** `subtitleUrl`
  existirem, troca pro `<video>` nativo com `<track kind="subtitles">`. Caso
  contrário (todos os filmes atuais), continua no iframe padrão.
- **`web/src/app/movie/[slug]/page.jsx`** — já passa os dois campos novos pro
  `Player`.

**Ainda faltando pra qualquer filme funcionar com legenda:** popular
`subtitleUrl` + `videoFileUrl` no banco pra aquele filme, e colocar o arquivo
`.vtt` de verdade em `server/public/subtitles/`.

## Por que parou aqui

A ideia original era: pegar a transcrição em inglês que o archive.org já gera
automaticamente (reconhecimento de fala) pra alguns itens, e traduzir pra
português.

Testei em 22 filmes que tinham essa transcrição disponível. **A qualidade é
inutilizável** — é reconhecimento de fala quebrando com áudio antigo de baixa
fidelidade (trilha mono dos anos 30-40, chiado, música de fundo). Traduzir
isso geraria legenda tão sem sentido quanto o original em inglês, pior que não
ter legenda nenhuma.

Pra filmes mudos (Nanook of the North, Battleship Potemkin, The Plow That
Broke the Plains), o problema é outro: a "transcrição" tenta captar a trilha
musical como se fosse fala, o que não faz sentido nenhum.

Resultado: **nenhum dos 126 filmes do catálogo tem, hoje, uma fonte de
legenda em inglês (ou qualquer idioma) que valha a pena traduzir.**

⚠️ Vale lembrar também: alguns filmes/documentários "de domínio público" têm
narração em verso ou texto separadamente protegido por direitos autorais
mesmo com o filme em si sendo PD (ex: "Night Mail" de 1936, narrado com um
poema de W. H. Auden, morto em 1973 — ainda sob direitos autorais). Antes de
traduzir a narração de qualquer documentário, checar se ela não é uma obra
separada ainda protegida.

## Caminhos possíveis pra quando retomar

1. **OpenSubtitles.org (ou serviço parecido) — provavelmente o melhor caminho.**
   Bancos de legenda feitos por fãs, às vezes já em português, pra filmes
   clássicos famosos (His Girl Friday, Suspicion, etc.). Tem API gratuita com
   limite diário, mas exige criar conta — isso o usuário precisa fazer (não dá
   pra criar conta por ele). Depois de ter a API key, dá pra buscar por
   título/ano e baixar `.srt` já prontos (às vezes até em pt-BR direto, sem
   precisar traduzir nada).

2. **Foco nos filmes mais notáveis primeiro.** Mesmo com uma fonte de legenda
   melhor, traduzir tudo de uma vez (126 filmes + 148 curtas) não é realista.
   Fazer em lotes pequenos, começando pelos títulos mais assistidos/
   destacados.

3. **Aviso de transparência enquanto isso.** Enquanto não há legenda, dá pra
   adicionar um aviso discreto na página do filme ("Áudio original em inglês,
   sem legenda disponível") — o usuário preferiu não fazer isso agora, mas
   fica registrado como opção rápida se quiser mudar de ideia.

## Dados já levantados (não perder esse trabalho)

Em `server/src/seed/subs-check-2026-08-08.json` está o resultado de verificar,
título por título, quais dos 126 filmes têm algum arquivo `.srt` no
archive.org (campo `hasSubtitle`) — são 22 de 126, mas com qualidade ruim
como explicado acima. Não é um arquivo usado pelo código, só um registro do
levantamento pra não ter que refazer a varredura depois.

## Próximo passo sugerido quando retomar

Perguntar ao usuário se ele quer criar a conta no OpenSubtitles (ou serviço
equivalente) e passar a API key — esse é o passo que estava faltando quando o
trabalho foi pausado.
