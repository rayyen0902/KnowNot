import { View, Text } from '@tarojs/components';
import './index.scss';

type Props = {
  title: string;
  subtitle: string;
  name: string;
  description: string;
};

export function MessageProductCard({ title, subtitle, name, description }: Props) {
  return (
    <View className='message-product'>
      <Text className='message-product__title'>{title}</Text>
      <Text className='message-product__subtitle'>{subtitle}</Text>
      <View className='message-product__card'>
        <View className='message-product__avatar' />
        <View className='message-product__body'>
          <Text className='message-product__name'>{name}</Text>
          <Text className='message-product__desc'>{description}</Text>
        </View>
        <View className='message-product__arrow'>›</View>
      </View>
    </View>
  );
}
