import type { OptionItem } from '@/features/home/types/card';
import type { HomeBlockLayout } from '@/features/home/types/layout';

export type HomeBlockSchema =
  | {
      id: string;
      type: 'assistant_bubble';
      text: string;
      layout: HomeBlockLayout;
      className?: string;
    }
  | {
      id: string;
      type: 'user_bubble';
      text: string;
      layout: HomeBlockLayout;
      className?: string;
    }
  | {
      id: string;
      type: 'choice_card';
      title: string;
      hint?: string;
      multiple?: boolean;
      layout: HomeBlockLayout;
      options: OptionItem[];
      stateKey: 'skinType' | 'washTime' | 'makeupHabit' | 'routineSteps';
      confirmText?: string;
      action?: 'toReport';
    }
  | {
      id: string;
      type: 'allergy_card';
      title: string;
      layout: HomeBlockLayout;
      placeholder?: string;
      presetOptions?: OptionItem[];
      stateKey: 'allergyInput';
      selectedStateKey: 'allergyPreset';
      submitText?: string;
    }
  | {
      id: string;
      type: 'upload_card';
      title: string;
      layout: HomeBlockLayout;
      buttonText?: string;
      tips?: string;
    }
  | {
      id: string;
      type: 'product_card';
      title: string;
      layout: HomeBlockLayout;
      tag?: string;
      name: string;
      desc?: string;
      imageText?: string;
    }
  | {
      id: string;
      type: 'notice_card';
      text: string;
      layout: HomeBlockLayout;
      noticeType?: 'info' | 'success' | 'warning' | 'error';
    };
