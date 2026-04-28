import { View, Text, Button } from '@tarojs/components';
import type { ReactNode } from 'react';
import './index.scss';

type PageShellProps = {
  title: string;
  subtitle?: string;
  actionText?: string;
  actionOnClick?: () => void;
  headerExtra?: ReactNode;
  children: ReactNode;
};

export function PageShell({ title, subtitle, actionText, actionOnClick, headerExtra, children }: PageShellProps) {
  return (
    <View className='page-shell'>
      <View className='page-shell__header'>
        <View className='page-shell__heading'>
          <Text className='page-shell__title'>{title}</Text>
          {subtitle ? <Text className='page-shell__subtitle'>{subtitle}</Text> : null}
        </View>
        <View className='page-shell__actions'>
          {headerExtra ? <View className='page-shell__header-extra'>{headerExtra}</View> : null}
          {actionText ? (
            <Button className='page-shell__action' onClick={actionOnClick}>
              {actionText}
            </Button>
          ) : null}
        </View>
      </View>
      <View className='page-shell__content'>{children}</View>
    </View>
  );
}