import { View, Text } from '@tarojs/components';
import { useEffect, useState } from 'react';
import Taro from '@tarojs/taro';
import { goTo } from '@/utils/router';
import './index.scss';

const CONSENT_STORAGE_KEY = 'privacy_health_consent_v1';

export default function SplashPage() {
  const [consentReady, setConsentReady] = useState(false);

  useEffect(() => {
    const agreed = Taro.getStorageSync(CONSENT_STORAGE_KEY) === '1';
    setConsentReady(agreed);
  }, []);

  useEffect(() => {
    if (!consentReady) return;
    const timer = setTimeout(() => {
      goTo('/pages/home/index');
    }, 500);

    return () => clearTimeout(timer);
  }, [consentReady]);

  const handleAgreeAndContinue = () => {
    Taro.setStorageSync(CONSENT_STORAGE_KEY, '1');
    setConsentReady(true);
  };

  return (
    <View className='splash-page' onClick={() => consentReady && goTo('/pages/home/index')}>
      <View className='splash-main'>
        <View className='splash-logo-wrap'>
          <View className='splash-logo-wrap__glow' />
          <View className='splash-logo' />
          <Text className='splash-brand'>知不Ai</Text>
        </View>
      </View>

      <View className='splash-footer'>
        <View className='splash-footer__content'>
          <Text className='splash-footer__text'>AI 智能护肤助手</Text>
          <View className='splash-footer__links'>
            <Text className='splash-footer__link' onClick={() => goTo('/pages/privacy-policy/index')}>《隐私政策》</Text>
            <Text className='splash-footer__link' onClick={() => goTo('/pages/health-authorization/index')}>《健康信息授权》</Text>
          </View>
        </View>
      </View>

      {!consentReady ? (
        <View className='splash-consent-mask' onClick={(e) => e.stopPropagation()}>
          <View className='splash-consent-card'>
            <Text className='splash-consent-card__title'>隐私与健康信息提示</Text>
            <Text className='splash-consent-card__desc'>
              为继续使用，请先阅读并同意《隐私政策》《健康信息授权》，我们仅在必要范围内处理信息。
            </Text>
            <View className='splash-consent-card__links'>
              <Text className='splash-consent-card__link' onClick={() => goTo('/pages/privacy-policy/index')}>《隐私政策》</Text>
              <Text className='splash-consent-card__link' onClick={() => goTo('/pages/health-authorization/index')}>《健康信息授权》</Text>
            </View>
            <Text className='splash-consent-card__cta' onClick={handleAgreeAndContinue}>同意并继续</Text>
          </View>
        </View>
      ) : null}
    </View>
  );
}
