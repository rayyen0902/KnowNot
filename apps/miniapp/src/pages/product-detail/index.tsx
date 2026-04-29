import { useMemo, useState } from 'react';
import Taro, { useLoad } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { mockProductDetail, mockProducts } from '@/data/mock';
import { goTo } from '@/utils/router';
import './index.scss';

type MergedProduct = {
  brand: string;
  verificationTag: string;
  title: string;
  desc: string;
  tags: string[];
  match: number;
  matchStatus: string;
  matchReason: string;
  points: string[];
  ingredients: typeof mockProductDetail.ingredients;
  routines: typeof mockProductDetail.routines;
};

function mergeProduct(productId: string): MergedProduct {
  const list = mockProducts;
  if (list.length === 0) {
    return {
      brand: mockProductDetail.brand,
      verificationTag: mockProductDetail.verificationTag,
      title: mockProductDetail.title,
      desc: mockProductDetail.desc,
      tags: mockProductDetail.tags,
      match: mockProductDetail.match,
      matchStatus: mockProductDetail.matchStatus,
      matchReason: mockProductDetail.matchReason,
      points: mockProductDetail.points,
      ingredients: mockProductDetail.ingredients,
      routines: mockProductDetail.routines
    };
  }
  const n = Number.parseInt(productId, 10);
  const idx = Number.isFinite(n) ? Math.min(Math.max(n, 0), list.length - 1) : 0;
  const p = list[idx];
  return {
    brand: p.brand,
    verificationTag: mockProductDetail.verificationTag,
    title: p.title,
    desc: p.desc,
    tags: p.tags,
    match: p.match,
    matchStatus: p.matchDesc,
    matchReason: mockProductDetail.matchReason,
    points: mockProductDetail.points,
    ingredients: mockProductDetail.ingredients,
    routines: mockProductDetail.routines
  };
}

export default function ProductDetailPage() {
  const [productId, setProductId] = useState('0');

  useLoad((params: { product_id?: string }) => {
    setProductId(params?.product_id ?? '0');
  });

  const product = useMemo(() => mergeProduct(productId), [productId]);

  const onConsult = () => {
    Taro.showToast({
      title: '咨询入口暂未开放，已跳转订单页',
      icon: 'none'
    });
    goTo('/pages/orders/index');
  };

  const onAddList = () => {
    goTo('/pages/my-products/index');
  };

  const onLogistics = () => {
    goTo('/pages/orders/index');
  };

  return (
    <View className='product-detail-page'>
      <View className='detail-hero' />

      <View className='detail-content'>
        <View className='detail-card detail-card--header'>
          <View className='detail-brand-row'>
            <Text className='detail-badge'>{product.brand}</Text>
            <Text className='detail-badge detail-badge--secondary'>⌂ {product.verificationTag}</Text>
          </View>
          <Text className='detail-title'>{product.title}</Text>
          <Text className='detail-desc'>{product.desc}</Text>
          <View className='detail-tags'>
            {product.tags.map((tag) => (
              <Text key={tag} className='detail-tag'>
                {tag}
              </Text>
            ))}
          </View>
        </View>

        <View className='match-card'>
          <View className='match-card__head'>
            <View className='match-card__left'>
              <View className='match-card__icon'>✿</View>
              <Text className='match-card__title'>知不Ai 肤质匹配</Text>
            </View>
            <View className='match-score'>
              {product.match}
              <Text className='match-score__percent'>%</Text>
              <Text className='match-score__desc'>{product.matchStatus}</Text>
            </View>
          </View>
          <View className='match-card__body'>
            <Text className='match-card__body-text'>{product.matchReason}</Text>
            {product.points.map((point) => (
              <Text key={point} className='match-point'>
                {point}
              </Text>
            ))}
          </View>
        </View>

        <Text className='section-title'>核心成分图谱</Text>
        <View className='ingredient-grid'>
          {product.ingredients.map((ing, index) => (
            <View
              key={ing.title}
              className={index === 0 ? 'ingredient-card ingredient-card--big' : 'ingredient-card'}
            >
              {index === 0 ? (
                <>
                  <View className='ingredient-card__icon'>◌</View>
                  <View>
                    <Text className='ingredient-card__title'>{ing.title}</Text>
                    <Text className='ingredient-card__desc'>{ing.desc}</Text>
                  </View>
                </>
              ) : (
                <>
                  <Text className='ingredient-card__title ingredient-card__title--accent'>{ing.title}</Text>
                  <Text className='ingredient-card__desc'>{ing.desc}</Text>
                </>
              )}
            </View>
          ))}
        </View>

        <Text className='section-title'>定制护肤仪式</Text>
        <View className='routine-scroll'>
          {product.routines.map((step) => (
            <View
              key={step.step}
              className={step.accent ? 'routine-card routine-card--accent' : 'routine-card'}
            >
              <View className='routine-card__step'>{step.step}</View>
              <Text className='routine-card__title'>{step.title}</Text>
              <Text className='routine-card__desc'>{step.desc}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className='bottom-bar'>
        <View className='bottom-bar__primary' onClick={onConsult}>
          <Text className='bottom-bar__primary-icon'>◻</Text>
          <Text className='bottom-bar__primary-text'>立即咨询</Text>
        </View>
        <View className='bottom-bar__item' onClick={onAddList}>
          <Text className='bottom-bar__item-icon'>◎</Text>
          <Text>加入清单</Text>
        </View>
        <View className='bottom-bar__item' onClick={onLogistics}>
          <Text className='bottom-bar__item-icon'>◫</Text>
          <Text>物流追踪</Text>
        </View>
      </View>
    </View>
  );
}
