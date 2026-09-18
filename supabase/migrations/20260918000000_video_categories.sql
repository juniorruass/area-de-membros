alter table public.videos
  add column if not exists cat text not null default '';
