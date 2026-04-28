import type { HomeBlockLayout } from '@/features/home/types/layout';

export interface CardBaseProps {
  id?: string;
  className?: string;
  /** 与 homeSchema.layout 对齐，用于容器密度与栅格修饰 */
  layout?: HomeBlockLayout;
}

export interface BubbleProps extends CardBaseProps {
  text: string;
  time?: string;
  status?: 'sending' | 'sent' | 'failed';
}

export interface StatusNoticeCardProps extends CardBaseProps {
  text: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  icon?: boolean;
}

export interface OptionItem {
  label: string;
  value: string;
  disabled?: boolean;
}

export type ChoiceValue = string | string[];

export interface ChoiceCardProps extends CardBaseProps {
  title: string;
  hint?: string;
  multiple?: boolean;
  layout?: HomeBlockLayout;
  options: OptionItem[];
  value: ChoiceValue;
  onChange: (value: ChoiceValue) => void;
  confirmText?: string;
  onConfirm?: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export interface AllergyCardProps extends CardBaseProps {
  title: string;
  presetOptions?: OptionItem[];
  selectedValues?: string[];
  onPresetToggle?: (value: string) => void;
  inputValue: string;
  onInputChange: (value: string) => void;
  onSubmit: () => void;
  submitText?: string;
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
}

export interface UploadPhotoCardProps extends CardBaseProps {
  title: string;
  buttonText?: string;
  tips?: string;
  onUploadClick: () => void;
  disabled?: boolean;
}

export interface ProductRecommendCardProps extends CardBaseProps {
  title: string;
  tag?: string;
  name: string;
  desc?: string;
  imageUrl?: string;
  imageText?: string;
  onClick?: () => void;
  actionText?: string;
  onAction?: () => void;
}
