import { View, Text, Button } from '@tarojs/components';
import { goTo } from '@/utils/router';
import './index.scss';

/** 空白占位页：开发调试用，用户可从启动页进入主流程。 */
export default function BlankPage() {
  return (
    <View className='blank-page blank-page--filled'>
      <Text className='blank-page__title'>空白页</Text>
      <Text className='blank-page__desc'>此页用于开发占位。正式使用请从启动页进入首页。</Text>
      <Button className='blank-page__btn' onClick={() => goTo('/pages/home/index')}>
        去首页
      </Button>
    </View>
  );
}
