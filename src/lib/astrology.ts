/**
 * Western Astrology Data and Calculations
 * 西方占星数据与计算
 */

export type ZodiacSign = {
  id: string
  name: string
  chineseName: string
  symbol: string
  element: '火' | '土' | '风' | '水'
  quality: '开创' | '固定' | '变动'
  rulingPlanet: string
  dateRange: [number, number, number, number] // [startMonth, startDay, endMonth, endDay]
  traits: string[]
  personality: string
  compatible: string[]
  incompatible: string[]
  luckyNumbers: number[]
  luckyColors: string[]
  dailyHoroscopes: Record<string, string> // day of week -> horoscope
}

export type AstrologyChart = {
  sunSign: ZodiacSign
  moonSign: ZodiacSign | null
  risingSign: ZodiacSign | null
  risingSignRange: string | null
  birthDate: Date
  birthTime: string | null
  birthLocation: string | null
}

// Element colors for styling
export const ELEMENT_COLORS: Record<string, { bg: string; text: string; gradient: string }> = {
  '火': { bg: 'bg-red-100', text: 'text-red-700', gradient: 'from-red-50 to-orange-50' },
  '土': { bg: 'bg-amber-100', text: 'text-amber-700', gradient: 'from-amber-50 to-yellow-50' },
  '风': { bg: 'bg-cyan-100', text: 'text-cyan-700', gradient: 'from-cyan-50 to-sky-50' },
  '水': { bg: 'bg-blue-100', text: 'text-blue-700', gradient: 'from-blue-50 to-indigo-50' },
}

// Element compatibility
export const ELEMENT_COMPATIBILITY: Record<string, string> = {
  '火': '火生木，木生火；土泄火，火耗土',
  '土': '土生金，金生土；火生土，土泄火',
  '风': '风生火，火生风；风泄气，气耗风',
  '水': '水生木，木生水；金生水，水泄金',
}

// All 12 Zodiac Signs Data
export const ZODIAC_SIGNS: ZodiacSign[] = [
  {
    id: 'aries',
    name: 'Aries',
    chineseName: '白羊',
    symbol: '\u2648',
    element: '火',
    quality: '开创',
    rulingPlanet: '火星',
    dateRange: [3, 21, 4, 19],
    traits: ['勇敢', '冲动', '领导力', '竞争意识'],
    personality: '白羊座是十二星座中的第一个，代表着新生和开始。他们充满活力和热情，喜欢冒险和挑战。白羊座的人直率诚实，面对困难从不退缩，总是第一个冲上前线。',
    compatible: ['狮子', '射手', '双子', '天秤'],
    incompatible: ['巨蟹', '摩羯', '金牛'],
    luckyNumbers: [1, 9, 18, 28],
    luckyColors: ['红色', '鲜橙色', '金黄色'],
    dailyHoroscopes: {
      'Monday': '今天适合开展新项目，您的领导能力会得到充分发挥。',
      'Tuesday': '能量充沛，但注意控制冲动情绪，三思而后行。',
      'Wednesday': '思维清晰，适合处理复杂问题，与人合作顺利。',
      'Thursday': '运气不错，可能遇到意外惊喜或机会。',
      'Friday': '人际关系运佳，适合社交和团队活动。',
      'Saturday': '适合休息和反思，为下周做准备。',
      'Sunday': '放松心情，享受家庭时光。',
    },
  },
  {
    id: 'taurus',
    name: 'Taurus',
    chineseName: '金牛',
    symbol: '\u2649',
    element: '土',
    quality: '固定',
    rulingPlanet: '金星',
    dateRange: [4, 20, 5, 20],
    traits: ['稳定', '务实', '忠诚', '艺术感'],
    personality: '金牛座以稳重和务实著称，他们追求安全感和舒适的生活。金牛座的人有很强的艺术品味和审美能力，同时也很固执，一旦决定就很难改变。',
    compatible: ['处女', '摩羯', '巨蟹', '双鱼'],
    incompatible: ['狮子', '天蝎', '水瓶'],
    luckyNumbers: [2, 6, 15, 24],
    luckyColors: ['绿色', '粉色', '淡蓝色'],
    dailyHoroscopes: {
      'Monday': '今天适合处理财务事务，投资理财有望获得收益。',
      'Tuesday': '工作稳定，但需要耐心等待机会。',
      'Wednesday': '艺术灵感迸发，适合创作或欣赏艺术。',
      'Thursday': '与他人合作愉快，可能结识新朋友。',
      'Friday': '财运不错，可以考虑小额投资。',
      'Saturday': '享受美食和放松时光，与朋友聚会。',
      'Sunday': '适合亲近自然，感受宁静。',
    },
  },
  {
    id: 'gemini',
    name: 'Gemini',
    chineseName: '双子',
    symbol: '\u264A',
    element: '风',
    quality: '变动',
    rulingPlanet: '水星',
    dateRange: [5, 21, 6, 20],
    traits: ['聪明', '好奇', '多才多艺', '善变'],
    personality: '双子座的人聪明机智，好奇心强，喜欢学习和交流。他们思维敏捷，善于表达，但有时可能显得不够专注或善变。',
    compatible: ['天秤', '水瓶', '白羊', '狮子'],
    incompatible: ['处女', '双鱼', '金牛'],
    luckyNumbers: [3, 5, 12, 21],
    luckyColors: ['黄色', '浅绿色', '银色'],
    dailyHoroscopes: {
      'Monday': '思维活跃，适合学习和沟通，发表观点。',
      'Tuesday': '可能出现分歧，保持开放心态倾听他人。',
      'Wednesday': '创意丰富，适合写作或演讲。',
      'Thursday': '旅行或短途出行可能带来好运。',
      'Friday': '社交活跃，容易结识新朋友。',
      'Saturday': '适合多样化的活动，保持灵活性。',
      'Sunday': '需要独处时间整理思绪。',
    },
  },
  {
    id: 'cancer',
    name: 'Cancer',
    chineseName: '巨蟹',
    symbol: '\u264B',
    element: '水',
    quality: '开创',
    rulingPlanet: '月亮',
    dateRange: [6, 21, 7, 22],
    traits: ['敏感', '温柔', '顾家', '情绪化'],
    personality: '巨蟹座是最具有家庭观念的星座，他们重视亲情和友情，感情丰富而细腻。巨蟹座的人善解人意，但有时可能过于敏感或情绪化。',
    compatible: ['双鱼', '天蝎', '金牛', '处女'],
    incompatible: ['白羊', '天秤', '摩羯'],
    luckyNumbers: [2, 7, 11, 20],
    luckyColors: ['白色', '银色', '淡蓝色'],
    dailyHoroscopes: {
      'Monday': '家庭事务需要关注，与亲人共度时光。',
      'Tuesday': '情绪波动较大，需要自我调节。',
      'Wednesday': '直觉得到增强，适合处理需要洞察力的事。',
      'Thursday': '工作中有新机会，把握当下。',
      'Friday': '回忆过去，思考未来方向。',
      'Saturday': '享受家庭温暖，烹饪或装饰家居。',
      'Sunday': '休息充电，为新一周做准备。',
    },
  },
  {
    id: 'leo',
    name: 'Leo',
    chineseName: '狮子',
    symbol: '\u264C',
    element: '火',
    quality: '固定',
    rulingPlanet: '太阳',
    dateRange: [7, 23, 8, 22],
    traits: ['自信', '慷慨', '领导力', '表演欲'],
    personality: '狮子座的人自信满满，喜欢成为焦点。他们慷慨大方，喜欢帮助他人，具有天然的领导气质。狮子座热爱生活，享受被赞美和认可。',
    compatible: ['白羊', '射手', '双子', '天秤'],
    incompatible: ['金牛', '天蝎', '水瓶'],
    luckyNumbers: [1, 8, 17, 28],
    luckyColors: ['金色', '橙色', '紫色'],
    dailyHoroscopes: {
      'Monday': '魅力四射，适合展示才华或领导团队。',
      'Tuesday': '注意控制自我中心倾向，多倾听他人。',
      'Wednesday': '创意和娱乐活动带来好运。',
      'Thursday': '事业发展顺利，有晋升或加薪机会。',
      'Friday': '社交活动频繁，享受被关注的感觉。',
      'Saturday': '适合娱乐和放松，展示自我。',
      'Sunday': '反思自我，设定新目标。',
    },
  },
  {
    id: 'virgo',
    name: 'Virgo',
    chineseName: '处女',
    symbol: '\u264D',
    element: '土',
    quality: '变动',
    rulingPlanet: '水星',
    dateRange: [8, 23, 9, 22],
    traits: ['细心', '完美主义', '勤劳', '分析能力'],
    personality: '处女座的人追求完美，注重细节和分析。他们勤劳踏实，善于组织和规划。处女座有很强的服务意识，喜欢帮助他人改进。',
    compatible: ['金牛', '摩羯', '巨蟹', '天蝎'],
    incompatible: ['双子', '射手', '双鱼'],
    luckyNumbers: [4, 6, 13, 22],
    luckyColors: ['深绿色', '米色', '灰色'],
    dailyHoroscopes: {
      'Monday': '工作细节需要注意，避免小错误。',
      'Tuesday': '健康和自我照顾成为焦点。',
      'Wednesday': '分析和学习能力增强，适合研究。',
      'Thursday': '服务他人带来满足感和好运。',
      'Friday': '整理和清洁带来好心情和好运。',
      'Saturday': '放松方式可以是有条理的活动。',
      'Sunday': '规划下周工作和生活。',
    },
  },
  {
    id: 'libra',
    name: 'Libra',
    chineseName: '天秤',
    symbol: '\u264E',
    element: '风',
    quality: '开创',
    rulingPlanet: '金星',
    dateRange: [9, 23, 10, 22],
    traits: ['和谐', '公正', '社交', '犹豫不决'],
    personality: '天秤座追求和谐与平衡，重视美感和人际关系。他们善于社交，总能公平地处理问题。但有时可能过于追求平衡而犹豫不决。',
    compatible: ['双子', '水瓶', '狮子', '白羊'],
    incompatible: ['摩羯', '处女', '巨蟹'],
    luckyNumbers: [4, 6, 14, 24],
    luckyColors: ['粉红色', '淡绿色', '天蓝色'],
    dailyHoroscopes: {
      'Monday': '人际关系运佳，适合社交活动。',
      'Tuesday': '需要做决定时，避免过度犹豫。',
      'Wednesday': '艺术和美感带来愉悦和好运。',
      'Thursday': '合作和合伙事务顺利。',
      'Friday': '恋爱运提升，适合约会。',
      'Saturday': '享受艺术、音乐或美好事物。',
      'Sunday': '思考人生平衡和价值观。',
    },
  },
  {
    id: 'scorpio',
    name: 'Scorpio',
    chineseName: '天蝎',
    symbol: '\u264F',
    element: '水',
    quality: '固定',
    rulingPlanet: '冥王星',
    dateRange: [10, 23, 11, 21],
    traits: ['神秘', '执着', '深刻', '占有欲'],
    personality: '天蝎座神秘而深刻，情感丰富强烈。他们执着专注，一旦决定就会坚持到底。天蝎座善于洞察人心，有很强的直觉和分析能力。',
    compatible: ['巨蟹', '双鱼', '处女', '金牛'],
    incompatible: ['狮子', '白羊', '水瓶'],
    luckyNumbers: [4, 8, 13, 21],
    luckyColors: ['深红色', '紫黑色', '暗绿色'],
    dailyHoroscopes: {
      'Monday': '情感加深，与重要的人分享感受。',
      'Tuesday': '专注目标，不被干扰所动。',
      'Wednesday': '洞察力增强，适合深入研究。',
      'Thursday': '权力和影响力提升，注意使用方式。',
      'Friday': '财务或情感议题需要诚实面对。',
      'Saturday': '需要独处和反思时间。',
      'Sunday': '释放情感，拥抱深层自我。',
    },
  },
  {
    id: 'sagittarius',
    name: 'Sagittarius',
    chineseName: '射手',
    symbol: '\u2650',
    element: '火',
    quality: '变动',
    rulingPlanet: '木星',
    dateRange: [11, 22, 12, 21],
    traits: ['乐观', '冒险精神', '自由', '直率'],
    personality: '射手座乐观开朗，喜欢冒险和探索。他们追求自由，思想开放，直率诚实。射手座热爱旅行和学习，总是充满热情和活力。',
    compatible: ['白羊', '狮子', '双子', '天秤'],
    incompatible: ['处女', '双鱼', '金牛'],
    luckyNumbers: [3, 7, 12, 21],
    luckyColors: ['紫色', '蓝色', '金黄色'],
    dailyHoroscopes: {
      'Monday': '冒险精神旺盛，考虑旅行或学习新事物。',
      'Tuesday': '保持开放心态，接受新观点。',
      'Wednesday': '与外国人或不同文化的人交流顺利。',
      'Thursday': '乐观态度感染他人，适合团队合作。',
      'Friday': '哲学或精神层面的思考带来启发。',
      'Saturday': '户外活动或旅行带来好运。',
      'Sunday': '反思人生意义和目标。',
    },
  },
  {
    id: 'capricorn',
    name: 'Capricorn',
    chineseName: '摩羯',
    symbol: '\u2651',
    element: '土',
    quality: '开创',
    rulingPlanet: '土星',
    dateRange: [12, 22, 1, 19],
    traits: ['稳重', '野心', '责任', '保守'],
    personality: '摩羯座稳重可靠，有强烈的责任感和野心。他们脚踏实地，追求成功和地位。摩羯座的人自律性强，有耐心和毅力。',
    compatible: ['金牛', '处女', '天蝎', '双鱼'],
    incompatible: ['白羊', '天秤', '狮子'],
    luckyNumbers: [1, 4, 8, 17],
    luckyColors: ['深棕色', '黑色', '深蓝色'],
    dailyHoroscopes: {
      'Monday': '工作努力得到认可，职业发展顺利。',
      'Tuesday': '责任重大，需要合理分配时间。',
      'Wednesday': '保持耐心，循序渐进达成目标。',
      'Thursday': '长辈或权威人物可能提供帮助。',
      'Friday': '财务计划和管理运佳。',
      'Saturday': '工作与休息需要平衡。',
      'Sunday': '反思成就和未来规划。',
    },
  },
  {
    id: 'aquarius',
    name: 'Aquarius',
    chineseName: '水瓶',
    symbol: '\u2652',
    element: '风',
    quality: '固定',
    rulingPlanet: '天王星',
    dateRange: [1, 20, 2, 18],
    traits: ['创新', '独立', '人道主义', '叛逆'],
    personality: '水瓶座独立创新，思维超前，重视人道主义精神。他们喜欢打破常规，追求自由和独特。水瓶座的人友善但有时显得疏离。',
    compatible: ['天秤', '双子', '白羊', '狮子'],
    incompatible: ['金牛', '天蝎', '处女'],
    luckyNumbers: [3, 7, 11, 22],
    luckyColors: ['天蓝色', '银色', '霓虹色'],
    dailyHoroscopes: {
      'Monday': '创意和独特的想法带来好运。',
      'Tuesday': '朋友和社交网络带来支持。',
      'Wednesday': '关注社会议题，参与公益活动。',
      'Thursday': '科技或新领域带来机会。',
      'Friday': '保持独立思考，不随波逐流。',
      'Saturday': '与志同道合的人交流互动。',
      'Sunday': '独处时间有助于创新思考。',
    },
  },
  {
    id: 'pisces',
    name: 'Pisces',
    chineseName: '双鱼',
    symbol: '\u2653',
    element: '水',
    quality: '变动',
    rulingPlanet: '海王星',
    dateRange: [2, 19, 3, 20],
    traits: ['浪漫', '敏感', '艺术', '逃避'],
    personality: '双鱼座浪漫敏感，富有艺术气质和想象力。他们情感丰富，善解人意，但有时可能过于理想化或逃避现实。双鱼座有很强的直觉和同理心。',
    compatible: ['天蝎', '巨蟹', '金牛', '处女'],
    incompatible: ['双子', '射手', '狮子'],
    luckyNumbers: [3, 6, 9, 15],
    luckyColors: ['海蓝色', '淡紫色', '白色'],
    dailyHoroscopes: {
      'Monday': '情感丰富，适合创作或艺术表达。',
      'Tuesday': '需要设定界限，避免过度付出。',
      'Wednesday': '直觉增强，适合需要洞察力的事情。',
      'Thursday': '梦境或想象力带来启示。',
      'Friday': '人际关系运佳，适合表达情感。',
      'Saturday': '需要休息和放松时间。',
      'Sunday': '亲近自然或水边，放松心灵。',
    },
  },
]

/**
 * Get zodiac sign by date
 */
export function getSunSign(date: Date): ZodiacSign {
  const month = date.getMonth() + 1
  const day = date.getDate()

  for (const sign of ZODIAC_SIGNS) {
    const [startMonth, startDay, endMonth, endDay] = sign.dateRange
    if (
      (month === startMonth && day >= startDay) ||
      (month === endMonth && day <= endDay) ||
      (startMonth > endMonth && (month > startMonth || month < endMonth))
    ) {
      return sign
    }
  }

  return ZODIAC_SIGNS[0] // Default to Aries
}

/**
 * Get Moon sign (simplified calculation based on date)
 * Real moon sign calculation requires exact birth time
 * This provides an approximation based on solar date
 */
export function getMoonSign(date: Date): ZodiacSign {
  // Simplified lunar mansion-based calculation
  // In real astrology, this requires exact time and location
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000)
  const signIndex = Math.floor((dayOfYear % 30) / 2.5) // Average 2.5 days per sign
  return ZODIAC_SIGNS[signIndex % 12]
}

/**
 * Get Rising sign based on birth time (simplified)
 * Real rising sign calculation requires exact birth time and location
 * Returns the sign and a note about time requirement
 */
export function getRisingSign(date: Date, birthTime: string | null): {
  sign: ZodiacSign | null
  range: string | null
} {
  if (!birthTime) {
    // Return a range of possible rising signs
    return {
      sign: null,
      range: '上升星座需要准确的出生时间才能计算。请输入出生时间以获得更精确的结果。',
    }
  }

  // Parse time (format: HH:MM)
  const [hours, minutes] = birthTime.split(':').map(Number)
  if (isNaN(hours) || isNaN(minutes)) {
    return {
      sign: null,
      range: '请输入有效的出生时间（格式：HH:MM）',
    }
  }

  // Simplified rising sign calculation
  // Each sign rises for approximately 2 hours
  const totalMinutes = hours * 60 + minutes
  const signIndex = Math.floor(totalMinutes / 120) % 12
  return {
    sign: ZODIAC_SIGNS[signIndex],
    range: null,
  }
}

/**
 * Generate full astrology chart
 */
export function getAstrologyChart(
  birthDate: Date,
  birthTime: string | null = null,
  birthLocation: string | null = null
): AstrologyChart {
  const sunSign = getSunSign(birthDate)
  const moonSign = getMoonSign(birthDate)
  const risingResult = getRisingSign(birthDate, birthTime)

  return {
    sunSign,
    moonSign,
    risingSign: risingResult.sign,
    risingSignRange: risingResult.range,
    birthDate,
    birthTime,
    birthLocation,
  }
}

/**
 * Get daily horoscope for a zodiac sign
 */
export function getDailyHoroscope(sign: ZodiacSign): string {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const today = days[new Date().getDay()]
  return sign.dailyHoroscopes[today]
}

/**
 * Get element compatibility info
 */
export function getElementInfo(element: '火' | '土' | '风' | '水'): {
  description: string
  compatible: string
} {
  const descriptions: Record<string, string> = {
    '火': '火象星座充满热情和活力，喜欢冒险和挑战。白羊座、狮子座、射手座属于火象。',
    '土': '土象星座稳重务实，追求安全感和实际成果。金牛座、处女座、摩羯座属于土象。',
    '风': '风象星座善于沟通和思考，追求自由和变化。双子座、天秤座、水瓶座属于风象。',
    '水': '水象星座情感丰富，直觉敏锐，重视人际关系。巨蟹座、天蝎座、双鱼座属于水象。',
  }

  return {
    description: descriptions[element],
    compatible: ELEMENT_COMPATIBILITY[element],
  }
}

/**
 * Get zodiac sign by ID
 */
export function getZodiacById(id: string): ZodiacSign | undefined {
  return ZODIAC_SIGNS.find(sign => sign.id === id)
}

/**
 * Get zodiac sign by Chinese name
 */
export function getZodiacByChineseName(name: string): ZodiacSign | undefined {
  return ZODIAC_SIGNS.find(sign => sign.chineseName === name)
}
