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
├── infra/              # 部署与基础设施（预留）
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
