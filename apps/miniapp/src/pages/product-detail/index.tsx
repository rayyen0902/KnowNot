import { View, Text } from '@tarojs/components';
import './index.scss';

export default function ProductDetailPage() {
  return (
    <View className='product-detail-page'>
      <View className='detail-hero' />

      <View className='detail-content'>
        <View className='detail-card detail-card--header'>
          <View className='detail-brand-row'>
            <Text className='detail-badge'>DERMALAB</Text>
            <Text className='detail-badge detail-badge--secondary'>⌂ 临床验证</Text>
          </View>
          <Text className='detail-title'>多重神经酰胺修护精华乳</Text>
          <Text className='detail-desc'>专为敏弱肌设计，深层修护肌肤屏障，即刻舒缓泛红干痒，重建健康肌肤生态。</Text>
          <View className='detail-tags'>
            <Text className='detail-tag'>强韧屏障</Text>
            <Text className='detail-tag'>深层保湿</Text>
            <Text className='detail-tag'>舒缓褪红</Text>
          </View>
        </View>

        <View className='match-card'>
          <View className='match-card__head'>
            <View className='match-card__left'>
              <View className='match-card__icon'>✿</View>
              <Text className='match-card__title'>知不Ai 肤质匹配</Text>
            </View>
            <View className='match-score'>
              96<Text className='match-score__percent'>%</Text>
              <Text className='match-score__desc'>极度契合当前状态</Text>
            </View>
          </View>
          <View className='match-card__body'>
            <Text className='match-card__body-text'>根据您最新的测肤报告（混合偏干、屏障受损期），该产品的核心成分矩阵能提供针对性修护。</Text>
            <Text className='match-point'>急救舒缓：有效改善您近期的两颊泛红问题。</Text>
            <Text className='match-point'>精准保湿：补充细胞间脂质，解决U区干燥起皮。</Text>
          </View>
        </View>

        <Text className='section-title'>核心成分图谱</Text>
        <View className='ingredient-grid'>
          <View className='ingredient-card ingredient-card--big'>
            <View className='ingredient-card__icon'>◌</View>
            <View>
              <Text className='ingredient-card__title'>复合神经酰胺 (1, 3, 6-II)</Text>
              <Text className='ingredient-card__desc'>模拟健康皮脂膜结构，黄金比例直达肌底，像水泥一样填补细胞间隙，强韧屏障。</Text>
            </View>
          </View>
          <View className='ingredient-card'>
            <Text className='ingredient-card__title ingredient-card__title--accent'>依克多因</Text>
            <Text className='ingredient-card__desc'>细胞级防护盾，抵御外界刺激，长效锁水。</Text>
          </View>
          <View className='ingredient-card'>
            <Text className='ingredient-card__title ingredient-card__title--accent'>积雪草提取物</Text>
            <Text className='ingredient-card__desc'>温和植萃力量，即刻褪红，舒缓敏感不适。</Text>
          </View>
        </View>

        <Text className='section-title'>定制护肤仪式</Text>
        <View className='routine-scroll'>
          <View className='routine-card'>
            <View className='routine-card__step'>1</View>
            <Text className='routine-card__title'>温和清洁</Text>
            <Text className='routine-card__desc'>使用氨基酸洁面后，保留肌肤微湿状态。</Text>
          </View>
          <View className='routine-card routine-card--accent'>
            <View className='routine-card__step'>2</View>
            <Text className='routine-card__title'>取量涂抹</Text>
            <Text className='routine-card__desc'>取2-3泵精华乳于掌心，点涂于面部及颈部。</Text>
          </View>
          <View className='routine-card'>
            <View className='routine-card__step'>3</View>
            <Text className='routine-card__title'>按压吸收</Text>
            <Text className='routine-card__desc'>双手搓热，轻柔按压面部帮助成分渗透吸收。</Text>
          </View>
        </View>
      </View>

      <View className='bottom-bar'>
        <View className='bottom-bar__primary'>
          <Text className='bottom-bar__primary-icon'>◻</Text>
          <Text className='bottom-bar__primary-text'>立即咨询</Text>
        </View>
        <View className='bottom-bar__item'>
          <Text className='bottom-bar__item-icon'>◎</Text>
          <Text>加入清单</Text>
        </View>
        <View className='bottom-bar__item'>
          <Text className='bottom-bar__item-icon'>◫</Text>
          <Text>物流追踪</Text>
        </View>
      </View>
    </View>
  );
}
