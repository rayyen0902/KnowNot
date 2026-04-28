# 抖音小程序 V1 接口联调记录

> 更新时间：2026-04-28  
> 范围：`user/init`、`report/task/create`、`report/task/status`、`report/detail`、`user/bind`

## 1) 字段对齐表（当前仓库）

说明：当前仓库未包含 `backend-go` 实际源码，以下为**前端实现 vs 文档协议**对齐结果，待后端仓库接入后复核最终字段。

### POST `/api/v1/user/init`

- 请求字段：`anonymous_id?`
- 响应字段：`token`、`anonymous_id`
- 错误码：`40001` 参数错误、`40101` 登录态异常、`50001` 内部错误

### POST `/api/v1/report/task/create`

- 请求字段：
  - `session_id`
  - `profile.skin_type`
  - `profile.wash_time`
  - `profile.makeup_habit`
  - `profile.routine_steps[]`
  - `profile.allergy_input`
  - `profile.allergy_preset[]`
- 响应字段：`task_id`
- 错误码：`40001` 参数错误、`40901` 状态冲突、`50001` 内部错误、`50201` AI 上游失败

### GET `/api/v1/report/task/status?task_id=...`

- 请求字段：`task_id`（query）
- 响应字段：`task_id`、`state`（`pending|running|done|failed`）、`report_id?`、`error_message?`
- 错误码：`40001` 参数错误、`40401` 任务不存在、`50001` 内部错误

### GET `/api/v1/report/detail?report_id=...`

- 请求字段：`report_id`（query）
- 响应字段：
  - `report_id`
  - `skin_type`
  - `main_issues[]`
  - `recommended_ingredients[]`
  - `avoid_ingredients[]`
  - `morning_routine[]`
  - `night_routine[]`
  - `product_tips[]`
  - `confidence`
- 错误码：`40001` 参数错误、`40401` 报告不存在、`50001` 内部错误

### POST `/api/v1/user/bind`

- 请求字段：`anonymous_id`、`login_code`
- 响应字段：`token`、`user_id`
- 错误码：`40001` 参数错误、`40101` 登录校验失败、`40901` 绑定冲突、`50001` 内部错误

## 2) 本次联调可观测日志点

以下日志已在前端代码中加点（便于你在抖音开发者工具控制台截图留档）：

- `[v1-flow] user/init success`
- `[v1-flow] report/task/create success`
- `[v1-flow] report/task/status`
- `[v1-flow] report/task/done`
- `[v1-flow] report/detail success`
- `[v1-flow] user/bind success`
- `[v1-flow] shop/jump success`

## 3) Mock 联调说明

`apps/miniapp/src/services/api.ts` 已支持 mock 模式：

- 默认无 `TARO_APP_API_BASE_URL` 时自动启用 mock；
- 或显式设置 `TARO_APP_MOCK_API=1`；
- `report/task/status` 会依次返回 `pending -> running -> done`；
- 当 `profile.allergy_preset` 包含 `mock_fail` 时，可触发一次 `failed` 分支用于验收。
