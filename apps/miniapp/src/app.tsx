import { PropsWithChildren } from 'react';
import { View } from '@tarojs/components';
import './app.scss';

export default function App({ children }: PropsWithChildren) {
  return <View className='app-root'>{children}</View>;
}