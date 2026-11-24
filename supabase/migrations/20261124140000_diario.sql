-- Fase 3: diário da horta (P6). Anotações com foto, colheitas com quantidade e fotos privadas.
-- Segurança: RLS de dono em tudo (SEG-5), fotos em bucket privado com pasta por usuário (SEG-11),
-- só JPEG/PNG/WebP até 10 MB (SEG-12). O app remove o EXIF antes de enviar (SEG-13).

create table public.entradas_diario (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  plantio_id uuid not null,
  data date not null check (data >= date '2000-01-01'),
  texto text check (char_length(texto) <= 2000),
  -- Caminho no bucket "fotos": <usuario>/<arquivo>.jpg; a pasta tem que ser do próprio dono.
  foto_caminho text check (foto_caminho ~ '^[0-9a-f-]{36}/[0-9a-f-]{36}\.(jpg|png|webp)$'),
  criado_em timestamptz not null default now(),
  check (char_length(btrim(coalesce(texto, ''))) > 0 or foto_caminho is not null),
  check (foto_caminho is null or split_part(foto_caminho, '/', 1) = usuario_id::text),
  foreign key (plantio_id, usuario_id) references public.plantios (id, usuario_id) on delete cascade
);
create index entradas_diario_plantio_idx on public.entradas_diario (plantio_id, data desc);

create table public.colheitas (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  plantio_id uuid not null,
  data date not null check (data >= date '2000-01-01'),
  quantidade numeric(8, 2) not null check (quantidade > 0 and quantidade <= 100000),
  unidade text not null check (unidade in ('kg', 'g', 'macos', 'unidades')),
  criado_em timestamptz not null default now(),
  foreign key (plantio_id, usuario_id) references public.plantios (id, usuario_id) on delete cascade
);
create index colheitas_plantio_idx on public.colheitas (plantio_id, data desc);

alter table public.entradas_diario enable row level security;
alter table public.colheitas enable row level security;

grant select, insert, update, delete on public.entradas_diario, public.colheitas to authenticated;
revoke all on public.entradas_diario, public.colheitas from anon;

create policy "dono" on public.entradas_diario for all to authenticated
  using (usuario_id = (select auth.uid())) with check (usuario_id = (select auth.uid()));
create policy "dono" on public.colheitas for all to authenticated
  using (usuario_id = (select auth.uid())) with check (usuario_id = (select auth.uid()));

-- Bucket privado de fotos. O limite de tamanho e os tipos são conferidos pelo próprio Storage.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('fotos', 'fotos', false, 10485760, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update
  set public = false, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

-- Cada usuário só lê, envia e apaga arquivos dentro da pasta com o seu id. Sem update: foto não é trocada no lugar.
create policy "fotos: dono le" on storage.objects for select to authenticated
  using (bucket_id = 'fotos' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "fotos: dono envia" on storage.objects for insert to authenticated
  with check (bucket_id = 'fotos' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "fotos: dono apaga" on storage.objects for delete to authenticated
  using (bucket_id = 'fotos' and (storage.foldername(name))[1] = (select auth.uid())::text);
