import { useRef } from 'react';
import Taro, { useLoad } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { bindAnonymousUser } from '@/services/api';
import { switchTab } from '@/utils/router';
import './index.scss';

export default function AuthPage() {
  const pageStateRef = useRef({
    scene: '',
    anonymousId: '',
    reportId: ''
  });

  useLoad((params) => {
    pageStateRef.current.scene = params?.scene || '';
    pageStateRef.current.anonymousId = params?.anonymous_id || '';
    pageStateRef.current.reportId = params?.report_id || '';
  });

  const enterHome = () => {
    switchTab('/pages/home/index');
  };

  const handleLoginSuccess = async () => {
    try {
      Taro.showLoading({ title: '登录中...' });
      // TODO(auth-v1): 这里当前仅保留 Taro.login 占位流程。
      // 正式链路需替换为“手机号验证码发送/校验”接口：
      // 1) POST /api/v1/auth/sms/send
      // 2) POST /api/v1/auth/sms/verify
      // 并在 verify 成功后换取业务 token，再执行 bind。
      const loginRes = await Taro.login();
      const loginCode = loginRes.code || 'mock_login_code';
      if (pageStateRef.current.scene === 'bind_report' && pageStateRef.current.anonymousId) {
        await bindAnonymousUser({
          anonymous_id: pageStateRef.current.anonymousId,
          login_code: loginCode
        });
        console.info('[v1-flow] user/bind success', {
          anonymousId: pageStateRef.current.anonymousId,
          reportId: pageStateRef.current.reportId
        });
        Taro.hideLoading();
        const reportUrl = pageStateRef.current.reportId
          ? `/pages/report/index?report_id=${encodeURIComponent(pageStateRef.current.reportId)}`
          : '/pages/report/index';
        Taro.navigateTo({ url: reportUrl });
        return;
      }
      Taro.hideLoading();
      enterHome();
    } catch (error) {
      Taro.hideLoading();
      Taro.showToast({
        title: error instanceof Error ? error.message : '登录失败，请稍后重试',
        icon: 'none'
      });
    }
  };

  return (
    <View className='auth-page'>
      <View className='auth-main'>
        <View className='auth-bg-orb auth-bg-orb--pink' />
        <View className='auth-bg-orb auth-bg-orb--teal' />

        <View className='auth-brand'>
          <View className='auth-brand__logo' />
          <View className='auth-brand__title'>开启您的专属护肤</View>
          <Text className='auth-brand__desc'>专业临床级 AI 肌肤诊断，量身定制方案</Text>
        </View>

        <View className='auth-card'>
          <View className='auth-card__glow' />
          <View className='auth-action auth-action--primary' onClick={handleLoginSuccess}>
            <Text className='auth-action__icon'>▭</Text>
            <Text>微信一键授权登录</Text>
          </View>

          <View className='auth-agree'>
            <View className='auth-agree__check' />
            <View className='auth-agree__text'>
              我已阅读并同意 《用户服务协议》、
              <Text className='auth-agree__link'>《隐私政策》</Text>
              及 《健康信息授权协议》
            </View>
          </View>
        </View>

        <View className='auth-sub'>
          <View className='auth-sub__trust'>
            <Text className='auth-sub__trust-icon'>◉</Text>
            <Text>数据加密传输，保护您的隐私安全</Text>
          </View>
          <View className='auth-sub__phone' onClick={handleLoginSuccess}>
            手机号验证码登录
          </View>
        </View>
      </View>
    </View>
  );
}
