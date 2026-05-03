import { View, Text } from '@tarojs/components';
import { useState } from 'react';
import Taro from '@tarojs/taro';
import { goTo } from '@/utils/router';
import { mockFavoriteEntries } from '@/data/mock';
import './index.scss';

const HEADER_SUB =
  '您的专属肌肤档案库。这里保存了您认为最有价\n值的护肤方案与临床推荐。';

export default function FavoritesPage() {
  const [tab, setTab] = useState<'plan' | 'product'>('plan');
  const hasItems = mockFavoriteEntries.length > 0;

  const onReport = () => {
    const r = mockFavoriteEntries.find((e) => e.kind === 'report');
    if (r?.reportId) goTo(`/pages/report/index?report_id=${encodeURIComponent(r.reportId)}`);
    else {
      Taro.showToast({ title: '请先在首页完成采集并生成报告', icon: 'none' });
      setTimeout(() => goTo('/pages/home/index'), 400);
    }
  };

  const onProduct = () => {
    const p = mockFavoriteEntries.find((e) => e.kind === 'product');
    if (p?.productId !== undefined)
      goTo(`/pages/product-detail/index?product_id=${encodeURIComponent(String(p.productId))}`);
    else {
      Taro.showToast({ title: '请先在首页完成采集并生成报告', icon: 'none' });
      setTimeout(() => goTo('/pages/home/index'), 400);
    }
  };

  return (
    <View className='favorites-page'>
      <View className='favorites-body'>
        <View className='favorites-main'>
          <View className='favorites-header'>
            <Text className='favorites-header__title'>我的收藏</Text>
            <Text className='favorites-header__sub'>{HEADER_SUB}</Text>
          </View>

          <View className='favorites-tabs-wrap'>
            <View className='favorites-tabs'>
              <View
                className={`favorites-tab ${tab === 'plan' ? 'favorites-tab--active' : ''}`}
                onClick={() => setTab('plan')}
              >
                <View className='favorites-tab__icon favorites-tab__icon--doc' />
                <Text className='favorites-tab__text'>护肤方案</Text>
              </View>
              <View
                className={`favorites-tab ${tab === 'product' ? 'favorites-tab--active' : ''}`}
                onClick={() => setTab('product')}
              >
                <View className='favorites-tab__icon favorites-tab__icon--bag' />
                <Text className='favorites-tab__text'>推荐产品</Text>
              </View>
            </View>
          </View>

          {hasItems ? (
            <View className='favorites-bento'>
              {/* NHFOu — Hero highlight */}
              <View className='fav-card fav-card--hero' onClick={onReport}>
                <View className='fav-card--hero__media'>
                  <View className='fav-card--hero__media-bg' />
                  <View className='fav-card--hero__media-overlay' />
                </View>
                <View className='fav-card--hero__body'>
                  <View className='fav-card--hero__meta-row'>
                    <View className='fav-card--hero__pill'>
                      <View className='fav-card--hero__pill-icon' />
                      <Text className='fav-card--hero__pill-text'>核心成分</Text>
                    </View>
                    <Text className='fav-card--hero__time'>2周前收藏</Text>
                  </View>
                  <Text className='fav-card--hero__title'>
                    抗老初级指南：A醇的正确建立{'\n'}耐受方法与临床数据
                  </Text>
                  <Text className='fav-card--hero__desc'>
                    视黄醇（A醇）作为抗衰老的黄金标准成分，其{'\n'}
                    刺激性常常让新手望而却步。本文详细解析如何
                  </Text>
                  <View className='fav-card--hero__footer'>
                    <View className='fav-card--hero__avatar'>
                      <Text className='fav-card--hero__avatar-t'>Dr.</Text>
                    </View>
                    <View className='fav-card--hero__cta'>
                      <Text className='fav-card--hero__cta-text'>阅读全文</Text>
                      <View className='fav-card--hero__cta-arrow' />
                    </View>
                  </View>
                </View>
              </View>

              {/* r1ICo — Clinical protocol */}
              <View className='fav-card fav-card--clinical' onClick={onReport}>
                <View className='fav-card--clinical__blob' />
                <View className='fav-card--clinical__top'>
                  <View className='fav-card--clinical__icon-wrap'>
                    <View className='fav-card--clinical__icon' />
                  </View>
                  <Text className='fav-card--clinical__title'>敏感肌屏障修护处方</Text>
                  <Text className='fav-card--clinical__desc'>
                    针对红血丝与角质层薄弱的定制方案，包含神经{'\n'}
                    酰胺与泛醇的协同使用建议。
                  </Text>
                </View>
                <View className='fav-card--clinical__bar'>
                  <Text className='fav-card--clinical__read'>12 分钟阅读</Text>
                  <View className='fav-card--clinical__play'>
                    <View className='fav-card--clinical__play-icon' />
                  </View>
                </View>
              </View>

              {/* sbJ9S — Text insights */}
              <View className='fav-card fav-card--texty' onClick={onReport}>
                <View className='fav-card--texty__tag-row'>
                  <View className='fav-card--texty__tag-icon' />
                  <Text className='fav-card--texty__tag'>防晒解析</Text>
                </View>
                <Text className='fav-card--texty__title'>
                  物理防晒 vs 化学防晒：成分谱系图{'\n'}解与光毒性风险评估
                </Text>
                <Text className='fav-card--texty__desc'>
                  深入探讨二氧化钛与氧化锌的微粒化处理技{'\n'}
                  术，以及化学防晒剂在不同肤质上的表现...
                </Text>
                <View className='fav-card--texty__footer'>
                  <Text className='fav-card--texty__time'>1个月前收藏</Text>
                  <View className='fav-card--texty__arrow-btn'>
                    <View className='fav-card--texty__arrow' />
                  </View>
                </View>
              </View>

              {/* lT3KX — Product note + AI */}
              <View className='fav-card fav-card--note' onClick={onReport}>
                <View className='fav-card--note__accent' />
                <Text className='fav-card--note__title'>早C晚A的搭配误区</Text>
                <Text className='fav-card--note__desc'>
                  为什么你的VC精华加上A醇反而导致了烂脸？{'\n'}pH值的冲突原理分析。
                </Text>
                <View className='fav-card--note__ai'>
                  <View className='fav-card--note__ai-icon' />
                  <Text className='fav-card--note__ai-text'>
                    AI 重点摘要：建议将高浓度原型VC与A醇{'\n'}分早晚使用，避免叠加导致酸碱度中和失活{'\n'}及过度刺激。
                  </Text>
                </View>
              </View>

              {/* p7KCmj — Image focus */}
              <View className='fav-card fav-card--visual' onClick={onProduct}>
                <View className='fav-card--visual__img' />
                <View className='fav-card--visual__grad' />
                <View className='fav-card--visual__glass'>
                  <View className='fav-card--visual__glass-inner'>
                    <View className='fav-card--visual__chip'>
                      <Text className='fav-card--visual__chip-t'>生活方式</Text>
                    </View>
                    <Text className='fav-card--visual__glass-title'>
                      饮食抗糖化对肤色的长期影响数据报{'\n'}告
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          ) : (
            <View className='favorites-empty'>
              <Text className='favorites-empty__title'>暂无收藏</Text>
              <Text className='favorites-empty__hint'>在报告或商品页加入收藏后，将显示在这里。</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
