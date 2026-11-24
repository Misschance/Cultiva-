-- Testes de segurança: cada usuário só vê e altera os próprios dados (SEG-5) e ninguém escreve no catálogo (SEG-6).
\pset tuples_only on
\pset format unaligned
\set ON_ERROR_STOP on

insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-00000000000a', 'ana@exemplo.test'),
  ('00000000-0000-0000-0000-00000000000b', 'beto@exemplo.test');


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

-- Ana cria o perfil, um local e um plantio
select pg_temp.como('00000000-0000-0000-0000-00000000000a');
set role authenticated;
insert into public.perfis (id, nome) values ('00000000-0000-0000-0000-00000000000a', 'Ana');
select pg_temp.deve_falhar($$insert into public.perfis (id) values ('00000000-0000-0000-0000-00000000000b')$$,
  'criar perfil de outro usuário');
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
insert into public.perfis (id, nome) values ('00000000-0000-0000-0000-00000000000b', 'Beto');
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

-- Diário, colheitas e fotos (fase 3): mesma regra de dono, e cada um só mexe na própria pasta de fotos
select pg_temp.como('00000000-0000-0000-0000-00000000000a');
set role authenticated;
insert into storage.objects (bucket_id, name) values ('fotos', '00000000-0000-0000-0000-00000000000a/30000000-0000-0000-0000-00000000000a.jpg');
insert into public.entradas_diario (plantio_id, data, texto, foto_caminho) values
  ('20000000-0000-0000-0000-00000000000a', '2026-11-10', 'Primeiras folhas', '00000000-0000-0000-0000-00000000000a/30000000-0000-0000-0000-00000000000a.jpg');
insert into public.colheitas (plantio_id, data, quantidade, unidade) values ('20000000-0000-0000-0000-00000000000a', '2026-12-30', 1.5, 'kg');
select pg_temp.deve_falhar($$insert into storage.objects (bucket_id, name) values ('fotos', '00000000-0000-0000-0000-00000000000b/x.jpg')$$,
  'enviar foto para a pasta de outro usuário');
select pg_temp.deve_falhar($$insert into public.entradas_diario (plantio_id, data, foto_caminho) values ('20000000-0000-0000-0000-00000000000a', '2026-11-10', '00000000-0000-0000-0000-00000000000b/30000000-0000-0000-0000-00000000000b.jpg')$$,
  'anotação apontando para foto de outro usuário');
select pg_temp.deve_falhar($$insert into public.entradas_diario (plantio_id, data, texto) values ('20000000-0000-0000-0000-00000000000a', '2026-11-10', '   ')$$,
  'anotação vazia');
select pg_temp.deve_falhar($$insert into public.entradas_diario (plantio_id, data, foto_caminho) values ('20000000-0000-0000-0000-00000000000a', '2026-11-10', '../../etc/passwd')$$,
  'caminho de foto fora do padrão');
select pg_temp.deve_falhar($$insert into public.colheitas (plantio_id, data, quantidade, unidade) values ('20000000-0000-0000-0000-00000000000a', '2026-12-30', -2, 'kg')$$,
  'colheita com quantidade negativa');
select pg_temp.deve_falhar($$insert into public.colheitas (plantio_id, data, quantidade, unidade) values ('20000000-0000-0000-0000-00000000000a', '2026-12-30', 2, 'toneladas')$$,
  'colheita com unidade desconhecida');
reset role;

select pg_temp.como('00000000-0000-0000-0000-00000000000b');
set role authenticated;
do $$ begin
  assert (select count(*) from public.entradas_diario) = 0, 'Beto não deveria ver o diário da Ana';
  assert (select count(*) from public.colheitas) = 0, 'Beto não deveria ver as colheitas da Ana';
  assert (select count(*) from storage.objects) = 0, 'Beto não deveria ver as fotos da Ana';
end $$;
delete from storage.objects;
delete from public.entradas_diario;
select pg_temp.deve_falhar($$insert into public.entradas_diario (plantio_id, data, texto) values ('20000000-0000-0000-0000-00000000000a', '2026-11-10', 'invasão')$$,
  'anotar no plantio de outro usuário');
select pg_temp.deve_falhar($$insert into public.colheitas (plantio_id, data, quantidade, unidade) values ('20000000-0000-0000-0000-00000000000a', '2026-12-30', 1, 'kg')$$,
  'registrar colheita no plantio de outro usuário');
reset role;
do $$ begin
  assert (select count(*) from storage.objects) = 1, 'delete do Beto não deveria apagar a foto da Ana';
  assert (select count(*) from public.entradas_diario) = 1, 'delete do Beto não deveria apagar o diário da Ana';
  assert (select public from storage.buckets where id = 'fotos') = false, 'bucket de fotos precisa ser privado';
end $$;

-- Plantas de casa: mesma regra de dono
select pg_temp.como('00000000-0000-0000-0000-00000000000a');
set role authenticated;
insert into public.plantas_casa (id, planta_id, apelido, comodo, desde)
  values ('40000000-0000-0000-0000-00000000000a', 'jiboia', 'Jiboia da sala', 'Sala', '2026-11-01');
insert into public.cuidados_casa (planta_casa_id, tipo, data) values ('40000000-0000-0000-0000-00000000000a', 'conferir', '2026-11-08');
select pg_temp.deve_falhar($$insert into public.plantas_casa (planta_id, usuario_id) values ('jiboia', '00000000-0000-0000-0000-00000000000b')$$,
  'cadastrar planta de casa em nome de outro usuário');
select pg_temp.deve_falhar($$insert into public.plantas_casa (planta_id) values ('../jiboia')$$,
  'id de planta de casa fora do padrão');
select pg_temp.deve_falhar($$insert into public.plantas_casa (planta_id, apelido) values ('jiboia', '   ')$$,
  'apelido em branco');
select pg_temp.deve_falhar($$insert into public.cuidados_casa (planta_casa_id, tipo, data) values ('40000000-0000-0000-0000-00000000000a', 'poda', '2026-11-08')$$,
  'cuidado de casa desconhecido');
reset role;

select pg_temp.como('00000000-0000-0000-0000-00000000000b');
set role authenticated;
do $$ begin
  assert (select count(*) from public.plantas_casa) = 0, 'Beto não deveria ver as plantas de casa da Ana';
  assert (select count(*) from public.cuidados_casa) = 0, 'Beto não deveria ver os cuidados da Ana';
end $$;
update public.plantas_casa set ativa = false;
delete from public.cuidados_casa;
select pg_temp.deve_falhar($$insert into public.cuidados_casa (planta_casa_id, tipo, data) values ('40000000-0000-0000-0000-00000000000a', 'rega', '2026-11-09')$$,
  'registrar cuidado na planta de casa de outro usuário');
reset role;
do $$ begin
  assert (select ativa from public.plantas_casa where id = '40000000-0000-0000-0000-00000000000a'), 'update do Beto não deveria afetar a Ana';
  assert (select count(*) from public.cuidados_casa) = 1, 'delete do Beto não deveria apagar os cuidados da Ana';
end $$;

-- Visitante sem login lê o catálogo e nada mais
select pg_temp.como(null);
set role anon;
do $$ begin
  assert (select count(*) from public.especies) = 13, 'anônimo deveria ler o catálogo';
end $$;
select pg_temp.deve_falhar($$select count(*) from public.plantios$$, 'anônimo lendo plantios');
select pg_temp.deve_falhar($$select count(*) from public.perfis$$, 'anônimo lendo perfis');
select pg_temp.deve_falhar($$select count(*) from public.entradas_diario$$, 'anônimo lendo o diário');
select pg_temp.deve_falhar($$select count(*) from storage.objects$$, 'anônimo listando fotos');
select pg_temp.deve_falhar($$select count(*) from public.plantas_casa$$, 'anônimo lendo plantas de casa');
reset role;

\echo 'Todos os testes de RLS passaram.'
