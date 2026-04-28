import { View, Text } from '@tarojs/components';
import { useEffect } from 'react';
import { goTo } from '@/utils/router';
import './index.scss';

export default function SplashPage() {
  useEffect(() => {
    const timer = setTimeout(() => {
      goTo('/pages/home/index');
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View className='splash-page' onClick={() => goTo('/pages/home/index')}>
      <View className='splash-main'>
        <View className='splash-logo-wrap'>
          <View className='splash-logo-wrap__glow' />
          <View className='splash-logo' />
          <Text className='splash-brand'>知不Ai</Text>
        </View>
      </View>

      <View className='splash-footer'>
        <Text className='splash-footer__text'>临床级智能护肤管家</Text>
      </View>
    </View>
  );
}
