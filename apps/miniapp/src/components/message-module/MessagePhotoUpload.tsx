import { View, Text } from '@tarojs/components';
import './index.scss';

type Props = {
  title: string;
  description: string;
  onClick?: () => void;
};

export function MessagePhotoUpload({ title, description, onClick }: Props) {
  return (
    <View className='message-upload' onClick={onClick}>
      <Text className='message-upload__title'>{title}</Text>
      <Text className='message-upload__desc'>{description}</Text>
      <View className='message-upload__action'>点击拍照分析</View>
    </View>
  );
}
