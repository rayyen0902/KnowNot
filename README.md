# AI 护肤助理 Monorepo

这是项目的 monorepo 根目录。

## 当前结构

```text
ai-skincare/
├── apps/
│   ├── miniapp/        # 抖音小程序前端
│   ├── backend-go/     # Go 后端（预留）
│   └── ai-python/      # Python AI 服务（预留）
├── packages/
│   ├── shared/         # 共享工具（预留）
│   ├── types/          # 共享类型（预留）
│   └── constants/      # 共享常量（预留）
├── docs/               # 架构 / API / 数据库 / 工作流 / AI 宪法
├── infra/              # 部署与基础设施；含可选「本地备份到 GitHub」脚本
├── scripts/            # 统一脚本（预留）
├── package.json        # monorepo 根脚本
└── pnpm-workspace.yaml
```

## 启动小程序前端

```bash
pnpm install
pnpm dev:miniapp
```

## 构建小程序前端

```bash
pnpm build:miniapp
```

## 本地安全备份到 GitHub（可选）

本机备份到 **自管** GitHub 私有仓：**勿**提交 PAT。最简单：加 `backup` 远程后执行 `./infra/backup/setup-mac-auto-backup.sh`（详见 [`infra/backup/README.md`](./infra/backup/README.md)）。
