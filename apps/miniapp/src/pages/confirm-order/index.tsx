import { View, Text } from '@tarojs/components';
import './index.scss';

const ADDRESS_LINES = '上海市徐汇区漕河泾新兴技术\n开发区田林路88号';

const NOTE_LINES =
  '您的专属配方已由AI皮肤分析模型确认，\n适合当前焕亮周期使用。预计发货时间：\n48小时内。';

export default function ConfirmOrderPage() {
  return (
    <View className='confirm-order-page'>
      <View className='confirm-order-main'>
        <View className='confirm-address-card'>
          <View className='confirm-address-card__pin-wrap'>
            <View className='confirm-address-card__pin' />
          </View>
          <View className='confirm-address-card__body'>
            <View className='confirm-address-card__line1'>
              <Text className='confirm-address-card__name'>林女士</Text>
              <Text className='confirm-address-card__phone'>138****5678</Text>
            </View>
            <Text className='confirm-address-card__addr'>{ADDRESS_LINES}</Text>
          </View>
          <View className='confirm-address-card__chevron' />
        </View>

        <View className='confirm-product-card'>
          <View className='confirm-product-card__shop'>
            <View className='confirm-product-card__shop-icon' />
            <Text className='confirm-product-card__shop-name'>
              Luminous Essence 官方旗舰店
            </Text>
          </View>

          <View className='confirm-product-card__row'>
            <View className='confirm-product-card__thumb' />
            <View className='confirm-product-card__meta'>
              <View className='confirm-product-card__meta-top'>
                <Text className='confirm-product-card__title'>知不AI特调精华</Text>
                <View className='confirm-product-card__tag'>
                  <Text className='confirm-product-card__tag-text'>30ml 焕亮版</Text>
                </View>
              </View>
              <View className='confirm-product-card__price-row'>
                <Text className='confirm-product-card__price'>¥ 680.00</Text>
                <Text className='confirm-product-card__qty'>x 1</Text>
              </View>
            </View>
          </View>
        </View>

        <View className='confirm-cost-card'>
          <View className='confirm-cost-row'>
            <Text className='confirm-cost-row__label'>商品总额</Text>
            <Text className='confirm-cost-row__value confirm-cost-row__value--strong'>
              ¥ 680.00
            </Text>
          </View>
          <View className='confirm-cost-row'>
            <Text className='confirm-cost-row__label'>运费</Text>
            <Text className='confirm-cost-row__value'>免运费</Text>
          </View>
          <View className='confirm-cost-row'>
            <View className='confirm-cost-row__discount'>
              <View className='confirm-cost-row__discount-icon' />
              <Text className='confirm-cost-row__discount-text'>AI护肤专属优惠</Text>
            </View>
            <Text className='confirm-cost-row__minus'>- ¥ 50.00</Text>
          </View>
          <View className='confirm-cost-row confirm-cost-row--total'>
            <Text className='confirm-cost-row__total-label'>订单小计</Text>
            <Text className='confirm-cost-row__total-price'>¥ 630.00</Text>
          </View>
        </View>

        <View className='confirm-note-card'>
          <View className='confirm-note-card__icon-wrap'>
            <View className='confirm-note-card__icon' />
          </View>
          <Text className='confirm-note-card__text'>{NOTE_LINES}</Text>
        </View>
      </View>

      <View className='confirm-submit-bar'>
        <View className='confirm-submit-bar__left'>
          <Text className='confirm-submit-bar__label'>实付款</Text>
          <Text className='confirm-submit-bar__value'>¥ 630.00</Text>
        </View>
        <View className='confirm-submit-bar__button'>
          <Text className='confirm-submit-bar__button-text'>提交订单</Text>
        </View>
      </View>
    </View>
  );
}
