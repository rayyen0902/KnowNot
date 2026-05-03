/** PDWAk 内 Tab：left/width 来自 Pencil snapshot_layout（390 画布坐标） */
export const PENCIL_HOME_TABS = [
  { id: 'dlLTo', left: 0, width: 98, label: '护肤日程', sans: true, iw: 12, ih: 13.333333015441895 },
  { id: 'AToTH', left: 111, width: 98, label: '护肤报告', sans: false, iw: 12, ih: 12 },
  { id: 'TfASm', left: 222, width: 96.6666669845581, label: '个人中心', sans: false, iw: 10.666666984558105, ih: 10.666666984558105 },
  { id: 'zo6y8', left: 332, width: 100, label: '知心模式', sans: false, iw: 14, ih: 13.666666984558105 },
  { id: 'tiMJi', left: 456, width: 99.3333330154419, label: '顾问模式', sans: false, iw: 13.333333015441895, ih: 12 },
  { id: 'JMFUV', left: 568, width: 100.6666669845581, label: '专家模式', sans: false, iw: 14.666666984558105, ih: 14 },
  { id: 'RvL3M', left: 680, width: 70, label: '其他', sans: false, iw: 12, ih: 12 }
] as const;

export type PencilHomeTab = (typeof PENCIL_HOME_TABS)[number];

/** 末 Tab 右缘 = 750（与稿 PDWAk 可滚动宽度一致） */
export const PENCIL_HOME_TABS_TRACK_W = 750;
