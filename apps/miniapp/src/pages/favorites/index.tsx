import { View, Text, Button } from '@tarojs/components';
import { PageShell } from '@/components/PageShell';
import { goTo } from '@/utils/router';
import { mockFavorites } from '@/data/mock';
import './index.scss';

export default function FavoritesPage() {
  return (
    <PageShell title='我的收藏' subtitle='收藏你喜欢的报告、产品和建议' headerExtra={<View className='favorites-shell-tag'>收藏中心</View>}>
      <View className='favorite-card'>
        {mockFavorites.map((item) => (
          <Button key={item} className='favorite-card__item' onClick={() => goTo('/pages/report/index')}>
            <Text>{item}</Text>
          </Button>
        ))}
      </View>
    </PageShell>
  );
}