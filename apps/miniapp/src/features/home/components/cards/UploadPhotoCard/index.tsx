import { Text, View } from '@tarojs/components';
import BaseCard from '../BaseCard';
import type { UploadPhotoCardProps } from '@/features/home/types/card';
import './index.scss';

export default function UploadPhotoCard({
  title,
  buttonText = '点击拍照或上传图片',
  tips,
  onUploadClick,
  className,
  layout,
  disabled
}: UploadPhotoCardProps) {
  return (
    <BaseCard className={className} variant='question' layout={layout}>
      <Text className='upload-photo-card__title'>{title}</Text>
      <View className='upload-photo-card__cta' onClick={() => !disabled && onUploadClick()}>
        {buttonText}
      </View>
      {tips ? <Text className='upload-photo-card__tips'>{tips}</Text> : null}
    </BaseCard>
  );
}
