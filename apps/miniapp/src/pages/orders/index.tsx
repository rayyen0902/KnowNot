import { View, Text } from '@tarojs/components';
import { goTo } from '@/utils/router';
import './index.scss';

export default function OrdersPage() {
  const tabs = ['全部', '待付款', '待发货', '已完成'];
  const orders = [
    {
      shop: 'Luminous 官方旗舰店',
      status: '待付款',
      statusTone: 'pending',
      name: '知不AI特调精华',
      spec: '规格：30ml 焕亮版',
      price: '¥ 299.00',
      qty: 'x 1',
      actions: [
        { label: '取消订单', tone: 'ghost' },
        { label: '立即付款', tone: 'primary' }
      ]
    },
    {
      shop: 'Luminous 官方旗舰店',
      status: '已完成',
      statusTone: 'done',
      name: '知不AI特调精华',
      spec: '规格：30ml 紧致版',
      price: '¥ 359.00',
      qty: 'x 2',
      actions: [
        { label: '查看物流', tone: 'ghost' },
        { label: '再次购买', tone: 'outline' }
      ]
    },
    {
      shop: 'Luminous 官方旗舰店',
      status: '待发货',
      statusTone: 'shipping',
      name: '知不AI特调精华',
      spec: '规格：15ml 体验装',
      price: '¥ 129.00',
      qty: 'x 1',
      actions: [{ label: '催发货', tone: 'ghost' }]
    }
  ];

  return (
    <View className='orders-page'>
      <View className='orders-main'>
        <View className='orders-filter-wrap'>
          <View className='orders-filter'>
            <View className='orders-filter__active' />
            {tabs.map((tab, index) => (
              <View className={`orders-filter__item ${index === 0 ? 'orders-filter__item--active' : ''}`} key={tab}>
                {tab}
              </View>
            ))}
          </View>
        </View>

        <View className='orders-list'>
          {orders.map((order) => (
            <View className='order-card' key={`${order.shop}-${order.spec}`} onClick={() => goTo('/pages/order-detail/index')}>
              <View className='order-card__head'>
                <View className='order-card__shop'>
                  <Text className='order-card__shop-icon'>◍</Text>
                  <Text>{order.shop}</Text>
                </View>
                <Text className={`order-card__status order-card__status--${order.statusTone}`}>{order.status}</Text>
              </View>

              <View className='order-card__body'>
                <View className='order-card__thumb' />
                <View className='order-card__meta'>
                  <View className='order-card__name'>{order.name}</View>
                  <View className='order-card__spec'>{order.spec}</View>
                  <View className='order-card__amount'>
                    <Text className='order-card__price'>{order.price}</Text>
                    <Text className='order-card__qty'>{order.qty}</Text>
                  </View>
                </View>
              </View>

              <View className='order-card__actions'>
                {order.actions.map((action) => (
                  <View
                    className={`order-card__btn order-card__btn--${action.tone}`}
                    key={action.label}
                    onClick={() => {
                      if (action.label === '立即付款') {
                        goTo('/pages/confirm-order/index');
                      }
                    }}
                  >
                    {action.label}
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}