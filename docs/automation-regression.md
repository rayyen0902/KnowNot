# 自动化回归说明

本说明用于后端 V1 主链路的最小自动化回归：postgres 模式一键启动 + 6 接口 smoke（正向 + 负向）。

## 1) postgres 模式一键启动

脚本：`backend/scripts/start_postgres.sh`

```bash
cd /Users/caopinggege/Desktop/AIhufu
export PORT=18083
export STORAGE_MODE=postgres
export DATABASE_URL='postgresql://postgres.ojksspldvpuktzizydam:<DB_PASSWORD>@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres?sslmode=require'
export MIGRATION_FILE=./migrations/001_init_v1.sql
./backend/scripts/start_postgres.sh
```

说明：
- 默认 `STORAGE_MODE=postgres`
- 固定读取 `PORT`、`STORAGE_MODE`、`DATABASE_URL`、`MIGRATION_FILE`
- 启动后会自动打印 healthz 检查命令

## 2) 6 接口一键 smoke

脚本：`backend/scripts/smoke_v1.sh`

```bash
cd /Users/caopinggege/Desktop/AIhufu
BASE_URL=http://127.0.0.1:18083 ./backend/scripts/smoke_v1.sh
```

覆盖链路：
- `user/init -> session/start -> report/task/create -> report/task/status -> report/detail -> user/bind`

关键断言：
- 每步 `code=0`
- 每步 `trace_id` 存在
- `task/status` 的 `state` 字段存在且最终 `done`

结果：
- 全部通过输出 `PASS`
- 任一步失败输出 `FAIL`

## 3) 负向 smoke

脚本：`backend/scripts/smoke_v1_negative.sh`

```bash
cd /Users/caopinggege/Desktop/AIhufu
BASE_URL=http://127.0.0.1:18083 ./backend/scripts/smoke_v1_negative.sh
```

覆盖关键错误路径：
- `user/bind` 空 `login_code` -> `40001`
- `user/bind` 无效 `login_code` -> `40101`
- `report/detail` 不存在报告 -> `40401`

## 4) CI 接入（GitHub Actions）

配置文件：`.github/workflows/backend-smoke.yml`

触发条件：
- push 到 `main` 或 `master`
- `workflow_dispatch` 手动触发

流水线执行：
1. 启动后端（postgres 模式）
2. 执行 `backend/scripts/smoke_v1.sh`
3. 执行 `backend/scripts/smoke_v1_negative.sh`
4. 任一步失败即终止（FAIL）

CI 必填密钥：
- `DATABASE_URL`（Repository Secrets）
