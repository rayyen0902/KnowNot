import Taro from '@tarojs/taro';

const STORAGE_KEYS = {
  token: 'miniapp_token',
  anonymousId: 'miniapp_anonymous_id',
  userId: 'miniapp_user_id'
} as const;

export function getToken() {
  return Taro.getStorageSync<string>(STORAGE_KEYS.token) || '';
}

export function setToken(token: string) {
  Taro.setStorageSync(STORAGE_KEYS.token, token);
}

export function getAnonymousId() {
  return Taro.getStorageSync<string>(STORAGE_KEYS.anonymousId) || '';
}

export function setAnonymousId(anonymousId: string) {
  Taro.setStorageSync(STORAGE_KEYS.anonymousId, anonymousId);
}

export function getUserId() {
  return Taro.getStorageSync<string>(STORAGE_KEYS.userId) || '';
}

export function setUserId(userId: string) {
  Taro.setStorageSync(STORAGE_KEYS.userId, userId);
}

export function clearSession() {
  Taro.removeStorageSync(STORAGE_KEYS.token);
  Taro.removeStorageSync(STORAGE_KEYS.userId);
}
