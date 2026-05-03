import { useEffect, useRef, useState } from 'react';
import Taro, { useDidShow } from '@tarojs/taro';
import { ScrollView, Text, View } from '@tarojs/components';
import {
  appendChatMessage,
  getAccelerateSentAt,
  isReportTaskBlockingTab,
  setAccelerateSentAt,
  subscribeReportTask
} from '@/services/reportFlowState';
import { openReportTabEntry } from '@/utils/reportTabNavigation';
import { goTo } from '@/utils/router';
import './HomeFloatingTabs.scss';

type TabItem = {
  key: string;
  path: string;
  label: string;
  iconModifier: string;
};

/** 与 `pencil-首页.pen`「Mode Tabs: Scrollable」顺序、文案对齐 */
const TABS: TabItem[] = [
  { key: 'calendar', path: '/pages/calendar/index', label: '护肤日程', iconModifier: 'floating-tabs__icon--calendar' },
  { key: 'report', path: '/pages/report/index', label: '护肤报告', iconModifier: 'floating-tabs__icon--doc' },
  { key: 'profile', path: '/pages/profile/index', label: '个人中心', iconModifier: 'floating-tabs__icon--my' },
  { key: 'heart', path: '/pages/favorites/index', label: '知心模式', iconModifier: 'floating-tabs__icon--heart' },
  { key: 'consult', path: '/pages/home/index', label: '顾问模式', iconModifier: 'floating-tabs__icon--chat' },
  { key: 'expert', path: '/pages/questionnaire/index', label: '专家模式', iconModifier: 'floating-tabs__icon--expert' },
  { key: 'more', path: '', label: '其他', iconModifier: 'floating-tabs__icon--more' }
];

function normalizeRoute(route: string) {
  const trimmed = route.trim();
  if (!trimmed) return '';
  const withSlash = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return withSlash.replace(/\/+/g, '/');
}

function currentRoutePath() {
  const pages = Taro.getCurrentPages();
  const cur = pages[pages.length - 1] as { route?: string } | undefined;
  return normalizeRoute(cur?.route ?? '');
}

export default function HomeFloatingTabs() {
  const [activePath, setActivePath] = useState(currentRoutePath);
  const [reportTabBlocked, setReportTabBlocked] = useState(isReportTaskBlockingTab);
  const reportTapTsRef = useRef<number[]>([]);

  const refresh = () => setActivePath(currentRoutePath());

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    return subscribeReportTask(() => {
      setReportTabBlocked(isReportTaskBlockingTab());
    });
  }, []);

  useDidShow(() => {
    refresh();
    setReportTabBlocked(isReportTaskBlockingTab());
  });

  const tryReportStrongTouchFeedback = () => {
    const now = Date.now();
    reportTapTsRef.current = reportTapTsRef.current.filter((t) => now - t <= 1500);
    reportTapTsRef.current.push(now);
    if (reportTapTsRef.current.length < 3) return;
    reportTapTsRef.current = [];
    const last = getAccelerateSentAt();
    if (now - last < 8000) return;
    setAccelerateSentAt(now);
    appendChatMessage({ role: 'system', text: '报告加速生成中……' });
  };

  return (
    <ScrollView scrollX className='floating-tabs' showScrollbar={false}>
      <View className='floating-tabs__row'>
        {TABS.map((item) => {
          const normalized = normalizeRoute(item.path);
          const isActive = item.path !== '' && normalized === activePath;
          const reportLocked = item.key === 'report' && reportTabBlocked;
          return (
            <View
              key={item.key}
              className={`floating-tabs__item${isActive ? ' floating-tabs__item--active' : ''}${
                reportLocked ? ' floating-tabs__item--disabled' : ''
              }`}
              ariaRole='button'
              ariaDisabled={reportLocked ? true : undefined}
              ariaLabel={reportLocked ? `${item.label}，报告生成中暂不可点` : item.label}
              onClick={() => {
                if (item.key === 'more') {
                  Taro.showToast({ title: '敬请期待', icon: 'none' });
                  return;
                }
                if (!item.path) return;
                if (item.key === 'report' && reportTabBlocked) {
                  tryReportStrongTouchFeedback();
                  return;
                }
                if (item.key === 'report') {
                  openReportTabEntry();
                  return;
                }
                goTo(item.path);
              }}
            >
              <View className={`floating-tabs__icon ${item.iconModifier}`} />
              <Text className='floating-tabs__label'>{item.label}</Text>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}
