# AIhufu Backend (Phase 1 Baseline)

## Start (File mode fallback)

```bash
cd /Users/caopinggege/Desktop/AIhufu/backend
cp .env.example .env
export PORT=8080
export STORAGE_MODE=file
export DATA_FILE=./data/store.json
go run main.go
```

## Start (Postgres mode)

```bash
cd /Users/caopinggege/Desktop/AIhufu/backend
cp .env.example .env
export PORT=8080
export STORAGE_MODE=postgres
export DATABASE_URL="postgres://postgres:postgres@127.0.0.1:5432/aihufu?sslmode=disable"
export MIGRATION_FILE=./migrations/001_init_v1.sql
go run main.go
```

Apply migration manually if needed (service will also execute this file on startup in postgres mode):

```bash
psql "$DATABASE_URL" -f migrations/001_init_v1.sql
```

## Environment Variables

- `PORT`: HTTP listen port, default `8080`
- `STORAGE_MODE`: `file` (default) or `postgres`
- `DATA_FILE`: file persistence path, default `./data/store.json`
- `DATABASE_URL`: required when `STORAGE_MODE=postgres`
- `MIGRATION_FILE`: migration sql file path, default `./migrations/001_init_v1.sql`

## Health Check

```bash
curl -sS "http://127.0.0.1:8080/healthz"
```

Expected:

```json
{"code":0,"message":"ok","data":{"status":"ok","time":"...","storage_mode":"..."},"trace_id":"..."}
```

## Data Tables (JSON persistence)

Persisted in `DATA_FILE`:

- `users_by_anon`
- `sessions_by_id`
- `tasks_by_id`
- `reports_by_id`
- `bound_users`

Task transitions are stored in `tasks_by_id[*].transitions` for observability.

## Postgres Tables

- `users`
- `sessions`
- `tasks`
- `reports`
- `binds`

Indexes and sequences are defined in `migrations/001_init_v1.sql`.
