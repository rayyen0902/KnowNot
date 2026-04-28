import { View, Text } from '@tarojs/components';
import './index.scss';

const products = [
  {
    brand: 'ESTEE LAUDER',
    name: '小棕瓶特润修护肌透精华霜 50ml',
    date: '2023.01.15',
    status: '仅剩 15天过期',
    statusType: 'danger'
  },
  {
    brand: 'LANCÔME',
    name: '菁纯臻颜焕亮雪肌面霜 60ml',
    date: '2023.08.01',
    status: '建议使用至 2024.08',
    statusType: 'safe'
  },
  {
    brand: 'LA ROCHE-POSAY',
    name: 'B5 多效修复面霜 40ml',
    date: '2023.09.15',
    status: '建议使用至 2024.03',
    statusType: 'safe'
  }
] as const;

export default function MyProductsPage() {
  return (
    <View className='my-products-page'>
      <View className='my-products-main'>
        <View className='summary-grid'>
          <View className='summary-card'>
            <Text className='summary-card__label'>在用产品</Text>
            <Text className='summary-card__value'>12</Text>
            <View className='summary-card__orb' />
          </View>
          <View className='summary-card summary-card--warn'>
            <Text className='summary-card__label summary-card__label--warn'>⚠ 临期提示</Text>
            <Text className='summary-card__value summary-card__value--warn'>2</Text>
            <View className='summary-card__orb summary-card__orb--warn' />
          </View>
        </View>

        <View className='category-head'>
          <Text className='category-head__title'>精华 & 面霜</Text>
          <Text className='category-head__count'>共 4 件</Text>
        </View>

        <View className='product-list'>
          {products.map((item, index) => (
            <View key={item.name} className={`product-card ${index === 0 ? 'product-card--danger' : ''}`}>
              <View className='product-card__thumb' />
              <View className='product-card__main'>
                <Text className='product-card__brand'>{item.brand}</Text>
                <Text className='product-card__name'>{item.name}</Text>
                <Text className='product-card__meta'>开日用: {item.date}</Text>
                <Text className={`product-card__status product-card__status--${item.statusType}`}>
                  {item.statusType === 'danger' ? '▲ ' : '◉ '}
                  {item.status}
                </Text>
              </View>
              <Text className='product-card__more'>•••</Text>
            </View>
          ))}
        </View>

        <View className='my-products-fab'>＋ 添加新产品</View>
      </View>
    </View>
  );
}