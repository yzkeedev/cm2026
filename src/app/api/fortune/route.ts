import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// Validation schemas
const HEAVENLY_STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'] as const
const EARTHLY_BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'] as const

const FortuneRequestSchema = z.object({
  bazi: z.object({
    dayStem: z.enum(HEAVENLY_STEMS),
    dayBranch: z.enum(EARTHLY_BRANCHES),
    yearStem: z.enum(HEAVENLY_STEMS),
    yearBranch: z.enum(EARTHLY_BRANCHES),
  }),
  todayGanzhi: z.object({
    stem: z.enum(HEAVENLY_STEMS),
    branch: z.enum(EARTHLY_BRANCHES),
  }),
  birthDate: z.object({
    year: z.number().int().min(1900).max(2100),
    month: z.number().int().min(1).max(12),
    day: z.number().int().min(1).max(31),
  }),
})

// 西方星座计算
function getWesternZodiac(month: number, day: number): { sign: string; element: string; quality: string } {
  const zodiacs = [
    { sign: '摩羯座', start: [12, 22], element: '土', quality: '开创' },
    { sign: '水瓶座', start: [1, 20], element: '风', quality: '固定' },
    { sign: '双鱼座', start: [2, 19], element: '水', quality: '变动' },
    { sign: '白羊座', start: [3, 21], element: '火', quality: '开创' },
    { sign: '金牛座', start: [4, 20], element: '土', quality: '固定' },
    { sign: '双子座', start: [5, 21], element: '风', quality: '变动' },
    { sign: '巨蟹座', start: [6, 21], element: '水', quality: '开创' },
    { sign: '狮子座', start: [7, 23], element: '火', quality: '固定' },
    { sign: '处女座', start: [8, 23], element: '土', quality: '变动' },
    { sign: '天秤座', start: [9, 23], element: '风', quality: '开创' },
    { sign: '天蝎座', start: [10, 23], element: '水', quality: '固定' },
    { sign: '射手座', start: [11, 22], element: '火', quality: '变动' },
  ]

  for (const z of zodiacs) {
    if (month === z.start[0] && day >= z.start[1]) return z
    if (month === z.start[0] + 1 && day < zodiacs[(zodiacs.indexOf(z) + 1) % 12].start[1]) return z
  }
  return zodiacs[0]
}

// 生命灵数计算
function calculateLifePathNumber(year: number, month: number, day: number): number {
  const sum = year + month + day
  let result = sum
  while (result > 9) {
    result = String(result).split('').reduce((a, b) => a + Number(b), 0)
  }
  return result
}

// 今日灵数频率
function getTodayLifeNumber(year: number, month: number, day: number): number {
  const dateStr = `${year}${String(month).padStart(2, '0')}${String(day).padStart(2, '0')}`
  const sum = dateStr.split('').reduce((a, b) => a + Number(b), 0)
  let result = sum
  while (result > 9) {
    result = String(result).split('').reduce((a, b) => a + Number(b), 0)
  }
  return result
}

// 灵数含义
const LIFE_PATH_MEANINGS: Record<number, string> = {
  1: '独立、创新、领袖',
  2: '合作、平衡、外交',
  3: '创意、表达、社交',
  4: '稳定、勤奋、务实',
  5: '自由、冒险、变化',
  6: '责任、和谐、家庭',
  7: '灵性、探索、分析',
  8: '权力、成就、物质',
  9: '人道、智慧、终结',
}

// 中西合璧运势解读生成器
function generateFortuneText(
  bazi: { dayStem: string; dayBranch: string; yearStem: string; yearBranch: string },
  todayGanzhi: { stem: string; branch: string },
  birthDate: { year: number; month: number; day: number }
): {
  eastern: string
  western: string
  radar: { dimension: string; score: number; note: string }[]
  booster: { color: string; number: string; direction: string; item: string }
  avoidance: string[]
  aiQuote: string
  keyword: string
} {
  const stems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']
  const wuxing = ['木', '火', '土', '金', '水']

  const stemIndex = stems.indexOf(todayGanzhi.stem)
  const branchIndex = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'].indexOf(todayGanzhi.branch)
  const dayStemIndex = stems.indexOf(bazi.dayStem)

  // 获取日主五行
  const dayWuxing = wuxing[Math.floor(dayStemIndex / 2) % 5]
  const currentWuxing = wuxing[Math.floor(stemIndex / 2) % 5]

  // 计算八字与流日的生克关系
  const wuxingRelations: Record<string, { generates: string; overcomes: string }> = {
    '木': { generates: '火', overcomes: '土' },
    '火': { generates: '土', overcomes: '金' },
    '土': { generates: '金', overcomes: '水' },
    '金': { generates: '水', overcomes: '木' },
    '水': { generates: '木', overcomes: '火' },
  }

  const dayRelation = wuxingRelations[dayWuxing]
  const currentRelation = wuxingRelations[currentWuxing]

  // 东方能量解读 - 简化版
  let eastern = ''
  if (currentRelation?.overcomes === dayWuxing) {
    eastern = `今天是天时帮你的好日子！${todayGanzhi.stem}${todayGanzhi.branch}的能量正好能让你在工作和事业上表现突出。2026年是火年，天气比较燥热，但今天你有好运加持，适合把握机会，表现自己。`
  } else if (dayRelation?.generates === currentWuxing) {
    eastern = `今天适合发挥创意！你的想法会得到别人的认可，如果有艺术创作、设计之类的工作，今天会很顺利。表达自己时注意方式方法就好。`
  } else if (currentRelation?.overcomes === dayWuxing) {
    eastern = `今天财运不错！但是要注意，可能会有一些财务方面的压力或花销。控制好预算，不要冲动消费。`
  } else {
    eastern = `今天是平稳的一天。不需要太激进，适合静下心来思考，或者做一些不需要太赶时间的事情。顺其自然就好。`
  }

  // 西方星示 - 简化版
  const zodiac = getWesternZodiac(birthDate.month, birthDate.day)
  const lifePath = calculateLifePathNumber(birthDate.year, birthDate.month, birthDate.day)
  const todayLifeNumber = getTodayLifeNumber(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate())
  const lifeMeaning = LIFE_PATH_MEANINGS[lifePath]
  const todayLifeMeaning = LIFE_PATH_MEANINGS[todayLifeNumber]

  const zodiacNotes: Record<string, string> = {
    '水': '今天情绪比较敏感，容易想太多',
    '火': '今天行动力很强，适合执行力',
    '风': '今天思维活跃，适合动脑筋',
    '土': '今天比较稳定，适合按计划来',
  }

  const western = `你的太阳星座是${zodiac.sign}（${zodiac.element}元素，${zodiac.quality}星座）。${zodiacNotes[zodiac.element] || '今天状态不错'}。

你的生命灵数是${lifePath}，代表${lifeMeaning}。今天的能量数字是${todayLifeNumber}，代表${todayLifeMeaning}。在2026年这个变化比较大的年份里，今天适合回归内心，多陪陪家人朋友。`

  // 能量雷达 - 简化版
  const careerScore = currentRelation?.overcomes === dayWuxing ? 5 : currentRelation?.generates === dayWuxing ? 3 : 4
  const wealthScore = dayWuxing === '金' ? 2 : dayWuxing === '水' ? 4 : 3
  const loveScore = zodiac.element === '水' ? 4 : zodiac.sign.includes('蟹') ? 3 : 4
  const healthScore = currentWuxing === '火' && dayWuxing === '金' ? 2 : 3
  const creativityScore = currentRelation?.generates === dayWuxing || zodiac.element === '风' ? 5 : 3

  const radar = [
    { dimension: '事业 (Career)', score: careerScore, note: currentRelation?.overcomes === dayWuxing ? '运气好，适合表现自己' : '稳步推进，做好眼前事' },
    { dimension: '财富 (Wealth)', score: wealthScore, note: dayWuxing === '金' ? '注意花销，别乱投资' : '收入稳定，注意存钱' },
    { dimension: '感情 (Love)', score: loveScore, note: zodiac.element === '水' ? '今天有点敏感，多沟通' : '人缘好，适合社交' },
    { dimension: '健康 (Health)', score: healthScore, note: currentWuxing === '火' ? '注意喉咙和牙齿' : '身体不错，适当运动' },
    { dimension: '灵感 (Creativity)', score: creativityScore, note: currentRelation?.generates === dayWuxing ? '思维清晰，适合规划' : '保持平常心' },
  ]

  // 幸运色根据日干
  const colors: Record<string, string> = {
    '甲': '青色、绿色、白色',
    '乙': '青色、绿色、黑色',
    '丙': '红色、紫色、银色',
    '丁': '红色、紫色、白色',
    '戊': '黄色、棕色、金色',
    '己': '黄色、棕色、白色',
    '庚': '白色、金色、灰色',
    '辛': '白色、银色、珍珠白',
    '壬': '蓝色、黑色、青色',
    '癸': '蓝色、黑色、银色',
  }

  // 幸运方位
  const directions: Record<string, string> = {
    '甲': '东', '乙': '东', '丙': '南', '丁': '南',
    '戊': '中', '己': '中', '庚': '西', '辛': '西',
    '壬': '北', '癸': '北',
  }

  const booster = {
    color: colors[todayGanzhi.stem] || '白色、金色',
    number: String(todayLifeNumber),
    direction: directions[todayGanzhi.stem] || '中',
    item: zodiac.element === '火' ? '金属饰品' : zodiac.element === '水' ? '水晶球' : '机械表',
  }

  // 避坑指南 - 简化版
  const avoidance: string[] = []
  if (currentWuxing === '火' && dayWuxing === '金') {
    avoidance.push('今天说话要小心 - 容易得罪人')
    avoidance.push('运动要适量 - 容易受伤')
  }
  if (dayWuxing === '金') {
    avoidance.push('早点睡觉 - 熬夜伤身体')
    avoidance.push('别冲动做决定 - 三思而后行')
  }
  avoidance.push('穿衣服要注意 - 红色太招摇')

  // AI寄语 - 简化版
  const quotes = [
    '2026年是变化的一年，慢慢来，别着急。',
    '今天的安静，是为了明天更好地出发。',
    '保持好心情，好运自然来。',
  ]
  const aiQuote = quotes[Math.floor((stemIndex + branchIndex) / 2) % quotes.length]

  // 关键词 - 简化版
  const keywords = ['把握机会', '稳扎稳打', '内心平静', '顺势而为', '突破', '沉淀', '积累', '准备']
  const keyword = keywords[(stemIndex + branchIndex + birthDate.day) % keywords.length]

  return {
    eastern,
    western,
    radar,
    booster,
    avoidance,
    aiQuote,
    keyword,
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input with Zod
    const validated = FortuneRequestSchema.parse(body)

    // Generate fortune interpretation
    const result = generateFortuneText(
      validated.bazi,
      validated.todayGanzhi,
      validated.birthDate
    )

    return NextResponse.json({
      success: true,
      data: {
        ...result,
        generatedAt: new Date().toISOString(),
      }
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.issues },
        { status: 400 }
      )
    }

    // Log with correlation ID for debugging
    const correlationId = crypto.randomUUID()
    console.error(`[${correlationId}] Fortune API error:`, error)

    return NextResponse.json(
      { error: 'Failed to generate fortune', correlationId },
      { status: 500 }
    )
  }
}
