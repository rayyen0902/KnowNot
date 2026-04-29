import { View, Text, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { PageShell } from '@/components/PageShell';
import { goTo } from '@/utils/router';
import { mockFavoriteEntries } from '@/data/mock';
import './index.scss';

export default function FavoritesPage() {
  const onItemClick = (item: (typeof mockFavoriteEntries)[number]) => {
    if (item.kind === 'product' && item.productId !== undefined) {
      goTo(`/pages/product-detail/index?product_id=${encodeURIComponent(item.productId)}`);
      return;
    }
    if (item.kind === 'report' && item.reportId) {
      goTo(`/pages/report/index?report_id=${encodeURIComponent(item.reportId)}`);
      return;
    }
    Taro.showToast({ title: '请先在首页完成采集并生成报告', icon: 'none' });
    setTimeout(() => goTo('/pages/home/index'), 400);
  };

  return (
    <PageShell title='我的收藏' subtitle='收藏你喜欢的报告、产品和建议' headerExtra={<View className='favorites-shell-tag'>收藏中心</View>}>
      <View className='favorite-card'>
        {mockFavoriteEntries.length === 0 ? (
          <View className='favorite-card__empty'>
            <Text>暂无收藏</Text>
            <Text className='favorite-card__empty-hint'>在报告或商品页加入收藏后，将显示在这里。</Text>
          </View>
        ) : (
          mockFavoriteEntries.map((item) => (
            <Button key={item.id} className='favorite-card__item' onClick={() => onItemClick(item)}>
              <Text>{item.title}</Text>
            </Button>
          ))
        )}
      </View>
    </PageShell>
  );
}
