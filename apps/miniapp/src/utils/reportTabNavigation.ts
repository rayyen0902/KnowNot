import { getLastReportId } from '@/services/reportFlowState';
import { goTo } from '@/utils/router';
import { getUserId } from '@/utils/session';

/**
 * 底部「护肤报告」Tab 入口（对齐 interaction-spec §1-4 / 定稿 #2、#12）
 * TODO(Integration): last_report_id 可由 GET /api/v1/report/latest 等接口替代本地缓存
 */
export function openReportTabEntry() {
  const bound = Boolean(getUserId());
  if (!bound) {
    goTo('/pages/report/index?entry=shell');
    return;
  }
  const rid = getLastReportId();
  if (rid) {
    goTo(`/pages/report/index?report_id=${encodeURIComponent(rid)}`);
    return;
  }
  goTo('/pages/report/index?entry=shell');
}
