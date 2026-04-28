import { View, Text } from '@tarojs/components';
import './index.scss';

export function MessageModuleHeader({ title }: { title: string }) {
  return (
    <View className='message-module__header'>
      <Text className='message-module__header-title'>{title}</Text>
    </View>
  );
}
