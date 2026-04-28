import { Text } from '@tarojs/components';
import BaseCard from '../../cards/BaseCard';
import type { BubbleProps } from '@/features/home/types/card';
import './index.scss';

export default function AssistantBubble({ text, className, layout }: BubbleProps) {
  return (
    <BaseCard className={`assistant-bubble ${className ?? ''}`.trim()} variant='assistant' layout={layout}>
      <Text className='assistant-bubble__text'>{text}</Text>
    </BaseCard>
  );
}
