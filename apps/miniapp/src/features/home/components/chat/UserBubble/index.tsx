import { Text, View } from '@tarojs/components';
import type { BubbleProps } from '@/features/home/types/card';
import './index.scss';

const joinClassNames = (...classNames: Array<string | undefined | false>) =>
  classNames.filter(Boolean).join(' ');

export default function UserBubble({ text, className, layout }: BubbleProps) {
  return (
    <View className={joinClassNames('user-bubble', layout && `user-bubble--layout-${layout}`, className)}>
      <Text className='user-bubble__text'>{text}</Text>
    </View>
  );
}
