import { View, Text } from '@tarojs/components';
import './index.scss';

type Props = {
  title: string;
  question: string;
  options: string[];
  selected?: number[];
};

export function MessageMultiSelect({ title, question, options, selected = [] }: Props) {
  return (
    <View className='message-card'>
      <Text className='message-card__title'>{title}</Text>
      <Text className='message-card__question'>{question}</Text>
      <View className='message-card__options'>
        {options.map((option, index) => (
          <View
            key={option}
            className={`message-card__option ${selected.includes(index) ? 'message-card__option--active' : ''}`}
          >
            <View className='message-card__check' />
            <Text className='message-card__option-text'>{option}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
