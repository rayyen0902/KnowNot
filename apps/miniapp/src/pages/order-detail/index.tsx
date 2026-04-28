import { View, Text } from '@tarojs/components';
import './index.scss';

export default function OrderDetailPage() {
  return (
    <View className='order-detail-page'>
      <View className='order-detail-main'>
        <View className='status-card'>
          <View className='status-card__orb' />
          <View className='status-card__head'>
            <View className='status-card__truck'>◍</View>
            <View className='status-card__main'>
              <Text className='status-card__title'>已发货，运输中</Text>
              <Text className='status-card__desc'>最新：离开【上海中】，发往【苏州...</Text>
            </View>
          </View>
          <View className='status-card__bottom'>
            <Text className='status-card__eta'>预计 10月15日 送达</Text>
            <Text className='status-card__action'>查看物流详情 ›</Text>
          </View>
        </View>

        <View className='address-card'>
          <Text className='address-card__line1'>林清雅 138****5678</Text>
          <Text className='address-card__line2'>江苏省 苏州市 工业园区 金鸡湖大道88号 诚品居所 12栋 804室</Text>
        </View>

        <View className='product-card'>
          <Text className='product-card__title'>知不官方旗舰店</Text>

          <View className='product-item'>
            <View className='product-item__img' />
            <View className='product-item__main'>
              <Text className='product-item__name'>知不AI特调-抗糖焕亮精华液 针对暗沉肌</Text>
              <Text className='product-item__meta'>规格: 30ml 焕亮版</Text>
              <Text className='product-item__price'>¥ 399.00</Text>
            </View>
            <Text className='product-item__count'>x 1</Text>
          </View>

          <View className='product-item'>
            <View className='product-item__img' />
            <View className='product-item__main'>
              <Text className='product-item__name'>知不AI修护-舒缓保湿面霜</Text>
              <Text className='product-item__meta'>规格: 50g 基础修护</Text>
              <Text className='product-item__price'>¥ 280.00</Text>
            </View>
            <Text className='product-item__count'>x 1</Text>
          </View>

          <View className='product-card__footer'>
            <Text className='product-card__service'>联系客服</Text>
          </View>
        </View>

        <View className='amount-card'>
          <View className='amount-row'>
            <Text>商品总价</Text>
            <Text>¥ 679.00</Text>
          </View>
          <View className='amount-row'>
            <Text>运费</Text>
            <Text>¥ 0.00</Text>
          </View>
          <View className='amount-row amount-row--discount'>
            <Text>AI护肤专属优惠</Text>
            <Text>- ¥ 50.00</Text>
          </View>
          <View className='amount-row amount-row--pay'>
            <Text>实付款</Text>
            <Text>¥ 629.00</Text>
          </View>
        </View>

        <View className='info-card'>
          <Text className='info-card__title'>| 订单信息</Text>
          <View className='info-row'>
            <Text className='info-row__label'>订单编号</Text>
            <Text className='info-row__value'>ZB2023101288934 复制</Text>
          </View>
          <View className='info-row'>
            <Text className='info-row__label'>下单时间</Text>
            <Text className='info-row__value'>2023-10-12 14:30:22</Text>
          </View>
          <View className='info-row'>
            <Text className='info-row__label'>支付方式</Text>
            <Text className='info-row__value'>微信支付</Text>
          </View>
        </View>
      </View>

      <View className='order-detail-actions'>
        <Text className='order-detail-actions__btn order-detail-actions__btn--ghost'>申请售后</Text>
        <Text className='order-detail-actions__btn order-detail-actions__btn--primary'>查看物流</Text>
      </View>
    </View>
  );
}