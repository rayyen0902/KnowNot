import { Text, View } from '@tarojs/components';
import type { StatusNoticeCardProps } from '@/features/home/types/card';
import './index.scss';

const joinClassNames = (...classNames: Array<string | undefined | false>) =>
  classNames.filter(Boolean).join(' ');

export default function StatusNoticeCard({ text, type = 'info', className, layout }: StatusNoticeCardProps) {
  return (
    <View
      className={joinClassNames(
        'status-notice-card',
        `status-notice-card--${type}`,
        layout && `status-notice-card--layout-${layout}`,
        className
      )}
    >
      <Text>{text}</Text>
    </View>
  );
}
