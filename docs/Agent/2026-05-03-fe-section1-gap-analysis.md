# FE 对照：交互说明 §1 × `apps/miniapp` 现状与改动清单

| 字段 | 值 |
|------|-----|
| **版本** | v1 |
| **日期** | 2026-05-03 |
| **性质** | **前端实现 FE** 向现状盘点 + 改动清单（供 PMO 拆单、Integration 对齐） |
| **上游** | [2026-05-03-ux-interaction-spec-v1.md](./2026-05-03-ux-interaction-spec-v1.md)、[2026-05-03-ux-v0-decisions.md](./2026-05-03-ux-v0-decisions.md)、[docs/implementation-v1.md](../implementation-v1.md) |

---

## 总览

当前小程序：

- 问卷「生成报告」**未接** `report/task/create` 与轮询。
- 首页为 **静态 HomeFlow + 输入框占位**，无会话流、无报告卡片、无任务态驱动的 Tab 行为。
- 报告页有 **绑定门** + `report/detail` 雏形，但与「生成后回聊天、卡片触点、壳页路由、再次生成二选一、问卷续填」等 **interaction-spec §1** 要求差距较大。

**文档冲突说明**：`implementation-v1.md` §5.1 仍写「`done` 后跳转报告」，与 **Owner 定稿 + 交互说明**「以聊天为主场景」冲突。**实现时以定稿 + interaction-spec §1 为准**；是否修订 `implementation-v1.md` 由 **PMO 文档工单**另跟（见 interaction-spec **§3** 第 2 条及本文 **横切与依赖**）。

---

## §1-1：首页为聊天主场景；`report/task/create` 成功后回 P-Home-Chat，不在问卷页钉死 loading

| 维度 | 内容 |
|------|------|
| **现状** | `pages/questionnaire/index.tsx` 中 `onGenerateReport` 仅 `goTo('/pages/report/index')`，未调用 `createReportTask`（`api.ts` 中函数未被引用）。无「创建成功 → 回首页」链路。 |
| **差距** | 无任务创建；无「成功后在 `pages/home/index`（P-Home-Chat）承接等待」；问卷页也无真实 loading 与 API 绑定。 |
| **改动清单** | ① 在问卷完成流中组装 `profile`（及照片上传若已有接口）并调用 `POST /api/v1/report/task/create`。② 成功后 `switchTab` / `goTo` 回 `/pages/home/index`，不在问卷页阻塞整页生成 UI。③ 将「生成中」主 UI 迁到首页聊天场景（与 §1-2、定稿 #4 一致）。④ 若需 `session_id`，在首页或问卷前确保 `session/start` 与本地会话态一致（与 **BE** 契约对齐）。 |

---

## §1-2：`done` 后不自动进报告详情；在会话流插入持久报告卡片（未登录仅中性字段，不透实质内容 #8）

| 维度 | 内容 |
|------|------|
| **现状** | `pages/home/index.tsx` 无消息列表；发送仅 `showToast`，无 AI 流、无卡片组件。 |
| **差距** | 无「`done` → 插入卡片」；无持久本地/服务端消息模型与 UI。 |
| **改动清单** | ① 设计并实现聊天消息列表（至少：用户气泡、AI 文本、**报告卡片**消息类型）。② `done` 且拿到 `report_id` 后 **不向** `report/detail` 自动全页跳转；改为 `append` 卡片消息（字段中性：标题/CTA，无分数/成分等）。③ **持久化**策略：本地存储 + 或与 `chat/message`/系统事件对齐（interaction-spec **§3** PMO 工单定 **BE** 责任时需同步）。④ 卡片点击 → 报告壳/详情路由（与 §1-4、定稿 #12 一致）。 |

---

## §1-3：`pending` / `running`：底部「护肤报告」Tab 置灰；强触插入「报告加速生成中……」+ 防抖（默认阈值见 spec §2）

| 维度 | 内容 |
|------|------|
| **现状** | `HomeFloatingTabs.tsx` 报告 Tab 恒为可点，`goTo('/pages/report/index')`，无任务态、无置灰、无强触计数、无防抖插入消息。 |
| **差距** | 与定稿 #11、interaction-spec **§2**（约 1.5s 内 ≥3 次点击、加速文案 ≥8s 一条）均未实现。 |
| **改动清单** | ① 引入全局或可订阅的**报告任务状态**（`pending` / `running` / `done` / `failed`）。② Tab「护肤报告」在 `pending`/`running` 时 **禁用 + 置灰**样式。③ 监听 Tab 区域点击：满足强触阈值时在 P-Home-Chat 插入固定文案消息（或系统消息样式），**防抖**避免刷屏。④ 小程序侧用 `aria-role`/文案说明禁用原因等，在宿主支持范围内做可读性（与 §1-8 同条）。 |

---

## §1-4：未登录点 Tab → P-Report-Shell → P-Auth；已登录点 Tab → P-Report-Detail（有历史报告时直达最后一次）

| 维度 | 内容 |
|------|------|
| **现状** | 报告 Tab 始终去 `/pages/report/index` 无 `query`；`report/index.tsx` 无 `report_id` 时展示「请先生成报告」，未区分「未登录先进壳」与「无报告」。已登录也**未**根据「最后一次报告」自动解析 `report_id`。 |
| **差距** | 与定稿 #2、#12：Tab 入口应对 **登录态 + 是否已有报告** 分支；「最后一次报告」需本地或接口提供 `report_id`。 |
| **改动清单** | ① `HomeFloatingTabs`（或统一导航层）点击「护肤报告」时：**未登录** → 壳页（脱敏占位 + 登录引导，对齐 #12 文案由 PMO/UX 终稿）→ P-Auth；**已登录** → 若有 `last_report_id`（或接口返回）则 `/pages/report/index?report_id=...` 直达详情。② `report/index` 按 `query` + 登录态拆分 **Shell / Detail** 渲染路径（可与 §1-5 合并设计）。③ 与 **BE** 确认「最后一次报告」查询接口或绑定后列表字段（若尚无，FE 需占位 + TODO 与 **Integration** 对齐）。 |

---

## §1-5：Shell 不渲染 `report/detail` 实质字段；登录成功后再展示完整（或进 Detail 再拉取）

| 维度 | 内容 |
|------|------|
| **现状** | `!isBound && reportId` 时仅展示绑定说明，不调 `getReportDetail`，符合「未拉详情」。但无 `report_id` 的未登录 Tab 路径仍是「请先生成报告」，**不是**纯脱敏壳。已登录后详情区仍混用 `DEFAULT_METRICS` 等占位与接口字段，需保证**壳态绝不混入** `report` 实质字段。 |
| **差距** | Shell 路由与文案未完全对齐 #8 / #12；详情与占位边界需在代码层显式分支。 |
| **改动清单** | ① 明确 **Shell** 组件/分支：仅中性文案 + 登录 CTA，禁止 `report` 中摘要/分数/列表。② 登录成功后：`navigateBack` 或带 `report_id` 再进详情并 `getReportDetail`（与现 `goBind` + `useDidShow` reload 可演进）。③ **审计** `report/index.tsx` 所有使用 `report` 字段的区块，确保**仅在** `isBound` + 已拉取 detail 后渲染。 |

---

## §1-6：Auth 取消/返回 → P-Home-Chat + 一条 AI 软提醒（定稿 #9）

| 维度 | 内容 |
|------|------|
| **现状** | `pages/auth/index.tsx` 无显式「取消」；绑定成功 `navigateBack`。系统返回键/关闭行为未统一写回首页 + 未插入软提醒消息。 |
| **差距** | 与 #9：取消应回聊天且 AI 补一条非强迫提醒。 |
| **改动清单** | ① 增加可发现的「稍后/返回」或依赖 `onUnload` / `useRouter` 监听离开登录页。② 离开且**未完成绑定**时：`switchTab` 到首页（若栈深则明确路由策略）。③ 在首页聊天流 `append` 一条软提醒（文案 **UX 终稿**）。④ 与 §1-2 **消息模型**共用。 |

---

## §1-7：问卷再入「接着填 / 重新填」；报告「再次生成」二选一 + 回聊等待叙事（#3、#10、#4）

| 维度 | 内容 |
|------|------|
| **现状** | 问卷无再入弹窗；无草稿读写。报告页底部为「重新测试肤质」文案按钮（`report-footer__btn`），非二选一弹窗，也未接「直接重生成」与回聊天等待。 |
| **差距** | 定稿 #3、#10、#4 均未落地。 |
| **改动清单** | ① 问卷 `useLoad`/`useDidShow`：检测未完成草稿 → `Taro.showModal` 或自绘弹窗：「接着填」/「重新填」（草稿本地 vs 服务端随 **PMO 工单** interaction-spec §3-3）。② 报告详情底部「再次生成」→ 弹窗：「修改问卷」（带状态进问卷）、「直接重新生成」（沿用上轮 payload 调 `create`）。③「直接重新生成」提交后回 **P-Home-Chat** + 等待文案/轮询（与 §1-1、§1-2 一致）。④ 复制上一轮问卷答案的存储结构与 **BE** `profile` 映射表（**Integration**）。 |

---

## §1-8：轮询 2s/60s、`failed` 与定稿柔和、可重试、不恐吓；Tab 禁用无障碍可读

| 维度 | 内容 |
|------|------|
| **现状** | `api.ts` 仅有 mock `getReportTaskStatus`（非真实 2s/60s 循环）；无任何页面调用 `createReportTask`/`getReportTaskStatus`。报告加载失败文案为「加载失败」类常规提示。Tab 无禁用态故无 a11y。 |
| **差距** | 与 `implementation-v1.md` §5.2 / §六及定稿 #5：真实轮询、超时、失败柔和续等、后台重试叙事由前端配合（重试按钮或自动重试策略需与 **UX** 句终稿一致）。 |
| **改动清单** | ① 在 P-Home-Chat（或统一 hook）实现 `setInterval`/sleep 循环 **2s** 轮询，**60s** 超时停止并 UI/消息对齐文档「分析时间稍长…」类柔和文案。② `failed`：不恐吓；提供可重试（与定稿 #5「不说失败、柔和续等」一致的具体文案与是否自动重试由 **UX 终稿**）。③ Tab 禁用时：`aria-busy`/`aria-disabled` 等价或附可见说明文字（微信基础库能力内）。④ mock 联调数据与生产轮询分离，避免 `pollCount` 假逻辑误导验收。 |

---

## 横切与依赖（便于 PMO 拆单）

| 项 | 说明 |
|----|------|
| **全局状态** | 任务 `task_id`、状态、`report_id`、`last_report_id`、问卷草稿、聊天消息列表 —— 需决定放 React context、全局 store 或封装模块 + 事件（仅列方向，实现时收敛）。 |
| **`router.ts` / tabPages** | 若报告改为 `switchTab`，需在 `router` 与 `app.config` tabBar（若启用）之间统一；当前全 `navigateTo`，与「首页 Tab 化」一致化时需调整。 |
| **文档冲突** | `implementation-v1.md` §5.1 仍写「`done` 后跳转报告」；执行以 **ux-v0-decisions + interaction-spec §1** 为准；是否改 `implementation-v1.md` 由 **PMO 工单**（定稿 §4 / interaction-spec §3-2）。 |
| **BE / Integration** | `session_id`、`last_report`、聊天内系统消息/卡片是否服务端插入（interaction-spec §3-6）。 |

---

## 修订记录

| 版本 | 日期 | 说明 |
|------|------|------|
| v1 | 2026-05-03 | FE 向 §1 八条与 `apps/miniapp` 现状对照 + 改动清单；PMO 落库 |
