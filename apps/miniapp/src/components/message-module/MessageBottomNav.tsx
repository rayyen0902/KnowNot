import { View, Text } from '@tarojs/components';
import './index.scss';

export function MessageBottomNav() {
  return (
    <View className='message-bottom-nav'>
      <View className='message-bottom-nav__item message-bottom-nav__item--active'>
        <Text className='message-bottom-nav__icon'>◉</Text>
        <Text>消息</Text>
      </View>
      <View className='message-bottom-nav__item'>
        <Text className='message-bottom-nav__icon'>◇</Text>
        <Text>发现</Text>
      </View>
      <View className='message-bottom-nav__item'>
        <Text className='message-bottom-nav__icon'>◌</Text>
        <Text>日历</Text>
      </View>
      <View className='message-bottom-nav__item'>
        <Text className='message-bottom-nav__icon'>◐</Text>
        <Text>我的</Text>
      </View>
    </View>
  );
}
