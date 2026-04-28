import { View, Text } from '@tarojs/components';
import './index.scss';

const trendPoints = [52, 58, 64, 71, 78, 84];

const historyList = [
  {
    date: '2023年10月15日',
    badge: '紧急阶段',
    health: '较为稳定',
    hydration: '偏缺水',
    link: '查看完整报告'
  },
  {
    date: '2023年9月01日',
    badge: '复测阶段',
    health: '轻度出油',
    hydration: '有上升趋势',
    link: '查看完整报告'
  },
  {
    date: '2023年7月20日',
    badge: '初测阶段',
    health: '泛红敏感',
    hydration: '全脸偏低/沙漠干，伴有屏障易受损',
    link: '查看完整报告'
  }
];

export default function SkinRecordPage() {
  return (
    <View className='skin-record-page'>
      <View className='skin-record-main'>
        <View className='skin-record-head'>
          <View className='skin-record-head__row'>
            <Text className='skin-record-head__title'>肤质记录</Text>
            <View className='skin-record-head__tag'>
              <Text className='skin-record-head__tag-dot'>◌</Text>
              <Text>临床分析</Text>
            </View>
          </View>
          <Text className='skin-record-head__desc'>追踪您的肌肤演变。每次检测都由AI深度分析，提供专业的改善建议。</Text>
        </View>

        <View className='skin-record-summary'>
          <View className='skin-record-summary__main'>
            <Text className='skin-record-summary__label'>当前主要肤质</Text>
            <View className='skin-record-summary__type-row'>
              <Text className='skin-record-summary__type'>混合性</Text>
              <Text className='skin-record-summary__sub'>偏油</Text>
            </View>
            <View className='skin-record-summary__trend'>
              <Text className='skin-record-summary__trend-label'>整体改善</Text>
              <Text className='skin-record-summary__trend-icon'>⌁</Text>
            </View>
            <Text className='skin-record-summary__increase'>+12%</Text>
          </View>

          <View className='skin-record-summary__sub-card'>
            <View className='skin-record-summary__sub-head'>
              <Text className='skin-record-summary__sub-title'>整体改善</Text>
              <Text className='skin-record-summary__sub-icon'>⌁</Text>
            </View>
            <View className='skin-record-summary__bars'>
              {trendPoints.map((item) => (
                <View className='skin-record-summary__bar-item' key={item}>
                  <View className='skin-record-summary__bar-track'>
                    <View className='skin-record-summary__bar-fill' style={{ height: `${item}%` }} />
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View className='skin-record-history'>
          <Text className='skin-record-history__title'>历史报告</Text>
          {historyList.map((item, index) => (
            <View className={`skin-record-item ${index === 0 ? 'skin-record-item--latest' : ''}`} key={item.date}>
              <View className='skin-record-item__head'>
                <Text className='skin-record-item__date'>{item.date}</Text>
                <View className='skin-record-item__badge'>{item.badge}</View>
              </View>
              <View className='skin-record-item__body'>
                <View className='skin-record-item__metric'>
                  <Text className='skin-record-item__metric-label'>主要问题</Text>
                  <Text className='skin-record-item__metric-value'>{item.health}</Text>
                </View>
                <View className='skin-record-item__metric'>
                  <Text className='skin-record-item__metric-label'>建议方向</Text>
                  <Text className='skin-record-item__metric-value'>{item.hydration}</Text>
                </View>
              </View>
              <View className='skin-record-item__link'>{item.link} ›</View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
