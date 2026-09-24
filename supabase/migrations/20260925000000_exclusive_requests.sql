create table if not exists public.exclusive_requests (
  id uuid primary key default gen_random_uuid(),
  phone text not null unique,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  decided_at timestamptz
);

alter table public.exclusive_requests enable row level security;
-- Sem policies: apenas a service_role (backend do admin e a rota /exclusivo) acessa esta tabela.
