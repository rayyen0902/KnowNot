import { useEffect, useRef } from 'react';
import { getReportTaskStatus } from '@/services/api';
import type { ReportTaskState } from '@/services/types';
import {
  appendChatMessage,
  appendReportReadyCardMessage,
  getActiveReportTask,
  patchActiveReportTask,
  setActiveReportTask,
  setLastReportId,
  subscribeReportTask
} from '@/services/reportFlowState';

const POLL_MS = 2000;
const MAX_WAIT_MS = 60000;

function mapServerState(s: ReportTaskState): 'pending' | 'running' | 'done' | 'failed' {
  if (s === 'pending' || s === 'running' || s === 'done' || s === 'failed') return s;
  return 'pending';
}

export function useReportTaskPoller() {
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const waitIntroForTaskRef = useRef<string | null>(null);

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    const tick = async () => {
      const task = getActiveReportTask();
      if (!task || task.phase === 'done' || task.phase === 'failed') {
        clearTimer();
        return;
      }

      if (waitIntroForTaskRef.current !== task.taskId) {
        waitIntroForTaskRef.current = task.taskId;
        appendChatMessage({
          role: 'ai',
          text: '报告大约需要 30～60 秒，后台已在生成。你也可以继续和我聊聊日常护肤。'
        });
      }

      if (Date.now() - task.startedAt > MAX_WAIT_MS) {
        clearTimer();
        appendChatMessage({
          role: 'system',
          text: '分析时间稍长，任务已保留。可以稍后在底部「护肤报告」查看，或在聊天里留意新消息。'
        });
        setActiveReportTask(null);
        return;
      }

      try {
        const st = await getReportTaskStatus(task.taskId);
        const phase = mapServerState(st.state);
        patchActiveReportTask({ phase, reportId: st.report_id, errorHint: st.error_message });

        if (phase === 'done' && st.report_id) {
          clearTimer();
          appendReportReadyCardMessage(st.report_id);
          setLastReportId(st.report_id);
          setActiveReportTask(null);
          return;
        }

        if (phase === 'failed') {
          clearTimer();
          appendChatMessage({
            role: 'system',
            text: '生成排队稍久，系统会自动再试。你仍可继续聊天，稍后在「护肤报告」或问卷入口再发起也可以。'
          });
          setActiveReportTask(null);
        }
      } catch {
        /* 单次轮询失败不中断；超时由 MAX_WAIT_MS 统一柔和收尾 */
      }
    };

    const arm = () => {
      clearTimer();
      const task = getActiveReportTask();
      if (!task || (task.phase !== 'pending' && task.phase !== 'running')) {
        return;
      }
      void tick();
      timerRef.current = setInterval(() => {
        void tick();
      }, POLL_MS);
    };

    arm();
    const unsub = subscribeReportTask(arm);
    return () => {
      unsub();
      clearTimer();
    };
  }, []);
}
