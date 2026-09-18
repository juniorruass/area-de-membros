# Crochê da Rosenilda

Área de membros do curso de crochê, com moldes/receitas, videoaulas,
sorteio, PIX e um painel de admin pra gerenciar todo o conteúdo sem
precisar tocar em código.

## Stack

- TanStack Start
- TypeScript
- React
- Tailwind CSS
- Supabase (Postgres + Storage)

## Desenvolvimento

```sh
npm i
npm run dev
```

Copie `.env.example` (se existir) ou configure `.env.local` com as
variáveis `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_PASSWORD`,
`SESSION_SECRET` e `VITE_SUPABASE_URL` antes de rodar.

## Admin

Acesse `/admin/login` com a senha configurada em `ADMIN_PASSWORD` pra
gerenciar moldes, vídeos, sorteio e configurações (PIX, WhatsApp,
banner) direto pelo site.
