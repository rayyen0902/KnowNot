import { useMemo, useState } from 'react';
import Taro, { useDidShow, useLoad } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { getReportDetail, getShopCards } from '@/services/api';
import type { ReportDetailResponse, ShopCard } from '@/services/types';
import { getLastReportId } from '@/services/reportFlowState';
import { goTo } from '@/utils/router';
import { getAnonymousId, getUserId } from '@/utils/session';
import './index.scss';

type PageParams = {
  report_id?: string;
  entry?: string;
  reason?: string;
};

type ShellMode = 'login_gate' | 'no_report' | null;

type MetricItem = {
  key: string;
  label: string;
  value: number;
  icon: string;
  tone: 'blue' | 'orange' | 'green' | 'red';
};

type WarningItem = {
  title: string;
  desc: string;
  tip?: string;
  iconTone?: 'pink';
};

type DesignRoutineStep = {
  title: string;
  desc: string;
  tip: string;
};

type DesignRoutine = {
  title: string;
  icon: 'sun' | 'moon';
  steps: DesignRoutineStep[];
};

const DEFAULT_METRICS: MetricItem[] = [
  { key: 'hydration', label: '水分', value: 85, icon: '◌', tone: 'blue' },
  { key: 'oil', label: '油分', value: 40, icon: '◍', tone: 'orange' },
  { key: 'smoothness', label: '平滑度', value: 70, icon: '✧', tone: 'green' },
  { key: 'sensitivity', label: '敏感度', value: 20, icon: '◉', tone: 'red' }
];

const DEFAULT_WARNINGS: WarningItem[] = [
  {
    title: '屏障受损',
    desc: '面颊区域角质层较薄，易受外界刺激导致泛红，当前处于修护期。',
    tip: '成分建议：推荐使用氨基酸类温和洁面，严禁使用皂基洁面以免加重受损。'
  },
  {
    title: '轻微缺水',
    desc: '整体水分保持尚可，但U区有轻微干燥起皮现象，需注重深层保湿。',
    iconTone: 'pink'
  }
];

const DEFAULT_ROUTINES: DesignRoutine[] = [
  {
    title: '早间方案',
    icon: 'sun',
    steps: [
      {
        title: '温和清洁',
        desc: '使用氨基酸洁面乳，只洗T区即可。',
        tip: '手法：掌心揉搓起泡后，在T区轻柔打圈按摩15秒。'
      },
      {
        title: '补水保湿',
        desc: '使用含玻尿酸或B5的舒缓精华水。',
        tip: '手法：轻柔按压上脸，双手轻轻捂热促进吸收。'
      },
      {
        title: '硬核防晒',
        desc: '首选物理防晒霜，保护受损屏障。',
        tip: '手法：顺着同一方向轻柔平铺，切忌用力揉搓。'
      }
    ]
  },
  {
    title: '晚间方案',
    icon: 'moon',
    steps: [
      {
        title: '彻底卸洗',
        desc: '使用温和卸妆乳清除防晒及污垢。',
        tip: '手法：干手干脸轻轻打圈，温水充分乳化后冲净。'
      },
      {
        title: '密集修护',
        desc: '叠加使用神经酰胺修护面霜，厚涂U区。',
        tip: '手法：掌心温热乳化面霜，按压上脸，轻贴包裹面颊。'
      }
    ]
  }
];

const DEFAULT_PRODUCTS = [
  {
    tag: '修护精华',
    title: 'B5舒缓修护保湿精华液',
    subtitle: '高浓度维生素B5，深层滋润，强韧肌肤屏障，改善泛红。',
    tagTone: 'pink' as const
  },
  {
    tag: '温和洁面',
    title: '氨基酸净透洁面乳',
    subtitle: '弱酸性配方，绵密泡沫，洗后不紧绷，呵护脆弱肌肤。',
    tagTone: 'mint' as const
  }
];

export default function ReportPage() {
  const [reportId, setReportId] = useState('');
  const [shellMode, setShellMode] = useState<ShellMode>(null);
  const [report, setReport] = useState<ReportDetailResponse | null>(null);
  const [shopCards, setShopCards] = useState<ShopCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [userId, setUserId] = useState('');
  const isBound = Boolean(userId);

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

  useLoad((params: PageParams) => {
    const uid = getUserId();
    setUserId(uid);
    const entry = params?.entry || '';
    const ridFromQuery = params?.report_id || '';
    let nextReportId = ridFromQuery;
    if (!nextReportId && uid) {
      nextReportId = getLastReportId();
    }

    if (entry === 'shell' && !params?.report_id && !uid) {
      setShellMode('login_gate');
      setReportId('');
      setReport(null);
      setErrorText('');
      setLoading(false);
      return;
    }

    if (entry === 'shell' && uid && !ridFromQuery) {
      const last = getLastReportId();
      if (last) {
        setShellMode(null);
        setReportId(last);
        setReport(null);
        setErrorText('');
        void loadReportDetail(last);
        return;
      }
      setShellMode('no_report');
      setReportId('');
      setReport(null);
      setErrorText('');
      setLoading(false);
      return;
    }

    if (!entry && !params?.report_id) {
      if (!uid) {
        setShellMode('login_gate');
        setReportId('');
        setReport(null);
        setErrorText('');
        setLoading(false);
        return;
      }
      if (!nextReportId) {
        setShellMode('no_report');
        setReportId('');
        setReport(null);
        setErrorText('');
        setLoading(false);
        return;
      }
    }

    setShellMode(null);
    setReportId(nextReportId);
    setReport(null);
    setErrorText('');

    if (!nextReportId) {
      setLoading(false);
      return;
    }
    if (!uid) {
      setShopCards([]);
      setLoading(false);
      return;
    }
    void loadReportDetail(nextReportId);
  });

  useDidShow(() => {
    const latestUserId = getUserId();
    setUserId(latestUserId);
    if (shellMode) return;
    if (!reportId || !latestUserId || loading || report) return;
    void loadReportDetail(reportId);
  });

  const metricRows = useMemo(() => DEFAULT_METRICS, []);
  const coreWarnings = useMemo(() => {
    if ((report?.main_issues || []).length === 0) return DEFAULT_WARNINGS;
    return DEFAULT_WARNINGS.map((item, index) => ({
      ...item,
      title: report?.main_issues?.[index] || item.title
    }));
  }, [report?.main_issues]);
  const routineRows = useMemo(() => DEFAULT_ROUTINES, []);
  const productRows = useMemo(() => {
    if (shopCards.length === 0) return DEFAULT_PRODUCTS;
    return shopCards.slice(0, 2).map((card, index) => ({
      tag: DEFAULT_PRODUCTS[index]?.tag || '护肤推荐',
      title: card.title || DEFAULT_PRODUCTS[index]?.title || '',
      subtitle: card.subtitle || DEFAULT_PRODUCTS[index]?.subtitle || '',
      tagTone: DEFAULT_PRODUCTS[index]?.tagTone || 'pink'
    }));
  }, [shopCards]);

  const renderRoutine = (routine: DesignRoutine) => {
    const isMorning = routine.icon === 'sun';
    return (
      <View className='plan-wrap'>
        <View className={`plan-wrap__head ${isMorning ? 'plan-wrap__head--morning' : 'plan-wrap__head--night'}`}>
          <Text className='plan-wrap__head-icon'>{isMorning ? '☼' : '◔'}</Text>
          <Text className='plan-wrap__title'>{routine.title}</Text>
        </View>
      {routine.steps.map((item, index) => (
        <View key={`${routine.title}-${item.title}-${index}`} className='plan-step'>
          <View className='plan-step__num'>{index + 1}</View>
          <View className='plan-step__main'>
            <Text className='plan-step__title'>{item.title}</Text>
            <Text className='plan-step__desc'>{item.desc}</Text>
            <Text className='plan-step__tip'>{item.tip}</Text>
          </View>
        </View>
      ))}
      </View>
    );
  };

  const goBind = () => {
    const anonymousId = getAnonymousId();
    if (!anonymousId || !reportId) {
      Taro.showToast({ title: '缺少绑定参数', icon: 'none' });
      return;
    }
    goTo(`/pages/auth/index?scene=bind_report&anonymous_id=${encodeURIComponent(anonymousId)}&report_id=${encodeURIComponent(reportId)}`);
  };

  const goLoginFromShell = () => {
    goTo('/pages/auth/index?scene=report_shell');
  };

  const goQuestionnaire = () => {
    goTo('/pages/questionnaire/index');
  };

  const openShopCard = async (card: ShopCard) => {
    if (!card.jump_url) {
      Taro.showToast({ title: '暂无跳转链接', icon: 'none' });
      return;
    }
    try {
      await Taro.openSchema({ schema: card.jump_url });
      console.info('[v1-flow] shop/jump success', { cardId: card.id, jumpUrl: card.jump_url });
    } catch {
      Taro.setClipboardData({ data: card.jump_url });
      Taro.showToast({ title: '跳转失败，链接已复制', icon: 'none' });
    }
  };

  if (shellMode === 'login_gate') {
    return (
      <View className='report-page'>
        <View className='report-card'>
          <Text className='report-card__title'>请登录查看</Text>
          <Text className='report-card__text'>登录后可查看与你账号同步的护肤报告。当前页面不展示任何报告分析内容。</Text>
          <Text className='report-footer__btn' onClick={goLoginFromShell}>
            去登录
          </Text>
          <Text className='report-footer__desc'>*本服务提供日常护肤建议，不提供医疗诊断或治疗方案。</Text>
        </View>
      </View>
    );
  }

  if (shellMode === 'no_report') {
    return (
      <View className='report-page'>
        <View className='report-card'>
          <Text className='report-card__title'>暂无报告</Text>
          <Text className='report-card__text'>你还没有生成过护肤报告。完成问卷与拍照后，可在首页聊天里收到报告卡片。</Text>
          <Text className='report-footer__btn' onClick={goQuestionnaire}>
            去完成问卷
          </Text>
          <Text className='report-footer__desc'>*分析结果仅供日常护肤参考。</Text>
        </View>
      </View>
    );
  }

  if (!reportId) {
    return (
      <View className='report-page'>
        <View className='report-card'>
          <Text className='report-card__title'>请先生成报告</Text>
          <Text className='report-card__text'>完成问卷与拍照上传后，将自动生成报告并跳转到本页查看。</Text>
        </View>
      </View>
    );
  }

  if (!isBound) {
    return (
      <View className='report-page'>
        <View className='report-card'>
          <Text className='report-card__title'>绑定后可查看完整报告</Text>
          <Text className='report-card__text'>
            登录前不会展示分数、成分列表等报告实质内容。为保障数据安全，需先完成授权绑定后再查看详细分析与建议。
          </Text>
          <Text className='report-footer__btn' onClick={goBind}>立即绑定并查看</Text>
          <Text className='report-footer__desc'>*本服务提供日常护肤建议，不提供医疗诊断或治疗方案。</Text>
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
          <Text className='report-card__title'>暂时无法加载</Text>
          <Text className='report-card__text'>
            {errorText}。你可以稍后在首页聊天里点开报告卡片再试，不必着急。
          </Text>
        </View>
      ) : null}
      {!report ? null : (
        <View className='report-main'>
          <View className='report-hero'>
            <View className='report-hero__orb' />
            <View className='report-hero__badge'>
              <Text className='report-hero__badge-icon'>◔</Text>
            </View>
            <Text className='report-hero__label'>当前肤质</Text>
            <Text className='report-hero__type'>{report.skin_type || '混合性偏干'}</Text>
            <Text className='report-hero__desc'>T区易出油，U区较干燥，需要加强局部补水，维持水油平衡。</Text>
          </View>

          <View className='report-card'>
            <Text className='report-card__title'>皮肤多维指数</Text>
            {metricRows.map((item) => (
              <View key={item.key} className='metric-row'>
                <View className='metric-row__head'>
                  <View className='metric-row__label-wrap'>
                    <Text className={`metric-row__icon metric-row__icon--${item.tone}`}>{item.icon}</Text>
                    <Text className='metric-row__label'>{item.label}</Text>
                  </View>
                  <Text className='metric-row__value'>{item.value}</Text>
                </View>
                <View className='metric-row__track'>
                  <View className={`metric-row__fill metric-row__fill--${item.tone}`} style={{ width: `${item.value}%` }} />
                </View>
              </View>
            ))}
          </View>

          <View className='report-risk-core'>
            <Text className='report-risk-core__title'>风险预警</Text>
            {coreWarnings.map((item, index) => (
              <View key={`${item.title}-${index}`} className='report-warning'>
                <View className='report-warning__icon-wrap'>
                  <Text className='report-warning__icon'>△</Text>
                </View>
                <View className='report-warning__main'>
                  <Text className='report-warning__title'>{item.title}</Text>
                  <Text className='report-warning__desc'>{item.desc}</Text>
                  {item.tip ? <Text className='report-warning__tip'>{item.tip}</Text> : null}
                </View>
              </View>
            ))}
          </View>

          <View className='report-routine'>
            <Text className='report-routine__title'>定制护肤方案</Text>
            {routineRows.map((routine) => (
              <View key={routine.title}>
                {renderRoutine(routine)}
              </View>
            ))}
          </View>

          <View className='report-alert'>
            <View className='report-alert__icon-wrap'>
              <Text className='report-alert__icon'>△</Text>
            </View>
            <View className='report-alert__main'>
              <Text className='report-alert__title'>风险预警</Text>
              <Text className='report-alert__text'>
                尽可能按照建议科学护肤，禁止胡乱使用护肤品造成成分叠加或功效不对口导致皮肤屏障严重受损，甚至发生烂脸现象。
              </Text>
            </View>
          </View>

          <View className='report-recommend'>
            <Text className='report-recommend__title'>护肤助理推荐</Text>
            {productRows.map((item, index) => (
              <View
                key={`${item.title}-${index}`}
                className='shop-card'
                onClick={() => (shopCards[index] ? openShopCard(shopCards[index]) : undefined)}
              >
                <View className='shop-card__thumb' />
                <View className='shop-card__main'>
                  <View className={`shop-card__tag shop-card__tag--${item.tagTone}`}>
                    <Text>{item.tag}</Text>
                  </View>
                  <Text className='shop-card__title'>{item.title}</Text>
                  <Text className='shop-card__subtitle'>{item.subtitle}</Text>
                </View>
                <Text className='shop-card__chevron'>›</Text>
              </View>
            ))}
          </View>

          <View className='report-footer report-footer--recommend'>
            <Text className='report-footer__btn'>重新测试肤质</Text>
            <Text className='report-footer__desc'>*分析结果基于当前AI模型评估，仅供日常护肤参考，不作为医疗诊断依据。</Text>
          </View>
        </View>
      )}
    </View>
  );
}
