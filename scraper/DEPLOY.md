# Deploy do serviço de busca (Render)

Este serviço é **separado** do backend Node (`server/`) — Render não tem
como rodar Python dentro de um serviço já configurado como Node sem trocar
pra Docker, e isso arriscaria o deploy que já está no ar. Em vez disso, ele
sobe como um segundo Web Service, usando o runtime Python nativo do Render
(sem Dockerfile, sem mexer no serviço existente).

## Passo a passo

1. No painel do Render, **New > Web Service**.
2. Conecte o mesmo repositório GitHub (`sva-stream`) já usado pelo backend.
3. Configure:
   - **Root Directory**: `scraper`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn -w 1 -b 0.0.0.0:$PORT app:app --timeout 900`
   - **Instance Type**: Free está OK (mesma categoria do backend hoje)
4. Variáveis de ambiente (aba **Environment**):
   - `BACKEND_URL` = URL pública do backend Node já existente (ex:
     `https://sva-stream-api.onrender.com`, sem barra no final)
   - `CORS_ORIGIN` = `https://sepiastream.com` (ou `*` se quiser liberar geral)
   - `CATALOG_CSV_PATH` = `../novos-filmes-encontrados.csv` (padrão já
     assumido pelo código — só precisa declarar se quiser um caminho
     diferente)
   - `SCRAPER_MAX_CANDIDATES` = opcional, padrão `3000` (teto de candidatos
     verificados por rodada, pra uma busca não rodar por horas)
5. Deploy. Quando terminar, copie a URL pública do serviço (algo como
   `https://sva-stream-scraper.onrender.com`).
6. No Vercel (projeto do frontend), adicione a env var
   `NEXT_PUBLIC_SCRAPER_API_URL` com essa URL, e redeploy
   (`npx vercel --prod` na raiz do repo).

## Por que um serviço separado, e não dentro do backend Node

- Zero risco pro deploy do backend que já está em produção — nenhuma
  configuração existente é tocada.
- Render tem runtime Python nativo (mesma categoria do Node), então não
  precisa de Dockerfile nem imagem customizada.
- O serviço aqui **não tem acesso direto ao MongoDB** — toda checagem de
  admin e toda leitura do catálogo atual (pra não duplicar filme) passa pela
  API do backend Node já existente, usando o mesmo token de admin que o
  navegador já tem guardado. Isso significa: se o backend cair, esse serviço
  também para de funcionar (dependência de propósito, não é um "banco
  paralelo").

## Limitações conhecidas

- Plano free do Render "dorme" o serviço depois de ~15 min sem tráfego HTTP
  — a primeira chamada depois de um tempo parado demora uns 30-50s pra
  acordar. O frontend já espera isso (mostra "iniciando..." enquanto isso).
- Só uma busca por vez (rodar duas ao mesmo tempo devolve 409) — evita duas
  varreduras martelando os mesmos sites e disputando o mesmo job.
- O resultado de um job fica só na memória do processo — se o serviço
  reiniciar no meio de uma busca (deploy novo, ou o free tier reciclando por
  inatividade), o job se perde e precisa rodar de novo. Não é um problema de
  dado (nada é escrito no catálogo por esse serviço), só perde o trabalho de
  raspagem daquela rodada.
- Continua sem julgar risco de direito autoral (estúdio grande, propaganda,
  etc.) — só duração real + duplicata + ano de corte, igual ao
  `findCandidates.js` original. A revisão fina continua manual depois,
  igual já é hoje.
