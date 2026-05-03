import type { ReportTaskCreateRequest } from '@/services/types';

type Answers = Record<string, string[]>;

function first(a: string[] | undefined, fallback: string) {
  return a && a.length > 0 ? a[0]! : fallback;
}

/** 将问卷答案映射为后端 profile（Integration 可对字段表做精调） */
export function buildReportProfileFromAnswers(answers: Answers): ReportTaskCreateRequest['profile'] {
  const skinKey = first(answers.skinType, 'combo');
  const skinMap: Record<string, string> = {
    dry: 'dry',
    combo: 'combination',
    oily: 'oily',
    normal: 'normal'
  };
  const skin_type = skinMap[skinKey] || 'combination';

  const routineKey = first(answers.routine_pref, 'simple');
  const routine_steps =
    routineKey === 'detailed'
      ? ['cleanser', 'toner', 'serum', 'cream']
      : routineKey === 'clinic_vip'
        ? ['cleanser', 'serum', 'treatment']
        : ['cleanser', 'moisturizer'];

  const sens = first(answers.sensitivity, 'barrier');
  const allergy_preset =
    sens === 'allergy_known' ? ['known_allergy'] : sens === 'seasonal_red' ? ['fragrance'] : ['none'];

  return {
    skin_type,
    wash_time: 'morning_night',
    makeup_habit: 'light',
    routine_steps,
    allergy_input: '',
    allergy_preset
  };
}
