import path from 'path';

export default {
  projectName: 'zhibu-ai-skincare-miniapp',
  date: '2026-04-25',
  /**
   * 750：与 `d()/fp()` 中「round(px×750÷390)rpx」一致（390 为 Pencil 画布宽）。
   * 若改为 375，postcss 会把普通 `px` 放大一倍，需全站迁移或改用 `Px`/纯 rpx。
   */
  designWidth: 750,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2,
  },
  sourceRoot: 'src',
  outputRoot: 'dist',
  plugins: [],
  defineConstants: {},
  copy: {
    patterns: [],
    options: {},
  },
  framework: 'react',
  /**
   * 使用对象形式以便控制 prebundle。
   * 关闭后不再生成 app 入口对 dist/prebundle 的 require，避免「产物已引用 prebundle 但目录未复制」类报错。
   * @see https://docs.taro.zone/docs/config-detail#compilerprebundle
   */
  compiler: {
    type: 'webpack5',
    prebundle: {
      enable: false,
    },
  },
  cache: {
    enable: false,
  },
  alias: {
    '@': path.resolve(__dirname, '..', 'src'),
  },
  mini: {
    webpackChain(chain) {
      chain.resolve.alias.delete('@tarojs/shared');
    },
    postcss: {
      pxtransform: {
        enable: true,
        config: {},
      },
      url: {
        enable: true,
        config: {},
      },
      cssModules: {
        enable: false,
        config: {},
      },
    },
  },
  h5: {
    publicPath: '/',
  },
  chainWebpack(chain) {
    chain.resolve.alias.delete('@tarojs/shared');
  },
};