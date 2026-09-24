alter table public.moldes add column if not exists exclusive boolean not null default false;
alter table public.videos add column if not exists exclusive boolean not null default false;

create table if not exists public.exclusive_phones (
  id uuid primary key default gen_random_uuid(),
  phone text not null unique,
  note text,
  created_at timestamptz not null default now()
);

alter table public.exclusive_phones enable row level security;
-- Sem policies: apenas a service_role (backend do admin e a rota /exclusivo) acessa esta tabela.
