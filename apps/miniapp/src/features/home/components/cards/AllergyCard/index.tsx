import { Button, Input, Text, View } from '@tarojs/components';
import BaseCard from '../BaseCard';
import type { AllergyCardProps } from '@/features/home/types/card';
import './index.scss';

const joinClassNames = (...classNames: Array<string | undefined | false>) =>
  classNames.filter(Boolean).join(' ');

export default function AllergyCard({
  title,
  presetOptions = [],
  selectedValues = [],
  onPresetToggle,
  inputValue,
  onInputChange,
  onSubmit,
  submitText = '提交',
  placeholder = '请输入过敏成分 (如：酒精、香精等)',
  className,
  layout,
  disabled,
  loading
}: AllergyCardProps) {
  return (
    <BaseCard className={className} variant='question' layout={layout}>
      <Text className='allergy-card__title'>{title}</Text>

      {presetOptions.length > 0 ? (
        <View className='allergy-card__options'>
          {presetOptions.map((option) => {
            const active = selectedValues.includes(option.value);
            return (
              <View
                key={option.value}
                className={joinClassNames('allergy-card__chip', active && 'allergy-card__chip--active')}
                onClick={() => onPresetToggle?.(option.value)}
              >
                {option.label}
              </View>
            );
          })}
        </View>
      ) : null}

      <View className='allergy-card__input-row'>
        <Input
          className='allergy-card__input'
          value={inputValue}
          placeholder={placeholder}
          onInput={(event) => onInputChange(event.detail.value)}
        />
      </View>

      <Button className='allergy-card__submit' onClick={onSubmit} disabled={disabled || loading} loading={loading}>
        {submitText}
      </Button>
    </BaseCard>
  );
}
