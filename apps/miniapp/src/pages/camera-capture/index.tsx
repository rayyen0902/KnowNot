import { useCallback, useRef, useState } from 'react';
import type { ComponentProps, ComponentType } from 'react';
import Taro from '@tarojs/taro';
import { View, Text, Camera } from '@tarojs/components';
import './index.scss';

const CAMERA_ID = 'skin-capture-camera';

const HEADER_SUB =
  '对准产品包装或成分表，AI 助手将自动为您建立专业的\n临床级护肤档案。';

const TRUST_DESC =
  '已接入全球 50,000+ 院线与专柜品牌数据库，确保\n成分比对的绝对严谨性。';

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
      if (!cameraReady) {
        Taro.showToast({ title: '相机初始化中…', icon: 'none' });
      }
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

  const onCameraError = () => {
    Taro.showToast({
      title: '无法使用相机，请检查权限',
      icon: 'none'
    });
  };

  const onManualHint = () => {
    Taro.showToast({ title: '请从首页对话或搜索完成录入', icon: 'none' });
  };

  return (
    <View className='camera-capture-page'>
      <View className='camera-capture-page__main'>
        <View className='camera-capture-page__header'>
          <Text className='camera-capture-page__title'>智能识屏录入</Text>
          <Text className='camera-capture-page__subtitle'>{HEADER_SUB}</Text>
        </View>

        <View className='camera-capture-page__search-wrap'>
          <View className='camera-capture-page__search'>
            <View className='camera-capture-page__search-icon' />
            <View className='camera-capture-page__search-field'>
              <Text className='camera-capture-page__search-placeholder'>搜索品牌、单品或核心成分...</Text>
            </View>
            <View className='camera-capture-page__search-btn'>
              <View className='camera-capture-page__search-btn-icon' />
            </View>
          </View>
        </View>

        <View className={`camera-capture-page__scanner${!cameraReady || capturing ? ' camera-capture-page__scanner--busy' : ''}`}>
          <DouyinCamera
            id={CAMERA_ID}
            className='camera-capture-page__camera'
            devicePosition='back'
            resolution='high'
            flash='off'
            beauty={0}
            onInitDone={onCameraInit}
            onError={onCameraError}
          />

          <View className='camera-capture-page__viewport'>
            <View className='camera-capture-page__frost'>
              <View className='camera-capture-page__corner camera-capture-page__corner--tl' />
              <View className='camera-capture-page__corner camera-capture-page__corner--tr' />
              <View className='camera-capture-page__corner camera-capture-page__corner--bl' />
              <View className='camera-capture-page__corner camera-capture-page__corner--br' />
              <View className='camera-capture-page__laser' />
              <View className='camera-capture-page__center'>
                <View className='camera-capture-page__center-icon-wrap'>
                  <View className='camera-capture-page__center-icon' />
                </View>
                <Text className='camera-capture-page__center-text'>将瓶身或成分表置于框内</Text>
              </View>
            </View>
          </View>
          <View className='camera-capture-page__tap-catcher' onClick={onCapture} />
        </View>

        <View className='camera-capture-page__footer'>
          <View className='camera-capture-page__trust'>
            <View className='camera-capture-page__trust-badge'>
              <View className='camera-capture-page__trust-badge-icon' />
            </View>
            <View className='camera-capture-page__trust-body'>
              <Text className='camera-capture-page__trust-title'>精准院线级解析</Text>
              <Text className='camera-capture-page__trust-desc'>{TRUST_DESC}</Text>
            </View>
          </View>
          <View className='camera-capture-page__manual' onClick={onManualHint}>
            <View className='camera-capture-page__manual-icon' />
            <Text className='camera-capture-page__manual-text'>找不到产品？尝试手动添加</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
