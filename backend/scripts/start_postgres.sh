#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKEND_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

PORT="${PORT:-8080}"
STORAGE_MODE="${STORAGE_MODE:-postgres}"
DATABASE_URL="${DATABASE_URL:-}"
MIGRATION_FILE="${MIGRATION_FILE:-./migrations/001_init_v1.sql}"

if [[ "$STORAGE_MODE" == "postgres" && -z "$DATABASE_URL" ]]; then
  echo "[start_postgres] DATABASE_URL is required when STORAGE_MODE=postgres"
  exit 1
fi

cd "$BACKEND_DIR"

# Allow callers to pass repo-root style path.
if [[ "$MIGRATION_FILE" == ./backend/* ]]; then
  MIGRATION_FILE=".${MIGRATION_FILE#./backend}"
fi

if [[ ! -f "$MIGRATION_FILE" ]]; then
  echo "[start_postgres] migration file not found: $MIGRATION_FILE"
  exit 1
fi

echo "[start_postgres] PORT=$PORT"
echo "[start_postgres] STORAGE_MODE=$STORAGE_MODE"
echo "[start_postgres] MIGRATION_FILE=$MIGRATION_FILE"
echo "[start_postgres] starting server..."
echo "[start_postgres] health check command:"
echo "curl -sS \"http://127.0.0.1:${PORT}/healthz\""

exec env \
  PORT="$PORT" \
  STORAGE_MODE="$STORAGE_MODE" \
  DATABASE_URL="$DATABASE_URL" \
  MIGRATION_FILE="$MIGRATION_FILE" \
  go run ./main.go
