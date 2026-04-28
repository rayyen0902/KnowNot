import { View, Text } from '@tarojs/components';
import './index.scss';

type Props = {
  title: string;
  question: string;
  options: string[];
  selectedIndex?: number;
  onOptionClick?: (index: number) => void;
};

export function MessageSingleSelect({ title, question, options, selectedIndex = 0, onOptionClick }: Props) {
  return (
    <View className='message-card'>
      <Text className='message-card__title'>{title}</Text>
      <Text className='message-card__question'>{question}</Text>
      <View className='message-card__options'>
        {options.map((option, index) => (
          <View
            key={option}
            className={`message-card__option ${index === selectedIndex ? 'message-card__option--active' : ''}`}
            onClick={() => onOptionClick?.(index)}
          >
            <View className='message-card__radio' />
            <Text className='message-card__option-text'>{option}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
