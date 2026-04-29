import { useState } from 'react';
import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';
import {
  AllergyCard,
  AssistantBubble,
  ChoiceCard,
  ProductRecommendCard,
  StatusNoticeCard,
  UploadPhotoCard,
  UserBubble
} from '@/features/home/components';
import { goTo } from '@/utils/router';
import { homeSchema } from './homeSchema';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
}

type HomeFlowProps = {
  liveMessages?: ChatMessage[];
  onSubmitReport?: (payload: HomeFormState) => void | Promise<void>;
};

export type HomeFormState = {
  skinType: string;
  washTime: string;
  makeupHabit: string;
  routineSteps: string[];
  allergyInput: string;
  allergyPreset: string[];
};

export default function HomeFlow({ liveMessages = [], onSubmitReport }: HomeFlowProps) {
  const [form, setForm] = useState<HomeFormState>({
    skinType: 'combination',
    washTime: 'morning_night',
    makeupHabit: 'light',
    routineSteps: ['cleanser', 'toner'],
    allergyInput: '',
    allergyPreset: ['none']
  });

  const setChoiceValue = (stateKey: 'skinType' | 'washTime' | 'makeupHabit', value: string) => {
    setForm((prev) => ({ ...prev, [stateKey]: value }));
  };

  const setRoutineSteps = (value: string[]) => {
    setForm((prev) => ({ ...prev, routineSteps: value }));
  };

  const toggleAllergyPreset = (value: string) => {
    setForm((prev) => {
      const exists = prev.allergyPreset.includes(value);
      return {
        ...prev,
        allergyPreset: exists ? prev.allergyPreset.filter((item) => item !== value) : [...prev.allergyPreset, value]
      };
    });
  };

  const submitAllergy = () => {
    Taro.showToast({
      title: '过敏信息已保存',
      icon: 'none'
    });
  };

  return (
    <View className='home-layout'>
      {homeSchema.map((block) => {
        if (block.type === 'assistant_bubble') {
          return (
            <AssistantBubble key={block.id} text={block.text} layout={block.layout} className={block.className} />
          );
        }

        if (block.type === 'user_bubble') {
          return <UserBubble key={block.id} text={block.text} layout={block.layout} className={block.className} />;
        }

        if (block.type === 'choice_card') {
          const currentValue = form[block.stateKey];
          return (
            <ChoiceCard
              key={block.id}
              title={block.title}
              hint={block.hint}
              multiple={block.multiple}
              layout={block.layout}
              options={block.options}
              value={currentValue}
              onChange={(nextValue) => {
                if (block.stateKey === 'routineSteps') {
                  setRoutineSteps(Array.isArray(nextValue) ? nextValue : [nextValue]);
                  return;
                }

                if (Array.isArray(nextValue)) return;
                setChoiceValue(block.stateKey, nextValue);
              }}
              confirmText={block.confirmText}
              onConfirm={block.action === 'toReport' ? () => onSubmitReport?.(form) : undefined}
            />
          );
        }

        if (block.type === 'allergy_card') {
          return (
            <AllergyCard
              key={block.id}
              title={block.title}
              layout={block.layout}
              presetOptions={block.presetOptions}
              selectedValues={form[block.selectedStateKey]}
              onPresetToggle={toggleAllergyPreset}
              inputValue={form[block.stateKey]}
              onInputChange={(value) => setForm((prev) => ({ ...prev, allergyInput: value }))}
              onSubmit={submitAllergy}
              submitText={block.submitText}
              placeholder={block.placeholder}
            />
          );
        }

        if (block.type === 'upload_card') {
          return (
            <UploadPhotoCard
              key={block.id}
              title={block.title}
              layout={block.layout}
              buttonText={block.buttonText}
              tips={block.tips}
              onUploadClick={() => {
                void Taro.navigateTo({ url: '/pages/camera-capture/index' });
              }}
            />
          );
        }

        if (block.type === 'product_card') {
          return (
            <ProductRecommendCard
              key={block.id}
              title={block.title}
              layout={block.layout}
              tag={block.tag}
              name={block.name}
              desc={block.desc}
              imageText={block.imageText}
              onClick={() => goTo('/pages/product-detail/index?product_id=0')}
            />
          );
        }

        return (
          <StatusNoticeCard key={block.id} text={block.text} layout={block.layout} type={block.noticeType ?? 'info'} />
        );
      })}

      {liveMessages.map((message) =>
        message.role === 'user' ? (
          <UserBubble key={message.id} text={message.text} layout='default' />
        ) : (
          <AssistantBubble key={message.id} text={message.text} layout='default' />
        )
      )}

      <View id='home-flow-bottom' />
    </View>
  );
}
