import { useEffect, useState } from 'react';
import Taro, { useDidShow } from '@tarojs/taro';
import { View, ScrollView, Text, Input } from '@tarojs/components';
import HomeFlow from '@/features/home/container/HomeFlow';
import { ChatThread, HomeFloatingTabs } from '@/features/home/components';
import { initAnonymousUser } from '@/services/api';
import { appendChatMessage, getChatMessages, subscribeChatMessages } from '@/services/reportFlowState';
import type { ChatMessage } from '@/services/reportFlowState';
import './index.scss';

export default function HomePage() {
  const [chatText, setChatText] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => getChatMessages());

  useDidShow(() => {
    void initAnonymousUser().then((payload) => {
      console.info('[v1-flow] user/init success', payload);
    });
    setChatMessages(getChatMessages());
  });

  useEffect(() => {
    return subscribeChatMessages(() => {
      setChatMessages(getChatMessages());
    });
  }, []);

  const handleSend = () => {
    const value = chatText.trim();
    if (!value) {
      Taro.showToast({ title: '请输入内容', icon: 'none' });
      return;
    }
    appendChatMessage({ role: 'user', text: value });
    appendChatMessage({
      role: 'ai',
      text: '我已记下你的描述啦。如需生成护肤报告，可从底部「专家模式」完成问卷与拍照。'
    });
    setChatText('');
  };

  const handleCameraClick = () => {
    void Taro.navigateTo({ url: '/pages/camera-capture/index' });
  };

  const handleMicClick = () => {
    Taro.showToast({ title: '语音输入暂未开放，请用文字描述', icon: 'none' });
  };

  return (
    <View className='home-page home-page--pencil'>
      <ScrollView scrollY className='home-main home-main--pencil'>
        <ChatThread messages={chatMessages} />
        <HomeFlow />
      </ScrollView>

      <View className='home-dock'>
        <HomeFloatingTabs />

        <View className='chat-input chat-input--pencil'>
          <View className='chat-input__icon-btn' onClick={handleCameraClick}>
            <View className='chat-input__cam-wire' />
          </View>
          <View className='chat-input__icon-btn' onClick={handleMicClick}>
            <View className='chat-input__mic-wire' />
          </View>
          <Input
            className='chat-input__field'
            placeholder='咨询你的私人护肤顾问...'
            placeholderClass='chat-input__ph'
            value={chatText}
            onInput={(e) => setChatText(e.detail.value)}
            confirmType='send'
            onConfirm={handleSend}
          />
          <View className='chat-input__send' onClick={handleSend}>
            <Text className='chat-input__send-glyph'>➤</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
