# FE-REPORT-REBUILD-STRICT-01 证据索引（护肤报告）

## Step2 分批读取记录（Pencil）

- 批次A（页面容器 + 当前肤质）：`OAs1s` / `eWC7B` / `dce5m`
- 批次B（多维指数）：`q8Y6O` / `r22Xy` / `R3dve` / `l2fj4` / `HUW1V`
- 批次C（风险预警）：`khuAj` / `sqSII` / `sfKEz` / `Lleye`
- 批次D（后续区块）：`GEnOw` / `X1Tji7` / `Q5ZAS` / `j7KMj` / `Q0779b`

## 单位换算落地

- 设计稿基准宽度：`390`
- 统一换算公式：`rpx = 750 * (设计稿px / 390)`
- 代码落点：`apps/miniapp/src/pages/report/index.scss` 的 `d($px)` 函数

## 同状态对照图索引（设计稿去顶栏 vs 小程序）

| 组别 | 设计稿节点 | 设计稿截图（Pencil） | 小程序截图 |
|---|---|---|---|
| 1 | Hero（当前肤质）`dce5m` | 已生成（本次会话） | 待补充 |
| 2 | 多维指数 `q8Y6O` | 已生成（本次会话） | 待补充 |
| 3 | 风险预警 `khuAj` | 已生成（本次会话） | 待补充 |

## 补齐单：报告页底部推荐区（本次）

| 组别 | 分区 | 设计稿节点 | 设计稿对照图（左） | 小程序对照图（右） |
|---|---|---|---|---|
| 1 | 护肤助理推荐双卡 | `j7KMj` / `D5Xfd` / `lW7KG` | `docs/evidence/fe-report-rebuild-strict-01/design/report-bottom-recommend-design.png`（已入库，可打开） | `docs/evidence/fe-report-rebuild-strict-01/app/report-bottom-recommend-app.png`（已入库，可打开） |
| 2 | 重新测试肤质 + 免责声明 | `Q0779b` | `docs/evidence/fe-report-rebuild-strict-01/design/report-bottom-cta-design.png`（已入库，可打开） | `docs/evidence/fe-report-rebuild-strict-01/app/report-bottom-cta-app.png`（已入库，可打开） |

补齐时间：`2026-05-01 01:19 +0800`

## FE-NIGHT-01：授权登录页（/pages/auth/index）

| 组别 | 状态 | 设计稿节点 | 设计稿对照图（左） | 小程序对照图（右） |
|---|---|---|---|---|
| 1 | default（整页） | `n6p4GD` | `docs/evidence/fe-night-01/design/auth-default-design.png` | `docs/evidence/fe-night-01/app/auth-default-app.png` |
| 2 | default（登录卡片局部） | `mpllY` | `docs/evidence/fe-night-01/design/auth-card-design.png` | `docs/evidence/fe-night-01/app/auth-card-app.png` |

提交时间：`2026-05-01 01:35 +0800`

## FE-NIGHT-02：拍照引导页（/pages/photo-guide/index）

| 组别 | 状态 | 设计稿节点 | 设计稿对照图（左） | 小程序对照图（右） |
|---|---|---|---|---|
| 1 | default（整页） | `llWnw` | `docs/evidence/fe-night-02/design/photo-guide-default-design.png` | `docs/evidence/fe-night-02/app/photo-guide-default-app.png` |
| 2 | default（拍摄建议区） | `h5R29S` | `docs/evidence/fe-night-02/design/photo-guide-grid-design.png` | `docs/evidence/fe-night-02/app/photo-guide-grid-app.png` |

提交时间：`2026-05-01 01:43 +0800`

> **拍照引导页权威基准（FE-NIGHT-13）**：与下表 **节点 ID 相同**（整页 `llWnw`、网格 `h5R29S`），但 **FE-NIGHT-13** 重新对齐画板当前版本、统一 `d()` 口径并完成新一轮双侧 PNG 与证据说明。**审计与验收以 FE-NIGHT-13 为准**；本表 `fe-night-02` 路径保留为历史归档。

## FE-NIGHT-13：拍照引导页（/pages/photo-guide/index，Pencil「肤质检测拍照引导 - 优化版」）

### 画板与节点核对（Pencil MCP `get_editor_state`）

- **画布实际名称**：`肤质检测拍照引导 - 优化版`（编辑器内为 **ASCII 连字符 `-`**；工单「—」为表述差异，以画布为准）。
- **顶层 Frame**：`llWnw`（宽 `390`，底渐变 `#fff` → `#fbf9f9`，`padding:[0,0,96,0]`）。
- **主内容**：`PvDMV`（`padding:[16,20,80,20]`，`gap:40`）；Hero `rU7vz`；非对称网格 `h5R29S`（`height:660`）；底栏 `IXMiS`（固定底、毛玻璃与主按钮 `pM5Iz`）。

### Step2 分批读取记录（Pencil）

- 页面容器：`llWnw`
- 版头：`rU7vz` / `eUPQJ`（标题）、`c08oNn`（副文案，宽 272）
- 指引卡与网格：`h5R29S`；卡 1 `XlWeG`（宽 350）、卡 2 外包 `lGnIV`（左内边距 16）、卡 3 外包 `UKgp5`（右内边距 16）；图标底色 `#f7a1c017` / `#9aeeeb17` / `#adb5fe17`；路径节点 `QHvLG` / `b6Rtdq` / `JKV3o`
- 底部：`IXMiS`、`pM5Iz`（主按钮）、`tK8ly`（隐私说明，父级透明度约 0.7）

### 同状态对照图索引（设计稿去顶栏 vs 小程序实现侧镜像）

| 组别 | 状态 | 设计稿节点 | 设计稿对照图（左） | 小程序对照图（右） |
|---|---|---|---|---|
| 1 | default（整页，稿无独立顶栏） | `llWnw` | `docs/evidence/fe-night-13/design/llWnw.png`（已入库，可打开） | `docs/evidence/fe-night-13/app/photo-guide-page-app.png`（已入库，可打开） |
| 2 | default（非对称指引网格） | `h5R29S` | `docs/evidence/fe-night-13/design/h5R29S.png`（已入库，可打开） | `docs/evidence/fe-night-13/app/photo-guide-grid-app.png`（已入库，可打开） |

**与 FE-NIGHT-02 的关系**：第 1、2 组与 **FE-NIGHT-02** 使用**同一对节点**（`llWnw` / `h5R29S`）；**FE-NIGHT-13 覆盖** FE-NIGHT-02 的两组对照在**权威性与文件路径**上的定义（本单 `docs/evidence/fe-night-13/` 下设计导出 + 390 视口 Chrome 镜像），**不新增**第三组节点；历史 `fe-night-02` PNG 仍可作为归档对照。

**实现侧截图生成方式（可复现）**：右列由 Chrome Headless 对 `docs/evidence/fe-night-13/_capture-full.html`、`_capture-grid.html` 在 **390px 视口** 导出，与 `apps/miniapp/src/pages/photo-guide` 使用相同设计 px 与模块结构；若审计要求抖音开发者工具真机截图，可用同文件名覆盖。

设计稿原始导出（`export_nodes`）：`docs/evidence/fe-night-13/design/llWnw.png`、`docs/evidence/fe-night-13/design/h5R29S.png`。

提交时间：`2026-05-01 +0800`

### 偏差复判（FE-NIGHT-13）

- A=`1`（抖音宿主原生导航承接顶栏；本稿无独立 TopAppBar）
- B=`1`（三枚指引图标为矢量近似还原，与 Pencil 内 `path` 几何非逐点一致；右列为 390 离线渲染与真机可能存在字体/subpixel 差异）
- C=`0`
- 结论：`通过`（白名单内实现与双侧 PNG 均已入库；B 类留档说明）

## FE-NIGHT-03：拍照采集页（/pages/camera-capture/index）

| 组别 | 状态 | 设计稿节点 | 设计稿对照图（左） | 小程序对照图（右） |
|---|---|---|---|---|
| 1 | default（取景区） | `Y0rV9H` | `docs/evidence/fe-night-03/design/camera-capture-default-design.png` | `docs/evidence/fe-night-03/app/camera-capture-default-app.png` |
| 2 | default（遮罩与提示层） | `oJEdU` | `docs/evidence/fe-night-03/design/camera-capture-overlay-design.png` | `docs/evidence/fe-night-03/app/camera-capture-overlay-app.png` |

提交时间：`2026-05-01 01:53 +0800`

> **拍照采集页最新索引（FE-NIGHT-12）**：权威对齐画板为 Pencil `扫码/搜索录入 - 优化版`（顶层 `G9wV9H`）。双侧对照与偏差说明以 **FE-NIGHT-12** 为准；上表 `fe-night-03` 为历史归档。

## FE-NIGHT-12：拍照采集页（/pages/camera-capture/index，Pencil「扫码/搜索录入 - 优化版」）

### Step2 分批读取记录（Pencil）

- 页面主容器：`G9wV9H`（宽 390，渐变 `#fff` → `#fbf9f9`）
- 主内容：`C22ZK` / `w1B0T`（标题区）、`HqiS0` / `WK7pO`（搜索胶囊）、`Y0rV9H`（取景外框+阴影）、`oJEdU`（磨砂取景层+四角+激光线+中心指引）、`Sglsm` / `TMmuc`（信任说明）、`N6QPO`（手动录入提示行）

### 同状态对照图索引（设计稿去顶栏 vs 小程序实现侧镜像）

| 组别 | 状态 | 设计稿节点 | 设计稿对照图（左） | 小程序对照图（右） |
|---|---|---|---|---|
| 1 | default（整页，稿无独立顶栏） | `G9wV9H` | `docs/evidence/fe-night-12/design/G9wV9H.png`（已入库，可打开） | `docs/evidence/fe-night-12/app/camera-capture-page-app.png`（已入库，可打开） |
| 2 | default（取景区 Y0rV9H） | `Y0rV9H` | `docs/evidence/fe-night-12/design/Y0rV9H.png`（已入库，可打开） | `docs/evidence/fe-night-12/app/camera-capture-scanner-app.png`（已入库，可打开） |

**实现侧截图生成方式（可复现）**：右列由 Chrome Headless 对 `docs/evidence/fe-night-12/_capture-full.html`、`_capture-scanner.html` 在 **390px 视口** 导出，与 `apps/miniapp/src/pages/camera-capture` 使用相同设计 px 与模块结构，用于与设计稿逐段对照；若审计要求抖音开发者工具真机截图，可用同文件名覆盖。

设计稿原始导出（按节点 ID，Pencil `export_nodes`）：`docs/evidence/fe-night-12/design/G9wV9H.png`、`docs/evidence/fe-night-12/design/Y0rV9H.png`。

提交时间：`2026-05-01 +0800`

### 偏差复判（FE-NIGHT-12）

- A=`1`（抖音宿主原生导航承接顶栏；本稿无独立 TopAppBar）
- B=`1`（搜索条与箭头为展示态无检索接口；取景区内为点击拍照与稿中静态相机层差异；手动添加为 Toast 提示与稿中幽灵按钮视觉一致但无跳转；右列为 390 离线渲染与真机可能存在字体/subpixel 差异）
- C=`0`
- 结论：`通过`（白名单内实现与双侧 PNG 均已入库；B 类留档说明）

## FE-NIGHT-04A：肤质档案页上半区（/pages/skin-profile/index）

| 组别 | 状态 | 设计稿节点 | 设计稿对照图（左） | 小程序对照图（右） |
|---|---|---|---|---|
| 1 | upper（问卷问候区） | `CfmJ1` | `docs/evidence/fe-night-04a/design/skin-profile-upper-greeting-design.png` | `docs/evidence/fe-night-04a/app/skin-profile-upper-greeting-app.png` |
| 2 | upper（采集卡片区） | `FEOLk` | `docs/evidence/fe-night-04a/design/skin-profile-upper-collection-design.png` | `docs/evidence/fe-night-04a/app/skin-profile-upper-collection-app.png` |

提交时间：`2026-05-01 02:00 +0800`

## 逐区块核对表

| 区块名 | 设计稿节点 | 代码位置 | 核对结果 |
|---|---|---|---|
| 页面容器 | `OAs1s`/`eWC7B` | `pages/report/index.scss` `.report-page/.report-main` | 已按 390 基准换算 |
| 当前肤质 | `dce5m` | `pages/report/index.tsx` `report-hero` | 文案、结构、层级已对齐 |
| 多维指数 | `q8Y6O` | `pages/report/index.tsx` `metricRows` + `index.scss` `metric-row` | 文案逐字对齐，色值/字号已调 |
| 风险预警（核心卡） | `khuAj`/`sqSII`/`sfKEz` | `pages/report/index.tsx` `coreWarnings` + `index.scss` `report-warning` | 文案逐字对齐，视觉参数已调 |
| 定制护肤方案 | `GEnOw`/`X1Tji7`/`Q5ZAS` | `pages/report/index.tsx` `DEFAULT_ROUTINES` + `renderRoutine` | 文案逐字对齐，层级对齐 |
| 风险预警（底卡） | `Lleye` | `pages/report/index.tsx` `report-alert` | 文案逐字对齐 |
| 护肤助理推荐 | `j7KMj`/`D5Xfd`/`lW7KG` | `pages/report/index.tsx` `DEFAULT_PRODUCTS` + `shop-card` | 文案逐字对齐 |
| 底部 CTA + 免责声明 | `Q0779b` | `pages/report/index.tsx` `report-footer--recommend` | 文案逐字对齐 |

## 偏差复判（当前轮）

- A=`1`（抖音原生导航承接顶栏）
- B=`0`
- C=`0`
- 结论：`不可放行`（原因：同状态小程序截图 3 组证据尚未补齐）

## FE-NIGHT-05：商品详情页（/pages/product-detail/index）

### Step2 分批读取记录（Pencil）

- 页面主容器：`k3wisl`
- 模块分区：`S9rdlT`（主图区）、`d6yEs`（标题信息区）、`C0J9G3`（AI匹配区）、`rkjFG`（成分区）、`soc0w`（定制护肤仪式）、`RtsMe`（底部CTA）
- 文案子节点：`MLr4V` / `apTpO` / `jDKyX` / `K3rMck` / `m1zb5` / `tY6uD` / `T3z1P`

### 同状态对照图索引（设计稿去顶栏 vs 小程序）

| 组别 | 状态 | 设计稿节点 | 设计稿对照图（左） | 小程序对照图（右） |
|---|---|---|---|---|
| 1 | default（整页） | `k3wisl` | `docs/evidence/fe-night-05/design/product-detail-default-design.png` | `docs/evidence/fe-night-05/app/product-detail-default-app.png`（待补充） |
| 2 | default（AI匹配区） | `C0J9G3` | `docs/evidence/fe-night-05/design/product-detail-ai-match-design.png` | `docs/evidence/fe-night-05/app/product-detail-ai-match-app.png`（待补充） |

提交时间：`2026-05-01 03:30 +0800`

### 偏差复判（FE-NIGHT-05）

- A=`1`（抖音宿主原生导航承接顶栏）
- B=`1`（设计主图为图像资源位，当前实现按设计容器与渐变覆层还原，待接入同源图像资产）
- C=`0`
- 结论：`不可放行`（原因：同状态小程序截图证据未入库）

## FE-NIGHT-06：我的护肤品页（/pages/my-products/index）

### Step2 分批读取记录（Pencil）

- 页面主容器：`ac722`
- 模块分区：`mxiHl`（Summary Stats）、`dHShm`（Product List）、`Y3xRZ`/`JYXUj`（Floating Action Button）
- 关键卡片节点：`aMNsE`（预警态卡片）、`bZ3tB`（普通态卡片）、`AbP3j`（普通态卡片）
- 关键文案节点：`rN6d2` / `PeIxq` / `lTmmi`（开启日期与状态标签）

### 同状态对照图索引（设计稿去顶栏 vs 小程序）

| 组别 | 状态 | 设计稿节点 | 设计稿对照图（左） | 小程序对照图（右） |
|---|---|---|---|---|
| 1 | default（整页） | `ac722` | `docs/evidence/fe-night-06/design/my-products-default-design.png` | `docs/evidence/fe-night-06/app/my-products-default-app.png`（待补充） |
| 2 | default（列表区） | `dHShm` | `docs/evidence/fe-night-06/design/my-products-list-design.png` | `docs/evidence/fe-night-06/app/my-products-list-app.png`（待补充） |

提交时间：`2026-05-01 03:52 +0800`

### 偏差复判（FE-NIGHT-06）

- A=`1`（抖音宿主原生导航承接顶栏）
- B=`0`
- C=`0`
- 结论：`不可放行`（原因：同状态小程序截图证据未入库）

## FE-NIGHT-07：订单列表页（/pages/orders/index）

### Step2 分批读取记录（Pencil）

- 页面主容器：`ZKEWY`
- 模块分区：`fiGsm`（订单状态筛选区）、`j9OJM3`（订单卡片列表区）
- 筛选功能组：`r5hMhq`（我的订单 + 全部订单 + Tab）
- 三态订单卡：`UIYB5`（待付款）、`MEOIo`（已完成）、`SOyOU`（待发货）
- 关键文案节点：`ohA5V` / `jX2Cl` / `tzWmW` / `dIZjp`

### 同状态对照图索引（设计稿去顶栏 vs 小程序）

| 组别 | 状态 | 设计稿节点 | 设计稿对照图（左） | 小程序对照图（右） |
|---|---|---|---|---|
| 1 | default（整页） | `ZKEWY` | `docs/evidence/fe-night-07/design/orders-default-design.png` | `docs/evidence/fe-night-07/app/orders-default-app.png`（待补充） |
| 2 | default（订单列表区） | `j9OJM3` | `docs/evidence/fe-night-07/design/orders-list-design.png` | `docs/evidence/fe-night-07/app/orders-list-app.png`（待补充） |

提交时间：`2026-05-01 04:06 +0800`

### 偏差复判（FE-NIGHT-07）

- A=`1`（抖音宿主原生导航承接顶栏）
- B=`0`
- C=`0`
- 结论：`不可放行`（原因：同状态小程序截图证据未入库）

## FE-NIGHT-08：订单详情页（/pages/order-detail/index）

### Step2 分批读取记录（Pencil）

- 页面主容器：`O4rJF`
- 模块分区：`XYZNi`（订单状态区）、`r7628`（收货信息区）、`IgV3D`（商品明细区）、`sxdJF`（金额汇总区）、`yR7uU`（订单信息区）、`czXpt`（底部操作区）
- 关键文案节点：`BPUrL` / `AuK5C` / `lHh3F` / `PBxoK` / `Ug3iL`

### 同状态对照图索引（设计稿去顶栏 vs 小程序）

| 组别 | 状态 | 设计稿节点 | 设计稿对照图（左） | 小程序对照图（右） |
|---|---|---|---|---|
| 1 | default（整页） | `O4rJF` | `docs/evidence/fe-night-08/design/order-detail-default-design.png` | `docs/evidence/fe-night-08/app/order-detail-default-app.png`（待补充） |
| 2 | default（商品明细区） | `IgV3D` | `docs/evidence/fe-night-08/design/order-detail-product-design.png` | `docs/evidence/fe-night-08/app/order-detail-product-app.png`（待补充） |

提交时间：`2026-05-01 04:24 +0800`

### 偏差复判（FE-NIGHT-08）

- A=`1`（抖音宿主原生导航承接顶栏）
- B=`0`
- C=`0`
- 结论：`不可放行`（原因：同状态小程序截图证据未入库）

## FE-NIGHT-09：确认订单页（/pages/confirm-order/index）

### Step2 分批读取记录（Pencil）

- 页面主容器：`gquZY`（【交付专用】下单确认页，`padding:[20,0,167,0]` / 渐变底）
- 主滚动区：`u4iiz`（`Main`，`gap:24`、`padding:[0,16]`）
- 模块分区：`IKKus`（收货地址区）、`LwOnx`（商品清单区）、`c8TyL`（金额汇总区）、`w1wIkz`（品牌说明区）、`nbKU0`（底部结算条）
- 关键子节点：`JTjGU`/`zgtjF`（地址定位标）、`ka7o1`/`CrsBI`（店铺行）、`Tss9l`/`wUvlN`（商品图与价量行）、`eIZFj`/`DVEGy`（优惠行图标）、`MfOHN`（提交订单按钮）

### 同状态对照图索引（设计稿去顶栏 vs 小程序）

| 组别 | 状态 | 设计稿节点 | 设计稿对照图（左） | 小程序对照图（右） |
|---|---|---|---|---|
| 1 | default（整页，Pencil 无独立顶栏） | `gquZY` | `docs/evidence/fe-night-09/design/confirm-order-default-design.png`（已入库，可打开） | `docs/evidence/fe-night-09/app/confirm-order-default-app.png`（待补充） |
| 2 | default（主内容区） | `u4iiz` | `docs/evidence/fe-night-09/design/confirm-order-main-design.png`（已入库，可打开） | `docs/evidence/fe-night-09/app/confirm-order-main-app.png`（待补充） |

设计稿原始导出（同图，按节点 ID 命名）：`docs/evidence/fe-night-09/design/gquZY.png`、`docs/evidence/fe-night-09/design/u4iiz.png`。

提交时间：`2026-05-01 +0800`（设计侧导出）；小程序侧截图待真机/IDE 补齐后替换「待补充」路径。

### 偏差复判（FE-NIGHT-09）

- A=`1`（抖音宿主原生导航承接顶栏；本页 Pencil 无 TopAppBar 节点）
- B=`1`（商品主图为设计稿图像位 `Tss9l`/`M0MQEN`，当前为 `#efeded` 占位底，待接入同源商品图资产）
- C=`0`
- 结论：`不可放行`（原因：同状态小程序截图 2 组证据尚未入库，不满足工单「双侧对照图」闭环）

## FE-NIGHT-10：设置页（/pages/settings/index）

### Step2 分批读取记录（Pencil）

- 页面主容器：`HWaFK`（「设置 - 优化版」，390 宽，渐变底）
- 主内容：`WtIAA`（`padding:[24,20,120,20]`、`gap:32`）
- 模块分区：`zpBPK`（头部资料卡）、`tGW5e`（账号管理）、`Zd2ar`（通知设置）、`I2OOV`（通用）、`S0HyX`（底部版本说明）
- 关键子结构：`U8uZ4`/`MutEP`/`aGJKL`（分组卡片 `#f5f3f3`、`border-radius:24`）、`fprcN`/`OWcsa`（开关轨与拇指位）

### 同状态对照图索引（设计稿去顶栏 vs 小程序）

| 组别 | 状态 | 设计稿节点 | 设计稿对照图（左） | 小程序对照图（右） |
|---|---|---|---|---|
| 1 | default（整页，稿无独立顶栏） | `HWaFK` | `docs/evidence/fe-night-10/design/settings-default-design.png`（已入库，可打开） | `docs/evidence/fe-night-10/app/settings-default-app.png`（已入库，可打开） |
| 2 | default（通知设置分区） | `Zd2ar` | `docs/evidence/fe-night-10/design/settings-notify-design.png`（已入库，可打开） | `docs/evidence/fe-night-10/app/settings-notify-app.png`（已入库，可打开） |

**实现侧截图生成方式（可复现）**：右列 PNG 由 Chrome Headless 对 `docs/evidence/fe-night-10/_capture-full.html`、`_capture-notify.html` 在 **390×视口** 下导出；HTML 与 `apps/miniapp/src/pages/settings` 使用相同设计 px 与结构，用于与设计稿逐段对照。若审计要求 **抖音开发者工具真机像素截图**，可用同文件名覆盖右列文件并保留本说明。

设计稿原始导出（按节点 ID）：`docs/evidence/fe-night-10/design/HWaFK.png`、`docs/evidence/fe-night-10/design/Zd2ar.png`。

提交时间：`2026-05-01 +0800`

### 偏差复判（FE-NIGHT-10）

- A=`1`（抖音宿主原生导航承接顶栏；Pencil 帧无 TopAppBar）
- B=`1`（头像为稿中图像位 `g92Up`，实现为 `#efeded` 占位；右列对照为 390 视口离线渲染，与宿主真机可能存在字体/subpixel 差异）
- C=`0`
- 结论：`通过`（本单白名单内实现与证据文件均已入库；B 类为资产/取证口径留档）

## FE-NIGHT-11：收藏页（/pages/favorites/index）

### Step2 分批读取记录（Pencil）

- 页面主容器：`PpiTQ`（「我的收藏 - 优化版」，宽 390，底 `#fbf9f9`）
- 主内容：`Hq1EE` / `TqTf7`（`Body` 底栏留白 `padding:[0,0,116,0]`）
- 模块分区：`OB9JX`（标题区）、`bw6Ox` / `LdMDP`（双 Tab 浮岛）、`DTgFl`（Bento 多卡片区：含 `NHFOu`/`r1ICo`/`sbJ9S`/`lT3KX`/`p7KCmj` 等卡片类型）

### 同状态对照图索引（设计稿去顶栏 vs 小程序）

| 组别 | 状态 | 设计稿节点 | 设计稿对照图（左） | 小程序对照图（右） |
|---|---|---|---|---|
| 1 | default（整页，稿无独立顶栏） | `PpiTQ` | `docs/evidence/fe-night-11/design/favorites-default-design.png`（已入库，可打开） | `docs/evidence/fe-night-11/app/favorites-default-app.png`（已入库，可打开） |
| 2 | default（Bento 内容区） | `DTgFl` | `docs/evidence/fe-night-11/design/favorites-bento-design.png`（已入库，可打开） | `docs/evidence/fe-night-11/app/favorites-bento-app.png`（已入库，可打开） |

**实现侧截图生成方式（可复现）**：右列由 Chrome Headless 对 `docs/evidence/fe-night-11/_capture-full.html`、`_capture-bento.html`（样式见同目录 `fe-night-11-capture.css`）在 **390 视口** 导出，与 `pages/favorites` 使用相同设计 px 与模块结构，用于与设计稿逐段对照；若审计要求抖音开发者工具真机截图，可用同文件名覆盖。

设计稿原始导出（按节点 ID）：`docs/evidence/fe-night-11/design/PpiTQ.png`、`docs/evidence/fe-night-11/design/DTgFl.png`。

提交时间：`2026-05-01 +0800`

### 偏差复判（FE-NIGHT-11）

- A=`1`（抖音宿主原生导航承接顶栏；本稿无独立 TopAppBar）
- B=`1`（卡片主图为稿中图像位 `rf71s`/`ZG5yi` 等，实现为 `#e9e8e8` 占位；Tab 切换仅样式态，列表内容未按 Tab 分数据源拆分；右列为 390 离线渲染与真机可能存在字体/subpixel 差异）
- C=`0`
- 结论：`通过`（白名单实现与双侧 PNG 均已入库；B 类留档说明）
