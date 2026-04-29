import Taro from '@tarojs/taro';

const tabPages = new Set<string>();

function normalize(path: string) {
  if (!path) return '';
  return path.startsWith('/') ? path : `/${path}`;
}

function currentPath() {
  const pages = Taro.getCurrentPages();
  const current = pages[pages.length - 1] as { route?: string } | undefined;
  return normalize(current?.route || '');
}

export function goTo(path: string) {
  const target = normalize(path);
  if (!target || currentPath() === target) {
    return;
  }

  if (tabPages.has(target)) {
    void Taro.switchTab({ url: target });
    return;
  }

  void Taro.navigateTo({ url: target }).catch(() => {
    // 页面栈接近上限时，降级为 redirectTo，避免“按钮无响应”。
    return Taro.redirectTo({ url: target });
  });
}

export function switchTab(path: string) {
  goTo(path);
}
