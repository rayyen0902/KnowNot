import { View, Text } from '@tarojs/components';
import './index.scss';

type Props = {
  leftText: string;
  rightText: string;
  align?: 'left' | 'right';
  onLeftClick?: () => void;
  onRightClick?: () => void;
};

export function MessageChoiceGroup({ leftText, rightText, align = 'left', onLeftClick, onRightClick }: Props) {
  return (
    <View className={`message-choice-group message-choice-group--${align}`}>
      <View className='message-choice-group__chip' onClick={onLeftClick}>
        <Text>{leftText}</Text>
      </View>
      <View className='message-choice-group__chip message-choice-group__chip--active' onClick={onRightClick}>
        <Text>{rightText}</Text>
      </View>
    </View>
  );
}
