import Taro from '@tarojs/taro';
import {
  getAnonymousId,
  getToken,
  setAnonymousId,
  setToken,
  setUserId
} from '@/utils/session';
import type {
  ApiResponse,
  BindUserRequest,
  BindUserResponse,
  ChatMessageRequest,
  ChatMessageResponse,
  InitUserRequest,
  InitUserResponse,
  ReportDetailResponse,
  ReportTaskCreateRequest,
  ReportTaskCreateResponse,
  ReportTaskStatusResponse,
  SessionStartRequest,
  SessionStartResponse,
  ShopCard
} from './types';

const DEFAULT_ERROR_MESSAGE = '服务开小差，请稍后重试';
const runtimeEnv: Record<string, string | undefined> =
  typeof process !== 'undefined' && process.env ? process.env : {};
const API_BASE = runtimeEnv.TARO_APP_API_BASE_URL || '';
const USE_MOCK_API = runtimeEnv.TARO_APP_MOCK_API === '1' || !API_BASE;

const API_ERROR_MESSAGE_MAP: Record<string, Record<number, string>> = {
  '/api/v1/user/init': {
    40001: '初始化参数有误，请重试',
    40101: '登录状态已失效，请重新授权',
    50001: '初始化失败，请稍后重试'
  },
  '/api/v1/report/task/create': {
    40001: '采集信息不完整，请检查后重试',
    40901: '当前状态暂不可生成报告，请稍后重试',
    50001: '报告任务创建失败，请稍后重试',
    50201: '分析服务暂时不可用，请稍后重试'
  },
  '/api/v1/report/task/status': {
    40001: '任务参数有误，请重试',
    40401: '报告任务不存在，请重新发起',
    50001: '任务状态查询失败，请稍后重试'
  },
  '/api/v1/report/detail': {
    40001: '报告参数有误，请重试',
    40401: '报告不存在或已失效，请重新生成',
    50001: '报告加载失败，请稍后重试'
  },
  '/api/v1/user/bind': {
    40001: '绑定参数有误，请重试',
    40101: '抖音授权校验失败，请重新登录',
    40901: '该账号已绑定其他身份，请更换账号重试',
    50001: '账号绑定失败，请稍后重试'
  }
};

function normalizeApiPath(url: string) {
  const path = normalizePath(url);
  return path.split('?')[0];
}

function getMappedApiErrorMessage(url: string, code?: number) {
  if (typeof code !== 'number') return '';
  const path = normalizeApiPath(url);
  const table = API_ERROR_MESSAGE_MAP[path];
  if (!table) return '';
  return table[code] || '';
}

type MockTask = {
  /** 创建时刻，用于按时间模拟 pending→running→done（对齐 §1-8 轮询联调） */
  createdAtMs: number;
  shouldFail: boolean;
  reportId?: string;
};

const mockStore = {
  taskSeed: 0,
  reportSeed: 0,
  tasks: {} as Record<string, MockTask>,
  reports: {} as Record<string, ReportDetailResponse>,
  bindHistory: {} as Record<string, string>
};

function normalizePath(path: string) {
  return path.startsWith('/') ? path : `/${path}`;
}

async function request<T>(url: string, method: 'GET' | 'POST', data?: Record<string, unknown>): Promise<T> {
  if (USE_MOCK_API) {
    const mockResult = await mockRequest<T>(url, method, data);
    return mockResult;
  }

  const token = getToken();
  const requestUrl = `${API_BASE}${normalizePath(url)}`;
  const response = await Taro.request<ApiResponse<T>>({
    url: requestUrl,
    method,
    data,
    header: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  });

  const payload = response.data;
  if (response.statusCode < 200 || response.statusCode >= 300) {
    const message = getMappedApiErrorMessage(url, payload?.code) || payload?.message || DEFAULT_ERROR_MESSAGE;
    throw new Error(message);
  }

  if (!payload || typeof payload.code !== 'number') {
    throw new Error(DEFAULT_ERROR_MESSAGE);
  }

  if (payload.code !== 0) {
    if (payload.code === 401 || payload.code === 40101) {
      Taro.showToast({ title: '登录状态失效，请重新授权', icon: 'none' });
    }
    throw new Error(getMappedApiErrorMessage(url, payload.code) || payload.message || DEFAULT_ERROR_MESSAGE);
  }

  return payload.data;
}

function createMockReport(reportId: string): ReportDetailResponse {
  const report: ReportDetailResponse = {
    report_id: reportId,
    skin_type: '混合性偏干',
    main_issues: ['屏障受损', '轻微缺水'],
    recommended_ingredients: ['神经酰胺', '泛醇', '角鲨烷'],
    avoid_ingredients: ['高浓度酸类', '强清洁成分'],
    morning_routine: [
      { title: '温和清洁', desc: '氨基酸洁面，减少摩擦', tip: '起泡后轻柔打圈' },
      { title: '保湿修护', desc: '补水精华后涂抹面霜', tip: '分区按压吸收' }
    ],
    night_routine: [
      { title: '彻底卸洗', desc: '晚间卸洗防晒和彩妆' },
      { title: '屏障修护', desc: '加强修护霜厚涂干燥区域' }
    ],
    product_tips: ['优先温和修护线产品', '功效类成分逐步加量，避免叠加刺激'],
    confidence: 0.86
  };
  return report;
}

async function mockRequest<T>(url: string, method: 'GET' | 'POST', data?: Record<string, unknown>): Promise<T> {
  console.info('[mock-api] request', { method, url, data });

  if (url === '/api/v1/user/init' && method === 'POST') {
    const reusedAnonymousId = typeof data?.anonymous_id === 'string' ? data.anonymous_id : '';
    const anonymousId = reusedAnonymousId || `anon_${Date.now()}`;
    return {
      token: `mock_token_${Date.now()}`,
      anonymous_id: anonymousId
    } as T;
  }

  if (url === '/api/v1/session/start' && method === 'POST') {
    return { session_id: `sess_${Date.now()}` } as T;
  }

  if (url === '/api/v1/report/task/create' && method === 'POST') {
    mockStore.taskSeed += 1;
    const taskId = `task_${mockStore.taskSeed}`;
    const shouldFail = Array.isArray((data as ReportTaskCreateRequest | undefined)?.profile?.allergy_preset)
      && ((data as ReportTaskCreateRequest).profile.allergy_preset || []).includes('mock_fail');
    mockStore.tasks[taskId] = {
      createdAtMs: Date.now(),
      shouldFail
    };
    return { task_id: taskId } as T;
  }

  if (url.startsWith('/api/v1/report/task/status') && method === 'GET') {
    const taskId = new URLSearchParams(url.split('?')[1] || '').get('task_id') || '';
    const task = mockStore.tasks[taskId];
    if (!task) {
      throw new Error('任务不存在');
    }
    const elapsed = Date.now() - task.createdAtMs;
    let state: ReportTaskStatusResponse['state'] = 'pending';
    if (elapsed >= 2100) state = 'running';
    if (elapsed >= 4200) state = task.shouldFail ? 'failed' : 'done';

    if (state === 'done' && !task.reportId) {
      mockStore.reportSeed += 1;
      task.reportId = `rpt_${mockStore.reportSeed}`;
      mockStore.reports[task.reportId] = createMockReport(task.reportId);
    }

    return {
      task_id: taskId,
      state,
      report_id: task.reportId,
      error_message: state === 'failed' ? 'mock 任务失败（用于联调验收）' : ''
    } as T;
  }

  if (url.startsWith('/api/v1/report/detail') && method === 'GET') {
    const reportId = new URLSearchParams(url.split('?')[1] || '').get('report_id') || '';
    const saved = mockStore.reports[reportId];
    if (!saved) {
      throw new Error('报告不存在');
    }
    return saved as T;
  }

  if (url === '/api/v1/user/bind' && method === 'POST') {
    const anonymousId = (data?.anonymous_id as string) || '';
    const userId = `user_${Date.now()}`;
    if (anonymousId) {
      mockStore.bindHistory[anonymousId] = userId;
    }
    return {
      token: `mock_user_token_${Date.now()}`,
      user_id: userId
    } as T;
  }

  if (url.startsWith('/api/v1/shop/cards') && method === 'GET') {
    return [
      {
        id: 'shop_1',
        title: '屏障修护精华',
        subtitle: '抖店直营，适合敏感修护期',
        jump_url: 'snssdk1128://ec_goods_detail?product_id=mock123'
      }
    ] as T;
  }

  throw new Error(`mock 未实现接口: ${method} ${url}`);
}

export async function userInit(payload: InitUserRequest = {}) {
  return request<InitUserResponse>('/api/v1/user/init', 'POST', payload);
}

export async function initAnonymousUser() {
  const token = getToken();
  const anonymousId = getAnonymousId();
  if (token && anonymousId) {
    return { token, anonymous_id: anonymousId };
  }

  const result = await userInit(anonymousId ? { anonymous_id: anonymousId } : {});
  setToken(result.token);
  setAnonymousId(result.anonymous_id);
  return result;
}

export async function sessionStart(payload: SessionStartRequest) {
  return request<SessionStartResponse>('/api/v1/session/start', 'POST', payload);
}

export async function chatMessage(payload: ChatMessageRequest) {
  return request<ChatMessageResponse>('/api/v1/chat/message', 'POST', payload);
}

export async function createReportTask(payload: ReportTaskCreateRequest) {
  return request<ReportTaskCreateResponse>('/api/v1/report/task/create', 'POST', payload);
}

export async function getReportTaskStatus(taskId: string) {
  return request<ReportTaskStatusResponse>(`/api/v1/report/task/status?task_id=${taskId}`, 'GET');
}

export async function getReportDetail(reportId: string) {
  return request<ReportDetailResponse>(`/api/v1/report/detail?report_id=${reportId}`, 'GET');
}

export async function bindAnonymousUser(payload: BindUserRequest) {
  const result = await request<BindUserResponse>('/api/v1/user/bind', 'POST', payload);
  setToken(result.token);
  setUserId(result.user_id);
  return result;
}

export async function getShopCards(reportId: string) {
  return request<ShopCard[]>(`/api/v1/shop/cards?report_id=${reportId}`, 'GET');
}
