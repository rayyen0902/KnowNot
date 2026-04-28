import { useCallback, useRef, useState } from 'react';
import type { ComponentProps, ComponentType } from 'react';
import Taro from '@tarojs/taro';
import { View, Text, Camera } from '@tarojs/components';
import './index.scss';

const CAMERA_ID = 'skin-capture-camera';

/** 抖音 camera 若识别 `beauty` 则关闭美颜；未识别时由宿主默认（官方未在文档中保证）。 */
type DouyinCameraProps = ComponentProps<typeof Camera> & { beauty?: number };
const DouyinCamera = Camera as ComponentType<DouyinCameraProps>;

export default function CameraCapturePage() {
  const ctxRef = useRef<Taro.CameraContext | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [capturing, setCapturing] = useState(false);

  const onCameraInit = useCallback(() => {
    ctxRef.current = Taro.createCameraContext(CAMERA_ID);
    setCameraReady(true);
  }, []);

  const goSkinProfileWithImage = (path: string) => {
    try {
      Taro.setStorageSync('pendingSkinCameraImage', path);
    } catch {
      // ignore
    }
    void Taro.redirectTo({ url: '/pages/skin-profile/index' });
  };

  const onCapture = useCallback(() => {
    if (!cameraReady || capturing || !ctxRef.current) {
      return;
    }
    setCapturing(true);
    ctxRef.current.takePhoto({
      quality: 'original',
      success: (res) => {
        const path = res.tempImagePath;
        if (path) {
          goSkinProfileWithImage(path);
        } else {
          Taro.showToast({ title: '未获取到照片', icon: 'none' });
        }
      },
      fail: () => {
        Taro.showToast({ title: '拍照失败', icon: 'none' });
      },
      complete: () => {
        setCapturing(false);
      }
    });
  }, [cameraReady, capturing]);

  const onCancel = () => {
    void Taro.navigateBack();
  };

  const onCameraError = () => {
    Taro.showToast({
      title: '无法使用相机，请检查权限',
      icon: 'none'
    });
  };

  return (
    <View className='camera-capture-page'>
      <DouyinCamera
        id={CAMERA_ID}
        className='camera-capture-page__camera'
        devicePosition='front'
        resolution='high'
        flash='off'
        beauty={0}
        onInitDone={onCameraInit}
        onError={onCameraError}
      />
      <Text className='camera-capture-page__hint'>
        已尝试关闭小程序侧美颜；若画面仍偏磨皮，请在抖音拍摄面板将美颜调至「无」。
      </Text>
      <View className='camera-capture-page__toolbar'>
        <Text className='camera-capture-page__btn camera-capture-page__btn--ghost' onClick={onCancel}>
          取消
        </Text>
        <View
          className={`camera-capture-page__shutter${!cameraReady || capturing ? ' camera-capture-page__shutter--disabled' : ''}`}
          onClick={onCapture}
        />
        <View className='camera-capture-page__btn' />
      </View>
    </View>
  );
}
