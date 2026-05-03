import { useMemo, useState } from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { createReportTask, initAnonymousUser } from '@/services/api';
import { setActiveReportTask, setLastCreateProfileJson, REPORT_FLOW_KEYS } from '@/services/reportFlowState';
import { ensureReportSessionId } from '@/services/reportSession';
import { goTo } from '@/utils/router';
import { buildReportProfileFromAnswers } from '@/utils/questionnaireToProfile';
import { openSystemSkinCameraPicker, pickSkinPhotosFromAlbum } from '@/utils/skinCamera';
import './index.scss';

type Option = {
  id: string;
  label: string;
  /** Secondary line (routine cards) */
  desc?: string;
};

type QuestionKind =
  | 'age_pills'
  | 'issues_grid'
  | 'skin_grid'
  | 'oil_rows'
  | 'sensitivity_rows'
  | 'budget_row'
  | 'factor_grid'
  | 'brand_rows'
  | 'routine_detail_cards';

type Question = {
  id: string;
  title: string;
  kind: QuestionKind;
  multi?: boolean;
  options: Option[];
};

const STEP_1: Question[] = [
  {
    id: 'age',
    title: '您的年龄范围是？',
    kind: 'age_pills',
    options: [
      { id: 'u18', label: '18岁以下' },
      { id: '18_24', label: '18-24岁' },
      { id: '25_30', label: '25-30岁' },
      { id: '31_40', label: '31-40岁' },
      { id: '40p', label: '40岁以上' }
    ]
  },
  {
    id: 'issues',
    title: '目前主要的肌肤困扰？',
    kind: 'issues_grid',
    multi: true,
    options: [
      { id: 'acne', label: '痘痘/粉刺' },
      { id: 'pores', label: '黑头/毛孔' },
      { id: 'dry', label: '干燥/脱皮' },
      { id: 'sensitive', label: '敏感/泛红' },
      { id: 'oil_heavy', label: '出油严重' },
      { id: 'dull', label: '暗沉/色斑' }
    ]
  }
];

const STEP_2: Question[] = [
  {
    id: 'skinType',
    title: '基础肤质属于？',
    kind: 'skin_grid',
    options: [
      { id: 'dry', label: '干性肌肤' },
      { id: 'combo', label: '混合性肌肤' },
      { id: 'oily', label: '油性肌肤' },
      { id: 'normal', label: '中性肌肤' }
    ]
  },
  {
    id: 'oil',
    title: '出油情况如何？',
    kind: 'oil_rows',
    options: [
      { id: 'all_oily', label: '全脸易泛油光' },
      { id: 't_zone', label: 'T区出油，U区偏干' },
      { id: 'tight_dry', label: '几乎不出油，常感紧绷' }
    ]
  },
  {
    id: 'sensitivity',
    title: '是否有敏感或过敏史？',
    kind: 'sensitivity_rows',
    options: [
      { id: 'barrier', label: '屏障健康，无明显敏感' },
      { id: 'seasonal_red', label: '换季易泛红' },
      { id: 'allergy_known', label: '明确成分过敏' }
    ]
  },
  {
    id: 'budget',
    title: '每月护肤花销金额？',
    kind: 'budget_row',
    options: [
      { id: '100_500', label: '¥100-500' },
      { id: '500_1000', label: '¥500-1000' },
      { id: '1000_2000', label: '¥1000-2000' },
      { id: '2000p', label: '¥2000+' }
    ]
  }
];

const STEP_3: Question[] = [
  {
    id: 'factor',
    title: '核心购买因素是什么？',
    kind: 'factor_grid',
    multi: true,
    options: [
      { id: 'ingredient', label: '成分功效' },
      { id: 'price', label: '价格适中' },
      { id: 'feel', label: '肤感体验' },
      { id: 'brand', label: '品牌知名度' }
    ]
  },
  {
    id: 'brand_pref',
    title: '偏好哪类护肤品牌？',
    kind: 'brand_rows',
    options: [
      { id: 'efficacy_clinic', label: '功效院线' },
      { id: 'luxury', label: '大牌奢华' },
      { id: 'natural_pure', label: '纯净天然' },
      { id: 'niche_minimal', label: '小众精简' }
    ]
  },
  {
    id: 'routine_pref',
    title: '您的日常护肤习惯是？',
    kind: 'routine_detail_cards',
    options: [
      {
        id: 'simple',
        label: '精简护肤',
        desc: '基础清洁与保湿为主，追求高效省时，不喜欢繁琐步骤。'
      },
      {
        id: 'detailed',
        label: '精细护理',
        desc: '多步骤叠加（水、精华、眼霜、面霜等），享受护肤的仪式感。'
      },
      {
        id: 'clinic_vip',
        label: '院线上宾',
        desc: '经常做医美，美容院专业护理。'
      }
    ]
  }
];

const STEPS = [
  {
    id: 'step1',
    num: '01',
    title: '基本信息',
    subtitle: '了解您的基础信息，定制专属方案。',
    questions: STEP_1
  },
  {
    id: 'step2',
    num: '02',
    title: '肤质自评',
    subtitle: '了解您的基础肤质状态，定制专属方案。',
    questions: STEP_2
  },
  {
    id: 'step3',
    num: '03',
    title: '产品偏好',
    subtitle: '了解您的日常护肤习惯，定制专属方案。',
    questions: STEP_3
  },
  {
    id: 'step4',
    num: '04',
    title: '肤质测评',
    subtitle: '为了精准皮肤分析，请上传一张清晰的素颜照。',
    questions: [] as Question[]
  }
] as const;

type Answers = Record<string, string[]>;

export default function QuestionnairePage() {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Answers>({
    age: ['25_30'],
    issues: ['acne', 'sensitive'],
    skinType: ['combo'],
    oil: ['t_zone'],
    sensitivity: ['barrier'],
    budget: ['500_1000'],
    factor: ['ingredient', 'feel'],
    brand_pref: ['efficacy_clinic'],
    routine_pref: ['simple']
  });

  const maxSkinPhotos = 3;
  const [captureSheetOpen, setCaptureSheetOpen] = useState(false);
  const [pickedSkinPhotos, setPickedSkinPhotos] = useState<string[]>([]);

  const openCaptureSheet = () => setCaptureSheetOpen(true);
  const closeCaptureSheet = () => setCaptureSheetOpen(false);

  const onSheetTakePhoto = async () => {
    closeCaptureSheet();
    if (pickedSkinPhotos.length >= maxSkinPhotos) {
      Taro.showToast({ title: `最多添加${maxSkinPhotos}张照片`, icon: 'none' });
      return;
    }
    const path = await openSystemSkinCameraPicker();
    if (!path) return;
    setPickedSkinPhotos((prev) => (prev.length >= maxSkinPhotos ? prev : [...prev, path]));
    Taro.showToast({ title: '已添加照片', icon: 'success' });
  };

  const onSheetPickAlbum = async () => {
    closeCaptureSheet();
    const remaining = maxSkinPhotos - pickedSkinPhotos.length;
    if (remaining <= 0) {
      Taro.showToast({ title: `最多添加${maxSkinPhotos}张照片`, icon: 'none' });
      return;
    }
    const paths = await pickSkinPhotosFromAlbum(remaining);
    if (paths.length === 0) return;
    setPickedSkinPhotos((prev) => [...prev, ...paths].slice(0, maxSkinPhotos));
    Taro.showToast({ title: `已选择 ${paths.length} 张照片`, icon: 'success' });
  };

  const step = STEPS[current];
  const percentage = useMemo(() => Math.round(((current + 1) / STEPS.length) * 100), [current]);

  const onToggle = (question: Question, optionId: string) => {
    setAnswers((prev) => {
      const oldValue = prev[question.id] ?? [];
      if (!question.multi) {
        return { ...prev, [question.id]: [optionId] };
      }
      const exists = oldValue.includes(optionId);
      return {
        ...prev,
        [question.id]: exists ? oldValue.filter((item) => item !== optionId) : [...oldValue, optionId]
      };
    });
  };

  const onPrev = () => {
    if (current === 0) {
      void Taro.navigateBack();
      return;
    }
    setCurrent((prev) => Math.max(0, prev - 1));
  };

  const onNext = () => setCurrent((prev) => Math.min(STEPS.length - 1, prev + 1));

  const onGenerateReport = async () => {
    if (pickedSkinPhotos.length === 0) {
      Taro.showToast({ title: '请先上传至少一张照片', icon: 'none' });
      return;
    }
    try {
      Taro.showLoading({ title: '提交中...', mask: true });
      await initAnonymousUser();
      const sessionId = await ensureReportSessionId();
      const profile = buildReportProfileFromAnswers(answers);
      setLastCreateProfileJson(JSON.stringify(profile));
      const { task_id } = await createReportTask({ session_id: sessionId, profile });
      setActiveReportTask({
        taskId: task_id,
        phase: 'pending',
        startedAt: Date.now()
      });
      try {
        Taro.removeStorageSync(REPORT_FLOW_KEYS.questionnaireDraft);
      } catch {
        /* ignore */
      }
      Taro.hideLoading();
      goTo('/pages/home/index');
    } catch (error) {
      Taro.hideLoading();
      Taro.showToast({
        title: error instanceof Error ? error.message : '提交失败，请稍后重试',
        icon: 'none'
      });
    }
  };

  const renderHeading = (question: Question, showMultiTag?: boolean) => (
    <View className='q-heading'>
      <Text className='q-heading__bullet'>•</Text>
      <View className='q-heading__title-wrap'>
        <Text className='q-heading__title'>{question.title}</Text>
      </View>
      {showMultiTag ? (
        <View className='q-multi-tag'>
          <Text className='q-multi-tag__text'>多选</Text>
        </View>
      ) : null}
    </View>
  );

  const renderQuestion = (question: Question) => {
    const sel = answers[question.id] ?? [];

    switch (question.kind) {
      case 'age_pills':
        return (
          <View key={question.id} className='q-card q-card--hero'>
            {renderHeading(question)}
            <View className='age-pills'>
              {question.options.map((option) => {
                const checked = sel.includes(option.id);
                return (
                  <View
                    key={option.id}
                    className={`age-pill${checked ? ' age-pill--active' : ''}`}
                    onClick={() => onToggle(question, option.id)}
                  >
                    <Text className={`age-pill__txt${checked ? ' age-pill__txt--active' : ''}`}>{option.label}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        );

      case 'issues_grid':
        return (
          <View key={question.id} className='q-card q-card--hero'>
            {renderHeading(question, true)}
            <View className='issues-grid'>
              {question.options.map((option) => {
                const checked = sel.includes(option.id);
                return (
                  <View
                    key={option.id}
                    className={`issue-cell${checked ? ' issue-cell--active' : ''}`}
                    onClick={() => onToggle(question, option.id)}
                  >
                    <Text className={`issue-cell__label${checked ? ' issue-cell__label--active' : ''}`}>{option.label}</Text>
                    <View className={`issue-cell__icon${checked ? ' issue-cell__icon--on' : ''}`}>{checked ? <Text className='issue-cell__tick'>✓</Text> : null}</View>
                  </View>
                );
              })}
            </View>
          </View>
        );

      case 'skin_grid':
        return (
          <View key={question.id} className='q-card q-card--compact'>
            {renderHeading(question)}
            <View className='skin-grid'>
              {question.options.map((option) => {
                const checked = sel.includes(option.id);
                return (
                  <View
                    key={option.id}
                    className={`skin-cell${checked ? ' skin-cell--active' : ''}`}
                    onClick={() => onToggle(question, option.id)}
                  >
                    <Text className={checked ? 'skin-cell__txt skin-cell__txt--active' : 'skin-cell__txt'}>{option.label}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        );

      case 'oil_rows':
        return (
          <View key={question.id} className='q-card q-card--compact'>
            {renderHeading(question)}
            <View className='oil-stack'>
              {question.options.map((option) => {
                const checked = sel.includes(option.id);
                return (
                  <View
                    key={option.id}
                    className={`oil-row${checked ? ' oil-row--active' : ''}`}
                    onClick={() => onToggle(question, option.id)}
                  >
                    <Text className={checked ? 'oil-row__label oil-row__label--active' : 'oil-row__label'}>{option.label}</Text>
                    <View className={`oil-row__check${checked ? ' oil-row__check--on' : ''}`}>
                      {checked ? <Text className='oil-row__tick'>✓</Text> : null}
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        );

      case 'sensitivity_rows':
        return (
          <View key={question.id} className='q-card q-card--compact'>
            {renderHeading(question)}
            <View className='sense-stack'>
              {question.options.map((option) => {
                const checked = sel.includes(option.id);
                const teal = option.id === 'barrier';
                return (
                  <View
                    key={option.id}
                    className={`sense-row${checked && teal ? ' sense-row--teal' : ''}${checked && !teal ? ' sense-row--pink' : ''}`}
                    onClick={() => onToggle(question, option.id)}
                  >
                    <Text
                      className={
                        checked && teal ? 'sense-row__label sense-row__label--teal' : checked ? 'sense-row__label sense-row__label--pink' : 'sense-row__label'
                      }
                    >
                      {option.label}
                    </Text>
                    {checked && teal ? (
                      <View className='sense-row__check-teal'>
                        <Text className='sense-row__tick-teal'>✓</Text>
                      </View>
                    ) : checked ? (
                      <View className='sense-row__check-pink'>
                        <Text className='sense-row__tick-pink'>✓</Text>
                      </View>
                    ) : null}
                  </View>
                );
              })}
            </View>
          </View>
        );

      case 'budget_row':
        return (
          <View key={question.id} className='q-card q-card--compact'>
            {renderHeading(question)}
            <View className='budget-row'>
              {question.options.map((option) => {
                const checked = sel.includes(option.id);
                return (
                  <View
                    key={option.id}
                    className={`budget-pill${checked ? ' budget-pill--active' : ''}`}
                    onClick={() => onToggle(question, option.id)}
                  >
                    <Text className={checked ? 'budget-pill__txt budget-pill__txt--active' : 'budget-pill__txt'}>{option.label}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        );

      case 'factor_grid':
        return (
          <View key={question.id} className='q-card q-card--compact'>
            {renderHeading(question)}
            <View className='factor-grid'>
              {question.options.map((option) => {
                const checked = sel.includes(option.id);
                return (
                  <View
                    key={option.id}
                    className={`factor-cell${checked ? ' factor-cell--active' : ''}`}
                    onClick={() => onToggle(question, option.id)}
                  >
                    <Text className={checked ? 'factor-cell__txt factor-cell__txt--active' : 'factor-cell__txt'}>{option.label}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        );

      case 'brand_rows':
        return (
          <View key={question.id} className='q-card q-card--compact'>
            {renderHeading(question)}
            <View className='brand-stack'>
              {question.options.map((option) => {
                const checked = sel.includes(option.id);
                return (
                  <View
                    key={option.id}
                    className={`brand-row${checked ? ' brand-row--active' : ''}`}
                    onClick={() => onToggle(question, option.id)}
                  >
                    <View className={`brand-row__icon${checked ? ' brand-row__icon--on' : ''}`}>
                      <Text className='brand-row__glyph'>{checked ? '✓' : '○'}</Text>
                    </View>
                    <Text className={checked ? 'brand-row__label brand-row__label--active' : 'brand-row__label'}>{option.label}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        );

      case 'routine_detail_cards':
        return (
          <View key={question.id} className='q-card q-card--compact'>
            {renderHeading(question)}
            <View className='routine-cards'>
              {question.options.map((option) => {
                const checked = sel.includes(option.id);
                return (
                  <View
                    key={option.id}
                    className={`routine-rich${checked ? ' routine-rich--active' : ''}`}
                    onClick={() => onToggle(question, option.id)}
                  >
                    <View className={`routine-rich__radio${checked ? ' routine-rich__radio--on' : ''}`}>{checked ? <Text className='routine-rich__tick'>✓</Text> : null}</View>
                    <View className='routine-rich__body'>
                      <Text className={checked ? 'routine-rich__title routine-rich__title--active' : 'routine-rich__title'}>{option.label}</Text>
                      <Text className={checked ? 'routine-rich__desc routine-rich__desc--active' : 'routine-rich__desc'}>{option.desc}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  const leftLabel = current === 0 ? '返回' : '上一步';
  const primaryLabel = current < 3 ? '下一步' : '生成报告';

  return (
    <View className='questionnaire-page'>
      <View className='questionnaire-main'>
        <View className='questionnaire-glow' />

        <View className='questionnaire-progress'>
          <View className='questionnaire-progress__head'>
            <Text className='questionnaire-progress__label'>
              步骤 {current + 1} / {STEPS.length}
            </Text>
            <Text className='questionnaire-progress__label'>{percentage}%</Text>
          </View>
          <View className='questionnaire-progress__track'>
            <View className='questionnaire-progress__fill' style={{ width: `${percentage}%` }} />
          </View>
        </View>

        <View className='questionnaire-head'>
          <Text className='questionnaire-head__num'>{step.num}</Text>
          <View className='questionnaire-head__text'>
            <Text className='questionnaire-head__title'>{step.title}</Text>
            <Text className='questionnaire-head__sub'>{step.subtitle}</Text>
          </View>
        </View>

        {current < 3 ? (
          <View className={`questionnaire-body questionnaire-body--step${current + 1}`}>{step.questions.map(renderQuestion)}</View>
        ) : (
          <View className='questionnaire-body questionnaire-body--step4'>
            <View className='step4-hero' onClick={openCaptureSheet}>
              <View className='step4-hero__circle'>
                <Text className='step4-hero__cam'>📷</Text>
              </View>
              <Text className='step4-hero__title'>点击拍摄或上传照片</Text>
              <Text className='step4-hero__sub'>支持 JPG, PNG 格式，最大 10MB</Text>
            </View>

            <View className='step4-tips'>
              <View className='step4-tips__head'>
                <View className='step4-tips__ico' />
                <Text className='step4-tips__title'>拍摄建议</Text>
              </View>
              <View className='step4-tips__row'>
                <View className='step4-tips__dot' />
                <Text className='step4-tips__txt'>自然光下拍摄，避免背光或强侧影。</Text>
              </View>
              <View className='step4-tips__row'>
                <View className='step4-tips__dot' />
                <Text className='step4-tips__txt'>保持素颜，摘除眼镜，露完整脸部。</Text>
              </View>
              <View className='step4-tips__row'>
                <View className='step4-tips__dot' />
                <Text className='step4-tips__txt'>镜头与视线平齐，距面部30-40厘米。</Text>
              </View>
            </View>

            <Text className='step4-privacy'>照片仅用于本次分析，结束后立即销毁，绝不保存。</Text>
          </View>
        )}
      </View>

      <View className='questionnaire-footer'>
        <View className='questionnaire-footer__actions'>
          <View className='questionnaire-btn questionnaire-btn--ghost' onClick={onPrev}>
            <Text className='questionnaire-btn__txt questionnaire-btn__txt--ghost'>{leftLabel}</Text>
          </View>
          {current < 3 ? (
            <View className='questionnaire-btn questionnaire-btn--primary' onClick={onNext}>
              <Text className='questionnaire-btn__txt questionnaire-btn__txt--primary'>{primaryLabel}</Text>
            </View>
          ) : (
            <View className='questionnaire-btn questionnaire-btn--primary' onClick={onGenerateReport}>
              <Text className='questionnaire-btn__txt questionnaire-btn__txt--primary'>{primaryLabel}</Text>
            </View>
          )}
        </View>
      </View>

      {captureSheetOpen ? (
        <View className='step4-sheet-mask' onClick={closeCaptureSheet}>
          <View className='step4-sheet' onClick={(e) => e.stopPropagation()}>
            <Text className='step4-sheet__title'>添加照片</Text>
            <Text className='step4-sheet__desc'>
              拍照将调起相机；相册单次可选 1～3 张（最多共 {maxSkinPhotos} 张）。
            </Text>
            <View className='step4-sheet__btn step4-sheet__btn--primary' onClick={onSheetTakePhoto}>
              <Text className='step4-sheet__btn-text'>拍照</Text>
            </View>
            <View className='step4-sheet__btn' onClick={onSheetPickAlbum}>
              <Text className='step4-sheet__btn-text'>从相册上传（1～3 张）</Text>
            </View>
            <View className='step4-sheet__cancel' onClick={closeCaptureSheet}>
              <Text className='step4-sheet__cancel-text'>取消</Text>
            </View>
          </View>
        </View>
      ) : null}
    </View>
  );
}
