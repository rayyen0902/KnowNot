import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { goTo } from '@/utils/router';
import './index.scss';

export default function ProductDetailPage() {
  const onConsult = () => {
    Taro.showToast({
      title: '咨询入口暂未开放，已跳转订单页',
      icon: 'none'
    });
    goTo('/pages/orders/index');
  };

  const onAddList = () => {
    goTo('/pages/my-products/index');
  };

  const onLogistics = () => {
    goTo('/pages/orders/index');
  };

  return (
    <View className='product-detail-page'>
      <View className='product-hero'>
        <View className='product-hero__image' />
        <View className='product-hero__overlay' />
      </View>

      <View className='product-content'>
        <View className='product-header'>
          <View className='product-header__brand-row'>
            <Text className='product-header__brand'>DERMALAB</Text>
            <Text className='product-header__verify'>◍ 临床验证</Text>
          </View>
          <Text className='product-header__title'>多重神经酰胺修护精华乳</Text>
          <Text className='product-header__desc'>专为敏弱肌设计，深层修护肌肤屏障，即刻舒缓泛红干痒，重建健康肌肤生态。</Text>
          <View className='product-header__tags'>
            <Text className='product-header__tag'>强韧屏障</Text>
            <Text className='product-header__tag'>深层保湿</Text>
            <Text className='product-header__tag'>舒缓褪红</Text>
          </View>
        </View>

        <View className='ai-match'>
          <View className='ai-match__surface'>
            <View className='ai-match__head'>
              <View className='ai-match__title-row'>
                <View className='ai-match__title-icon-wrap'>
                  <Text className='ai-match__title-icon'>◍</Text>
                </View>
                <Text className='ai-match__title'>知不Ai 肤质匹配</Text>
              </View>
              <View className='ai-match__score'>
                <Text className='ai-match__score-num'>96</Text>
                <Text className='ai-match__score-percent'>%</Text>
                <Text className='ai-match__score-desc'>极度契合当前状态</Text>
              </View>
            </View>

            <View className='ai-match__body'>
              <Text className='ai-match__summary'>根据您最新的测肤报告（混合偏干、屏障受损期），该产品的核心成分矩阵能提供针对性修护。</Text>
              <View className='ai-match__point'>
                <Text className='ai-match__dot'>●</Text>
                <Text className='ai-match__point-text'>急救舒缓：有效改善您近期的两颊泛红问题。</Text>
              </View>
              <View className='ai-match__point'>
                <Text className='ai-match__dot'>●</Text>
                <Text className='ai-match__point-text'>精准保湿：补充细胞间脂质，解决U区干燥起皮。</Text>
              </View>
            </View>
          </View>
        </View>

        <View className='section-block'>
          <Text className='section-block__title'>核心成分图谱</Text>
          <View className='ingredient-grid'>
            <View className='ingredient-grid__major'>
              <View className='ingredient-grid__major-icon'>◌</View>
              <View>
                <Text className='ingredient-grid__major-title'>复合神经酰胺 (1, 3, 6-II)</Text>
                <Text className='ingredient-grid__major-desc'>模拟健康皮脂膜结构，黄金比例直达肌底，像水泥一样填补细胞间隙，强韧屏障。</Text>
              </View>
            </View>

            <View className='ingredient-grid__minor-wrap'>
              <View className='ingredient-grid__minor'>
                <Text className='ingredient-grid__minor-title'>依克多因</Text>
                <Text className='ingredient-grid__minor-desc'>细胞级防护盾，抵御外界刺激，长效锁水。</Text>
              </View>
              <View className='ingredient-grid__minor'>
                <Text className='ingredient-grid__minor-title'>积雪草提取物</Text>
                <Text className='ingredient-grid__minor-desc'>温和植萃力量，即刻褪红，舒缓敏感不适。</Text>
              </View>
            </View>
          </View>
        </View>

        <View className='section-block section-block--usage'>
          <Text className='section-block__title'>定制护肤仪式</Text>
          <View className='usage-scroll'>
            <View className='usage-card'>
              <View className='usage-card__step'>1</View>
              <Text className='usage-card__title'>温和清洁</Text>
              <Text className='usage-card__desc'>使用氨基酸洁面后，保留肌肤微湿状态。</Text>
            </View>
            <View className='usage-card usage-card--accent'>
              <View className='usage-card__step usage-card__step--accent'>2</View>
              <Text className='usage-card__title usage-card__title--accent'>取量涂抹</Text>
              <Text className='usage-card__desc'>取2-3泵精华乳于掌心，均匀点涂于面部及颈部。</Text>
            </View>
            <View className='usage-card'>
              <View className='usage-card__step'>3</View>
              <Text className='usage-card__title'>按压吸收</Text>
              <Text className='usage-card__desc'>双手搓热，轻柔按压面部帮助成分渗透吸收。</Text>
            </View>
          </View>
        </View>
      </View>

      <View className='detail-bottom-bar'>
        <View className='detail-bottom-bar__primary' onClick={onConsult}>
          <Text className='detail-bottom-bar__primary-icon'>▣</Text>
          <Text className='detail-bottom-bar__primary-text'>立即咨询</Text>
        </View>
        <View className='detail-bottom-bar__item' onClick={onAddList}>
          <Text className='detail-bottom-bar__item-icon'>◎</Text>
          <Text>加入清单</Text>
        </View>
        <View className='detail-bottom-bar__item' onClick={onLogistics}>
          <Text className='detail-bottom-bar__item-icon'>◫</Text>
          <Text>物流追踪</Text>
        </View>
      </View>
    </View>
  );
}
