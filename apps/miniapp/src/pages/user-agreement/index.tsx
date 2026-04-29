import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import './index.scss';

export default function UserAgreementPage() {
  return (
    <View className='legal-page'>
      <View className='legal-page__card'>
        <Text className='legal-page__title'>用户服务协议</Text>
        <Text className='legal-page__desc'>
          当前为联调占位页。正式版本将展示完整服务条款（账号使用规范、服务范围、责任限制与争议处理流程）。
        </Text>
        <Text className='legal-page__btn' onClick={() => Taro.navigateBack()}>返回</Text>
      </View>
    </View>
  );
}
