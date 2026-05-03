import type { HomeBlockSchema } from '@/features/home/types/schema';

/** 首页当前仅展示商品推荐卡（聊天与其它问卷卡片已下线）。 */
export const homeSchema: HomeBlockSchema[] = [
  {
    id: 'product',
    type: 'product_card',
    layout: 'wide',
    title: '根据您的混合性肌肤，我推荐这款产品：',
    tag: '保湿控油',
    name: '焕颜平衡精华液',
    desc: '适合混合性肌肤日常护理',
    imageText: 'SAFE\nFOR\nWIK'
  }
];
