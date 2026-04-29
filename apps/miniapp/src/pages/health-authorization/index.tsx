import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import './index.scss';

export default function HealthAuthorizationPage() {
  return (
    <View className='legal-page'>
      <View className='legal-page__card'>
        <Text className='legal-page__title'>健康信息授权</Text>
        <Text className='legal-page__desc'>
          当前为联调占位页。正式版本将展示健康信息授权范围、用途、保存期限与撤回方式说明。
        </Text>
        <Text className='legal-page__btn' onClick={() => Taro.navigateBack()}>返回</Text>
      </View>
    </View>
  );
}
