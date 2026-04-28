import { View, Text } from '@tarojs/components';
import './index.scss';

type Props = {
  title: string;
  content: string;
  align?: 'left' | 'right';
};

export function MessageTextBubble({ title, content, align = 'left' }: Props) {
  return (
    <View className={`message-bubble message-bubble--${align}`}>
      <Text className='message-bubble__title'>{title}</Text>
      {content ? <Text className='message-bubble__content'>{content}</Text> : null}
    </View>
  );
}
