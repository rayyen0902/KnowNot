import { View } from '@tarojs/components';
import { MessageModuleHeader } from './MessageModuleHeader';
import { MessageTextBubble } from './MessageTextBubble';
import { MessageChoiceGroup } from './MessageChoiceGroup';
import { MessageSingleSelect } from './MessageSingleSelect';
import { MessageMultiSelect } from './MessageMultiSelect';
import { MessagePhotoUpload } from './MessagePhotoUpload';
import { MessageProductCard } from './MessageProductCard';
import { MessageBottomNav } from './MessageBottomNav';

export function MessageModulePage() {
  return (
    <View className='message-module'>
      <MessageModuleHeader title='消息模块组件库' />
      <MessageTextBubble title='1. AI 问卷卡片' content='为了更准确地为你做护肤建议，我会通过几个简单问题了解你的肤质、习惯和偏好。' align='left' />
      <MessageChoiceGroup
        leftText='温和'
        rightText='干净型'
        align='left'
      />
      <MessageTextBubble title='我的，开始吧。' content='' align='right' />
      <MessageSingleSelect
        title='2. 敏感性/过敏史'
        question='您有敏感皮肤或常见过敏吗？'
        options={['清爽', '干燥', '油性']}
        selectedIndex={2}
      />
      <MessageChoiceGroup leftText='单选' rightText='多选' align='left' />
      <MessageSingleSelect
        title='3. 基础护肤（洁面/卸妆）'
        question='您通常会从什么开始？'
        options={['早上', '晚上', '都做']}
        selectedIndex={2}
      />
      <MessageMultiSelect
        title='4. 需求判断（保湿/抗痘）'
        question='您目前最希望改善的是什么？'
        options={['控油', '保湿', '抗老', '痘痘/闭口']}
        selected={[1, 3]}
      />
      <MessagePhotoUpload
        title='5. 照片上传（选填）'
        description='为了更精准识别你的皮肤状态，可以拍一张素颜照片上传。'
      />
      <MessageProductCard
        title='6. 推荐护肤产品'
        subtitle='根据你的皮肤状态，推荐一款温和洁面。'
        name='舒缓净颜洁面'
        description='温和清洁，适合敏感和干性肌肤日常使用。'
      />
      <MessageBottomNav />
    </View>
  );
}
