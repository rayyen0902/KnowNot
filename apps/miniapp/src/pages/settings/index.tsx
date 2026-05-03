import { View, Text } from '@tarojs/components';
import { goTo } from '@/utils/router';
import './index.scss';

type AccountRow = {
  key: string;
  icon: 'person' | 'lock' | 'pay';
  label: string;
  onClick?: () => void;
};

type NotifyRow = {
  key: string;
  title: string;
  desc: string;
  active: boolean;
};

type CommonRow = {
  key: string;
  icon: 'cache' | 'about' | 'logout';
  label: string;
  value?: string;
  arrow?: boolean;
  danger?: boolean;
};

export default function SettingsPage() {
  const accountRows: AccountRow[] = [
    { key: 'profile', icon: 'person', label: '个人信息', onClick: () => goTo('/pages/profile/index') },
    { key: 'security', icon: 'lock', label: '密码与安全' },
    { key: 'pay', icon: 'pay', label: '订阅与支付' }
  ];

  const notificationRows: NotifyRow[] = [
    { key: 'remind', title: '护肤提醒', desc: '每日早晚护肤步骤定时提醒', active: true },
    { key: 'report', title: '皮肤分析报告', desc: '每周AI皮肤状态变化推送', active: true },
    { key: 'sys', title: '系统通知', desc: '应用更新与重要公告', active: false }
  ];

  const commonRows: CommonRow[] = [
    { key: 'cache', icon: 'cache', label: '清除缓存', value: '124 MB' },
    { key: 'about', icon: 'about', label: '关于我们', arrow: true },
    { key: 'logout', icon: 'logout', label: '退出登录', danger: true }
  ];

  return (
    <View className='settings-page'>
      <View className='settings-main'>
        <View className='settings-hero' onClick={() => goTo('/pages/profile/index')}>
          <View className='settings-hero__glow' />
          <View className='settings-hero__avatar' />
          <View className='settings-hero__body'>
            <Text className='settings-hero__name'>Emily Chen</Text>
            <View className='settings-hero__desc-wrap'>
              <Text className='settings-hero__desc'>Premium Member</Text>
            </View>
            <View className='settings-hero__button'>
              <Text className='settings-hero__button-text'>编辑个人资料</Text>
            </View>
          </View>
        </View>

        <View className='settings-section'>
          <View className='settings-section__title-wrap'>
            <Text className='settings-section__title'>账号管理</Text>
          </View>
          <View className='settings-group'>
            {accountRows.map((item, index) => (
              <View
                className={`settings-row ${index !== accountRows.length - 1 ? 'settings-row--divider' : ''}`}
                key={item.key}
                onClick={item.onClick}
              >
                <View className='settings-row__left'>
                  <View className={`settings-row__icon settings-row__icon--${item.icon}`} />
                  <Text className='settings-row__label'>{item.label}</Text>
                </View>
                <View className='settings-row__chevron' />
              </View>
            ))}
          </View>
        </View>

        <View className='settings-section'>
          <View className='settings-section__title-wrap'>
            <Text className='settings-section__title'>通知设置</Text>
          </View>
          <View className='settings-group settings-group--notify'>
            {notificationRows.map((item) => (
              <View className='notify-row' key={item.key}>
                <View className='notify-row__body'>
                  <Text className='notify-row__title'>{item.title}</Text>
                  <Text className='notify-row__desc'>{item.desc}</Text>
                </View>
                <View className={`notify-switch ${item.active ? 'notify-switch--active' : ''}`}>
                  <View className='notify-switch__thumb' />
                </View>
              </View>
            ))}
          </View>
        </View>

        <View className='settings-section'>
          <View className='settings-section__title-wrap'>
            <Text className='settings-section__title'>通用</Text>
          </View>
          <View className='settings-group'>
            {commonRows.map((item, index) => (
              <View
                className={`settings-row ${index !== commonRows.length - 1 ? 'settings-row--divider' : ''}`}
                key={item.key}
              >
                <View className='settings-row__left'>
                  <View
                    className={`settings-row__icon settings-row__icon--${item.icon} ${item.danger ? 'settings-row__icon--danger' : ''}`}
                  />
                  <Text className={`settings-row__label ${item.danger ? 'settings-row__label--danger' : ''}`}>
                    {item.label}
                  </Text>
                </View>
                {item.value ? <Text className='settings-row__value'>{item.value}</Text> : null}
                {item.arrow ? <View className='settings-row__chevron' /> : null}
              </View>
            ))}
          </View>
        </View>

        <View className='settings-footer'>
          <Text className='settings-footer__version'>知不Ai护肤 v2.4.1</Text>
          <Text className='settings-footer__copy'>© 2023 Clinical Glow. All rights reserved.</Text>
        </View>
      </View>
    </View>
  );
}
