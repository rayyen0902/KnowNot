import { useEffect, useState } from 'react';
import Taro, { useDidShow } from '@tarojs/taro';
import { ScrollView, Text, View } from '@tarojs/components';
import { goTo } from '@/utils/router';
import './HomeFloatingTabs.scss';

type TabItem = {
  key: string;
  path: string;
  label: string;
  iconModifier: string;
};

const TABS: TabItem[] = [
  { key: 'profile', path: '/pages/profile/index', label: '个人', iconModifier: 'floating-tabs__icon--my' },
  { key: 'report', path: '/pages/report/index', label: '报告', iconModifier: 'floating-tabs__icon--report' },
  { key: 'calendar', path: '/pages/calendar/index', label: '日程', iconModifier: 'floating-tabs__icon--calendar' },
  { key: 'heart', path: '', label: '知心', iconModifier: 'floating-tabs__icon--heart' },
  { key: 'expert', path: '', label: '专家', iconModifier: 'floating-tabs__icon--expert' }
];

function normalizeRoute(route: string): string {
  const trimmed = route.trim();
  if (!trimmed) return '';
  const withSlash = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return withSlash.replace(/\/+/g, '/');
}

function currentRoutePath(): string {
  const pages = Taro.getCurrentPages();
  const cur = pages[pages.length - 1] as { route?: string } | undefined;
  const route = cur?.route ?? '';
  return normalizeRoute(route);
}

export default function HomeFloatingTabs() {
  const [activePath, setActivePath] = useState(currentRoutePath);

  const refresh = () => setActivePath(currentRoutePath());

  useEffect(() => {
    refresh();
  }, []);

  useDidShow(() => {
    refresh();
  });

  return (
    <ScrollView scrollX className='floating-tabs' showScrollbar={false}>
      <View className='floating-tabs__row'>
        {TABS.map((item) => {
          const isActive = Boolean(item.path) && normalizeRoute(item.path) === activePath;
          return (
            <View
              key={item.key}
              className={`floating-tabs__item${isActive ? ' floating-tabs__item--active' : ''}`}
              onClick={() => {
                if (item.path) goTo(item.path);
              }}
            >
              <View className={`floating-tabs__icon ${item.iconModifier}`} />
              <Text>{item.label}</Text>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}
