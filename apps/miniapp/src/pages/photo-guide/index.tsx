import { View, Text, Input } from '@tarojs/components';
import { goTo } from '@/utils/router';
import './index.scss';

export default function PhotoGuidePage() {
  return (
    <View className='scan-page'>
      <View className='scan-main'>
        <View className='scan-copy'>
          <Text className='scan-copy__title'>智能识屏录入</Text>
          <Text className='scan-copy__desc'>对准产品包装或成分表，AI 助手将自动生成日常护肤记录，帮助你持续复盘。</Text>
        </View>

        <View className='scan-search'>
          <Text className='scan-search__icon'>⌕</Text>
          <Input className='scan-search__input' placeholder='搜索品牌、单品或核心成分…' />
          <View className='scan-search__go'>→</View>
        </View>

        <View className='scan-viewport-wrap' onClick={() => goTo('/pages/camera-capture/index')}>
          <View className='scan-viewport'>
            <View className='scan-corner scan-corner--tl' />
            <View className='scan-corner scan-corner--tr' />
            <View className='scan-corner scan-corner--bl' />
            <View className='scan-corner scan-corner--br' />
            <View className='scan-center'>
              <Text className='scan-center__icon'>✎</Text>
            </View>
            <Text className='scan-center__hint'>将瓶身或成分表置于框内</Text>
          </View>
        </View>

        <View className='scan-trust'>
          <View className='scan-trust__icon'>✓</View>
          <View>
            <Text className='scan-trust__title'>精准成分解析</Text>
            <Text className='scan-trust__desc'>已接入全球 50,000+ 成分与专利品牌数据库，确保成分比对准确性与专业性。</Text>
          </View>
        </View>

        <View className='scan-manual' onClick={() => goTo('/pages/my-products/index')}>
          ⌁ 找不到产品？尝试手动添加
        </View>
      </View>
    </View>
  );
}