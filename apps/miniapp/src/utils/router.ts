import Taro from '@tarojs/taro';

const tabPages = new Set<string>();

export function goTo(path: string) {
  if (tabPages.has(path)) {
    Taro.switchTab({ url: path });
    return;
  }

  Taro.navigateTo({ url: path });
}

export function switchTab(path: string) {
  Taro.navigateTo({ url: path });
}
