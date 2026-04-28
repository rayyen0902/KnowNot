import { View, Text } from '@tarojs/components';
import './index.scss';

export default function ConfirmOrderPage() {
  return (
    <View className='confirm-order-page'>
      <View className='confirm-order-main'>
        <View className='confirm-address-card'>
          <View className='confirm-address-card__icon'>◉</View>
          <View className='confirm-address-card__body'>
            <View className='confirm-address-card__name-row'>
              <Text className='confirm-address-card__name'>林女士</Text>
              <Text className='confirm-address-card__phone'>138****5678</Text>
            </View>
            <Text className='confirm-address-card__text'>上海市徐汇区漕河泾新兴技术开发区田林路88号</Text>
          </View>
          <Text className='confirm-address-card__arrow'>›</Text>
        </View>

        <View className='confirm-product-card'>
          <View className='confirm-product-card__shop'>
            <Text className='confirm-product-card__shop-icon'>◍</Text>
            <Text>Luminous Essence 官方旗舰店</Text>
          </View>

          <View className='confirm-product-card__content'>
            <View className='confirm-product-card__thumb' />
            <View className='confirm-product-card__meta'>
              <View className='confirm-product-card__name'>知不AI特调精华</View>
              <View className='confirm-product-card__tag'>30ml 焕亮版</View>
              <View className='confirm-product-card__amount'>
                <Text className='confirm-product-card__price'>¥ 680.00</Text>
                <Text className='confirm-product-card__qty'>x 1</Text>
              </View>
            </View>
          </View>
        </View>

        <View className='confirm-cost-card'>
          <View className='confirm-cost-row'>
            <Text>商品总额</Text>
            <Text className='confirm-cost-row__value'>¥ 680.00</Text>
          </View>
          <View className='confirm-cost-row'>
            <Text>运费</Text>
            <Text className='confirm-cost-row__value'>免运费</Text>
          </View>
          <View className='confirm-cost-row'>
            <View className='confirm-cost-row__discount'>
              <Text className='confirm-cost-row__discount-icon'>◌</Text>
              <Text>AI护肤专属优惠</Text>
            </View>
            <Text className='confirm-cost-row__minus'>- ¥ 50.00</Text>
          </View>
          <View className='confirm-cost-row confirm-cost-row--total'>
            <Text className='confirm-cost-row__total-label'>订单小计</Text>
            <Text className='confirm-cost-row__total-price'>¥ 630.00</Text>
          </View>
        </View>

        <View className='confirm-note-card'>
          <Text className='confirm-note-card__icon'>ⓘ</Text>
          <Text className='confirm-note-card__text'>
            您的专属配方已由AI皮肤分析模型确认，适合当前焕亮周期使用。预计发货时间：48小时内。
          </Text>
        </View>
      </View>

      <View className='confirm-submit-bar'>
        <View className='confirm-submit-bar__price'>
          <Text className='confirm-submit-bar__label'>实付款</Text>
          <Text className='confirm-submit-bar__value'>¥ 630.00</Text>
        </View>
        <View className='confirm-submit-bar__button'>提交订单</View>
      </View>
    </View>
  );
}
