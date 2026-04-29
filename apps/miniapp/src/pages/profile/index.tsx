import { View, Text } from '@tarojs/components';
import { goTo } from '@/utils/router';
import { mockUser } from '@/data/mock';
import './index.scss';

export default function ProfilePage() {
  return (
    <View className='profile-page'>
      <View className='profile-main'>
        <View className='profile-hero'>
          <View className='profile-hero__avatar' />
          <View className='profile-hero__body'>
            <Text className='profile-hero__name'>{mockUser.name}</Text>
            <Text className='profile-hero__role'>{mockUser.role}</Text>
            <Text className='profile-hero__button'>编辑/完善资料</Text>
          </View>
        </View>

        <View className='profile-banner'>
          <View className='profile-banner__left'>
            <Text className='profile-banner__title'>我的护肤品</Text>
            <Text className='profile-banner__desc'>登记您的产品，AI为您智能排班，避免成分冲突。</Text>
            <Text className='profile-banner__button' onClick={() => goTo('/pages/my-products/index')}>
              立即录入
            </Text>
          </View>
          <Text className='profile-banner__icon'>❧</Text>
        </View>

        <View className='orders-card'>
          <View className='orders-card__head'>
            <Text className='orders-card__title'>我的订单</Text>
            <Text className='orders-card__more' onClick={() => goTo('/pages/orders/index')}>
              全部订单 ›
            </Text>
          </View>
          <View className='orders-actions'>
            <View className='orders-action'>
              <View className='orders-action__icon orders-action__icon--badge'>
                <Text>▣</Text>
                <Text className='orders-action__badge'>1</Text>
              </View>
              <Text className='orders-action__label'>待付款</Text>
            </View>
            <View className='orders-action'>
              <View className='orders-action__icon'>◫</View>
              <Text className='orders-action__label'>待收货</Text>
            </View>
            <View className='orders-action'>
              <View className='orders-action__icon'>◩</View>
              <Text className='orders-action__label'>待评价</Text>
            </View>
            <View className='orders-action'>
              <View className='orders-action__icon'>⟲</View>
              <Text className='orders-action__label'>退换/售后</Text>
            </View>
          </View>
        </View>

        <View className='trend-card'>
          <View className='trend-card__head'>
            <Text className='trend-card__title'>肤质变化曲线</Text>
            <Text className='trend-card__tag'>+15% 改善</Text>
          </View>
          <View className='trend-chart'>
            <View className='trend-chart__shape' />
            <View className='trend-chart__labels'>
              {['一', '二', '三', '四', '五', '六', '今'].map((item) => (
                <Text key={item} className={item === '今' ? 'is-today' : ''}>
                  {item}
                </Text>
              ))}
            </View>
          </View>
        </View>

        <View className='profile-list-card'>
          <View className='profile-list-row' onClick={() => goTo('/pages/favorites/index')}>
            <View className='profile-list-row__left'>
              <Text className='profile-list-row__dot profile-list-row__dot--pink'>♥</Text>
              <Text>我的收藏</Text>
            </View>
            <Text>›</Text>
          </View>
          <View className='profile-list-row' onClick={() => goTo('/pages/skin-record/index')}>
            <View className='profile-list-row__left'>
              <Text className='profile-list-row__dot profile-list-row__dot--teal'>☲</Text>
              <Text>肤质记录</Text>
            </View>
            <Text>›</Text>
          </View>
          <View className='profile-list-row' onClick={() => goTo('/pages/settings/index')}>
            <View className='profile-list-row__left'>
              <Text className='profile-list-row__dot profile-list-row__dot--gray'>⚙</Text>
              <Text>设置</Text>
            </View>
            <Text>›</Text>
          </View>
        </View>
      </View>
    </View>
  );
}