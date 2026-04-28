import { View, Text } from '@tarojs/components';
import './index.scss';

type CalendarDay = {
  day: string;
  muted?: boolean;
  selected?: boolean;
  level?: -1 | 0 | 1 | 2 | 3 | 4 | 5;
};

type RoutineItem = {
  title: string;
  desc: string;
  done?: boolean;
};

const weekLabels = ['日', '一', '二', '三', '四', '五', '六'];

const days: CalendarDay[] = [
  { day: '1', level: 0 },
  { day: '2', level: 1 },
  { day: '3', level: 2 },
  { day: '4', level: 3 },
  { day: '5', level: 4 },
  { day: '6', level: 5 },
  { day: '7', level: 5 },
  { day: '8', level: 4 },
  { day: '9', level: 2 },
  { day: '10', level: 1 },
  { day: '11', level: 0 },
  { day: '12' },
  { day: '13', level: -1 },
  { day: '14', level: -1 },
  { day: '15', level: 0 },
  { day: '16', selected: true },
  { day: '17' },
  { day: '18' },
  { day: '19' },
  { day: '20' },
  { day: '21' },
  { day: '22' },
  { day: '23' },
  { day: '24' },
  { day: '25' },
  { day: '26' },
  { day: '27' },
  { day: '28' },
  { day: '29' },
  { day: '30' },
  { day: '31' },
  { day: '1', muted: true },
  { day: '2', muted: true },
  { day: '3', muted: true },
  { day: '4', muted: true }
];

const morningRoutine: RoutineItem[] = [
  { title: '温和洁面乳', desc: '清水轻柔起泡，按压洗净', done: true },
  { title: '维C亮肤精华', desc: '取3-4滴，掌心预热后按压上脸', done: true },
  { title: '轻盈防晒霜 SPF50', desc: '取一元硬币大小，均匀涂抹全脸及颈部' }
];

const nightRoutine: RoutineItem[] = [
  { title: '卸妆卸除膏', desc: '干手干脸按摩乳化，彻底冲洗' },
  { title: 'A醇抗皱精华', desc: '避开眼唇，豌豆大小薄涂' },
  { title: '神经酰胺修护面霜', desc: '锁住水分，厚涂于干燥区域' }
];

export default function CalendarPage() {
  return (
    <View className='calendar-page'>
      <View className='calendar-main'>
        <View className='calendar-panel'>
          <View className='calendar-panel__top'>
            <Text className='calendar-panel__month'>2023年 10月</Text>
            <Text className='calendar-panel__arrows'>‹ ›</Text>
          </View>

          <View className='calendar-week-labels'>
            {weekLabels.map((label) => (
              <Text key={label} className='calendar-week-label'>
                {label}
              </Text>
            ))}
          </View>

          <View className='calendar-grid'>
            {days.map((item, index) => {
              const level = item.level ?? -1;
              const levelClass = level >= 0 ? `calendar-day--level-${level}` : '';
              const mutedClass = item.muted ? 'calendar-day--muted' : '';
              const selectedClass = item.selected ? 'calendar-day--selected' : '';
              return (
                <View key={`${item.day}-${index}`} className={`calendar-day ${levelClass} ${mutedClass} ${selectedClass}`}>
                  <Text>{item.day}</Text>
                </View>
              );
            })}
          </View>

          <View className='calendar-legend'>
            <Text className='calendar-legend__label'>依从度：</Text>
            <View className='calendar-legend__swatches'>
              <View className='swatch swatch--0' />
              <View className='swatch swatch--1' />
              <View className='swatch swatch--3' />
              <View className='swatch swatch--5' />
            </View>
          </View>
        </View>

        <View className='routine-section'>
          <View className='routine-heading'>
            <Text className='routine-heading__icon'>✿</Text>
            <Text className='routine-heading__text'>今日流程</Text>
          </View>

          <View className='routine-card'>
            <Text className='routine-card__title routine-card__title--am'>晨间护理 (AM)</Text>
            {morningRoutine.map((item, idx) => (
              <View key={item.title} className={`routine-item ${idx !== morningRoutine.length - 1 ? 'routine-item--divider' : ''}`}>
                <View className={`checkbox ${item.done ? 'checkbox--checked' : ''}`}>{item.done ? '✓' : ''}</View>
                <View className='routine-item__main'>
                  <Text className='routine-item__title'>{item.title}</Text>
                  <Text className='routine-item__desc'>{item.desc}</Text>
                </View>
              </View>
            ))}
          </View>

          <View className='routine-card'>
            <Text className='routine-card__title routine-card__title--pm'>夜间护理 (PM)</Text>
            {nightRoutine.map((item, idx) => (
              <View key={item.title} className={`routine-item ${idx !== nightRoutine.length - 1 ? 'routine-item--divider' : ''}`}>
                <View className={`checkbox ${item.done ? 'checkbox--checked' : ''}`}>{item.done ? '✓' : ''}</View>
                <View className='routine-item__main'>
                  <Text className='routine-item__title'>{item.title}</Text>
                  <Text className='routine-item__desc'>{item.desc}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View className='advice-section'>
          <Text className='advice-section__title'>日常健康建议</Text>

          <View className='advice-item'>
            <Text className='advice-item__icon'>🧃</Text>
            <View className='advice-item__main'>
              <Text className='advice-item__heading'>多喝水</Text>
              <Text className='advice-item__text'>建议今日饮水量达到2000ml，有助于促进新陈代谢，保持肌肤水润透亮。</Text>
            </View>
          </View>

          <View className='advice-item'>
            <Text className='advice-item__icon'>☾</Text>
            <View className='advice-item__main'>
              <Text className='advice-item__heading'>优质睡眠</Text>
              <Text className='advice-item__text'>晚上11点前入睡，保证7-8小时高质量睡眠，让肌肤在夜间得到充分修护。</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}