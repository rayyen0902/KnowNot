import { View, Text, Button } from '@tarojs/components';
import { useState } from 'react';
import './index.scss';

export default function TaroDemoPage() {
  const [count, setCount] = useState(0);

  return (
    <View className='demo-page'>
      <View className='demo-card'>
        <Text className='demo-kicker'>Taro 4.2 demo</Text>
        <Text className='demo-title'>最小可运行页面</Text>
        <Text className='demo-desc'>如果这个页面能正常打开，说明基础链路已经跑通。</Text>

        <View className='demo-counter'>
          <Text className='demo-counter__label'>点击次数</Text>
          <Text className='demo-counter__value'>{count}</Text>
        </View>

        <View className='demo-actions'>
          <Button className='demo-button demo-button--primary' onClick={() => setCount((value) => value + 1)}>
            +1
          </Button>
          <Button className='demo-button' onClick={() => setCount(0)}>
            重置
          </Button>
        </View>
      </View>
    </View>
  );
}
