import { View, Text, ScrollView, Image, Button } from '@tarojs/components';
import { pencilToRpx, pencilToRpxValue } from '@/utils/fromPencil390';
import { goTo } from '@/utils/router';
import { PENCIL_HOME_TABS, PENCIL_HOME_TABS_TRACK_W } from './tabs';
import './index.scss';

import imgTabProfile from '@/assets/pencil-home/fQQ4L.png';
import imgTabReport from '@/assets/pencil-home/JZl4b.png';
import imgTabSchedule from '@/assets/pencil-home/tSD4E.png';
import imgTabHeart from '@/assets/pencil-home/K2oEM.png';
import imgTabAdvisor from '@/assets/pencil-home/gFHrb.png';
import imgTabExpert from '@/assets/pencil-home/q0JCB.png';
import imgTabMore from '@/assets/pencil-home/vG9Xx.png';
import imgCamera from '@/assets/pencil-home/OodZR.png';
import imgMic from '@/assets/pencil-home/xSOQB.png';
import imgSend from '@/assets/pencil-home/IKvjF.png';

const TAB_IMG: Record<(typeof PENCIL_HOME_TABS)[number]['id'], string> = {
  dlLTo: imgTabSchedule,
  AToTH: imgTabReport,
  TfASm: imgTabProfile,
  zo6y8: imgTabHeart,
  tiMJi: imgTabAdvisor,
  JMFUV: imgTabExpert,
  RvL3M: imgTabMore
};

export default function PencilHomePage() {
  return (
    <View className='pencil-home'>
      <ScrollView scrollY className='pencil-home__scroll'>
        <View className='pencil-home__feed'>
          <View className='pencil-home__dztfc'>
            <View className='pencil-home__gt2mt'>
              <View className='pencil-home__b2fplz'>
                <View className='pencil-home__b57emz'>
                  <Text className='pencil-home__reco-title'>
                    根据您的混合性肌肤，我推荐这款产品：
                  </Text>
                </View>
                <View className='pencil-home__bpeme'>
                  <View className='pencil-home__azk0h' />
                  <View className='pencil-home__kmejs'>
                    <View className='pencil-home__y24mb'>
                      <Text className='pencil-home__reco-tag-text'>保湿控油</Text>
                    </View>
                    <Text className='pencil-home__reco-name'>焕颜平衡精华液</Text>
                    <View className='pencil-home__b35i2'>
                      <Text className='pencil-home__reco-desc'>适合混合性肌肤日常护理</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>

          <View className='pencil-home__yeaul'>
            <View className='pencil-home__efwz4'>
              <Text className='pencil-home__notice'>已成功保存您的肌肤档案档案</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View className='pencil-home__n02xnb'>
        <ScrollView scrollX className='pencil-home__pdwak-scroll' enableFlex>
          <View
            className='pencil-home__pdwak-track'
            style={{
              width: pencilToRpx(PENCIL_HOME_TABS_TRACK_W),
              minWidth: pencilToRpx(PENCIL_HOME_TABS_TRACK_W),
              height: pencilToRpx(50)
            }}
          >
            {PENCIL_HOME_TABS.map((tab, i) => {
              const prev = PENCIL_HOME_TABS[i - 1];
              const marginLeft = i === 0 ? 0 : pencilToRpxValue(tab.left - prev.left - prev.width);
              return (
                <View
                  key={tab.id}
                  className='pencil-home__tab'
                  style={{
                    marginLeft: marginLeft ? `${marginLeft}rpx` : 0,
                    width: pencilToRpx(tab.width),
                    height: pencilToRpx(32)
                  }}
                >
                  <Image
                    className='pencil-home__tab-img'
                    src={TAB_IMG[tab.id]}
                    mode='aspectFit'
                    style={{ width: pencilToRpx(tab.iw), height: pencilToRpx(tab.ih) }}
                  />
                  <Text
                    className={`pencil-home__tab-label ${
                      tab.sans ? 'pencil-home__tab-label--sans' : 'pencil-home__tab-label--hei'
                    }`}
                  >
                    {tab.label}
                  </Text>
                </View>
              );
            })}
          </View>
        </ScrollView>

        <View className='pencil-home__eqmbw'>
          <View className='pencil-home__mu4oy'>
            <Image
              className='pencil-home__eq-icon'
              src={imgCamera}
              mode='aspectFit'
              style={{ width: pencilToRpx(20), height: pencilToRpx(18) }}
            />
          </View>
          <View className='pencil-home__rrajv'>
            <Image
              className='pencil-home__eq-icon'
              src={imgMic}
              mode='aspectFit'
              style={{ width: pencilToRpx(14), height: pencilToRpx(19) }}
            />
          </View>
          <View className='pencil-home__mxxib'>
            <View className='pencil-home__dxtbm'>
              <Text className='pencil-home__input-placeholder'>咨询你的私人护肤顾问...</Text>
            </View>
          </View>
          <View className='pencil-home__d0wqhs'>
            <Image
              className='pencil-home__send-img'
              src={imgSend}
              mode='aspectFit'
              style={{ width: pencilToRpx(14), height: pencilToRpx(14) }}
            />
          </View>
        </View>
      </View>

      <View className='pencil-home__fab-wrap'>
        <Button className='pencil-home__fab' size='mini' onClick={() => goTo('/pages/home/index')}>
          回应用首页
        </Button>
      </View>
    </View>
  );
}
