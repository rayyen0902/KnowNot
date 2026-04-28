import { Button, Text, View } from '@tarojs/components';
import BaseCard from '../BaseCard';
import type { ProductRecommendCardProps } from '@/features/home/types/card';
import './index.scss';

export default function ProductRecommendCard({
  title,
  tag,
  name,
  desc,
  imageUrl,
  imageText,
  onClick,
  actionText,
  onAction,
  className,
  layout
}: ProductRecommendCardProps) {
  return (
    <BaseCard className={className} variant='product' layout={layout} onClick={onClick}>
      <Text className='product-recommend-card__title'>{title}</Text>

      <View className='product-recommend-card__inner'>
        <View className='product-recommend-card__thumb'>
          {imageUrl ? <Text>{imageUrl}</Text> : <Text className='product-recommend-card__thumb-text'>{imageText ?? 'PRODUCT'}</Text>}
        </View>

        <View className='product-recommend-card__body'>
          {tag ? <View className='product-recommend-card__tag'>{tag}</View> : null}
          <Text className='product-recommend-card__name'>{name}</Text>
          {desc ? <Text className='product-recommend-card__desc'>{desc}</Text> : null}
          {actionText && onAction ? (
            <Button className='product-recommend-card__action' onClick={onAction}>
              {actionText}
            </Button>
          ) : null}
        </View>
      </View>
    </BaseCard>
  );
}
