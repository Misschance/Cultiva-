#!/usr/bin/env bash
# Cria um banco descartável, aplica o simulador do Supabase, as migrações, a carga e os testes.
# Uso: DATABASE_URL=postgres://usuario:senha@localhost:5432/postgres bash supabase/tests/rodar.sh
set -euo pipefail
cd "$(dirname "$0")/.."

: "${DATABASE_URL:?defina DATABASE_URL apontando para um Postgres de teste}"
BANCO="cultivae_teste_$$"
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -qc "create database $BANCO"
trap 'psql "$DATABASE_URL" -qc "drop database if exists $BANCO" >/dev/null' EXIT
URL_TESTE="${DATABASE_URL%/*}/$BANCO"

rodar() { psql "$URL_TESTE" -v ON_ERROR_STOP=1 -q -f "$1"; }
rodar tests/00_simular_supabase.sql
for m in migrations/*.sql; do rodar "$m"; done
rodar seed.sql
rodar tests/10_rls.sql
rodar seed.sql
rodar tests/20_recarga_segura.sql
