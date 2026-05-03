# Agent 交付物目录（Cursor 会话产出）

本目录存放 **Owner（唯一真人）** 与 **PMO（Cursor 项目总控会话）** 认可后、供各执行 Agent（UX / FE / BE 等）对照的**短文档**，例如：

- **当前主链交互**：[2026-05-03-ux-v0-decisions.md](./2026-05-03-ux-v0-decisions.md)（Owner **v1.0 已定稿**）→ [2026-05-03-ux-interaction-spec-v1.md](./2026-05-03-ux-interaction-spec-v1.md)（**UX《交互说明》v1**）→ [2026-05-03-fe-section1-gap-analysis.md](./2026-05-03-fe-section1-gap-analysis.md)（**FE §1 差距清单**）→ [2026-05-03-fe-section1-commits-handoff.md](./2026-05-03-fe-section1-commits-handoff.md)（**FE §1 八提交 + PR 模板** · `rollback/to-three-pages`）
- 交互说明定稿片段（链接或粘贴摘要）
- 某迭代里程碑与验收要点（供拆工单）
- 跨会话需对齐的「单页事实表」（字段、状态、跳转）

**不写进此目录也可**：一切以 `docs/team-roles.md` 与根目录规格文档为准；此处仅为 **降低多会话上下文丢失** 的归档位。

---

## 协作事实（与 `team-roles.md` 一致）

| 角色 | 谁承担 |
|------|--------|
| **Owner** | **你本人（唯一真人）**；价值观、商业、最终验收 |
| **PMO** | **Owner 指定的 Cursor 会话**；拆计划、写可复制指令、把共识**落实进仓库** |
| **UX / FE / BE / …** | **各自独立的 Cursor 会话**；会话开头自报角色名 |

**指派口令示例**（复制到任意 Cursor 会话首条）：

```text
本会话角色：【项目总控 PMO】。依据 docs/team-roles.md；Owner 为唯一真人，其余 Agent 均为 Cursor 会话。请……
```

```text
本会话角色：【前端实现 FE】。依据 docs/team-roles.md 与 UX 定稿（路径：docs/Agent/……）。请……
```

---

## 命名约定（可选）

文件名建议带日期与主题，例如：`2026-05-03-ux-flow-report-bind.md`，便于 PMO 在工单里引用。
