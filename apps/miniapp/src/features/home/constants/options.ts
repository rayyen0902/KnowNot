import type { OptionItem } from '@/features/home/types/card';

export const baseSkinOptions: OptionItem[] = [
  { label: '干型', value: 'dry' },
  { label: '混合型', value: 'combination' },
  { label: '油型', value: 'oily' },
  { label: '敏感型', value: 'sensitive' }
];

export const washOptions: OptionItem[] = [
  { label: '早晚都洗', value: 'morning_night' },
  { label: '早上', value: 'morning' },
  { label: '晚上', value: 'night' }
];

export const makeupOptions: OptionItem[] = [
  { label: '全妆', value: 'full' },
  { label: '不化妆', value: 'none' },
  { label: '偶尔化妆', value: 'sometimes' },
  { label: '淡妆 (防晒/隔离)', value: 'light' }
];

export const routineOptions: OptionItem[] = [
  { label: '洁面', value: 'cleanser' },
  { label: '防晒', value: 'sunscreen' },
  { label: '爽肤水/精华水', value: 'toner' },
  { label: '面霜/乳液', value: 'cream' }
];
