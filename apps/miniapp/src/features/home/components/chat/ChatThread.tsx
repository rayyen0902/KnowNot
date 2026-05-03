import { View, Text } from '@tarojs/components';
import { goTo } from '@/utils/router';
import type { ChatMessage } from '@/services/reportFlowState';
import './ChatThread.scss';

type Props = {
  messages: ChatMessage[];
};

export default function ChatThread({ messages }: Props) {
  if (messages.length === 0) {
    return null;
  }

  return (
    <View className='chat-thread'>
      {messages.map((m) => {
        if (m.role === 'user') {
          return (
            <View key={m.id} className='chat-thread__row chat-thread__row--user'>
              <View className='chat-thread__bubble chat-thread__bubble--user'>
                <Text className='chat-thread__text'>{m.text || ''}</Text>
              </View>
            </View>
          );
        }
        if (m.role === 'report_card' && m.reportId) {
          const title = m.cardTitle || '护肤报告';
          return (
            <View key={m.id} className='chat-thread__row'>
              <View
                className='chat-thread__card'
                onClick={() => {
                  goTo(`/pages/report/index?report_id=${encodeURIComponent(m.reportId!)}`);
                }}
              >
                <Text className='chat-thread__card-title'>{title}</Text>
                <Text className='chat-thread__card-sub'>
                  {m.text || '查看报告（登录后可看完整内容）'}
                </Text>
                <Text className='chat-thread__card-cta'>查看 ›</Text>
              </View>
            </View>
          );
        }
        return (
          <View key={m.id} className='chat-thread__row'>
            <View className={`chat-thread__bubble chat-thread__bubble--${m.role === 'system' ? 'system' : 'ai'}`}>
              <Text className='chat-thread__text'>{m.text || ''}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}
