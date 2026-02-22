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

  // 东方能量解读
  let eastern = ''
  if (currentRelation?.overcomes === dayWuxing) {
    eastern = `今日${todayGanzhi.stem}${todayGanzhi.branch}为${currentRelation.overcomes}气之${['午', '酉', '申'].includes(todayGanzhi.branch) ? '截脚克木' : '官星当令'}。对你的${bazi.dayStem}木而言，这是正官${['午', '酉', '申'].includes(todayGanzhi.branch) ? '制刃' : '坐禄'}之象。2026丙午年火气滔天，你这棵${bazi.dayStem}木容易被${currentWuxing}之火烤焦。今日的${todayGanzhi.stem}${todayGanzhi.branch}金如同寒流定心，帮助你在燥乱中找回专注。`
  } else if (dayRelation?.generates === currentWuxing) {
    eastern = `今日${todayGanzhi.stem}${todayGanzhi.branch}${dayWuxing}气生${currentWuxing}。对你的${bazi.dayStem}木而言，这是食伤泄秀之日。创意灵感丰富，适合艺术创作，但需注意表达方式。`
  } else if (currentRelation?.overcomes === dayWuxing) {
    eastern = `今日${todayGanzhi.stem}${todayGanzhi.branch}${currentWuxing}克${dayWuxing}。对你的${bazi.dayStem}木而言，这是财星显现之日，但金木相战，注意财务压力。`
  } else {
    eastern = `今日${todayGanzhi.stem}${todayGanzhi.branch}气场平稳。对你的${bazi.dayStem}木而言，今日宜静心养性，不宜冒进。`
  }

  // 西方星示
  const zodiac = getWesternZodiac(birthDate.month, birthDate.day)
  const lifePath = calculateLifePathNumber(birthDate.year, birthDate.month, birthDate.day)
  const todayLifeNumber = getTodayLifeNumber(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate())
  const lifeMeaning = LIFE_PATH_MEANINGS[lifePath]
  const todayLifeMeaning = LIFE_PATH_MEANINGS[todayLifeNumber]

  const western = `你的太阳星座是${zodiac.sign}（${zodiac.element}相${zodiac.quality}）。今日星象显示${zodiac.element === '水' ? '情绪较为敏感' : zodiac.sign.includes('火') ? '行动力充沛' : '思维活跃'}。

生命灵数${lifePath}（${lifeMeaning}），今日灵数频率为${todayLifeNumber}（${todayLifeMeaning}）。在激进的2026年里，今天是你回归内在、修复关系的绝佳时机。`

  // 能量雷达
  const careerScore = currentRelation?.overcomes === dayWuxing ? 5 : currentRelation?.generates === dayWuxing ? 3 : 4
  const wealthScore = dayWuxing === '金' ? 2 : dayWuxing === '水' ? 4 : 3
  const loveScore = zodiac.element === '水' ? 4 : zodiac.sign.includes('蟹') ? 3 : 4
  const healthScore = currentWuxing === '火' && dayWuxing === '金' ? 2 : 3
  const creativityScore = currentRelation?.generates === dayWuxing || zodiac.element === '风' ? 5 : 3

  const radar = [
    { dimension: '事业', score: careerScore, note: currentRelation?.overcomes === dayWuxing ? '正官加持，职场威信极高' : '稳步推进，专注核心项目' },
    { dimension: '财富', score: wealthScore, note: dayWuxing === '金' ? '金克木，财星受损，不宜大额投资' : '财富平稳，注意守财' },
    { dimension: '感情', score: loveScore, note: zodiac.element === '水' ? '感性被理性压制，略有距离感' : '人际关系顺畅' },
    { dimension: '健康', score: healthScore, note: currentWuxing === '火' ? '火旺金脆，注意嗓子/牙齿' : '状态平稳，注意休息' },
    { dimension: '灵感', score: creativityScore, note: currentRelation?.generates === dayWuxing ? '逻辑思维强，适合架构设计' : '创意一般，务实为佳' },
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

  // 避坑指南
  const avoidance: string[] = []
  if (currentWuxing === '火' && dayWuxing === '金') {
    avoidance.push('忌与人正面口角 - 火旺遇金日，一句话说错可能毁掉关系')
    avoidance.push('忌剧烈运动 - 金木相克，关节易受伤')
  }
  if (dayWuxing === '金') {
    avoidance.push('忌熬夜 - 金日耗肝血，晚11点前入睡')
    avoidance.push('忌冲动决策 - 正官当令，约束为主')
  }
  avoidance.push('忌穿红色 - 2026火年本已燥热')

  // AI寄语
  const quotes = [
    '在赤马年的烈焰中，唯有守住秩序的寒冰，方能雕刻出栋梁之才。',
    '火烈则木焦，金裁则木成。今日的寂静与规矩是你最好的护身符。',
    '2026年的喧嚣中，让自己成为那潭静水，以不变应万变。',
  ]
  const aiQuote = quotes[Math.floor((stemIndex + branchIndex) / 2) % quotes.length]

  // 关键词
  const keywords = ['官星修剪', '秩序重建', '定心养性', '静水深流', '破局', '沉潜', '蓄势', '绸缪']
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
