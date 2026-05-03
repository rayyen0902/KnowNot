import { Text, View } from '@tarojs/components';
import { goTo } from '@/utils/router';
import { homeSchema } from './homeSchema';

/** 首页主内容：对齐 `pencil-首页.pen`「Main Content Area」轻量商品卡 + 系统通知行 */
export default function HomeFlow() {
  const product = homeSchema.find((b) => b.type === 'product_card');
  if (!product || product.type !== 'product_card') {
    return <View className='pencil-feed' />;
  }

  const lines = (product.imageText ?? 'PRODUCT').split('\n');

  return (
    <View className='pencil-feed'>
      <View className='pencil-feed__section'>
        <Text className='pencil-product__title'>{product.title}</Text>
        <View className='pencil-product__shell' onClick={() => goTo('/pages/product-detail/index?product_id=0')}>
          <View className='pencil-product__card'>
            <View className='pencil-product__row'>
              <View className='pencil-product__thumb'>
                {lines.map((line, i) => (
                  <Text key={`${i}-${line}`} className='pencil-product__thumb-line'>
                    {line}
                  </Text>
                ))}
              </View>
              <View className='pencil-product__meta'>
                {product.tag ? (
                  <View className='pencil-product__tag'>
                    <Text className='pencil-product__tag-text'>{product.tag}</Text>
                  </View>
                ) : null}
                <Text className='pencil-product__name'>{product.name}</Text>
                {product.desc ? <Text className='pencil-product__desc'>{product.desc}</Text> : null}
              </View>
            </View>
          </View>
        </View>
      </View>

      <Text className='pencil-feed__notice'>已成功保存您的肌肤档案档案</Text>
      <View id='home-flow-bottom' />
    </View>
  );
}
