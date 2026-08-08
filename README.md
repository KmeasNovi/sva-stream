# CulStream

Catálogo de filmes em domínio público, estilo Netflix/HBO, montado 100% com serviços gratuitos.
Visual baseado no protótipo Stitch "CulStream" (paleta *High-Energy Streaming System*: roxo elétrico
+ verde neon sobre fundo escuro, tipografia Montserrat/Inter, ícones Material Symbols).

Sem contas de usuário nem assinatura: o site é público e gratuito. O painel `/admin` é só para
quem administra o catálogo (você), não para visitantes.

## Como funciona o streaming (sem custo)

O maior custo de qualquer serviço de streaming é **banda**, não armazenamento. Por isso este
projeto **não hospeda arquivos de vídeo** — o MongoDB guarda só metadados (título, sinopse,
pôster, gêneros) e uma referência (`source.provider` + `source.id`) para o vídeo, que é servido
direto por quem já hospeda filmes de domínio público de graça:

- **archive.org** — hospedagem e streaming gratuitos e ilimitados, ideal para domínio público.
- **YouTube (não listado)** — alternativa, também sem custo de banda pra você.

O frontend só embute o player desses provedores (veja `web/src/components/Player.jsx`).

⚠️ Confirme que cada filme é realmente domínio público **no Brasil** (70 anos após a morte do
autor), não só nos EUA — pode haver diferença de legislação.

## Estrutura

```
stream/
  server/   API Express + MongoDB (Render)
  web/      Frontend Next.js (Vercel)
```

## Rodando localmente

Pré-requisito: Node.js 18+ e uma conta grátis no MongoDB Atlas.

```bash
# na raiz do projeto
npm install

# backend
cp server/.env.example server/.env
# edite server/.env com sua MONGODB_URI do Atlas e um JWT_SECRET aleatório

# frontend
cp web/.env.example web/.env.local

# popular o banco com alguns filmes de exemplo + criar o admin
# (defina SEED_ADMIN_EMAIL/SEED_ADMIN_PASSWORD no server/.env antes)
npm run seed

# rodar os dois em terminais separados
npm run dev:server   # http://localhost:4000
npm run dev:web      # http://localhost:3000
```

Login do admin fica em `http://localhost:3000/admin/login`.

## Deploy (tudo grátis)

### 1. MongoDB Atlas (banco de dados)
1. Crie um cluster **M0 (free)** em https://www.mongodb.com/cloud/atlas
2. Crie um usuário de banco e libere o IP `0.0.0.0/0` (Network Access) para o Render conseguir conectar.
3. Copie a connection string — vai virar `MONGODB_URI`.

### 2. Render (backend/API)
1. Suba este repositório no GitHub.
2. No Render, crie um **Web Service** apontando para a pasta `server/` (Root Directory: `server`).
3. Build command: `npm install` — Start command: `npm start`.
4. Configure as variáveis de ambiente do `server/.env.example` (MONGODB_URI, JWT_SECRET, CORS_ORIGIN
   com a URL do seu frontend na Vercel, e opcionalmente BREVO_API_KEY/BREVO_LIST_ID).
5. O plano free do Render "dorme" após ~15 min de inatividade. Configure um monitor grátis no
   **UptimeRobot** (ou similar) fazendo ping em `/api/health` a cada 5 minutos para manter o
   serviço acordado.

### 3. Vercel (frontend)
1. Importe o mesmo repositório na Vercel, apontando o Root Directory para `web/`.
2. Configure `NEXT_PUBLIC_API_URL` com a URL pública do seu serviço no Render.
3. Deploy automático a cada push no GitHub.

### 4. Brevo (opcional — email/newsletter)
1. Crie conta grátis em https://www.brevo.com (até 300 emails/dia).
2. Gere uma API key em Settings > SMTP & API.
3. Defina `BREVO_API_KEY` (e opcionalmente `BREVO_LIST_ID`) nas variáveis do Render.

## Adicionando filmes

Pelo painel `/admin/dashboard` (requer login), ou diretamente no `server/src/seed/seedMovies.js`
para popular em lote. Para achar o `source.id`:

- **archive.org**: é o `identifier` que aparece na URL, ex. `https://archive.org/details/<identifier>`.
- **YouTube**: é o `videoId` da URL, ex. `https://www.youtube.com/watch?v=<videoId>`.

## Manutenção

Rode `npm audit` de vez em quando e mantenha as dependências atualizadas (`npm outdated`),
especialmente o Next.js — é um projeto ativo com correções de segurança frequentes.

## Próximos passos sugeridos

- Plugar as telas que você está prototipando nos componentes em `web/src/components` e páginas em
  `web/src/app`.
- Trocar o CSS simples em `web/src/app/globals.css` pelo seu design system.
- Se quiser pôsteres/sinopses prontos, a API do TMDB é gratuita e cobre boa parte dos clássicos
  em domínio público.
>>>>>>> origin/main
