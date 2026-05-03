# FE-HIFI-03 视觉基准说明（护肤报告）

## 设计稿基准宽度

- **390px**（Pencil 顶层 Frame `【交付专用】护肤报告`，节点 `OAs1s` 的 `width=390`）。

## 换算公式（全项目唯一口径）

\[
\text{rpx} = 750 \times \frac{\text{设计稿 px}}{390}
\]

小程序样式层屏幕宽度对应 **750rpx**（抖音 TTSS）。

## 工程落地

- **实现方式**：`apps/miniapp/src/pages/report/index.scss` 内定义 **`d(设计稿px)`**（基于 `390` 基准宽度）输出 **rpx**，并仅用于 `pages/report/index` 重建样式，不混用第二套换算比例。
- **Taro 全局**：`apps/miniapp/config/index.ts` 中 **`designWidth: 750`** 保持不变；**FE-HIFI-03（本期）护肤报告页**尺寸与间距以 **`d()`** 为准，对应上式。

## 验收机型（回执时补全宿主版本）

- **基准机型**：以 Owner 指定验收机为准；开发自测以 **iPhone 类安全区 + 抖音小程序原生导航栏** 为约束。
- **宿主差异**：顶栏由抖音原生导航替代设计稿 `Header - TopAppBar`，见 `docs/fe-hifi-03-evidence.md` 偏差清单 **A 类**。

## 设计稿顶栏删除范围（Pencil）

| 页面 | Frame 名称 | 查询方式 | 删除范围结论 | 说明 |
| --- | --- | --- | --- | --- |
| 护肤报告 | `【交付专用】护肤报告` (`OAs1s`) | `batch_get` + `snapshot_layout` + `get_screenshot` | 未检索到独立可渲染顶栏节点（如 Header/TopAppBar/返回/标题） | 页面有效画布从 Hero 区块起始，对齐策略为不在小程序内额外渲染任何自定义顶栏 |

实现：`apps/miniapp/src/pages/report/index.tsx` **不渲染自定义顶部栏**；宿主使用抖音原生导航栏，页面主内容按“去顶栏后有效画布”对齐，避免二次叠压。
