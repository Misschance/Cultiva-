-- Rodar a carga de novo (atualização do catálogo) não pode apagar dados de usuários.
\set ON_ERROR_STOP on
do $$ begin
  assert (select count(*) from public.plantios) = 1, 'a recarga do catálogo apagou plantios de usuários';
  assert (select count(*) from public.registros_acao) = 1, 'a recarga do catálogo apagou registros de usuários';
  assert (select count(*) from public.especies) = 13, 'catálogo incompleto após recarga';
end $$;
\echo 'Recarga do catálogo preserva os dados dos usuários.'
