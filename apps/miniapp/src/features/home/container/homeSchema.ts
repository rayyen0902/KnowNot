import {
  baseSkinOptions,
  makeupOptions,
  routineOptions,
  washOptions
} from '@/features/home/constants/options';
import type { HomeBlockSchema } from '@/features/home/types/schema';

export const homeSchema: HomeBlockSchema[] = [
  {
    id: 'assistant-1',
    type: 'assistant_bubble',
    layout: 'default',
    text: '为了给您提供最准确的护肤建议，我需要更好地了解您的皮肤状况。您愿意回答几个简短的问题吗？'
  },
  {
    id: 'user-1',
    type: 'user_bubble',
    layout: 'default',
    text: '好的，开始吧。'
  },
  {
    id: 'assistant-2',
    type: 'assistant_bubble',
    layout: 'default',
    text: '非常感谢您的配合，您在下面卡片中根据自身情况，依次选择一下，谢谢！'
  },
  {
    id: 'choice-skin',
    type: 'choice_card',
    title: '您如何描述您的基础肤质？',
    layout: 'four',
    options: baseSkinOptions,
    stateKey: 'skinType'
  },
  {
    id: 'choice-wash',
    type: 'choice_card',
    title: '您通常什么时候洗脸？',
    layout: 'three',
    options: washOptions,
    stateKey: 'washTime'
  },
  {
    id: 'choice-makeup',
    type: 'choice_card',
    title: '您平时的化妆习惯是？',
    layout: 'two',
    options: makeupOptions,
    stateKey: 'makeupHabit'
  },
  {
    id: 'choice-routine',
    type: 'choice_card',
    title: '您目前的护肤步骤有哪些？',
    hint: '可多选',
    multiple: true,
    layout: 'two',
    options: routineOptions,
    stateKey: 'routineSteps',
    confirmText: '确认',
    action: 'toReport'
  },
  {
    id: 'allergy',
    type: 'allergy_card',
    layout: 'default',
    title: '您是否有任何已知护肤品成分过敏？',
    presetOptions: [{ label: '没有', value: 'none' }],
    stateKey: 'allergyInput',
    selectedStateKey: 'allergyPreset',
    submitText: '提交',
    placeholder: '请输入过敏成分 (如：酒精、香精等)'
  },
  {
    id: 'upload',
    type: 'upload_card',
    layout: 'wide',
    title: '为了更准确地分析您的皮肤状况，可以拍摄一张面部无妆照片吗？',
    buttonText: '点击拍照或上传图片'
  },
  {
    id: 'assistant-3',
    type: 'assistant_bubble',
    layout: 'compact',
    text: '您的“护肤报告”正在生成中，约需要30到60秒，您可以和我聊聊，您现在都在用的护肤品有哪些吗？'
  },
  {
    id: 'product',
    type: 'product_card',
    layout: 'wide',
    title: '根据您的混合性肌肤，我推荐这款产品：',
    tag: '保湿控油',
    name: '焕颜平衡精华液',
    desc: '适合混合性肌肤日常护理',
    imageText: 'SAFE\nFOR\nWIK'
  },
  {
    id: 'notice',
    type: 'notice_card',
    layout: 'compact',
    text: '已成功保存您的肌肤档案档案',
    noticeType: 'info'
  }
];
