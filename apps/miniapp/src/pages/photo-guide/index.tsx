import { View, Text } from '@tarojs/components';
import { goTo } from '@/utils/router';
import './index.scss';

const HERO_DESC =
  '为了获得最精准的临床级肤质报告，请\n遵循以下拍摄建议。';

const CARD1_DESC =
  '请在光线充足、均匀的环境下拍摄。避免强烈直\n射光或背光，以免产生阴影影响分析。';

const CARD2_DESC =
  '请摘下眼镜，将头发撩起，保持面部放松，正\n对镜头。素颜状态下检测效果最佳。';

const CARD3_DESC =
  '脸部轮廓需完整显示在屏幕提示框内，不要太\n远或太近，保持手机稳定。';

export default function PhotoGuidePage() {
  return (
    <View className='photo-guide-page'>
      <View className='photo-guide-page__main'>
        <View className='photo-guide-page__hero'>
          <Text className='photo-guide-page__hero-title'>AI 肤质分析</Text>
          <Text className='photo-guide-page__hero-desc'>{HERO_DESC}</Text>
        </View>

        <View className='photo-guide-page__grid'>
          <View className='photo-guide-page__card photo-guide-page__card--one'>
            <View className='photo-guide-page__card-icon-slot'>
              <View className='photo-guide-page__card-icon-ring photo-guide-page__card-icon-ring--pink'>
                <View className='photo-guide-page__card-icon-glyph photo-guide-page__card-icon-glyph--sun' />
              </View>
            </View>
            <Text className='photo-guide-page__card-title'>自然均匀光线</Text>
            <Text className='photo-guide-page__card-desc photo-guide-page__card-desc--wide'>{CARD1_DESC}</Text>
          </View>

          <View className='photo-guide-page__card photo-guide-page__card--two'>
            <View className='photo-guide-page__card-icon-slot'>
              <View className='photo-guide-page__card-icon-ring photo-guide-page__card-icon-ring--mint'>
                <View className='photo-guide-page__card-icon-glyph photo-guide-page__card-icon-glyph--face' />
              </View>
            </View>
            <Text className='photo-guide-page__card-title'>完全露出面部</Text>
            <Text className='photo-guide-page__card-desc photo-guide-page__card-desc--narrow'>{CARD2_DESC}</Text>
          </View>

          <View className='photo-guide-page__card photo-guide-page__card--three'>
            <View className='photo-guide-page__card-icon-slot'>
              <View className='photo-guide-page__card-icon-ring photo-guide-page__card-icon-ring--indigo'>
                <View className='photo-guide-page__card-icon-glyph photo-guide-page__card-icon-glyph--distance' />
              </View>
            </View>
            <Text className='photo-guide-page__card-title'>保持适当距离</Text>
            <Text className='photo-guide-page__card-desc photo-guide-page__card-desc--narrow'>{CARD3_DESC}</Text>
          </View>
        </View>
      </View>

      <View className='photo-guide-page__bottom'>
        <View className='photo-guide-page__bottom-inner'>
          <View className='photo-guide-page__cta' onClick={() => goTo('/pages/camera-capture/index')}>
            <View className='photo-guide-page__cta-icon' />
            <Text className='photo-guide-page__cta-label'>开始拍摄分析</Text>
          </View>
          <Text className='photo-guide-page__hint'>您的照片仅用于本次分析，我们将严格保护您的隐私</Text>
        </View>
      </View>
    </View>
  );
}
