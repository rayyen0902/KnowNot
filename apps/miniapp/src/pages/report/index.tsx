import { useMemo, useState } from 'react';
import Taro, { useLoad } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { getReportDetail, getShopCards } from '@/services/api';
import type { ReportDetailResponse, RoutineStep, ShopCard } from '@/services/types';
import { getAnonymousId, getUserId } from '@/utils/session';
import './index.scss';

type PageParams = {
  report_id?: string;
};

export default function ReportPage() {
  const [reportId, setReportId] = useState('');
  const [report, setReport] = useState<ReportDetailResponse | null>(null);
  const [shopCards, setShopCards] = useState<ShopCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState('');

  useLoad((params: PageParams) => {
    const nextReportId = params?.report_id || '';
    setReportId(nextReportId);

    if (!nextReportId) {
      setReport(null);
      setErrorText('');
      return;
    }
    void loadReportDetail(nextReportId);
  });

  const loadReportDetail = async (id: string) => {
    try {
      setLoading(true);
      setErrorText('');
      const detail = await getReportDetail(id);
      setReport(detail);
      const cards = await getShopCards(id);
      setShopCards(cards);
      console.info('[v1-flow] report/detail success', { reportId: id, cardCount: cards.length });
    } catch (error) {
      setErrorText(error instanceof Error ? error.message : '加载报告失败');
      setReport(null);
      setShopCards([]);
    } finally {
      setLoading(false);
    }
  };

  const confidenceText = useMemo(() => {
    if (!report) return '--';
    return `${Math.round(report.confidence * 100)}%`;
  }, [report]);

  const renderRoutine = (title: string, list: RoutineStep[]) => (
    <View className='plan-wrap'>
      <Text className='plan-wrap__title'>{title}</Text>
      {list.map((item, index) => (
        <View key={`${title}-${item.title}-${index}`} className='plan-step'>
          <View className='plan-step__num'>{index + 1}</View>
          <View className='plan-step__main'>
            <Text className='plan-step__title'>{item.title}</Text>
            <Text className='plan-step__desc'>{item.desc}</Text>
            {item.tip ? <Text className='plan-step__tip'>{item.tip}</Text> : null}
          </View>
        </View>
      ))}
    </View>
  );

  const goBind = () => {
    const anonymousId = getAnonymousId();
    if (!anonymousId || !reportId) {
      Taro.showToast({ title: '缺少绑定参数', icon: 'none' });
      return;
    }
    Taro.navigateTo({
      url: `/pages/auth/index?scene=bind_report&anonymous_id=${encodeURIComponent(anonymousId)}&report_id=${encodeURIComponent(reportId)}`
    });
  };

  const openShopCard = async (card: ShopCard) => {
    if (!card.jump_url) {
      Taro.showToast({ title: '暂无跳转链接', icon: 'none' });
      return;
    }
    try {
      // 抖店链路优先使用外部 schema 跳转，支付由抖音小店托管
      await Taro.openSchema({
        schema: card.jump_url
      });
      console.info('[v1-flow] shop/jump success', { cardId: card.id, jumpUrl: card.jump_url });
    } catch {
      Taro.setClipboardData({ data: card.jump_url });
      Taro.showToast({ title: '跳转失败，链接已复制', icon: 'none' });
    }
  };

  if (!reportId) {
    return (
      <View className='report-page'>
        <View className='report-card'>
          <Text className='report-card__title'>请先生成报告</Text>
          <Text className='report-card__text'>完成首页采集后将自动生成并跳转到报告页。</Text>
        </View>
      </View>
    );
  }

  return (
    <View className='report-page'>
      {loading ? (
        <View className='report-card'>
          <Text className='report-card__title'>报告生成中</Text>
          <Text className='report-card__text'>正在加载报告详情，请稍候...</Text>
        </View>
      ) : null}
      {errorText ? (
        <View className='report-card'>
          <Text className='report-card__title'>加载失败</Text>
          <Text className='report-card__text'>{errorText}</Text>
        </View>
      ) : null}
      {!report ? null : (
        <>
      <View className='report-hero'>
        <View className='report-hero__orb' />
        <View className='report-hero__badge'>
          <Text className='report-hero__badge-icon'>☺</Text>
        </View>
        <Text className='report-hero__label'>肤质评估</Text>
        <Text className='report-hero__type'>{report.skin_type}</Text>
        <Text className='report-hero__desc'>分析置信度：{confidenceText}</Text>
      </View>

      <View className='report-card report-card--core'>
        <Text className='report-card__title'>核心分析</Text>
        {(report.main_issues || []).map((issue, index) => (
          <View key={`${issue}-${index}`} className='report-warning'>
            <Text className='report-warning__icon'>△</Text>
            <View className='report-warning__main'>
              <Text className='report-warning__title'>{issue}</Text>
            </View>
          </View>
        ))}
      </View>

      <View className='report-card'>
        <Text className='report-card__title'>成分建议</Text>
        <Text className='report-card__text'>推荐：{(report.recommended_ingredients || []).join(' / ') || '暂无'}</Text>
        <Text className='report-card__text'>避开：{(report.avoid_ingredients || []).join(' / ') || '暂无'}</Text>
      </View>

      <View className='report-card'>
        <Text className='report-card__title'>护理建议</Text>
        {renderRoutine('早间方案', report.morning_routine || [])}
        {renderRoutine('晚间方案', report.night_routine || [])}
      </View>

      <View className='report-card'>
        <Text className='report-card__title'>产品建议</Text>
        {(report.product_tips || []).map((tip, index) => (
          <Text key={`${tip}-${index}`} className='report-card__text'>{`${index + 1}. ${tip}`}</Text>
        ))}
      </View>

      <View className='report-card'>
        <Text className='report-card__title'>抖店推荐</Text>
        {shopCards.length === 0 ? (
          <Text className='report-card__text'>暂无推荐商品</Text>
        ) : (
          shopCards.map((card) => (
            <View key={card.id} className='shop-card' onClick={() => openShopCard(card)}>
              <View className='shop-card__main'>
                <Text className='shop-card__title'>{card.title}</Text>
                {card.subtitle ? <Text className='shop-card__subtitle'>{card.subtitle}</Text> : null}
              </View>
              <Text className='shop-card__cta'>去抖店</Text>
            </View>
          ))
        )}
      </View>

      <View className='report-footer'>
        {!getUserId() ? <Text className='report-footer__btn' onClick={goBind}>查看完整报告并绑定账号</Text> : null}
        <Text className='report-footer__desc'>*分析结果基于当前AI模型评估，仅供日常护肤参考，不作为医疗诊断依据。</Text>
      </View>
        </>
      )}
    </View>
  );
}