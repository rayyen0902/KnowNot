import { Button, Text, View } from '@tarojs/components';
import BaseCard from '../BaseCard';
import type { ChoiceCardProps } from '@/features/home/types/card';
import type { HomeBlockLayout } from '@/features/home/types/layout';
import './index.scss';

const joinClassNames = (...classNames: Array<string | undefined | false>) =>
  classNames.filter(Boolean).join(' ');

const toChoiceGridLayout = (layout: HomeBlockLayout | undefined): 'two' | 'three' | 'four' => {
  if (layout === 'two' || layout === 'three' || layout === 'four') return layout;
  return 'two';
};

const toArrayValue = (value: ChoiceCardProps['value']) =>
  Array.isArray(value) ? value : value ? [value] : [];

export default function ChoiceCard({
  title,
  hint,
  multiple = false,
  layout,
  options,
  value,
  onChange,
  confirmText,
  onConfirm,
  className,
  disabled,
  loading
}: ChoiceCardProps) {
  const gridLayout = toChoiceGridLayout(layout);
  const selectedValues = toArrayValue(value);

  const handleToggle = (optionValue: string, optionDisabled?: boolean) => {
    if (disabled || loading || optionDisabled) return;

    if (multiple) {
      const exists = selectedValues.includes(optionValue);
      const next = exists ? selectedValues.filter((item) => item !== optionValue) : [...selectedValues, optionValue];
      onChange(next);
      return;
    }

    onChange(optionValue);
  };

  return (
    <BaseCard className={className} variant='question' layout={layout}>
      <Text className='choice-card__title'>{title}</Text>
      {hint ? <Text className='choice-card__hint'>{hint}</Text> : null}

      <View className={joinClassNames('choice-card__options', `choice-card__options--${gridLayout}`)}>
        {options.map((option) => {
          const active = selectedValues.includes(option.value);
          return (
            <View
              key={option.value}
              className={joinClassNames(
                'choice-card__chip',
                `choice-card__chip--${gridLayout}`,
                active && 'choice-card__chip--active',
                option.disabled && 'choice-card__chip--disabled'
              )}
              onClick={() => handleToggle(option.value, option.disabled)}
            >
              {option.label}
            </View>
          );
        })}
      </View>

      {confirmText && onConfirm ? (
        <Button className='choice-card__confirm' onClick={onConfirm} disabled={disabled || loading} loading={loading}>
          {confirmText}
        </Button>
      ) : null}
    </BaseCard>
  );
}
