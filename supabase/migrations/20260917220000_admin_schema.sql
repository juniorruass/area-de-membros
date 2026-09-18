create extension if not exists pgcrypto;

create table if not exists public.moldes (
  id uuid primary key default gen_random_uuid(),
  cat text not null default 'Bolsas e Necessaires',
  title text not null,
  pages int,
  file_path text,
  cover_path text,
  kind text not null default 'pdf',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.videos (
  id uuid primary key default gen_random_uuid(),
  yt text not null,
  title text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.sorteio_winners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  city text not null,
  prize text not null,
  sort_order int not null default 0
);

create table if not exists public.settings (
  key text primary key,
  value text
);

alter table public.moldes enable row level security;
alter table public.videos enable row level security;
alter table public.sorteio_winners enable row level security;
alter table public.settings enable row level security;
-- Sem policies: apenas a service_role (usada no backend do admin e nos
-- loaders do site) acessa essas tabelas. anon/authenticated ficam bloqueados.

insert into storage.buckets (id, name, public)
values ('materiais', 'materiais', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('site', 'site', true)
on conflict (id) do nothing;
