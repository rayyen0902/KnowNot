import Taro from '@tarojs/taro';

export function isDouyinMiniProgram() {
  return Taro.getEnv() === Taro.ENV_TYPE.TT;
}

export function isUserCancelError(err: unknown) {
  const msg =
    err && typeof err === 'object' && 'errMsg' in err
      ? String((err as { errMsg: string }).errMsg)
      : '';
  return /cancel|取消/i.test(msg);
}

/**
 * 微信等非抖音端：系统拍摄/相册选择器。
 * 抖音端首页应跳转 `pages/camera-capture`，用原生 Camera 组件尽量关闭美颜（见该页说明）。
 */
export async function openSystemSkinCameraPicker(): Promise<string | undefined> {
  try {
    const res = await Taro.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['camera'],
      camera: 'front',
      sizeType: ['original', 'compressed']
    });
    return res.tempFiles?.[0]?.tempFilePath;
  } catch (err) {
    if (isUserCancelError(err)) {
      return undefined;
    }
    try {
      const res = await Taro.chooseImage({
        count: 1,
        sourceType: ['camera'],
        sizeType: ['original', 'compressed']
      });
      return res.tempFilePaths?.[0];
    } catch (err2) {
      if (isUserCancelError(err2)) {
        return undefined;
      }
      Taro.showToast({
        title: '无法打开相机',
        icon: 'none'
      });
      return undefined;
    }
  }
}
