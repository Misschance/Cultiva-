-- Testes de segurança: cada usuário só vê e altera os próprios dados (SEG-5) e ninguém escreve no catálogo (SEG-6).
\pset tuples_only on
\pset format unaligned
\set ON_ERROR_STOP on

insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-00000000000a', 'ana@exemplo.test'),
  ('00000000-0000-0000-0000-00000000000b', 'beto@exemplo.test');

-- Perfil criado pelo gatilho
do $$ begin
  assert (select count(*) from public.perfis) = 2, 'gatilho deveria criar um perfil por usuário';
end $$;

-- Funções auxiliares de teste
create or replace function pg_temp.como(usuario uuid) returns void language plpgsql as $$
begin
  perform set_config('request.jwt.claim.sub', coalesce(usuario::text, ''), false);
end $$;

create or replace function pg_temp.deve_falhar(comando text, descricao text) returns void language plpgsql as $$
begin
  execute comando;
  raise exception 'FALHOU: % (o comando deveria ter sido bloqueado)', descricao;
exception
  when insufficient_privilege or check_violation or foreign_key_violation or not_null_violation then
    raise notice 'ok: %', descricao;
end $$;

-- Ana cria um local e um plantio
select pg_temp.como('00000000-0000-0000-0000-00000000000a');
set role authenticated;
insert into public.locais (id, nome, tipo, volume_litros) values ('10000000-0000-0000-0000-00000000000a', 'Varanda', 'vaso', 10);
insert into public.plantios (id, especie_id, especie_versao, local_id, origem, data_plantio)
  values ('20000000-0000-0000-0000-00000000000a', 'alface', 1, '10000000-0000-0000-0000-00000000000a', 'semente', '2026-11-01');
insert into public.registros_acao (plantio_id, tipo, feito_em) values ('20000000-0000-0000-0000-00000000000a', 'rega', '2026-11-02');
do $$ begin
  assert (select count(*) from public.plantios) = 1, 'Ana deveria ver o próprio plantio';
  assert (select count(*) from public.perfis) = 1, 'Ana deveria ver só o próprio perfil';
end $$;

select pg_temp.deve_falhar($$insert into public.locais (nome, tipo, usuario_id) values ('Falso', 'vaso', '00000000-0000-0000-0000-00000000000b')$$,
  'criar local em nome de outro usuário');
select pg_temp.deve_falhar($$insert into public.especies (id, nome_popular, nome_cientifico, grupo, rega_intervalo_dias_min, rega_intervalo_dias_max) values ('x', 'X', 'X', 'x', 1, 1)$$,
  'escrever no catálogo');
select pg_temp.deve_falhar($$update public.fases set rega = 'nunca' where especie_id = 'alface'$$,
  'alterar fase do catálogo');
select pg_temp.deve_falhar($$insert into public.locais (nome, tipo, volume_litros) values ('Gigante', 'vaso', -1)$$,
  'volume negativo');
select pg_temp.deve_falhar($$insert into public.locais (nome, tipo) values ('   ', 'vaso')$$,
  'nome em branco');
select pg_temp.deve_falhar($$insert into public.locais (nome, tipo) values ('Lua', 'cratera')$$,
  'tipo de local desconhecido');
select pg_temp.deve_falhar($$update public.perfis set lat = -23.55, lon = -46.63$$,
  'salvar coordenadas sem consentimento');
reset role;

-- Beto não enxerga nem altera nada da Ana
select pg_temp.como('00000000-0000-0000-0000-00000000000b');
set role authenticated;
do $$ begin
  assert (select count(*) from public.locais) = 0, 'Beto não deveria ver locais da Ana';
  assert (select count(*) from public.plantios) = 0, 'Beto não deveria ver plantios da Ana';
  assert (select count(*) from public.registros_acao) = 0, 'Beto não deveria ver registros da Ana';
  assert (select count(*) from public.perfis) = 1, 'Beto deveria ver só o próprio perfil';
  assert (select count(*) from public.especies) = 13, 'Beto deveria ler o catálogo';
end $$;
update public.plantios set status = 'perdido';
delete from public.locais;
select pg_temp.deve_falhar($$insert into public.plantios (especie_id, especie_versao, local_id, origem, data_plantio) values ('alface', 1, '10000000-0000-0000-0000-00000000000a', 'semente', '2026-11-01')$$,
  'plantar no local de outro usuário');
select pg_temp.deve_falhar($$insert into public.registros_acao (plantio_id, tipo, feito_em) values ('20000000-0000-0000-0000-00000000000a', 'rega', '2026-11-02')$$,
  'registrar rega no plantio de outro usuário');
reset role;

do $$ begin
  assert (select status from public.plantios where id = '20000000-0000-0000-0000-00000000000a') = 'ativo', 'update do Beto não deveria afetar a Ana';
  assert (select count(*) from public.locais) = 1, 'delete do Beto não deveria afetar a Ana';
end $$;

-- Visitante sem login lê o catálogo e nada mais
select pg_temp.como(null);
set role anon;
do $$ begin
  assert (select count(*) from public.especies) = 13, 'anônimo deveria ler o catálogo';
end $$;
select pg_temp.deve_falhar($$select count(*) from public.plantios$$, 'anônimo lendo plantios');
select pg_temp.deve_falhar($$select count(*) from public.perfis$$, 'anônimo lendo perfis');
reset role;

\echo 'Todos os testes de RLS passaram.'
