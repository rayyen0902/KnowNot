import { PropsWithChildren } from 'react';
import { View } from '@tarojs/components';
import type { HomeBlockLayout } from '@/features/home/types/layout';
import './index.scss';

type BaseCardVariant = 'default' | 'assistant' | 'question' | 'product';
type BaseCardPadding = 'sm' | 'md' | 'lg';

interface BaseCardProps {
  className?: string;
  variant?: BaseCardVariant;
  padding?: BaseCardPadding;
  layout?: HomeBlockLayout;
  onClick?: () => void;
}

const joinClassNames = (...classNames: Array<string | undefined | false>) =>
  classNames.filter(Boolean).join(' ');

export default function BaseCard({
  children,
  className,
  variant = 'default',
  padding = 'md',
  layout,
  onClick
}: PropsWithChildren<BaseCardProps>) {
  return (
    <View
      className={joinClassNames(
        'home-base-card',
        `home-base-card--${variant}`,
        `home-base-card--padding-${padding}`,
        layout && `home-base-card--layout-${layout}`,
        className
      )}
      onClick={onClick}
    >
      {children}
    </View>
  );
}
