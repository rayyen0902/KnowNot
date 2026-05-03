/**
 * Pencil 画布宽度（标注基准，px）。
 * 小程序端常见逻辑宽 375：750rpx 恒等于视口宽度，与「按 375 还是 390 写配置」无关。
 * 正确换算是：设计稿上的 1px → round(750 / 390) rpx（与 Taro designWidth 750/375 二选一配合 px 时再乘系数，见 fpPx）。
 */
export const PENCIL_ARTBOARD_WIDTH = 390;

/** 390 画布上的长度 → rpx 数值（不含单位） */
export function pencilToRpxValue(n: number): number {
  return Math.round((n * 750) / PENCIL_ARTBOARD_WIDTH);
}

/** 390 画布上的长度 → 供 style 使用的 `NNrpx` 字符串 */
export function pencilToRpx(n: number): string {
  return `${pencilToRpxValue(n)}rpx`;
}

/**
 * 若项目 `designWidth` 为 375：应写「375 设计坐标系下的 px」，再走 pxtransform。
 * 与直接写 rpx 等价：fpPx(x) * (750/375) == pencilToRpxValue(x)
 */
export function pencilToDesignPx375(n: number): number {
  return Math.round((n * 375) / PENCIL_ARTBOARD_WIDTH);
}
