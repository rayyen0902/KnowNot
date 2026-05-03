import Taro from '@tarojs/taro';

/** 本地报告主链路状态（对齐 interaction-spec §1；与 BE 契约见 integration-v1） */
export const REPORT_FLOW_KEYS = {
  activeTask: 'miniapp_report_flow_active_task',
  sessionId: 'miniapp_report_flow_session_id',
  lastReportId: 'miniapp_report_flow_last_report_id',
  chatMessages: 'miniapp_report_flow_chat_messages',
  accelerateSentAt: 'miniapp_report_flow_accelerate_sent_at',
  pendingAuthCancelSoftReminder: 'miniapp_report_flow_pending_auth_reminder',
  questionnaireDraft: 'miniapp_report_flow_questionnaire_draft',
  lastCreateProfile: 'miniapp_report_flow_last_create_profile'
} as const;

export type ReportTaskPhase = 'pending' | 'running' | 'done' | 'failed';

export type StoredReportTask = {
  taskId: string;
  phase: ReportTaskPhase;
  reportId?: string;
  startedAt: number;
  errorHint?: string;
};

type VoidFn = () => void;
const taskListeners = new Set<VoidFn>();
const chatListeners = new Set<VoidFn>();

function notifyTask() {
  taskListeners.forEach((fn) => fn());
}

function notifyChat() {
  chatListeners.forEach((fn) => fn());
}

export function subscribeReportTask(listener: VoidFn) {
  taskListeners.add(listener);
  return () => {
    taskListeners.delete(listener);
  };
}

export function subscribeChatMessages(listener: VoidFn) {
  chatListeners.add(listener);
  return () => {
    chatListeners.delete(listener);
  };
}

export function getActiveReportTask(): StoredReportTask | null {
  try {
    const raw = Taro.getStorageSync(REPORT_FLOW_KEYS.activeTask);
    if (!raw || typeof raw !== 'object') return null;
    return raw as StoredReportTask;
  } catch {
    return null;
  }
}

export function setActiveReportTask(task: StoredReportTask | null) {
  if (!task) {
    try {
      Taro.removeStorageSync(REPORT_FLOW_KEYS.activeTask);
    } catch {
      /* ignore */
    }
  } else {
    Taro.setStorageSync(REPORT_FLOW_KEYS.activeTask, task);
  }
  notifyTask();
}

/** 合并任务字段但不通知订阅者（避免轮询每 2s 打断 Tab/首页订阅） */
export function patchActiveReportTask(partial: Partial<StoredReportTask>) {
  const cur = getActiveReportTask();
  if (!cur) return;
  const next = { ...cur, ...partial };
  Taro.setStorageSync(REPORT_FLOW_KEYS.activeTask, next);
}

export function isReportTaskBlockingTab(): boolean {
  const t = getActiveReportTask();
  return Boolean(t && (t.phase === 'pending' || t.phase === 'running'));
}

export function setLastReportId(id: string) {
  if (!id) return;
  Taro.setStorageSync(REPORT_FLOW_KEYS.lastReportId, id);
}

export function getLastReportId(): string {
  try {
    const v = Taro.getStorageSync(REPORT_FLOW_KEYS.lastReportId);
    return typeof v === 'string' ? v : '';
  } catch {
    return '';
  }
}

export type ChatMessageRole = 'user' | 'ai' | 'system' | 'report_card';

export type ChatMessage = {
  id: string;
  role: ChatMessageRole;
  text?: string;
  reportId?: string;
  cardTitle?: string;
  createdAt: number;
};

export function getChatMessages(): ChatMessage[] {
  try {
    const raw = Taro.getStorageSync(REPORT_FLOW_KEYS.chatMessages);
    return Array.isArray(raw) ? (raw as ChatMessage[]) : [];
  } catch {
    return [];
  }
}

function persistChatMessages(messages: ChatMessage[]) {
  Taro.setStorageSync(REPORT_FLOW_KEYS.chatMessages, messages);
  notifyChat();
}

export function appendChatMessage(msg: Omit<ChatMessage, 'id' | 'createdAt'> & { id?: string }) {
  const list = getChatMessages();
  const id = msg.id || `m_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  const full: ChatMessage = {
    ...msg,
    id,
    createdAt: Date.now()
  };
  persistChatMessages([...list, full]);
}

/** 中性报告卡片（不透出 report/detail 实质字段，对齐定稿 #8） */
export function appendReportReadyCardMessage(reportId: string) {
  appendChatMessage({
    role: 'report_card',
    reportId,
    cardTitle: '护肤报告已就绪',
    text: '点卡片查看（登录后可看完整内容）'
  });
}

export function getAccelerateSentAt(): number {
  try {
    const v = Taro.getStorageSync(REPORT_FLOW_KEYS.accelerateSentAt);
    return typeof v === 'number' ? v : 0;
  } catch {
    return 0;
  }
}

export function setAccelerateSentAt(ts: number) {
  Taro.setStorageSync(REPORT_FLOW_KEYS.accelerateSentAt, ts);
}

export function shouldAppendAuthCancelSoftReminder(): boolean {
  try {
    return Boolean(Taro.getStorageSync(REPORT_FLOW_KEYS.pendingAuthCancelSoftReminder));
  } catch {
    return false;
  }
}

export function setPendingAuthCancelSoftReminder(on: boolean) {
  if (on) {
    Taro.setStorageSync(REPORT_FLOW_KEYS.pendingAuthCancelSoftReminder, 1);
  } else {
    try {
      Taro.removeStorageSync(REPORT_FLOW_KEYS.pendingAuthCancelSoftReminder);
    } catch {
      /* ignore */
    }
  }
}

export type QuestionnaireDraft = {
  current: number;
  answers: Record<string, string[]>;
  pickedSkinPhotos: string[];
  updatedAt: number;
};

export function getQuestionnaireDraft(): QuestionnaireDraft | null {
  try {
    const raw = Taro.getStorageSync(REPORT_FLOW_KEYS.questionnaireDraft);
    if (!raw || typeof raw !== 'object') return null;
    return raw as QuestionnaireDraft;
  } catch {
    return null;
  }
}

export function setQuestionnaireDraft(draft: QuestionnaireDraft | null) {
  if (!draft) {
    try {
      Taro.removeStorageSync(REPORT_FLOW_KEYS.questionnaireDraft);
    } catch {
      /* ignore */
    }
  } else {
    Taro.setStorageSync(REPORT_FLOW_KEYS.questionnaireDraft, draft);
  }
}

export function getLastCreateProfileJson(): string {
  try {
    const v = Taro.getStorageSync(REPORT_FLOW_KEYS.lastCreateProfile);
    return typeof v === 'string' ? v : '';
  } catch {
    return '';
  }
}

export function setLastCreateProfileJson(json: string) {
  if (!json) {
    try {
      Taro.removeStorageSync(REPORT_FLOW_KEYS.lastCreateProfile);
    } catch {
      /* ignore */
    }
  } else {
    Taro.setStorageSync(REPORT_FLOW_KEYS.lastCreateProfile, json);
  }
}
