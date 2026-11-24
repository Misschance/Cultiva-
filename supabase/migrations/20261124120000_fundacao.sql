-- Fase 0: catálogo de plantas (somente leitura para usuários) e dados de cultivo de cada usuário.
-- Segurança: RLS ligado em todas as tabelas (SEG-5), catálogo sem escrita para usuários (SEG-6),
-- restrições no banco para toda entrada (SEG-8).

create domain public.confianca as char(1) check (value in ('A', 'B', 'C'));

-- ---------------------------------------------------------------------------
-- Catálogo
-- ---------------------------------------------------------------------------

create table public.referencias (
  id text primary key check (id ~ '^R[0-9]{1,3}$'),
  citacao text not null,
  url text check (url is null or url ~ '^https://'),
  como_foi_lida text
);

create table public.especies (
  id text primary key check (id ~ '^[a-z0-9_]{1,40}$'),
  versao integer not null default 1 check (versao > 0),
  nome_popular text not null,
  nome_cientifico text not null,
  grupo text not null,
  parte_colhida text,
  propagacao text,
  profundidade_semeadura_cm text,
  germinacao_dias_min integer check (germinacao_dias_min >= 0),
  germinacao_dias_max integer check (germinacao_dias_max >= germinacao_dias_min),
  germinacao_confianca public.confianca,
  transplante_dias_apos_semeadura text,
  espacamento_cm text,
  luz_horas_min numeric(3, 1) check (luz_horas_min between 0 and 24),
  local_ideal text,
  luz_confianca public.confianca,
  agua_como_regar text,
  agua_confianca public.confianca,
  rega_intervalo_dias_min integer not null check (rega_intervalo_dias_min >= 1),
  rega_intervalo_dias_max integer not null check (rega_intervalo_dias_max >= rega_intervalo_dias_min),
  solo text,
  adubo_plantio text,
  adubo_cobertura text,
  adubo_confianca public.confianca,
  colheita_inicio_dias_min integer check (colheita_inicio_dias_min >= 0),
  colheita_inicio_dias_max integer check (colheita_inicio_dias_max >= colheita_inicio_dias_min),
  colheita_fonte text,
  colheita_confianca public.confianca,
  clima_temperatura text,
  dica_acessivel text,
  pendencias text
);

create table public.fases (
  especie_id text not null references public.especies (id) on delete cascade,
  ordem smallint not null check (ordem between 1 and 20),
  nome text not null check (nome in ('germinação', 'muda', 'desbaste', 'vegetativo', 'floração', 'frutificação', 'colheita', 'dormência')),
  dia_inicio integer check (dia_inicio >= 0),
  dia_fim integer check (dia_fim >= dia_inicio),
  rega text,
  adubacao text,
  intervencoes text,
  fonte text,
  confianca public.confianca,
  primary key (especie_id, ordem)
);

create table public.epocas_plantio (
  id bigint generated always as identity primary key,
  especie_id text not null references public.especies (id) on delete cascade,
  variedade text,
  regiao text not null check (regiao in ('Norte', 'Nordeste', 'Centro-Oeste', 'Sudeste', 'Sul')),
  mes_inicio smallint check (mes_inicio between 1 and 12),
  mes_fim smallint check (mes_fim between 1 and 12),
  recomendado boolean,
  texto text,
  fonte text,
  confianca public.confianca,
  observacao text
);
create index epocas_plantio_especie_idx on public.epocas_plantio (especie_id);

-- ---------------------------------------------------------------------------
-- Dados de cada usuário
-- ---------------------------------------------------------------------------

create table public.perfis (
  id uuid primary key references auth.users (id) on delete cascade,
  nome text check (char_length(nome) <= 80),
  cidade text check (char_length(cidade) <= 80),
  -- Coordenadas arredondadas a ~1 km, só com consentimento (SEG-14).
  lat numeric(5, 2) check (lat between -90 and 90),
  lon numeric(5, 2) check (lon between -180 and 180),
  consentimento_localizacao_em timestamptz,
  fuso text not null default 'America/Sao_Paulo' check (char_length(fuso) <= 64),
  horario_lembrete time not null default '08:00',
  criado_em timestamptz not null default now(),
  check ((lat is null and lon is null) or consentimento_localizacao_em is not null)
);

create table public.locais (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  nome text not null check (char_length(btrim(nome)) between 1 and 60),
  tipo text not null check (tipo in ('vaso', 'canteiro', 'quintal', 'jardineira', 'estufa')),
  interno boolean not null default false,
  horas_sol numeric(3, 1) check (horas_sol between 0 and 24),
  volume_litros numeric(6, 1) check (volume_litros > 0 and volume_litros <= 5000),
  material text check (material in ('plastico', 'barro', 'tecido')),
  criado_em timestamptz not null default now(),
  unique (id, usuario_id)
);
create index locais_usuario_idx on public.locais (usuario_id);

create table public.plantios (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  especie_id text not null references public.especies (id),
  especie_versao integer not null check (especie_versao > 0),
  local_id uuid not null,
  origem text not null check (origem in ('semente', 'muda', 'estaca')),
  quantidade integer not null default 1 check (quantidade between 1 and 10000),
  data_plantio date not null check (data_plantio >= date '2000-01-01'),
  apelido text check (char_length(apelido) <= 60),
  status text not null default 'ativo' check (status in ('ativo', 'colhido', 'perdido', 'arquivado')),
  criado_em timestamptz not null default now(),
  unique (id, usuario_id),
  -- O local precisa ser do mesmo usuário: impede ligar um plantio ao local de outra pessoa.
  foreign key (local_id, usuario_id) references public.locais (id, usuario_id) on delete restrict
);
create index plantios_usuario_idx on public.plantios (usuario_id);

create table public.confirmacoes_fase (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  plantio_id uuid not null,
  fase text not null check (char_length(fase) <= 30),
  data date not null,
  criado_em timestamptz not null default now(),
  foreign key (plantio_id, usuario_id) references public.plantios (id, usuario_id) on delete cascade
);
create index confirmacoes_fase_plantio_idx on public.confirmacoes_fase (plantio_id);

create table public.registros_acao (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  plantio_id uuid not null,
  tipo text not null check (tipo in ('rega', 'adubacao', 'poda', 'desbaste', 'tutoramento', 'transplante', 'colheita')),
  feito_em date not null,
  observacao text check (char_length(observacao) <= 500),
  criado_em timestamptz not null default now(),
  foreign key (plantio_id, usuario_id) references public.plantios (id, usuario_id) on delete cascade
);
create index registros_acao_plantio_idx on public.registros_acao (plantio_id, tipo, feito_em desc);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table public.referencias enable row level security;
alter table public.especies enable row level security;
alter table public.fases enable row level security;
alter table public.epocas_plantio enable row level security;
alter table public.perfis enable row level security;
alter table public.locais enable row level security;
alter table public.plantios enable row level security;
alter table public.confirmacoes_fase enable row level security;
alter table public.registros_acao enable row level security;

-- Catálogo: qualquer pessoa lê; ninguém escreve pela API (só migrações e o painel editorial com service role).
create policy "catalogo leitura" on public.referencias for select to anon, authenticated using (true);
create policy "catalogo leitura" on public.especies for select to anon, authenticated using (true);
create policy "catalogo leitura" on public.fases for select to anon, authenticated using (true);
create policy "catalogo leitura" on public.epocas_plantio for select to anon, authenticated using (true);
revoke insert, update, delete, truncate on public.referencias, public.especies, public.fases, public.epocas_plantio from anon, authenticated;

-- Dados do usuário: só o dono lê e escreve. Anônimos não têm acesso.
revoke all on public.perfis, public.locais, public.plantios, public.confirmacoes_fase, public.registros_acao from anon;

create policy "dono le" on public.perfis for select to authenticated using (id = (select auth.uid()));
create policy "dono altera" on public.perfis for update to authenticated
  using (id = (select auth.uid())) with check (id = (select auth.uid()));

create policy "dono" on public.locais for all to authenticated
  using (usuario_id = (select auth.uid())) with check (usuario_id = (select auth.uid()));
create policy "dono" on public.plantios for all to authenticated
  using (usuario_id = (select auth.uid())) with check (usuario_id = (select auth.uid()));
create policy "dono" on public.confirmacoes_fase for all to authenticated
  using (usuario_id = (select auth.uid())) with check (usuario_id = (select auth.uid()));
create policy "dono" on public.registros_acao for all to authenticated
  using (usuario_id = (select auth.uid())) with check (usuario_id = (select auth.uid()));

-- Perfil criado junto com a conta. security definer com search_path vazio para não ser sequestrável.
create function public.criar_perfil() returns trigger
  language plpgsql security definer set search_path = ''
as $$
begin
  insert into public.perfis (id) values (new.id);
  return new;
end;
$$;
revoke execute on function public.criar_perfil() from public, anon, authenticated;

create trigger ao_criar_usuario after insert on auth.users
  for each row execute function public.criar_perfil();
