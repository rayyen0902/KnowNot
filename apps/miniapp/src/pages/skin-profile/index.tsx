import { View, Text, Input } from '@tarojs/components';
import './index.scss';

export default function SkinProfilePage() {
  return (
    <View className='skin-scan-page'>
      <View className='skin-scan-main'>
        <View className='skin-scan-title'>智能识屏录入</View>
        <View className='skin-scan-subtitle'>对准产品包装或成分表，AI 助手将自动为您建立专业的临床级护肤档案。</View>

        <View className='skin-search'>
          <Text className='skin-search__icon'>⌕</Text>
          <Input className='skin-search__input' placeholder='搜索品牌、单品或核心成分…' />
          <View className='skin-search__button'>→</View>
        </View>

        <View className='scanner-card'>
          <View className='scanner-card__frame'>
            <View className='scanner-card__corner scanner-card__corner--tl' />
            <View className='scanner-card__corner scanner-card__corner--tr' />
            <View className='scanner-card__corner scanner-card__corner--bl' />
            <View className='scanner-card__corner scanner-card__corner--br' />
            <View className='scanner-card__scan-line' />
            <View className='scanner-card__center'>
              <View className='scanner-card__icon'>✎</View>
              <Text className='scanner-card__text'>将瓶身或成分表置于框内</Text>
            </View>
          </View>
        </View>

        <View className='trust-card'>
          <View className='trust-card__icon'>✓</View>
          <View className='trust-card__body'>
            <View className='trust-card__title'>精准构成临床解析</View>
            <View className='trust-card__desc'>已接入全球 50,000+ 院线与专利品牌数据库，确保成分比对的准确性与专业性。</View>
          </View>
        </View>

        <View className='manual-entry'>⌁ 找不到产品？尝试手动添加</View>
      </View>
    </View>
  );
}