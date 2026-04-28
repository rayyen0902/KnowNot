export const mockUser = {
  name: 'Emily Chen',
  role: '护肤达人',
  memberLevel: 'Premium Member',
  avatarLabel: 'Z'
};

export const mockHomeConversation = {
  greeting:
    '您好，我是您的专属护肤助理，为了给您更合理的护肤建议，需要了解您一些基础的护肤情况，您只需要点选卡片式与您相符的选项，您是否愿意？',
  question: '非常感谢您的配合，目前的护肤频率是？',
  selectedFrequency: '只在晚上使用',
  reply: '因为工作比较忙，早上经常来不及洗脸。',
  followUpPhoto: '有一个更简单的办法，您可以发一张您的无滤镜素颜照片，我帮您分析分析',
  reportOffer: '根据您的反馈，现在可以为您生成一份护肤报告，您需要吗？',
  generating: '报告生成中，大约需要30～60秒',
  recommendation: '根据你的诊断，可以给我推荐一款护肤精华吗？',
  routineNotice: '检测到您已录入【玻尿酸精华】，已为您加入今晚的护肤日程。'
};

export const mockReport = {
  score: 78,
  issues: ['屏障受损', '泛红', '干燥'],
  recommendedIngredients: ['神经酰胺', '泛醇', '角鲨烷'],
  note:
    '当前阶段建议以修护和保湿为主，减少刺激性清洁和高浓度活性成分的叠加使用。',
  extraTips: ['减少摩擦', '优先补水', '避免强酸叠加']
};

export const mockProfileStats = {
  improvementRate: '+15% 改善',
  trends: ['一', '二', '三', '四', '五', '六', '今']
};

export const mockProducts = [
  {
    brand: 'DermaLab',
    title: '多重神经酰胺修护精华乳',
    desc: '专为敏弱肌设计，深层修护肌肤屏障，即刻舒缓泛红干痒，重建健康肌肤生态。',
    tags: ['强韧屏障', '深层保湿', '舒缓褪红'],
    match: 96,
    matchDesc: '极度契合当前状态'
  },
  {
    brand: 'AquaSkin',
    title: '玻尿酸深层补水精华液',
    desc: '多重分子玻尿酸，帮助提升肌肤含水量与弹润感。',
    tags: ['补水', '弹润', '轻薄'],
    match: 89,
    matchDesc: '适合日常保湿'
  }
];

export const mockProductDetail = {
  brand: 'DermaLab',
  verificationTag: '临床验证',
  title: '多重神经酰胺修护精华乳',
  desc: '专为敏弱肌设计，深层修护肌肤屏障，即刻舒缓泛红干痒，重建健康肌肤生态。',
  tags: ['强韧屏障', '深层保湿', '舒缓褪红'],
  match: 96,
  matchStatus: '极度契合当前状态',
  matchReason:
    '根据您最新的测肤报告（混合偏干、屏障受损期），该产品的核心成分矩阵能提供针对性修护。',
  points: [
    '急救舒缓：有效改善您近期的两颊泛红问题。',
    '精准保湿：补充细胞间脂质，解决 U 区干燥起皮。'
  ],
  ingredients: [
    {
      title: '复合神经酰胺 (1, 3, 6-II)',
      desc: '模拟健康皮脂膜结构，填补细胞间隙，强韧屏障。'
    },
    {
      title: '依克多因',
      desc: '细胞级防护盾，抵御外界刺激，长效锁水。'
    },
    {
      title: '积雪草提取物',
      desc: '温和植萃力量，即刻褪红，舒缓敏感不适。'
    }
  ],
  routines: [
    {
      step: '1',
      title: '温和清洁',
      desc: '使用氨基酸洁面后，保留肌肤微湿状态。'
    },
    {
      step: '2',
      title: '取量涂抹',
      desc: '取 2-3 泵精华乳于掌心，均匀点涂于面部及颈部。',
      accent: true
    },
    {
      step: '3',
      title: '按压吸收',
      desc: '双手搓热，轻柔按压面部帮助成分渗透吸收。'
    }
  ]
};

export const mockSettings = {
  cacheSize: '124 MB',
  appVersion: '知不Ai护肤 v2.4.1'
};

export const mockOrders = [
  { no: 'NO202604250001', status: '已支付' },
  { no: 'NO202604240002', status: '待发货' }
];

export const mockCalendar = {
  day: '今天',
  morning: '清洁 · 保湿 · 防晒',
  evening: '洁面 · 修护 · 封层'
};

export const mockMyProducts = [
  { name: '修护面霜', desc: '敏感偏干适用' },
  { name: '保湿精华', desc: '日常保湿' }
];

export const mockFavorites = [
  '护肤报告 · 敏感偏干修护方案',
  '产品 · 神经酰胺面霜'
];