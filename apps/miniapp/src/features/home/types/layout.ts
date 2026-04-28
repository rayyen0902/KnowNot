/**
 * 首页 schema 区块排版：
 * - choice_card：two / three / four 映射选项栅格列数
 * - 其余区块：default / compact / wide 映射容器边距与信息密度（样式可按需扩展）
 */
export type HomeBlockLayout = 'default' | 'compact' | 'wide' | 'two' | 'three' | 'four';
