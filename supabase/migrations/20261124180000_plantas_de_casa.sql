-- Plantas de casa do usuário (jiboia, espada-de-são-jorge etc.) e os cuidados registrados.
-- O catálogo dessas plantas fica no app (base v2), então aqui só guardamos o id dela.
-- Segurança: RLS de dono (SEG-5), sem acesso anônimo, textos curtos e validados (SEG-8).

create table public.plantas_casa (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  planta_id text not null check (planta_id ~ '^[a-z0-9_]{1,40}$'),
  apelido text check (char_length(btrim(apelido)) between 1 and 60),
  comodo text check (char_length(btrim(comodo)) between 1 and 40),
  desde date not null default current_date check (desde >= date '2000-01-01'),
  ativa boolean not null default true,
  criado_em timestamptz not null default now(),
  unique (id, usuario_id)
);
create index plantas_casa_usuario_idx on public.plantas_casa (usuario_id);

create table public.cuidados_casa (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  planta_casa_id uuid not null,
  tipo text not null check (tipo in ('conferir', 'rega', 'adubo')),
  data date not null check (data >= date '2000-01-01'),
  criado_em timestamptz not null default now(),
  foreign key (planta_casa_id, usuario_id) references public.plantas_casa (id, usuario_id) on delete cascade
);
create index cuidados_casa_planta_idx on public.cuidados_casa (planta_casa_id, data desc);

alter table public.plantas_casa enable row level security;
alter table public.cuidados_casa enable row level security;

grant select, insert, update, delete on public.plantas_casa, public.cuidados_casa to authenticated;
revoke all on public.plantas_casa, public.cuidados_casa from anon;

create policy "dono" on public.plantas_casa for all to authenticated
  using (usuario_id = (select auth.uid())) with check (usuario_id = (select auth.uid()));
create policy "dono" on public.cuidados_casa for all to authenticated
  using (usuario_id = (select auth.uid())) with check (usuario_id = (select auth.uid()));
