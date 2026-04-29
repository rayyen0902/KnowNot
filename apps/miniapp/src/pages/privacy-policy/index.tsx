import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import './index.scss';

export default function PrivacyPolicyPage() {
  return (
    <View className='legal-page'>
      <View className='legal-page__card'>
        <Text className='legal-page__title'>隐私政策</Text>
        <Text className='legal-page__desc'>
          当前为联调占位页。正式版本将展示完整隐私政策条款（数据收集范围、用途说明、用户权利与反馈入口）。
        </Text>
        <Text className='legal-page__btn' onClick={() => Taro.navigateBack()}>返回</Text>
      </View>
    </View>
  );
}
