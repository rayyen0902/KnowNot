import { View } from '@tarojs/components';
import { goTo } from '@/utils/router';
import './index.scss';

export default function SettingsPage() {
  const accountRows = [
    { icon: '●', label: '个人信息', onClick: () => goTo('/pages/profile/index') },
    { icon: '■', label: '密码与安全' },
    { icon: '◆', label: '订阅与支付' }
  ];

  const notificationRows = [
    { title: '护肤提醒', desc: '每日早晚护肤步骤定时提醒', active: true },
    { title: '皮肤分析报告', desc: '每周AI皮肤状态变化推送', active: true },
    { title: '系统通知', desc: '应用更新与重要公告', active: false }
  ];

  const commonRows = [
    { icon: '◧', label: '清除缓存', value: '124 MB' },
    { icon: '◎', label: '关于我们', arrow: true },
    { icon: '⎋', label: '退出登录', danger: true }
  ];

  return (
    <View className='settings-page'>
      <View className='settings-main'>
        <View className='settings-hero' onClick={() => goTo('/pages/profile/index')}>
          <View className='settings-hero__glow' />
          <View className='settings-hero__avatar' />
          <View className='settings-hero__body'>
            <View className='settings-hero__name'>Emily Chen</View>
            <View className='settings-hero__desc'>Premium Member</View>
            <View className='settings-hero__button'>编辑个人资料</View>
          </View>
        </View>

        <View className='settings-section'>
          <View className='settings-section__title'>账号管理</View>
          <View className='settings-group'>
            {accountRows.map((item, index) => (
              <View
                className={`settings-row ${index !== accountRows.length - 1 ? 'settings-row--divider' : ''}`}
                key={item.label}
                onClick={item.onClick}
              >
                <View className='settings-row__left'>
                  <View className='settings-row__icon'>{item.icon}</View>
                  <View className='settings-row__label'>{item.label}</View>
                </View>
                <View className='settings-row__arrow'>›</View>
              </View>
            ))}
          </View>
        </View>

        <View className='settings-section'>
          <View className='settings-section__title'>通知设置</View>
          <View className='settings-group settings-group--pad'>
            {notificationRows.map((item, index) => (
              <View className={`notify-row ${index !== notificationRows.length - 1 ? 'notify-row--divider' : ''}`} key={item.title}>
                <View className='notify-row__body'>
                  <View className='notify-row__title'>{item.title}</View>
                  <View className='notify-row__desc'>{item.desc}</View>
                </View>
                <View className={`notify-switch ${item.active ? 'notify-switch--active' : ''}`}>
                  <View className='notify-switch__thumb' />
                </View>
              </View>
            ))}
          </View>
        </View>

        <View className='settings-section'>
          <View className='settings-section__title'>通用</View>
          <View className='settings-group'>
            {commonRows.map((item, index) => (
              <View className={`settings-row ${index !== commonRows.length - 1 ? 'settings-row--divider' : ''}`} key={item.label}>
                <View className='settings-row__left'>
                  <View className={`settings-row__icon ${item.danger ? 'settings-row__icon--danger' : ''}`}>{item.icon}</View>
                  <View className={`settings-row__label ${item.danger ? 'settings-row__label--danger' : ''}`}>{item.label}</View>
                </View>
                {item.value ? <View className='settings-row__value'>{item.value}</View> : null}
                {item.arrow ? <View className='settings-row__arrow'>›</View> : null}
              </View>
            ))}
          </View>
        </View>

        <View className='settings-footer'>
          <View className='settings-footer__version'>知不Ai护肤 v2.4.1</View>
          <View className='settings-footer__copy'>© 2023 Clinical Glow. All rights reserved.</View>
        </View>
      </View>
    </View>
  );
}