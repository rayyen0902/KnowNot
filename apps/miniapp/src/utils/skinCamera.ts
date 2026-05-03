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
 * 首页/引导页「直接拍照」：调系统相机（`chooseMedia` / `chooseImage`），返回临时文件路径；调用方可自行上传或展示。
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

function clampPhotoCount(n: number) {
  return Math.min(Math.max(Math.floor(n), 1), 3);
}

/**
 * 从相册选择肤质分析用照片，单次可选 1～3 张（与设计稿一致）。
 */
export async function pickSkinPhotosFromAlbum(maxCount = 3): Promise<string[]> {
  const count = clampPhotoCount(maxCount);
  try {
    const res = await Taro.chooseMedia({
      count,
      mediaType: ['image'],
      sourceType: ['album'],
      sizeType: ['original', 'compressed']
    });
    return (res.tempFiles ?? []).map((f) => f.tempFilePath).filter(Boolean);
  } catch (err) {
    if (isUserCancelError(err)) {
      return [];
    }
    try {
      const res = await Taro.chooseImage({
        count,
        sourceType: ['album'],
        sizeType: ['original', 'compressed']
      });
      return res.tempFilePaths ?? [];
    } catch (err2) {
      if (isUserCancelError(err2)) {
        return [];
      }
      Taro.showToast({
        title: '无法打开相册',
        icon: 'none'
      });
      return [];
    }
  }
}
