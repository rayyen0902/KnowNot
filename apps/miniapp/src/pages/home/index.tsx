import { useRef, useState } from 'react';
import Taro, { useDidShow } from '@tarojs/taro';
import { View, ScrollView, Text, Input } from '@tarojs/components';
import HomeFlow, { type ChatMessage, type HomeFormState } from '@/features/home/container/HomeFlow';
import { HomeFloatingTabs } from '@/features/home/components';
import {
  createReportTask,
  getReportTaskStatus,
  initAnonymousUser,
  sessionStart
} from '@/services/api';
import { goTo } from '@/utils/router';
import { getAnonymousId } from '@/utils/session';
import './index.scss';

const POLL_INTERVAL_MS = 2000;
const POLL_TIMEOUT_MS = 60000;

export default function HomePage() {
  const [chatText, setChatText] = useState('');
  const [liveMessages, setLiveMessages] = useState<ChatMessage[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const messageSeedRef = useRef(0);
  const sessionIdRef = useRef('');

  const createMessageId = (role: 'user' | 'assistant') => {
    messageSeedRef.current += 1;
    return `${role}-${Date.now()}-${messageSeedRef.current}`;
  };

  const appendAssistantReply = (userText: string) => {
    const reply = `收到你的问题：${userText}。我会结合你的肤质继续给建议。`;
    setTimeout(() => {
      setLiveMessages((prev) => [
        ...prev,
        {
          id: createMessageId('assistant'),
          role: 'assistant',
          text: reply
        }
      ]);
    }, 500);
  };

  const handleSend = () => {
    const value = chatText.trim();

    if (!value) {
      Taro.showToast({
        title: '请输入内容',
        icon: 'none'
      });
      return;
    }

    setLiveMessages((prev) => [
      ...prev,
      {
        id: createMessageId('user'),
        role: 'user',
        text: value
      }
    ]);
    setChatText('');
    appendAssistantReply(value);

    setTimeout(() => {
      Taro.pageScrollTo({
        selector: '#home-flow-bottom',
        duration: 300
      });
    }, 30);
  };

  const handleCameraClick = () => {
    void Taro.navigateTo({ url: '/pages/camera-capture/index' });
  };

  const handleMicClick = () => {
    Taro.showToast({
      title: '语音输入暂未开放，请用文字描述',
      icon: 'none'
    });
  };

  useDidShow(() => {
    void initAnonymousUser().then((payload) => {
      console.info('[v1-flow] user/init success', payload);
    });
  });

  const ensureSessionId = async () => {
    if (sessionIdRef.current) {
      return sessionIdRef.current;
    }
    const anonymousId = getAnonymousId();
    if (!anonymousId) {
      throw new Error('匿名身份初始化失败');
    }
    const result = await sessionStart({ anonymous_id: anonymousId });
    sessionIdRef.current = result.session_id;
    return result.session_id;
  };

  const pollReportTask = async (taskId: string) => {
    const startAt = Date.now();
    while (Date.now() - startAt <= POLL_TIMEOUT_MS) {
      await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
      const status = await getReportTaskStatus(taskId);
      console.info('[v1-flow] report/task/status', status);

      if (status.state === 'done' && status.report_id) {
        return status.report_id;
      }

      if (status.state === 'failed') {
        throw new Error(status.error_message || '报告生成失败');
      }
    }
    throw new Error('报告生成超时，请稍后重试');
  };

  const handleCreateReport = async (form: HomeFormState) => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      Taro.showLoading({ title: '报告生成中...' });
      await initAnonymousUser();
      const sessionId = await ensureSessionId();
      const task = await createReportTask({
        session_id: sessionId,
        profile: {
          skin_type: form.skinType,
          wash_time: form.washTime,
          makeup_habit: form.makeupHabit,
          routine_steps: form.routineSteps,
          allergy_input: form.allergyInput,
          allergy_preset: form.allergyPreset
        }
      });
      console.info('[v1-flow] report/task/create success', task);
      const reportId = await pollReportTask(task.task_id);
      Taro.hideLoading();
      console.info('[v1-flow] report/task/done', { reportId });
      goTo(`/pages/report/index?report_id=${encodeURIComponent(reportId)}`);
    } catch (error) {
      Taro.hideLoading();
      Taro.showToast({
        title: error instanceof Error ? error.message : '生成失败，请稍后再试',
        icon: 'none'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className='home-page'>
      <ScrollView scrollY className='home-main'>
        <HomeFlow liveMessages={liveMessages} onSubmitReport={handleCreateReport} />
      </ScrollView>

      <HomeFloatingTabs />

      <View className='chat-input'>
        <View className='chat-input__camera' onClick={handleCameraClick} />
        <View className='chat-input__mic' onClick={handleMicClick}>
          <View className='chat-input__mic-head' />
          <View className='chat-input__mic-stem' />
        </View>
        <Input
          className='chat-input__field'
          placeholder='咨询你的私人护肤顾问...'
          value={chatText}
          onInput={(e) => setChatText(e.detail.value)}
          confirmType='send'
          onConfirm={handleSend}
        />
        <Text className='chat-input__plus' onClick={handleSend}>发送</Text>
      </View>
    </View>
  );
}
