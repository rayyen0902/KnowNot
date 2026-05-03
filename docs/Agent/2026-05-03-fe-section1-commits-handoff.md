# FE §1 主链落地 · 提交与 PR 交接（rollback/to-three-pages）

| 字段 | 值 |
|------|-----|
| **分支** | `rollback/to-three-pages` |
| **依据** | [2026-05-03-fe-section1-gap-analysis.md](./2026-05-03-fe-section1-gap-analysis.md) §1-1…§1-8、[2026-05-03-ux-interaction-spec-v1.md](./2026-05-03-ux-interaction-spec-v1.md) §1 |
| **文档冲突** | 仍以 gap 文「总览」为准：实现遵循 **Owner 定稿 + interaction-spec §1**；`implementation-v1.md` §5.1 字面「`done` 后跳转报告页」已由 **回首页 + 聊天卡片** 替代；**是否改文档**归 **PMO 工单**。 |

---

## 提交顺序（8 个）

| § | Commit | 主要路径 |
|---|--------|----------|
| §1-1 | `7f140dd` | `services/reportFlowState.ts`、`reportSession.ts`、`utils/questionnaireToProfile.ts`、`pages/questionnaire/index.tsx` |
| §1-2 | `7416f41` | `reportFlowState`（聊天持久化 + `appendReportReadyCardMessage`）、`features/home/components/chat/ChatThread.*`、`components/index.ts`、`pages/home/index.tsx` |
| §1-3 | `619ac09` | `HomeFloatingTabs.tsx` / `.scss` |
| §1-4 | `ec3a41e` | `utils/reportTabNavigation.ts`、`HomeFloatingTabs.tsx`、`pages/report/index.tsx` |
| §1-5 | `c6a76cd` | `pages/report/index.tsx`（壳文案 + 详情加载错误柔和化） |
| §1-6 | `440a6d4` | `pages/auth/index.tsx` / `.scss`、`pages/home/index.tsx`（软提醒消费） |
| §1-7 | `d916dbd` | `pages/questionnaire/index.tsx`、`pages/report/index.tsx`（再次生成） |
| §1-8 | `2a1c0e0` | `hooks/useReportTaskPoller.ts`、`pages/home/index.tsx`、`services/api.ts`（mock 时间轴）、`reportFlowState.ts`（`patchActiveReportTask` 不 notify）、`HomeFloatingTabs` 去掉不兼容的 `ariaRole` / `ariaDisabled` |

**横切**：`reportFlowState` 承担 `task_id` / `last_report_id` / 聊天草稿 / 问卷草稿 / 登录软提醒标记；**TODO**：`reportTabNavigation.ts` 中已注明 `last_report` 可换 **BE** 接口。

---

## 可粘贴的 PR 描述（含验收勾选）

```markdown
## 背景

对齐 `docs/Agent/2026-05-03-fe-section1-gap-analysis.md` §1-1…§1-8 与 `2026-05-03-ux-interaction-spec-v1.md` §1；与 `implementation-v1.md` §5.1 字面冲突处按 **Owner 定稿 + interaction-spec** 实现（PMO 文档工单另跟）。

## 提交拆分（按 §1 顺序）

- `7f140dd` §1-1 · `7416f41` §1-2 · `619ac09` §1-3 · `ec3a41e` §1-4 · `c6a76cd` §1-5 · `440a6d4` §1-6 · `d916dbd` §1-7 · `2a1c0e0` §1-8

## 验收（请合并前自测勾选）

- [ ] **§1-1** 问卷「生成报告」调用 `report/task/create`，成功后进入 **P-Home-Chat**，问卷页无整页钉死 loading。
- [ ] **§1-2** `done` 后**不**自动进详情；聊天流出现**持久**中性「报告卡片」；本地 `Storage` 可复现（BE 同步见 Integration）。
- [ ] **§1-3** `pending`/`running` 时「护肤报告」Tab **置灰**；强触约 1.5s 内 ≥3 次 → 聊天插入「报告加速生成中……」，且 **≥8s** 防抖。
- [ ] **§1-4** 未登录 Tab → **壳**（`?entry=shell`）；已登录有 `last_report_id` → **详情**带 `report_id`。
- [ ] **§1-5** 壳/绑定门**不**展示 `report/detail` 实质字段；详情仅在绑定且 `report/detail` 成功之后。
- [ ] **§1-6** Auth「稍后返回」或未完成离开 → **首页** + **一条** AI 软提醒（非强迫）。
- [ ] **§1-7** 问卷再入 **接着填/重新填**；报告 **再次生成** → **修改问卷 / 直接重新生成**；直连回首页进入等待流。
- [ ] **§1-8** 轮询 **2s**、**60s** 超时柔和文案；`failed` 柔和、可再试路径不吓人；mock 约 **2.1s / 4.2s** 状态切换便于本地验。

## 备注

- 真机 `TARO_APP_MOCK_API` / `TARO_APP_API_BASE_URL` 与联调环境需 **Integration** 再对一遍。
```

---

## 开 PR 时请注意（FE 说明）

- 工作区里仍有**大量未提交的其它改动**（多页面 SCSS 等）；本次**只提交**与 §1 主链路相关的上述文件。开 PR 时请确认 **仅包含这 8 个 commit**，或按需 **cherry-pick** 到目标分支。
- `npx tsc` 在工程里仍有**既有报错**（如 `Taro.openSchema`、`request` 泛型等）；本次对 Tab/宿主能力范围内 **aria** 等做了与 **Taro 类型**兼容的收敛。若希望 PR 前 **tsc 全绿**，需**单独排期**修配置/全局类型。

---

## 修订记录

| 版本 | 日期 | 说明 |
|------|------|------|
| v1 | 2026-05-03 | FE 会话交接：8 commit 摘要 + PR 模板；PMO 落库 |
