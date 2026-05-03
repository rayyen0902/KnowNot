# 抖音小程序 V1 实施方案（匿名采集 -> 异步报告 -> 查看时绑定）

> 版本：v1.0  
> 适用范围：小程序 V1 首发链路  
> 依据文档：`architecture.md`

---

## 1. 服务分工（Go / Python / FC / Supabase）

- **Go（对外业务主干）**
  - 对小程序暴露 `/api/v1/*` 接口
  - 承担匿名身份初始化、会话编排、报告任务管理、报告查询、账号绑定、商品卡片聚合
  - 统一鉴权（Bearer Token）与错误码规范
- **Python（AI 内部服务）**
  - 处理画像理解、提示词编排、结构化输出校验
  - 输出报告固定字段协议，返回给 Go 入库
- **FC（模型接入适配层）**
  - 负责大模型供应商切换、参数标准化、轻量前后处理
  - 不承载核心业务状态与任务流转主链路
- **Supabase（数据层）**
  - 存储匿名用户、正式用户、会话、报告任务、报告详情
  - 保存绑定关系 `anonymous_id -> user_id`
  - 提供后续商品卡片、历史报告等查询底座

---

## 2. Go 对外接口 V1

统一前缀：`/api/v1`

### 2.1 用户初始化（匿名可用）

- `POST /api/v1/user/init`
- 请求体：

```json
{
  "anonymous_id": "optional_reuse_anonymous_id"
}
```

- 响应体：

```json
{
  "code": 0,
  "message": "ok",
  "data": {
    "token": "jwt_token",
    "anonymous_id": "anon_xxx"
  }
}
```

### 2.2 会话开始

- `POST /api/v1/session/start`
- 请求体：

```json
{
  "anonymous_id": "anon_xxx"
}
```

### 2.3 对话消息

- `POST /api/v1/chat/message`
- 请求体：

```json
{
  "session_id": "sess_xxx",
  "message": "用户消息"
}
```

### 2.4 报告任务创建

- `POST /api/v1/report/task/create`
- 请求体：

```json
{
  "session_id": "sess_xxx",
  "profile": {
    "skin_type": "combination",
    "wash_time": "morning_night",
    "makeup_habit": "light",
    "routine_steps": ["cleanser", "toner"],
    "allergy_input": "",
    "allergy_preset": ["none"]
  }
}
```

- 响应体：

```json
{
  "code": 0,
  "message": "ok",
  "data": {
    "task_id": "task_xxx"
  }
}
```

### 2.5 报告任务状态

- `GET /api/v1/report/task/status?task_id=task_xxx`
- 响应体：

```json
{
  "code": 0,
  "message": "ok",
  "data": {
    "task_id": "task_xxx",
    "state": "pending",
    "report_id": "rpt_xxx",
    "error_message": ""
  }
}
```

- `state` 枚举：`pending | running | done | failed`

### 2.6 报告详情

- `GET /api/v1/report/detail?report_id=rpt_xxx`
- `data` 字段遵循“报告固定字段协议”

### 2.7 用户绑定（查看完整报告时）

- `POST /api/v1/user/bind`
- 请求体：

```json
{
  "anonymous_id": "anon_xxx",
  "login_code": "dy_or_phone_login_code"
}
```

### 2.8 商品卡片（抖音小店跳转）

- `GET /api/v1/shop/cards?report_id=rpt_xxx`
- 返回卡片包含 `jump_url`，前端直跳抖音小店，支付由抖音侧托管

---

## 3. Python 内部接口 V1

- `POST /internal/v1/ai/report/generate`
- 仅 Go 内网可调用，需带内部鉴权头（如 `X-Internal-Token`）
- 输入：用户画像、采集上下文、会话信息、模型配置
- 输出：严格结构化的报告固定字段

---

## 4. 报告固定字段协议

```json
{
  "skin_type": "敏感偏干",
  "main_issues": ["屏障受损", "泛红", "干燥"],
  "recommended_ingredients": ["神经酰胺", "泛醇", "角鲨烷"],
  "avoid_ingredients": ["高浓度酸类", "强清洁成分"],
  "morning_routine": [
    {
      "title": "温和清洁",
      "desc": "使用温和洁面，减少摩擦",
      "tip": "起泡后轻柔打圈"
    }
  ],
  "night_routine": [
    {
      "title": "修护保湿",
      "desc": "叠加修护霜",
      "tip": "按压吸收"
    }
  ],
  "product_tips": ["优先修护类精华", "避免高刺激叠加"],
  "confidence": 0.82
}
```

---

## 5. 前端交互状态机

> **与交互说明对齐（2026-05-03）**：本章 **§5.2 第 5 步** 以 **[docs/Agent/2026-05-03-ux-interaction-spec-v1.md](./Agent/2026-05-03-ux-interaction-spec-v1.md) §1** 与 **[docs/Agent/2026-05-03-ux-v0-decisions.md](./Agent/2026-05-03-ux-v0-decisions.md) v1.0** 为准（首页聊天主场景、`done` 后回首页并插入持久报告卡片等）。**接口与轮询参数**仍以本章上文及 `api.md` 为准，不因 UI 叙事变更。

### 5.1 报告任务状态机

- `idle`：未开始任务
- `pending`：任务已创建，等待 worker 拉取
- `running`：模型处理中
- `done`：任务完成，取得 `report_id`（进入报告相关 UI 的方式见 **§5.2 第 5 步**）
- `failed`：任务失败，可重试

### 5.2 小程序链路（V1）

1. 进入首页 -> 调用 `user/init`（本地有 token + anonymous_id 时复用）
2. 提交采集 -> 调用 `session/start`（如无会话）
3. 调用 `report/task/create`
4. 前端每 2 秒轮询 `report/task/status`，60 秒超时
5. `done` 后 **不自动全页跳转报告详情**；回到 **首页聊天主场景**，在 **会话流** 插入 **持久**「报告卡片」消息（携带 `report_id`；未登录仅中性字段，不透出 `report/detail` 实质内容）。用户点击卡片（或经 Tab 进入报告壳/详情路由）后再走报告页与绑定流程。
6. 报告页拉取 `report/detail`
7. 用户点击查看完整报告 -> 进入授权页，调用 `user/bind`
8. 绑定成功后返回报告页，身份由 `anonymous_id` 迁移为 `user_id`

---

## 6. 约束与边界（V1）

- V1 不强制首屏注册，先完成采集与报告生成
- 注册/登录在“查看完整报告”时触发
- 商品链路先走抖音小店外跳，不在小程序内承接支付
- V1 对话与报告以结构化字段优先，避免依赖模型长文本
# V1 落地实施清单（抖音小程序首发）

> 版本：v1.0  
> 更新时间：2026-04-28  
> 目标：把「匿名进入 -> AI 采集 -> 异步报告 -> 查看报告时绑定注册 -> 抖店跳转」落地为可执行方案。

---

## 一、Go / Python / FC 分工落地

### 1.1 Go（对外稳定业务层）

Go 作为唯一对外 API 入口，负责：

- 匿名用户初始化（`anonymous_id` + token）
- 用户绑定注册（手机号/授权后将匿名数据迁移到 `user_id`）
- 对话状态机与采集流程推进
- 报告任务创建、状态查询、报告落库与查询
- 商品卡片配置读取与抖店跳转参数返回
- 统一鉴权、限流、日志、错误码、版本管理

> 约束：前端仅访问 Go，不直连 Python。

### 1.2 Python（内部 AI 能力层）

Python 仅提供内部 AI 能力接口，负责：

- Prompt 编排（对齐《宪章-AI护肤助理.md》）
- Qwen 模型调用
- 输出结果结构化（固定字段）
- 图像/OCR 预处理（启用时）
- 规则推理与风险标注

> 约束：Python 不承载登录、支付、业务主状态流转。

### 1.3 FC（适配与实验层）

FC 保留为轻量中间层，适合：

- 模型供应商适配
- 参数标准化
- 轻量前后处理
- 灰度试验与快速验证

不建议长期承担：

- 复杂业务状态管理
- 大量持久化逻辑
- 对外正式 API 主入口

---

## 二、接口清单（Go 对外 v1）

统一前缀：`/api/v1`  
统一响应：

```json
{
  "code": 0,
  "message": "ok",
  "data": {},
  "trace_id": "xxx"
}
```

### 2.1 匿名与用户

1) `POST /api/v1/user/init`  
- 首次进入创建匿名身份  
- 返回：`anonymous_id`、`access_token`、`expires_in`

2) `POST /api/v1/user/bind`  
- 查看完整报告时触发身份验证绑定  
- 入参：`anonymous_id`、`verify_type(phone_code|douyin_auth)`、`verify_payload`  
- 返回：`user_id`、`access_token`、`migrated`

3) `GET /api/v1/user/profile`  
- 获取当前用户资料与绑定状态

### 2.2 会话与采集

4) `POST /api/v1/session/start`  
- 创建/恢复会话  
- 返回：`session_id`、`dialogue_state`、`collected_fields`

5) `POST /api/v1/chat/message`  
- 用户消息输入  
- 返回：`assistant_reply`、`next_step`、`can_generate_report`

6) `POST /api/v1/upload/presign`  
- 获取上传凭证（face/product）  
- 返回：`upload_url`、`file_key`、`public_url`

7) `POST /api/v1/skin/profile`  
- 采集资料补全  
- 返回：`profile_id`、`completion_rate`

### 2.3 报告任务（异步）

8) `POST /api/v1/report/task/create`  
- 创建 AI 分析任务  
- 返回：`task_id`、`status(pending)`

9) `GET /api/v1/report/task/status?task_id=...`  
- 查询任务状态  
- 返回：`status(pending|running|done|failed)`、`progress`、`report_id?`

10) `GET /api/v1/report/detail?report_id=...`  
- 获取结构化报告详情（固定字段）

### 2.4 商品与转化

11) `GET /api/v1/shop/cards?scene=report_after`  
- 返回抖店跳转卡片配置（Go 配置表维护）

---

## 三、Python 内部接口（v1）

内部前缀：`/internal/v1/ai`

1) `POST /internal/v1/ai/report/generate`  
- 输入：用户资料、采集字段、图片输入、会话上下文、宪章版本  
- 输出：固定字段结构化 JSON（见下节）

2) `GET /internal/v1/ai/health`  
- 健康检查

---

## 四、报告固定字段协议（前端渲染稳定）

以下字段为报告页固定渲染协议，Python 与 Go 都必须保证输出完整（缺失则补默认值）：

- `skin_type: string`
- `main_issues: string[]`
- `recommended_ingredients: string[]`
- `avoid_ingredients: string[]`
- `morning_routine: string[]`
- `night_routine: string[]`
- `product_tips: string[]`
- `confidence: number(0~1)`

> 规则：宁可空数组，也不要缺字段。

---

## 五、前端改造清单（按现有页面落地）

### 5.1 首页匿名初始化与任务轮询

文件：`apps/miniapp/src/pages/home/index.tsx`

- 首次进入执行 `user/init`
- 保存 `anonymous_id` + token（本地缓存）
- 接管「生成报告」动作：创建任务 + 2 秒轮询状态
- 状态 `done` 后：回 **首页聊天主场景** 并在会话流插入 **持久报告卡片**（携带 `report_id`），**不**自动全页跳转 `report?report_id=...`（与上文 **## 5 · §5.2 第 5 步** 及 `docs/Agent/2026-05-03-ux-interaction-spec-v1.md` §1 一致）
- 状态 `failed` 显示重试

### 5.2 HomeFlow 不再直接跳报告

文件：`apps/miniapp/src/features/home/container/HomeFlow.tsx`

- 把 `switchTab('/pages/report/index')` 替换为回调触发
- 由父组件负责任务创建与轮询

### 5.3 报告页改造为动态渲染

文件：`apps/miniapp/src/pages/report/index.tsx`

- 读取 `report_id`
- 请求 `report/detail`
- 按固定字段渲染
- 无 `report_id` 时提示“请先生成报告”

### 5.4 Auth 页承接绑定流程

文件：`apps/miniapp/src/pages/auth/index.tsx`

- 接收 `anonymous_id` 与来源参数
- 登录成功后调用 `user/bind`
- 绑定成功返回报告页

### 5.5 新增服务层

建议新增：

- `apps/miniapp/src/services/api.ts`
- `apps/miniapp/src/services/types.ts`
- `apps/miniapp/src/utils/session.ts`

封装方法：

- `initAnonymousUser`
- `createReportTask`
- `getReportTaskStatus`
- `getReportDetail`
- `bindAnonymousUser`

---

## 六、最小任务状态机（异步）

```text
pending -> running -> done
running -> failed
failed -> pending (retry)
```

前端轮询建议：

- 轮询间隔：2s
- 最长等待：60s
- 超时文案：分析时间稍长，任务已保留，可稍后查看

---

## 七、阶段性决策记录（当前已确认）

1. 匿名用户数据可迁移为正式账号数据  
2. 迁移前必须身份验证（手机号验证码或抖音授权）  
3. 报告生成采用异步任务模式  
4. 报告页采用固定字段渲染协议  
5. 商品先跳转抖音小店，支付由抖音管理  
6. 抖店跳转参数第一期由 Go 配置表维护

> **2026-05-03 文档修订**：与 UX spec §1 对齐 — **§5.2 步骤 5** 由「`done` 后跳转报告页」改为「`done` 后回首页并在聊天流插入持久报告卡片」；**§5.1** `done` 条文案同步；**「五、前端改造清单」§5.1** 中 `done` 后跳转旧句同步；其余协议与接口未改。

