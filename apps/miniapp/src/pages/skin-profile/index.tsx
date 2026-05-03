import { View, Text } from '@tarojs/components';
import './index.scss';

export default function SkinProfilePage() {
  return (
    <View className='skin-profile-page'>
      <View className='skin-profile-main'>
        <View className='skin-profile-header'>
          <View className='skin-profile-header__row'>
            <Text className='skin-profile-header__title'>肤质记录</Text>
            <View className='skin-profile-header__badge'>
              <Text className='skin-profile-header__badge-icon'>◍</Text>
              <Text className='skin-profile-header__badge-text'>临床分析</Text>
            </View>
          </View>
          <Text className='skin-profile-header__desc'>追踪您的肌肤演变。每次检测都由AI深度分析，提供专业的改善建议。</Text>
        </View>

        <View className='skin-summary'>
          <View className='skin-summary__main'>
            <Text className='skin-summary__label'>当前主导肤质</Text>
            <Text className='skin-summary__date'>最新检测: 2023年10月15日</Text>
            <View className='skin-summary__type-row'>
              <Text className='skin-summary__type'>混合性</Text>
              <Text className='skin-summary__subtype'>偏油</Text>
            </View>
          </View>
          <View className='skin-summary__trend'>
            <View className='skin-summary__trend-head'>
              <Text className='skin-summary__trend-title'>整体改善</Text>
              <Text className='skin-summary__trend-arrow'>↗</Text>
            </View>
            <Text className='skin-summary__trend-value'>+12%</Text>
            <Text className='skin-summary__trend-desc'>较首次检测</Text>
          </View>
        </View>

        <View className='skin-history'>
          <Text className='skin-history__title'>历史报告</Text>

          <View className='history-item history-item--latest'>
            <View className='history-item__head'>
              <View>
                <Text className='history-item__latest-tag'>最新报告</Text>
                <Text className='history-item__date'>2023年10月15日</Text>
              </View>
              <View className='history-item__type'>
                <Text className='history-item__type-icon'>◍</Text>
                <Text className='history-item__type-text'>混合偏油</Text>
              </View>
            </View>
            <View className='history-item__grid'>
              <View>
                <Text className='history-item__label'>主要改善</Text>
                <View className='history-item__metric-row'>
                  <Text className='history-item__metric'>T区出油减少</Text>
                  <Text className='history-item__metric-value'>-15%</Text>
                </View>
              </View>
              <View>
                <Text className='history-item__label'>需关注</Text>
                <Text className='history-item__metric'>两颊缺水</Text>
              </View>
            </View>
            <View className='history-item__button'>
              <Text className='history-item__button-text'>查看完整报告</Text>
              <Text className='history-item__button-arrow'>›</Text>
            </View>
          </View>

          <View className='history-item history-item--muted'>
            <View className='history-item__head'>
              <Text className='history-item__date'>2023年9月01日</Text>
              <View className='history-item__type history-item__type--plain'>
                <Text className='history-item__type-icon history-item__type-icon--plain'>◍</Text>
                <Text className='history-item__type-text'>混合偏油</Text>
              </View>
            </View>
            <View className='history-item__grid'>
              <View>
                <Text className='history-item__label'>主要改善</Text>
                <View className='history-item__metric-row'>
                  <Text className='history-item__metric'>泛红减轻</Text>
                  <Text className='history-item__metric-value'>-8%</Text>
                </View>
              </View>
              <View>
                <Text className='history-item__label'>需关注</Text>
                <Text className='history-item__metric'>毛孔粗大</Text>
              </View>
            </View>
          </View>

          <View className='history-item history-item--muted'>
            <View className='history-item__head'>
              <View>
                <Text className='history-item__date'>2023年7月20日</Text>
                <Text className='history-item__first-tag'>首次记录</Text>
              </View>
              <View className='history-item__type history-item__type--plain'>
                <Text className='history-item__type-icon history-item__type-icon--plain'>◍</Text>
                <Text className='history-item__type-text'>油性敏感</Text>
              </View>
            </View>
            <View className='history-item__single'>
              <Text className='history-item__label'>基线状态</Text>
              <Text className='history-item__metric'>全脸油脂分泌旺盛，伴有局部敏感泛红。</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}