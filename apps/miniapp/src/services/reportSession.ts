import Taro from '@tarojs/taro';
import { initAnonymousUser, sessionStart } from '@/services/api';
import { getAnonymousId } from '@/utils/session';
import { REPORT_FLOW_KEYS } from '@/services/reportFlowState';

/** 问卷 / 再次生成前确保有 session_id（对齐 implementation-v1 §5.2） */
export async function ensureReportSessionId(): Promise<string> {
  const cached = Taro.getStorageSync(REPORT_FLOW_KEYS.sessionId);
  if (typeof cached === 'string' && cached.length > 0) {
    return cached;
  }
  await initAnonymousUser();
  const anonymousId = getAnonymousId();
  if (!anonymousId) {
    throw new Error('匿名身份未就绪，请稍后重试');
  }
  const { session_id } = await sessionStart({ anonymous_id: anonymousId });
  Taro.setStorageSync(REPORT_FLOW_KEYS.sessionId, session_id);
  return session_id;
}
