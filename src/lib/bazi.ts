import { Lunar, LunarDate, Solar } from 'lunar-javascript'

// 天干
const HEAVENLY_STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']

// 地支
const EARTHLY_BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']

// 五行
const WUXING = ['木', '火', '土', '金', '水']

// 纳音五行 (2026年天河水)
const NAYIN = {
  '甲子': '海中金', '乙丑': '海中金',
  '丙寅': '炉中火', '丁卯': '炉中火',
  '戊辰': '大林木', '己巳': '大林木',
  '庚午': '路旁土', '辛未': '路旁土',
  '壬申': '剑锋金', '癸酉': '剑锋金',
  '甲戌': '山头火', '乙亥': '山头火',
  '丙子': '涧下水', '丁丑': '涧下水',
  '戊寅': '城头土', '己卯': '城头土',
  '庚辰': '白蜡金', '辛巳': '白蜡金',
  '壬午': '杨柳木', '癸未': '杨柳木',
  '甲申': '井泉水', '乙酉': '井泉水',
  '丙戌': '屋上土', '丁亥': '屋上土',
  '戊子': '霹雳火', '己丑': '霹雳火',
  '庚寅': '松柏木', '辛卯': '松柏木',
  '壬辰': '长流水', '癸巳': '长流水',
  '甲午': '砂石金', '乙未': '砂石金',
  '丙申': '山下火', '丁酉': '山下火',
  '戊戌': '平地下', '己亥': '平地下',
  '庚子': '壁上土', '辛丑': '壁上土',
  '壬寅': '金箔金', '癸卯': '金箔金',
  '甲辰': '覆灯火', '乙巳': '覆灯火',
  '丙午': '天河水', '丁未': '天河水',
  '戊申': '大驿土', '己酉': '大驿土',
  '庚戌': '钗钏金', '辛亥': '钗钏金',
  '壬子': '桑柘木', '癸丑': '桑柘木',
  '甲寅': '大溪水', '乙卯': '大溪水',
  '丙辰': '砂石土', '丁巳': '砂石土',
  '戊午': '天上火', '己未': '天上火',
  '庚申': '石榴木', '辛酉': '石榴木',
  '壬戌': '大海水', '癸亥': '大海水',
}

// 生肖映射
const ZODIAC_ANIMALS: Record<string, string> = {
  '子': '鼠', '丑': '牛', '寅': '虎', '卯': '兔',
  '辰': '龙', '巳': '蛇', '午': '马', '未': '羊',
  '申': '猴', '酉': '鸡', '戌': '狗', '亥': '猪',
}

// 五行生克关系
const WUXING_RELATIONS = {
  '木': { generates: '火', overcomes: '土' },
  '火': { generates: '土', overcomes: '金' },
  '土': { generates: '金', overcomes: '水' },
  '金': { generates: '水', overcomes: '木' },
  '水': { generates: '木', overcomes: '火' },
}

// 2026年犯太岁生肖
const TAI_SUI_ZODIACS = ['马', '鼠', '牛', '兔']

// 幸运色 (水色系以中和火气)
const LUCKY_COLORS_BY_STEM: Record<string, string[]> = {
  '甲': ['青色', '绿色', '蓝色'],
  '乙': ['青色', '绿色', '黑色'],
  '丙': ['红色', '紫色', '白色'],
  '丁': ['红色', '紫色', '银色'],
  '戊': ['黄色', '棕色', '金色'],
  '己': ['黄色', '棕色', '白色'],
  '庚': ['白色', '金色', '灰色'],
  '辛': ['白色', '金色', '银色'],
  '壬': ['蓝色', '黑色', '青色'],
  '癸': ['蓝色', '黑色', '银色'],
}

// 幸运方位
const LUCKY_DIRECTIONS: Record<string, string> = {
  '甲': '东', '乙': '东', '丙': '南', '丁': '南',
  '戊': '中', '己': '中', '庚': '西', '辛': '西',
  '壬': '北', '癸': '北',
}

// 获取天干索引
export function getStemIndex(stem: string): number {
  return HEAVENLY_STEMS.indexOf(stem)
}

// 获取地支索引
export function getBranchIndex(branch: string): number {
  return EARTHLY_BRANCHES.indexOf(branch)
}

// 获取天干五行
export function getStemWuxing(stem: string): string {
  const index = getStemIndex(stem)
  return WUXING[Math.floor(index / 2) % 5]
}

// 获取地支五行
export function getBranchWuxing(branch: string): string {
  const branchIndex = getBranchIndex(branch)
  // 子藏癸水, 丑藏己土, 寅藏甲木, 卯藏乙木
  // 辰藏戊土, 巳藏丙火, 午藏丁火, 未藏己土
  // 申藏庚金, 酉藏辛金, 戌藏戊土, 亥藏壬水
  const hiddenStems: Record<string, string> = {
    '子': '癸', '丑': '己', '寅': '甲', '卯': '乙',
    '辰': '戊', '巳': '丙', '午': '丁', '未': '己',
    '申': '庚', '酉': '辛', '戌': '戊', '亥': '壬',
  }
  return getStemWuxing(hiddenStems[branch] || '土')
}

// 获取八字
export interface BaziData {
  year: string      // 年柱
  month: string     // 月柱
  day: string       // 日柱
  time: string      // 时柱
  yearStem: string  // 年干
  yearBranch: string // 年支
  monthStem: string // 月干
  monthBranch: string // 月支
  dayStem: string   // 日干
  dayBranch: string // 日支
  timeStem: string  // 时干
  timeBranch: string // 时支
}

// Convert zodiac animal to Earthly Branch
const ZODIAC_TO_BRANCH: Record<string, string> = {
  '鼠': '子', '牛': '丑', '虎': '寅', '兔': '卯',
  '龙': '辰', '蛇': '巳', '马': '午', '羊': '未',
  '猴': '申', '鸡': '酉', '狗': '戌', '猪': '亥'
}

function zodiacToBranch(zodiac: string): string {
  return ZODIAC_TO_BRANCH[zodiac] || zodiac
}

// 获取公历日期的八字
export function getBazi(date: Date, timeBranch: string = '子'): BaziData {
  const solar = Solar.fromDate(date)
  const lunar = solar.getLunar()

  const yearZodiac = lunar.getYearShengXiao()
  const monthZodiac = lunar.getMonthShengXiao()
  const dayZodiac = lunar.getDayShengXiao()

  const yearBranch = zodiacToBranch(yearZodiac)
  const yearStem = HEAVENLY_STEMS[(lunar.getYear() - 4) % 10]
  const monthStem = HEAVENLY_STEMS[(lunar.getMonth() * 2 + 2 + (lunar.getYear() - 4) % 10) % 10]
  const dayStem = HEAVENLY_STEMS[(lunar.getDay() + 6) % 10]
  const timeStem = getTimeStem(timeBranch, dayStem)

  return {
    year: yearStem + yearBranch,
    month: monthStem + zodiacToBranch(monthZodiac),
    day: dayStem + zodiacToBranch(dayZodiac),
    time: timeStem + timeBranch,
    yearStem,
    yearBranch,
    monthStem,
    monthBranch: zodiacToBranch(monthZodiac),
    dayStem,
    dayBranch: zodiacToBranch(dayZodiac),
    timeStem,
    timeBranch,
  }
}

// 根据日干获取时干
function getTimeStem(timeBranch: string, dayStem: string): string {
  const dayStemIndex = getStemIndex(dayStem)
  const timeBranchIndex = getBranchIndex(timeBranch)
  return HEAVENLY_STEMS[(dayStemIndex * 2 + timeBranchIndex) % 10]
}

// 获取今日干支
export function getTodayGanzhi(): { stem: string; branch: string; full: string } {
  const today = new Date()
  const solar = Solar.fromDate(today)
  const lunar = solar.getLunar()

  const dayStem = HEAVENLY_STEMS[(lunar.getDay() + 6) % 10]
  const dayBranch = zodiacToBranch(lunar.getDayShengXiao())

  return {
    stem: dayStem,
    branch: dayBranch,
    full: dayStem + dayBranch,
  }
}

// 获取流日干支
export function getCurrentDayGanzhi(): { stem: string; branch: string; full: string; year: number } {
  const today = new Date()
  const year = today.getFullYear()
  const solar = Solar.fromDate(today)
  const lunar = solar.getLunar()

  const dayStem = HEAVENLY_STEMS[(lunar.getDay() + 6) % 10]
  const dayBranch = zodiacToBranch(lunar.getDayShengXiao())

  return {
    stem: dayStem,
    branch: dayBranch,
    full: dayStem + dayBranch,
    year,
  }
}

// 获取纳音五行
export function getNayin(ganzhi: string): string {
  return NAYIN[ganzhi as keyof typeof NAYIN] || '未知'
}

// 判断是否犯太岁
export function isTaiSui(zodiac: string): boolean {
  return TAI_SUI_ZODIACS.includes(zodiac)
}

// 获取犯太岁生肖列表
export function getTaiSuiZodiacs(): string[] {
  return [...TAI_SUI_ZODIACS]
}

// 获取生肖
export function getZodiac(year: number): string {
  const zodiacs = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪']
  return zodiacs[(year - 1900) % 12]
}

// 获取幸运色
export function getLuckyColors(stem: string): string[] {
  return LUCKY_COLORS_BY_STEM[stem] || ['白色', '金色']
}

// 获取幸运方位
export function getLuckyDirection(stem: string): string {
  return LUCKY_DIRECTIONS[stem] || '中'
}

// 计算五行得分 (0-100)
export function calculateWuxingScore(bazi: BaziData, currentStem: string): {
  wealth: number
  career: number
  love: number
  health: number
  creativity: number
} {
  const dayStem = bazi.dayStem
  const dayBranch = bazi.dayBranch
  const currentWuxing = getStemWuxing(currentStem)
  const dayWuxing = getStemWuxing(dayStem)
  const dayBranchWuxing = getBranchWuxing(dayBranch)

  // 基础得分
  let baseScore = 50

  // 计算与流日的冲合克泄
  const relations = calculateRelation(currentWuxing, dayWuxing)
  const branchRelations = calculateRelation(currentWuxing, dayBranchWuxing)

  const wealth = Math.min(100, Math.max(0, baseScore + (relations.overcomes ? 20 : 0) + (relations.generates ? 15 : 0) - (relations.isOvercome ? 25 : 0) - (relations.isGenerated ? 10 : 0)))
  const career = Math.min(100, Math.max(0, baseScore + (relations.generates ? 20 : 0) + (branchRelations.generates ? 10 : 0) - (relations.isOvercome ? 15 : 0)))
  const love = Math.min(100, Math.max(0, baseScore + (relations.isSame ? 15 : 0) + (branchRelations.isSame ? 10 : 0)))
  const health = Math.min(100, Math.max(0, baseScore - (relations.isOvercome ? 20 : 0) - (relations.isGenerated ? 15 : 0)))
  const creativity = Math.min(100, Math.max(0, baseScore + (relations.generates ? 20 : 0) + (branchRelations.generates ? 10 : 0)))

  return {
    wealth: Math.round(wealth),
    career: Math.round(career),
    love: Math.round(love),
    health: Math.round(health),
    creativity: Math.round(creativity),
  }
}

// 计算五行关系
function calculateRelation(w1: string, w2: string): {
  generates: boolean
  overcomes: boolean
  isGenerated: boolean
  isOvercome: boolean
  isSame: boolean
} {
  if (w1 === w2) {
    return { generates: false, overcomes: false, isGenerated: false, isOvercome: false, isSame: true }
  }

  const r1 = WUXING_RELATIONS[w1 as keyof typeof WUXING_RELATIONS]
  const r2 = WUXING_RELATIONS[w2 as keyof typeof WUXING_RELATIONS]

  return {
    generates: r1?.generates === w2,
    overcomes: r1?.overcomes === w2,
    isGenerated: r2?.generates === w1,
    isOvercome: r2?.overcomes === w1,
    isSame: false,
  }
}

// 计算今日能量值
export function calculateEnergyScore(bazi: BaziData, currentDay: { stem: string; branch: string }): number {
  const dayWuxing = getStemWuxing(bazi.dayStem)
  const currentWuxing = getStemWuxing(currentDay.stem)
  const currentBranchWuxing = getBranchWuxing(currentDay.branch)

  const relation = calculateRelation(dayWuxing, currentWuxing)
  const branchRelation = calculateRelation(dayWuxing, currentBranchWuxing)

  let score = 50

  // 日主与流日关系
  if (relation.generates) score += 20
  if (relation.overcomes) score += 15
  if (relation.isGenerated) score -= 20
  if (relation.isOvercome) score -= 25

  // 日支与流日支关系
  if (branchRelation.generates) score += 10
  if (branchRelation.isOvercome) score -= 15

  // 2026年火年平衡
  if (currentWuxing === '火') score -= 10

  return Math.min(100, Math.max(0, score))
}

// 大环境指数 (赤马红羊劫)
export function getEnvironmentIndex(): {
  overall: number
  restlessness: number
  trend: string
  advice: string
} {
  const month = new Date().getMonth() + 1
  const day = new Date().getDate()

  // 模拟大环境计算
  const baseOverall = 72
  const baseRestlessness = 65

  // 2月躁动
  const seasonalAdjust = month === 2 ? -15 : 0

  const overall = Math.min(100, Math.max(0, baseOverall + seasonalAdjust))
  const restlessness = Math.min(100, Math.max(0, baseRestlessness + seasonalAdjust))

  const trend = overall > 70 ? '上升' : overall > 50 ? '平稳' : '需谨慎'
  const advice = '2026年丙午火年，宜静心养性，避免冲动决策。多用水色系物品调和。'

  return { overall, restlessness, trend, advice }
}

// 签文
const FORTUNES = [
  { number: 1, title: '上上签', content: '吉人自有天相，大吉大利', advice: '今日诸事皆宜，可放手去做' },
  { number: 2, title: '上签', content: '春风得意，马到成功', advice: '努力必有回报，坚持下去' },
  { number: 3, title: '中上', content: '稳扎稳打，步步高升', advice: '循序渐进，不可急躁' },
  { number: 4, title: '中签', content: '平平稳稳，无忧无虑', advice: '保持现状，靜心养性' },
  { number: 5, title: '中下', content: '小人作祟，需加防范', advice: '谨言慎行，避免冲突' },
  { number: 6, title: '下签', content: '困难重重，需待时机', advice: '不宜妄动，静待时机' },
  { number: 7, title: '下下签', content: '危机四伏，步步惊心', advice: '退避三舍，保守为上' },
  { number: 8, title: '上签', content: '贵人相助，好事将近', advice: '把握机遇，乘势而为' },
]

// 抽签
export function drawFortune(seed?: number): typeof FORTUNES[0] {
  const index = seed !== undefined
    ? seed % FORTUNES.length
    : Math.floor(Math.random() * FORTUNES.length)
  return FORTUNES[index]
}

// 犯太岁化解建议
export function getTaiSuiRemedies(zodiac: string): string[] {
  const remedies: Record<string, string[]> = {
    '马': ['多喝水', '穿白色衣物', '家中放置蓝色物品', '避免穿红色'],
    '鼠': ['佩戴金属饰品', '保持低调', '多行善积德', '避免冒险'],
    '牛': ['佩戴玉饰', '谨言慎行', '多静心', '避免锋利物品'],
    '兔': ['穿金色衣物', '多接触水', '保持平和心态', '避免与人争执'],
  }
  return remedies[zodiac] || ['保持心态平和']
}

// ==================== 梅花易数 (Plum Blossom Numerology) ====================

// 64 Hexagrams of I Ching
// 八卦 Unicode 符号
const BAGUA_SYMBOLS = ['☰', '☳', '☴', '☲', '☵', '☷', '☶', '☱']  // 乾震巽离坎坤艮兑
const BAGUA_NAMES = ['乾', '震', '巽', '离', '坎', '坤', '艮', '兑']
const BAGUA_ENAMES = ['Qian', 'Zhen', 'Xun', 'Li', 'Kan', 'Kun', 'Gen', 'Dui']

// 详细八卦数据
const BAGUA: Record<number, { chinese: string; name: string; symbol: string; element: string; meaning: string }> = {
  1: { chinese: '乾', name: 'Qian', symbol: '☰', element: '金', meaning: '天 - 创造、刚健' },
  2: { chinese: '坤', name: 'Kun', symbol: '☷', element: '土', meaning: '地 - 承载、柔顺' },
  3: { chinese: '震', name: 'Zhen', symbol: '☳', element: '木', meaning: '雷 - 震动、警觉' },
  4: { chinese: '巽', name: 'Xun', symbol: '☴', element: '木', meaning: '风 - 渗入、顺从' },
  5: { chinese: '坎', name: 'Kan', symbol: '☵', element: '水', meaning: '水 - 险陷、智慧' },
  6: { chinese: '离', name: 'Li', symbol: '☲', element: '火', meaning: '火 - 光明、依附' },
  7: { chinese: '艮', name: 'Gen', symbol: '☶', element: '土', meaning: '山 - 停止、稳重' },
  8: { chinese: '兑', name: 'Dui', symbol: '☱', element: '金', meaning: '泽 - 喜悦、言说' },
}

// 详细六十四卦数据
export const HEXAGRAM_DETAILS: Record<number, {
  name: string
  chinese: string
  meaning: string
  advice: string
  judgment: string      // 彖辞
  image: string        // 象辞
  lines: string[]       // 爻辞 (6个)
  upperTrigram: number  // 上卦 (1-8)
  lowerTrigram: number  // 下卦 (1-8)
}> = {
  1: {
    name: 'Qian', chinese: '乾', meaning: '元亨利贞', advice: '刚健不息',
    judgment: '大畜：利贞，不家食吉，利涉大川。',
    image: '天在山中，大畜。君子以多识前言往行，以畜其德。',
    lines: [
      '潜龙勿用，见龙在田，利见大人，君子终日乾乾，夕惕若厉无咎，或跃在渊无咎，飞龙在天利见大人，亢龙有悔',
    ],
    upperTrigram: 1, lowerTrigram: 1
  },
  2: {
    name: 'Kun', chinese: '坤', meaning: '元亨，利牝马之贞', advice: '柔顺厚德',
    judgment: '坤：元亨，利牝马之贞。君子有攸往，先迷后得主，利西南得朋，东北丧朋。安贞吉。',
    image: '地势坤，君子以厚德载物。',
    lines: [
      '履霜，坚冰至。直方大，不习无不利。含章可贞，或从王事无成有终。括囊无咎无誉，黄裳元吉，龙战于野其血玄黄',
    ],
    upperTrigram: 6, lowerTrigram: 6
  },
  3: {
    name: 'Zhun', chinese: '屯', meaning: '元亨利贞，勿用有攸往，利建侯', advice: '起始维艰',
    judgment: '屯：元亨利贞，勿用有攸往，利建侯。',
    image: '云雷屯，君子以经纶。',
    lines: [
      '磐桓，利居贞，利建侯，乘马班如求婚媾往吉无不利，屯如邅如乘马班如，屯于膏泽乘马班如，乘马班如求婚媾往吉无不利',
    ],
    upperTrigram: 5, lowerTrigram: 3
  },
  4: {
    name: 'Meng', chinese: '蒙', meaning: '亨，匪我求童蒙，童蒙求我', advice: '启蒙发智',
    judgment: '蒙：亨，匪我求童蒙，童蒙求我。初筮告，再三渎，渎则不告。利贞。',
    image: '山下出泉，蒙。君子以果行育德。',
    lines: [
      '发蒙，利用刑人，用说桎梏，利用刑人，用说桎梏，勿用取女，见金夫不有躬无攸利，困蒙击蒙，童蒙吉',
    ],
    upperTrigram: 7, lowerTrigram: 5
  },
  5: {
    name: 'Xu', chinese: '需', meaning: '有孚，光亨，贞吉，利涉大川', advice: '待机而动',
    judgment: '需：有孚，光亨，贞吉。利涉大川。',
    image: '云上于天，需。君子以饮食宴乐。',
    lines: [
      '需于郊，利用恒无咎，需于沙小有言终吉，需于泥致寇至，需于血出自穴，需于酒食贞吉',
    ],
    upperTrigram: 5, lowerTrigram: 1
  },
  6: {
    name: 'Song', chinese: '讼', meaning: '有孚窒惕，中吉，终凶', advice: '息讼止争',
    judgment: '讼：有孚窒惕，中吉，终凶。利见大人，不利涉大川。',
    image: '天与水违行，讼。君子以作事谋始。',
    lines: [
      '不永所事小有言其邑人三百户无眚，不克讼归而逋其邑人三百户无眚，食旧德贞厉终吉，或锡之鞶带终朝三褫之',
    ],
    upperTrigram: 1, lowerTrigram: 5
  },
  7: {
    name: 'Shi', chinese: '师', meaning: '贞丈人吉，无咎', advice: '统众致胜',
    judgment: '师：贞丈人吉，无咎。',
    image: '地中有水，师。君子以容民畜众。',
    lines: [
      '师出以律否臧凶，师在田中无咎，师左次无咎，师或舆尸凶，大君有命开国承家小人勿用',
    ],
    upperTrigram: 6, lowerTrigram: 3
  },
  8: {
    name: 'Bi', chinese: '比', meaning: '吉，原筮元永贞，无咎', advice: '亲比辅佐',
    judgment: '比：吉。原筮元永贞，无咎。不宁方来，后夫凶。',
    image: '地上有水，比。先王以建万国，亲诸侯。',
    lines: [
      '有孚比之无咎，有孚比之无咎，外比之贞吉，比之无首凶，比之自内贞吉，比之匪人，外比之贞吉',
    ],
    upperTrigram: 6, lowerTrigram: 5
  },
  9: {
    name: 'Xiao Chu', chinese: '小畜', meaning: '亨，密云不雨，自我西郊', advice: '小有积蓄',
    judgment: '小畜：亨。密云不雨，自我西郊。',
    image: '风上于天，小畜。君子以懿文德。',
    lines: [
      '复自道何其咎吉，舆说辐夫妻反目，有孚挛如富以其邻，牵复吉，有孚挛如不独富既雨既处尚德载妇贞厉',
    ],
    upperTrigram: 4, lowerTrigram: 1
  },
  10: {
    name: 'Lu', chinese: '履', meaning: '履虎尾，不咥人，亨', advice: '谨慎行事',
    judgment: '履：履虎尾，不咥人，亨。',
    image: '上天下泽，履。君子以辨上下，定民志。',
    lines: [
      '素履往无咎，履道坦坦幽人贞吉，眇能视跛能履履虎尾咥人凶武人为于大君，夬履贞厉，履虎尾咥人凶吉，，视履考祥其旋元吉',
    ],
    upperTrigram: 1, lowerTrigram: 8
  },
  11: {
    name: 'Tai', chinese: '泰', meaning: '小往大来，吉亨', advice: '天地交泰',
    judgment: '泰：小往大来，吉亨。',
    image: '天地交，泰。后以财成天地之道，辅相天地之宜，以左右民。',
    lines: [
      '拔茅茹以其汇征吉，苞荒用冯河不遐遗，翩翩不富以其邻不戒以孚，无平不陂无往不复艰贞无咎，帝乙归妹以祉元吉',
    ],
    upperTrigram: 8, lowerTrigram: 1
  },
  12: {
    name: 'Pi', chinese: '否', meaning: '否之匪人，不利君子贞，大往小来', advice: '闭塞不通',
    judgment: '否：否之匪人，不利君子贞。大往小来。',
    image: '天地不交，否。君子以俭德辟难，不可荣以禄。',
    lines: [
      '拔茅茹以其汇贞吉亨，苞承小人吉大人否亨，苞羞贞吉，苞有鱼无咎不利宾，倾否先否后喜，否终则倾何可长也',
    ],
    upperTrigram: 1, lowerTrigram: 8
  },
  13: {
    name: 'Tong Ren', chinese: '同人', meaning: '同人于野，亨，利涉大川', advice: '同人于野',
    judgment: '同人：同人于野，亨。利涉大川。',
    image: '天与火，同人。君子以类族辨物。',
    lines: [
      '同人于门无咎同人于宗吝，伏戎于莽升其高陵三岁不兴，乘其墉弗克攻吉同人于郊无悔',
    ],
    upperTrigram: 1, lowerTrigram: 6
  },
  14: {
    name: 'Da You', chinese: '大有', meaning: '元亨', advice: '富有盛德',
    judgment: '大有：元亨。',
    image: '火在天上，大有。君子以遏恶扬善，顺天休命。',
    lines: [
      '无交害匪咎艰则无咎，大车以载有攸往无咎，公用亨于天子小人弗克，匪其彭无咎，厥孚交如威如吉',
    ],
    upperTrigram: 6, lowerTrigram: 1
  },
  15: {
    name: 'Qian (Modesty)', chinese: '谦', meaning: '亨，君子有终', advice: '谦谦君子',
    judgment: '谦：亨，君子有终。',
    image: '地中有山，谦。君子以裒多益寡，称物平施。',
    lines: [
      '谦谦君子用涉大川吉，鸣谦贞吉，劳谦君子有终吉，无不利撝谦，不富以其邻利用侵伐无不利',
    ],
    upperTrigram: 6, lowerTrigram: 3
  },
  16: {
    name: 'Yu', chinese: '豫', meaning: '利建侯行师', advice: '欢乐和众',
    judgment: '豫：利建侯行师。',
    image: '雷出地奋，豫。先王以作乐崇德，殷荐之上帝，以配祖考。',
    lines: [
      '鸣豫凶，介于石不终日贞吉，盱豫悔迟有悔，由豫大有得勿疑朋盍簪，冥豫成有渝无咎',
    ],
    upperTrigram: 3, lowerTrigram: 6
  },
  17: {
    name: 'Sui', chinese: '随', meaning: '元亨利贞，无咎', advice: '随从顺变',
    judgment: '随：元亨利贞，无咎。',
    image: '泽中有雷，随。君子以向晦入宴息。',
    lines: [
      '官有渝贞吉出门交有功，系小子失丈夫，系丈夫失小子，隨有求得利居贞，随有获凶有孚在道以明',
    ],
    upperTrigram: 8, lowerTrigram: 3
  },
  18: {
    name: 'Gu', chinese: '蛊', meaning: '元亨，利涉大川', advice: '整饬治理',
    judgment: '蛊：元亨，利涉大川。',
    image: '山下有风，蛊。君子以振民育德。',
    lines: [
      '干父之蛊有子考无咎厉终吉，干母之蛊不可贞，干父之蛊用誉，裕父之蛊往见吝，幹父之蛊用誉，往未得也',
    ],
    upperTrigram: 7, lowerTrigram: 4
  },
  19: {
    name: 'Lin', chinese: '临', meaning: '元亨利贞，至于八月有凶', advice: '监临督导',
    judgment: '临：元亨利贞。至于八月有凶。',
    image: '泽上有地，临。君子以教思无穷，容保民无疆。',
    lines: [
      '咸临贞吉，咸临吉无不利，甘临无攸利既忧之无咎，至临无咎，敦临吉无咎',
    ],
    upperTrigram: 8, lowerTrigram: 3
  },
  20: {
    name: 'Guan', chinese: '观', meaning: '盥而不荐，有孚颙若', advice: '观仰效法',
    judgment: '观：盥而不荐，有孚颙若。',
    image: '风行地上，观。先王以省方观民设教。',
    lines: [
      '童观小人无咎君子吝，窥观利女贞，观我生进退，未观其生君子无咎，观其生君子无咎',
    ],
    upperTrigram: 4, lowerTrigram: 6
  },
  21: {
    name: 'Shi Ke', chinese: '噬嗑', meaning: '亨，利用狱', advice: '明罚敕法',
    judgment: '噬嗑：亨。利用狱。',
    image: '电雷，噬嗑。先王以明罚敕法。',
    lines: [
      '屦校灭趾无咎，噬肤灭鼻无咎，噬腊肉遇毒小吝无咎，噬干胏得金矢利艰贞吉，噬干肉得黄金贞厉无咎，何校灭耳凶',
    ],
    upperTrigram: 3, lowerTrigram: 5
  },
  22: {
    name: 'Bi (Adornment)', chinese: '贲', meaning: '亨，小利有攸往', advice: '文饰美化',
    judgment: '贲：亨。小利有攸往。',
    image: '山下火，贲。君子以明庶政，无敢折狱。',
    lines: [
      '贲其趾舍车而徒，贲其须，贲如皤如白马翰如匪寇婚媾，贲如濡如永贞吉，贲于丘园束帛戋戋吝终吉',
    ],
    upperTrigram: 7, lowerTrigram: 6
  },
  23: {
    name: 'Bo', chinese: '剥', meaning: '不利有攸往', advice: '剥落衰败',
    judgment: '剥：不利有攸往。',
    image: '山附于地，剥。上以厚下安宅。',
    lines: [
      '剥床以足蔑贞凶，剥床以辨蔑贞凶，剥之无咎，剥床以肤凶，贯鱼以宫人宠不利君子贞',
    ],
    upperTrigram: 7, lowerTrigram: 6
  },
  24: {
    name: 'Fu', chinese: '复', meaning: '亨，出入无疾，朋来无咎', advice: '复归更新',
    judgment: '复：亨。出入无疾，朋来无咎。反复其道，七日来复，利有攸往。',
    image: '雷在地中，复。先王以至日闭关，商旅不行，后不省方。',
    lines: [
      '不远复无祗悔元吉，休复吉，频复厉无咎，中行独复，敦复无悔',
    ],
    upperTrigram: 3, lowerTrigram: 6
  },
  25: {
    name: 'Wu Wang', chinese: '无妄', meaning: '元亨利贞，其匪正有眚', advice: '至诚无妄',
    judgment: '无妄：元亨利贞。其匪正有眚。不利有攸往。',
    image: '天下雷行，物与无妄。先王以茂对时育万物。',
    lines: [
      '无妄往吉，不耕获不菑畬则利有攸往，无妄之灾或系之牛行人之得邑人之灾，可贞无咎，无妄行有眚无攸利',
    ],
    upperTrigram: 3, lowerTrigram: 1
  },
  26: {
    name: 'Da Chu', chinese: '大畜', meaning: '利贞，不家食吉，利涉大川', advice: '大畜养德',
    judgment: '大畜：利贞，不家食吉，利涉大川。',
    image: '天在山中，大畜。君子以多识前言往行，以畜其德。',
    lines: [
      '有厉利已，舆说輹，良马逐利艰贞曰闲舆卫利有攸往，利涉大川',
    ],
    upperTrigram: 7, lowerTrigram: 1
  },
  27: {
    name: 'Yi', chinese: '颐', meaning: '贞吉，观颐，自求口实', advice: '颐养之道',
    judgment: '颐：贞吉。观颐，自求口实。',
    image: '山下有雷，颐。君子以慎言语，节饮食。',
    lines: [
      '舍尔灵龟观我朵颐凶，颠颐吉虎视眈眈其欲逐逐无咎，拂颐贞凶十年勿用无攸利，颠颐吉虎视眈眈其欲逐逐无咎，拂经居贞吉不可涉大川',
    ],
    upperTrigram: 7, lowerTrigram: 3
  },
  28: {
    name: 'Da Guo', chinese: '大过', meaning: '栋桡，利有攸往，亨', advice: '大过人力',
    judgment: '大过：栋桡。利有攸往，亨。',
    image: '泽灭木，大过。君子以独立不惧，遁世无闷。',
    lines: [
      '藉用白茅无咎，枯杨生稊老夫得其女妻无不利，栋桡凶，栋屋吉有它吝',
    ],
    upperTrigram: 8, lowerTrigram: 7
  },
  29: {
    name: 'Kan', chinese: '坎', meaning: '习坎，有孚，维心亨，行有尚', advice: '险中求通',
    judgment: '习坎：有孚，维心亨，行有尚。',
    image: '水洊至，习坎。君子以常德行，习教事。',
    lines: [
      '习坎入于坎窞凶，坎有险求小得，来之坎坎险且枕入于坎窞勿用，樽酒簋贰用缶纳约自牖终无咎，坎不盈祗既平无咎，系用徽纆寘于丛棘三岁不得凶',
    ],
    upperTrigram: 5, lowerTrigram: 5
  },
  30: {
    name: 'Li', chinese: '离', meaning: '利贞，亨，畜牝牛吉', advice: '光明附丽',
    judgment: '离：利贞，亨。畜牝牛吉。',
    image: '明两作，离。大人以继明照于四方。',
    lines: [
      '履错然悔无咎，黄离元吉，日昃之离不鼓缶而歌则大耋之嗟凶，突如其来如焚如死如弃如，突如其来如焚如死如弃如，突如其来如焚如死如弃如，王用出征有嘉折首获匪其丑无咎',
    ],
    upperTrigram: 6, lowerTrigram: 6
  },
  31: {
    name: 'Xian', chinese: '咸', meaning: '亨利贞，取女吉', advice: "感应相通",
    judgment: '咸：亨利贞。取女吉。',
    image: '山上有泽，咸。君子以虚受人。',
    lines: [
      '咸其拇，咸其腓凶居吉，咸其股执其随往吝，贞吉悔亡憧憧往来朋从尔思，咸其脢无悔，咸其辅颊舌',
    ],
    upperTrigram: 8, lowerTrigram: 7
  },
  32: {
    name: 'Heng', chinese: '恒', meaning: '亨无咎，利贞，利有攸往', advice: '恒久守常',
    judgment: '恒：亨无咎，利贞。利有攸往。',
    image: '雷风，恒。君子以立不易方。',
    lines: [
      '浚恒贞凶无攸利，不恒其德或承之羞贞吝，田无禽无咎，不恒其德或承之羞无咎，恒其德贞凶妇人吉夫子凶',
    ],
    upperTrigram: 4, lowerTrigram: 3
  },
  33: {
    name: 'Dun', chinese: '遯', meaning: '亨，小利贞', advice: '退隐待时',
    judgment: '遯：亨。小利贞。',
    image: '天下有山，遯。君子以远小人，不恶而严。',
    lines: [
      '遯尾厉勿用有攸往，执之用黄牛之革莫之胜说，係遯有疾厉畜臣妾吉，好遯君子吉小人否，利有攸往',
    ],
    upperTrigram: 1, lowerTrigram: 7
  },
  34: {
    name: 'Da Zhuang', chinese: '大壮', meaning: '利贞', advice: '盛壮有力',
    judgment: '大壮：利贞。',
    image: '雷在天上，大壮。君子以非礼勿履。',
    lines: [
      '壮于趾征凶有孚，贞吉小人用壮君子用罔贞厉，贞吉悔亡小人用壮君子用罔，贞吉悔亡藩决不羸壮于大舆之輹',
    ],
    upperTrigram: 3, lowerTrigram: 1
  },
  35: {
    name: 'Jin', chinese: '晋', meaning: '康侯用锡马蕃庶，昼日三接', advice: '晋升进益',
    judgment: '晋：康侯用锡马蕃庶，昼日三接。',
    image: '明出地上，晋。先王以明出庶物，作旅智。',
    lines: [
      '晋如摧如贞吉罔孚裕无咎，晋如愁如贞吉受兹介福于其王母，众允悔亡，晋如鼫鼠贞厉悔亡，失得勿恤往有庆也',
    ],
    upperTrigram: 6, lowerTrigram: 3
  },
  36: {
    name: 'Ming Yi', chinese: '明夷', meaning: '利艰贞', advice: '晦而明',
    judgment: '明夷：利艰贞。',
    image: '明入地中，明夷。君子以莅众，用晦而明。',
    lines: [
      '明夷于飞垂其翼君子于行三日不食有攸往主人有言，明夷夷于左股用拯马壮吉，入于左腹获明夷之心于出门庭',
    ],
    upperTrigram: 3, lowerTrigram: 6
  },
  37: {
    name: 'Jia Ren', chinese: '家人', meaning: '利女贞', advice: '家道齐正',
    judgment: '家人：利女贞。',
    image: '风自火出，家人。君子以言有物而行有恒。',
    lines: [
      '闲有家悔亡，家人嗃嗃悔厉吉妇子嘻嘻终吝，富家大吉，家人好好乐渐渐余',
    ],
    upperTrigram: 4, lowerTrigram: 6
  },
  38: {
    name: 'Kui', chinese: '睽', meaning: '小事吉', advice: '乖离对立',
    judgment: '睽：小事吉。',
    image: '上火下泽，睽。君子以同而异。',
    lines: [
      '悔亡丧马勿逐自复见恶人无咎，遇主于巷无咎，见舆曳其牛掣其人天且劓无初有终，睽孤遇元夫交孚厉无咎',
    ],
    upperTrigram: 8, lowerTrigram: 6
  },
  39: {
    name: 'Jian', chinese: '蹇', meaning: '利西南，不利东北，利见大人，贞吉', advice: '蹇难险阻',
    judgment: '蹇：利西南，不利东北。利见大人，贞吉。',
    image: '山上有水，蹇。君子以反身修德。',
    lines: [
      '往蹇来誉，王臣蹇蹇匪躬之故，往蹇来反，往蹇来连，大蹇朋来',
    ],
    upperTrigram: 7, lowerTrigram: 5
  },
  40: {
    name: 'Jie', chinese: '解', meaning: '利西南，无所往，其来复吉', advice: '解除险难',
    judgment: '解：利西南。无所往，其来复吉。有攸往，夙吉。',
    image: '雷雨作，解。君子以赦过宥罪。',
    lines: [
      '无咎，田获三狐得黄矢贞吉，解而拇朋至斯孚，解公用射隼于高墉之上获之无不利',
    ],
    upperTrigram: 3, lowerTrigram: 5
  },
  41: {
    name: 'Sun', chinese: '损', meaning: '有孚，元吉，无咎可贞，利有攸往', advice: '减损增益',
    judgment: '损：有孚，元吉，无咎可贞，利有攸往。曷之用？二簋可用享。',
    image: '山下泽，损。君子以惩忿窒欲。',
    lines: [
      '已事遄往无咎酌损之，利贞征凶弗损益之，或益之十朋之龟弗克违元吉',
    ],
    upperTrigram: 7, lowerTrigram: 8
  },
  42: {
    name: 'Yi', chinese: '益', meaning: '利有攸往，利涉大川', advice: '益增利益',
    judgment: '益：利有攸往，利涉大川。',
    image: '风雷，益。君子以见善则迁，有过则改。',
    lines: [
      '利用为大作元吉无咎，或益之自外来也，益之用凶事无咎有孚中行告公用圭，中行告公从利用为依迁国',
    ],
    upperTrigram: 4, lowerTrigram: 3
  },
  43: {
    name: 'Guai', chinese: '夬', meaning: '扬于王庭，孚号有厉，告自邑，不利即戎', advice: '决断刚果',
    judgment: '夬：扬于王庭，孚号有厉，告自邑，不利即戎。利有攸往。',
    image: '泽上于天，夬。君子以施禄及下，居德则忌。',
    lines: [
      '壮于前趾往不胜为咎，惕号莫夜有戎勿恤，壮于頄有凶君子夬夬独行遇雨终无咎，臀无肤其行次且牵羊悔亡消息不穷',
    ],
    upperTrigram: 8, lowerTrigram: 1
  },
  44: {
    name: 'Gou', chinese: '姤', meaning: '女壮，勿用取女', advice: '机遇相会',
    judgment: '姤：女壮，勿用取女。',
    image: '天下有风，姤。后以施命诰四方。',
    lines: [
      '系于金柅贞吉有攸往见凶，臀无肤其行次且厉无咎，包有鱼无咎宾不利，臀无肤其行次且厉无咎，姤其角吝无咎',
    ],
    upperTrigram: 4, lowerTrigram: 1
  },
  45: {
    name: 'Cui', chinese: '萃', meaning: '王假有庙，利见大人，亨利贞', advice: '聚合荟萃',
    judgment: '萃：王假有庙，利见大人，亨利贞。用大牲吉，利有攸往。',
    image: '泽上于地，萃。君子以除戎器，戒不虞。',
    lines: [
      '有孚不终乃乱乃萃若号一握为笑乱乃萃引吉， 引吉无咎大吉无咎，萃如嗟如无攸利往无咎小吝',
    ],
    upperTrigram: 8, lowerTrigram: 6
  },
  46: {
    name: 'Sheng', chinese: '升', meaning: '元亨，用见大人，勿恤，南征吉', advice: '上升进长',
    judgment: '升：元亨。用见大人，勿恤。南征吉。',
    image: '地中升木，升。君子以顺德，积小以高大。',
    lines: [
      '允升大吉，升阶维利用见大人勿恤，南征吉志行也',
    ],
    upperTrigram: 6, lowerTrigram: 4
  },
  47: {
    name: 'Kun', chinese: '困', meaning: '亨，贞大人吉，无咎，有言不信', advice: '困穷而通',
    judgment: '困：亨，贞大人吉，无咎。有言不信。',
    image: '泽无水，困。君子以致命遂志。',
    lines: [
      '臀困于株木入于幽谷三岁不觌凶，困于酒食朱绂方来利用亨祀，利用祭祀困于石据于蒺藜入于其宫不见其妻凶',
    ],
    upperTrigram: 8, lowerTrigram: 5
  },
  48: {
    name: 'Jing', chinese: '井', meaning: '改邑不改井，无丧无得，往来井井', advice: '井养不穷',
    judgment: '井：改邑不改井，无丧无得，往来井井。汔至亦未繘井，羸其瓶，凶。',
    image: '木上有水，井。君子以劳民劝相。',
    lines: [
      '井泥不食旧井无禽，井谷射鲋瓮敝漏，井渫不食为我心恻可用汲王明并受其福，井甃勿幕有孚元吉，井冽寒泉食',
    ],
    upperTrigram: 5, lowerTrigram: 4
  },
  49: {
    name: 'Ge', chinese: '革', meaning: '己日乃孚，元亨利贞，悔亡', advice: '变革更新',
    judgment: '革：己日乃孚。元亨利贞，悔亡。',
    image: '泽中有火，革。君子以治历明时。',
    lines: [
      '巩用黄牛之革，已日乃革之征吉无咎，征凶贞厉革言三就有孚，改命吉',
    ],
    upperTrigram: 8, lowerTrigram: 6
  },
  50: {
    name: 'Ding', chinese: '鼎', meaning: '元吉，亨', advice: '鼎新立业',
    judgment: '鼎：元吉，亨。',
    image: '木上有火，鼎。君子以正位凝命。',
    lines: [
      '鼎颠趾利出否得妾以其子无咎，鼎有实我仇有疾不我能即凶，鼎耳革其行塞雉膏不食方雨亏悔终吉，鼎折足覆公餗其形渥凶',
    ],
    upperTrigram: 6, lowerTrigram: 4
  },
  51: {
    name: 'Zhen', chinese: '震', meaning: '亨，震来虩虩，笑言哑哑', advice: '震动惊远',
    judgment: '震：亨。震来虩虩，笑言哑哑。震惊百里，不丧七鬯。',
    image: '洊雷，震。君子以恐惧修省。',
    lines: [
      '震来虩虩后笑言哑哑吉，震来厉亿丧贝跻于九陵勿逐七日得，震苏苏震行无眚，震遂泥',
    ],
    upperTrigram: 3, lowerTrigram: 3
  },
  52: {
    name: 'Gen', chinese: '艮', meaning: '艮其背不获其身，行其庭不见其人，无咎', advice: '静止安止',
    judgment: '艮：艮其背不获其身，行其庭不见其人，无咎。',
    image: '兼山，艮。君子以思不出其位。',
    lines: [
      '艮其趾无咎利永贞，艮其腓不拯其随其心不快，艮其限列其夤厉薰心，艮其身无咎，敦艮吉',
    ],
    upperTrigram: 7, lowerTrigram: 7
  },
  53: {
    name: 'Jian', chinese: '渐', meaning: '女归吉，利贞', advice: '渐进有序',
    judgment: '渐：女归吉，利贞。',
    image: '山上有木，渐。君子以居贤德善俗。',
    lines: [
      '鸿渐于干小子厉有言无咎，鸿渐于磐饮食衎衎吉，鸿渐于陆夫征不复妇孕不育凶，鸿渐于木或得其桷无咎，鸿渐于陵妇三岁不孕终莫之胜吉',
    ],
    upperTrigram: 7, lowerTrigram: 4
  },
  54: {
    name: 'Gui Mei', chinese: '归妹', meaning: '征凶，无攸利', advice: '归妹出嫁',
    judgment: '归妹：征凶，无攸利。',
    image: '泽上有雷，归妹。君子以永终知敝。',
    lines: [
      '归妹以娣跛能履征吉，眇能视利幽人之贞，归妹以须反归以娣，帝乙归妹其君之袂不如其娣之袂良月几望吉',
    ],
    upperTrigram: 3, lowerTrigram: 8
  },
  55: {
    name: 'Feng', chinese: '丰', meaning: '亨，王假之，勿忧宜日中', advice: '丰盛盛大',
    judgment: '丰：亨，王假之，勿忧宜日中。',
    image: '雷电皆至，丰。君子以折狱致刑。',
    lines: [
      '遇其配主虽旬无咎往有尚，丰其蔀日中见斗往得疑疾有孚发若吉，丰其沛日中见沫折其右肱无咎，丰其蔀日中见斗遇其夷主吉',
    ],
    upperTrigram: 3, lowerTrigram: 5
  },
  56: {
    name: 'Lv', chinese: '旅', meaning: '小亨，旅贞吉', advice: '羁旅在外',
    judgment: '旅：小亨，旅贞吉。',
    image: '山上有火，旅。君子以明慎用刑，而不留狱。',
    lines: [
      '旅琐琐斯其所取灾，旅即次怀其资得童仆贞，旅焚其次丧其童仆贞厉，旅于处得齐斧贞吉，射雉一矢亡终以誉命',
    ],
    upperTrigram: 7, lowerTrigram: 6
  },
  57: {
    name: 'Xun', chinese: '巽', meaning: '小亨，利有攸往，利见大人', advice: '巽顺入微',
    judgment: '巽：小亨。利有攸往，利见大人。',
    image: '随风，巽。君子以申命行事。',
    lines: [
      '进退利武人之贞，巽在床下用史巫纷若吉无咎，频巽吝，悔亡田获三品，巽在床下丧其齐斧贞吉',
    ],
    upperTrigram: 4, lowerTrigram: 4
  },
  58: {
    name: 'Dui', chinese: '兑', meaning: '亨，利贞', advice: '欣悦和兑',
    judgment: '兑：亨，利贞。',
    image: '丽泽，兑。君子以朋友讲习。',
    lines: [
      '和兑吉，孚兑吉悔亡，来的兑凶，商兑未宁介疾有喜，孚于剥有厉',
    ],
    upperTrigram: 8, lowerTrigram: 8
  },
  59: {
    name: 'Huan', chinese: '涣', meaning: '亨，王假有庙，利涉大川，利贞', advice: '涣散疏通',
    judgment: '涣：亨。王假有庙，利涉大川，利贞。',
    image: '风水涣。先王以享于帝立庙。',
    lines: [
      '用拯马壮吉，涣奔其机悔亡，涣其躬无悔，涣其群元吉散其负',
    ],
    upperTrigram: 4, lowerTrigram: 5
  },
  60: {
    name: 'Jie', chinese: '节', meaning: '亨，苦节不可贞', advice: '节制有度',
    judgment: '节：亨。苦节不可贞。',
    image: '泽上有水，节。君子以制数度，议德行。',
    lines: [
      '不出户庭无咎，不出门庭凶， 不节若则嗟若无咎，安节亨，甘节吉往有尚',
    ],
    upperTrigram: 8, lowerTrigram: 5
  },
  61: {
    name: 'Zhong Fu', chinese: '中孚', meaning: '豚鱼吉，利涉大川，利贞', advice: '至诚中信',
    judgment: '中孚：豚鱼吉，利涉大川，利贞。',
    image: '风泽中孚。君子以议狱缓死。',
    lines: [
      '虞吉有他不孚，鸣鹤在阴其子和之我有好爵吾与尔靡之得敌或鼓或罢或泣或歌，月几望马匹亡无咎，有孚挛如无咎',
    ],
    upperTrigram: 4, lowerTrigram: 8
  },
  62: {
    name: 'Xiao Guo', chinese: '小过', meaning: '亨利贞，可小事不可大事', advice: '小过矫枉',
    judgment: '小过：亨利贞。可小事，不可大事。飞鸟遗之音，不宜上宜下，大吉。',
    image: '山上有雷，小过。君子以行过乎恭，丧过乎哀，用过乎俭。',
    lines: [
      '飞鸟以凶，不及其君遇其臣无咎，弗过防之往厉必戒勿用永贞，弗过遇之往厉必戒勿用永贞，无咎弗过遇之厉必戒终日不懈',
    ],
    upperTrigram: 7, lowerTrigram: 3
  },
  63: {
    name: 'Ji Ji', chinese: '既济', meaning: '亨小利贞，初吉终乱', advice: '既济完成',
    judgment: '既济：亨小利贞。初吉终乱。',
    image: '水在火上，既济。君子以思患而豫防之。',
    lines: [
      '曳其轮濡其尾无咎，妇丧其茀勿逐七日得， 高宗伐鬼方三年克之小人勿用，繻有衣袽终日戒',
    ],
    upperTrigram: 5, lowerTrigram: 6
  },
  64: {
    name: 'Wei Ji', chinese: '未济', meaning: '亨，小狐汔济濡其尾，无攸利', advice: '未济待时',
    judgment: '未济：亨。小狐汔济，濡其尾，无攸利。',
    image: '火在水上，未济。君子以慎辨物居方。',
    lines: [
      '濡其尾吝，曳其轮贞吉， 未济征凶利涉大川， 贞吉悔亡震用伐鬼方三年有赏于大国，贞吉无悔君子之光有孚吉',
    ],
    upperTrigram: 6, lowerTrigram: 5
  },
}

const HEXAGRAMS: Record<number, { name: string; chinese: string; meaning: string; advice: string }> = {
  1: { name: 'Qian', chinese: '乾', meaning: 'Creative Force - Heaven', advice: 'Be assertive and leading' },
  2: { name: 'Kun', chinese: '坤', meaning: 'Receiving Force - Earth', advice: 'Be receptive and nurturing' },
  3: { name: 'Zhun', chinese: '屯', meaning: 'Difficulty at the Beginning', advice: 'Start slowly and carefully' },
  4: { name: 'Meng', chinese: '蒙', meaning: 'Youthful Folly', advice: 'Seek guidance and education' },
  5: { name: 'Xu', chinese: '需', meaning: 'Waiting', advice: 'Have patience and prepare' },
  6: { name: 'Song', chinese: '讼', meaning: 'Conflict', advice: 'Avoid disputes, seek harmony' },
  7: { name: 'Shi', chinese: '师', meaning: 'The Army', advice: 'Organize and lead with discipline' },
  8: { name: 'Bi', chinese: '比', meaning: 'Seeking Alliance', advice: 'Build relationships and trust' },
  9: { name: 'Xiao Chu', chinese: '小畜', meaning: 'Small Accumulation', advice: 'Gradual progress, small wins' },
  10: { name: 'Lu', chinese: '履', meaning: 'Treading Carefully', advice: 'Proceed with caution' },
  11: { name: 'Tai', chinese: '泰', meaning: 'Peace and Harmony', advice: 'Enjoy prosperity and balance' },
  12: { name: 'Pi', chinese: '否', meaning: 'Obstruction', advice: 'Wait for better times' },
  13: { name: 'Tong Ren', chinese: '同人', meaning: 'Seeking Fellowship', advice: 'Connect with like-minded people' },
  14: { name: 'Da You', chinese: '大有', meaning: 'Great Possession', advice: 'Enjoy success and abundance' },
  15: { name: 'Qian', chinese: '谦', meaning: 'Modesty', advice: 'Stay humble and grounded' },
  16: { name: 'Yu', chinese: '豫', meaning: 'Enthusiasm', advice: 'Channel energy positively' },
  17: { name: 'Sui', chinese: '随', meaning: 'Following', advice: 'Adapt and go with flow' },
  18: { name: 'Gu', chinese: '蛊', meaning: 'Decay', advice: 'Address problems before they spread' },
  19: { name: 'Lin', chinese: '临', meaning: 'Approaching', advice: 'Take initiative and lead' },
  20: { name: 'Guan', chinese: '观', meaning: 'Contemplation', advice: 'Observe before acting' },
  21: { name: 'Shi Ke', chinese: '噬嗑', meaning: 'Biting Through', advice: 'Take decisive action' },
  22: { name: 'Bi', chinese: '贲', meaning: 'Adornment', advice: 'Focus on presentation' },
  23: { name: 'Bo', chinese: '剥', meaning: 'Stripping Away', advice: 'Simplify and let go' },
  24: { name: 'Fu', chinese: '复', meaning: 'Return', advice: 'Time for renewal and restart' },
  25: { name: 'Wu Wang', chinese: '无妄', meaning: 'Innocence', advice: 'Act with sincerity' },
  26: { name: 'Da Chu', chinese: '大畜', meaning: 'Great Accumulation', advice: 'Prepare for big opportunities' },
  27: { name: 'Yi', chinese: '颐', meaning: 'Nourishment', advice: 'Take care of your foundation' },
  28: { name: 'Da Guo', chinese: '大过', meaning: 'Great Excess', advice: 'Balance extremes carefully' },
  29: { name: 'Kan', chinese: '坎', meaning: 'Danger', advice: 'Stay cautious and resilient' },
  30: { name: 'Li', chinese: '离', meaning: 'Clarity', advice: 'Seek illumination and awareness' },
  31: { name: 'Xian', chinese: '咸', meaning: 'Influence', advice: 'Be sensitive to others' },
  32: { name: 'Heng', chinese: '恒', meaning: 'Constancy', advice: 'Stay persistent and steady' },
  33: { name: 'Dun', chinese: '遯', meaning: 'Retreat', advice: 'Know when to step back' },
  34: { name: 'Da Zhuang', chinese: '大壮', meaning: 'Great Strength', advice: 'Channel power wisely' },
  35: { name: 'Jin', chinese: '晋', meaning: 'Progress', advice: 'Move forward with grace' },
  36: { name: 'Ming Yi', chinese: '明夷', meaning: 'Darkness Visible', advice: 'Endure through difficulty' },
  37: { name: 'Jia Ren', chinese: '家人', meaning: 'Family', advice: 'Focus on home and relationships' },
  38: { name: 'Kui', chinese: '睽', meaning: 'Opposition', advice: 'Find common ground' },
  39: { name: 'Jian', chinese: '蹇', meaning: 'Obstruction', advice: 'Navigate obstacles carefully' },
  40: { name: 'Jie', chinese: '解', meaning: 'Release', advice: 'Let go of burdens' },
  41: { name: 'Sun', chinese: '损', meaning: 'Decrease', advice: 'Simplify and reduce' },
  42: { name: 'Yi', chinese: '益', meaning: 'Increase', advice: 'Build and expand' },
  43: { name: 'Guai', chinese: '夬', meaning: 'Breakthrough', advice: 'Make decisive changes' },
  44: { name: 'Gou', chinese: '姤', meaning: 'Meeting', advice: 'Seize opportunities wisely' },
  45: { name: 'Cui', chinese: '萃', meaning: 'Gathering', advice: 'Unite with others' },
  46: { name: 'Sheng', chinese: '升', meaning: 'Rising', advice: 'Continue upward progress' },
  47: { name: 'Kun', chinese: '困', meaning: 'Exhaustion', advice: 'Find strength in adversity' },
  48: { name: 'Jing', chinese: '井', meaning: 'The Well', advice: 'Maintain your foundation' },
  49: { name: 'Ge', chinese: '革', meaning: 'Transformation', advice: 'Embrace necessary changes' },
  50: { name: 'Ding', chinese: '鼎', meaning: 'The Cauldron', advice: 'New beginnings await' },
  51: { name: 'Zhen', chinese: '震', meaning: 'Thunder', advice: 'Awaken and take action' },
  52: { name: 'Gen', chinese: '艮', meaning: 'Stillness', advice: 'Find inner peace' },
  53: { name: 'Jian', chinese: '渐', meaning: 'Gradual Progress', advice: 'Step by step advancement' },
  54: { name: 'Gui Mei', chinese: '归妹', meaning: 'Marriage', advice: 'Balance partnerships' },
  55: { name: 'Feng', chinese: '丰', meaning: 'Abundance', advice: 'Maximize your potential' },
  56: { name: 'Lv', chinese: '旅', meaning: 'Travel', advice: 'Adapt to new environments' },
  57: { name: 'Xun', chinese: '巽', meaning: 'Wind', advice: 'Be flexible and gentle' },
  58: { name: 'Dui', chinese: '兑', meaning: 'Joy', advice: 'Share happiness with others' },
  59: { name: 'Huan', chinese: '涣', meaning: 'Dispersion', advice: 'Clear obstacles and spread' },
  60: { name: 'Jie', chinese: '节', meaning: 'Moderation', advice: 'Set boundaries wisely' },
  61: { name: 'Zhong Fu', chinese: '中孚', meaning: 'Sincerity', advice: 'Be true to yourself' },
  62: { name: 'Xiao Guo', chinese: '小过', meaning: 'Small Excess', advice: 'Pay attention to details' },
  63: { name: 'Ji Ji', chinese: '既济', meaning: 'Completion', advice: 'Celebrate achievements' },
  64: { name: 'Wei Ji', chinese: '未济', meaning: 'Before Completion', advice: 'Prepare for next cycle' },
}

// 三枚铜钱掷卦法
// 每枚铜钱: 正面(字)=2, 背面(背)=1
// 三枚总和: 3=老阴(动), 4=少阴, 5=少阳, 6=老阳(动)
// 老阴(6)和老阳(9)为动爻，会发生变化

export type YaoResult = {
  value: number       // 3,4,5,6
  isYang: boolean    // true=阳, false=阴
  isOld: boolean     // 是否动爻 (6或9)
  line: number       // 第几爻 (1-6，从下往上)
}

// 掷一次三枚铜钱
export function tossThreeCoins(): number {
  // 随机生成三个铜钱的结果
  // 1=背(阴), 2=字(阳)
  const coin1 = Math.random() > 0.5 ? 2 : 1
  const coin2 = Math.random() > 0.5 ? 2 : 1
  const coin3 = Math.random() > 0.5 ? 2 : 1
  return coin1 + coin2 + coin3
}

// 将掷卦结果转换为爻
// 3=老阴(动,6), 4=少阴, 5=少阳, 6=老阳(动,9)
export function coinSumToYao(sum: number, line: number): YaoResult {
  const isYang = sum >= 5  // 5,6为阳
  const isOld = sum === 3 || sum === 6  // 3(老阴),6(老阳)为动爻

  return {
    value: sum,
    isYang,
    isOld,
    line,
  }
}

// 掷六次生成一个完整的卦
export function tossHexagram(): YaoResult[] {
  const lines: YaoResult[] = []

  // 从下往上掷六次
  for (let i = 1; i <= 6; i++) {
    const sum = tossThreeCoins()
    lines.push(coinSumToYao(sum, i))
  }

  return lines
}

// 根据六爻计算卦象号码 (1-64)
// 下卦(内卦)在前，上卦(外卦)在后
export function getHexagramNumber(lines: YaoResult[]): number {
  // 将爻转换为二进制 (阳=1, 阴=0)
  // 从下往上，下卦是1-3爻，上卦是4-6爻

  // 计算下卦 (初二三爻)
  let lower = 0
  for (let i = 0; i < 3; i++) {
    if (lines[i].isYang) {
      lower += Math.pow(2, 2 - i)
    }
  }

  // 计算上卦 (四五六爻)
  let upper = 0
  for (let i = 3; i < 6; i++) {
    if (lines[i].isYang) {
      upper += Math.pow(2, 5 - i)
    }
  }

  // 转换为1-8的八卦号
  const lowerGua = lower + 1  // 0-7 -> 1-8
  const upperGua = upper + 1

  // 计算64卦号码: (上卦-1) * 8 + 下卦
  return (upperGua - 1) * 8 + lowerGua
}

// 获取变卦 (如果有动爻)
export function getChangedHexagramNumber(lines: YaoResult[]): number | null {
  const hasChanging = lines.some(line => line.isOld)
  if (!hasChanging) return null

  // 创建变爻后的新卦
  const newLines = lines.map(line => {
    if (line.isOld) {
      // 动爻: 阴变阳，阳变阴
      return {
        ...line,
        isYang: !line.isYang,
      }
    }
    return line
  })

  return getHexagramNumber(newLines)
}

// 从卦象号码获取详细卦象
export function getHexagramDetail(hexagramNumber: number) {
  return HEXAGRAM_DETAILS[hexagramNumber] || HEXAGRAM_DETAILS[1]
}

// 获取八卦符号
export function getTrigramSymbol(trigramNumber: number): string {
  return BAGUA_SYMBOLS[trigramNumber - 1] || '☰'
}

// 获取六十四卦的完整显示
export function getHexagramDisplay(lines: YaoResult[]) {
  const hexNumber = getHexagramNumber(lines)
  const detail = getHexagramDetail(hexNumber)

  const changedNumber = getChangedHexagramNumber(lines)

  return {
    lines,
    hexagramNumber: hexNumber,
    changedHexagramNumber: changedNumber,
    detail,
    hasChanging: lines.some(l => l.isOld),
    // 上下卦
    upperTrigram: detail.upperTrigram,
    lowerTrigram: detail.lowerTrigram,
    upperSymbol: getTrigramSymbol(detail.upperTrigram),
    lowerSymbol: getTrigramSymbol(detail.lowerTrigram),
  }
}

// Calculate Plum Blossom hexagram from birth date
export function getMeihuaHexagram(birthDate: Date): {
  upper: number
  lower: number
  hexagram: number
  name: string
  chinese: string
  meaning: string
  advice: string
} {
  const year = birthDate.getFullYear()
  const month = birthDate.getMonth() + 1
  const day = birthDate.getDate()

  // Algorithm: Use year, month, day to generate hexagram numbers
  const upperNum = ((year + month) % 8) + 1
  const lowerNum = ((month + day) % 8) + 1
  const changeNum = ((year + day) % 6) + 1

  // Calculate hexagram number (1-64)
  const hexagram = ((upperNum - 1) * 8) + lowerNum

  const hex = HEXAGRAMS[hexagram] || HEXAGRAMS[1]

  return {
    upper: upperNum,
    lower: lowerNum,
    hexagram,
    name: hex.name,
    chinese: hex.chinese,
    meaning: hex.meaning,
    advice: hex.advice,
  }
}

// Get先天八卦 (Earlier Heaven Ba Gua) from birth year
export function getBaGuaEarlyHeaven(year: number): {gua: string; element: string; meaning: string} {
  const baGua = [
    { gua: '乾', element: '金', meaning: 'Heaven - Creation, strength' },
    { gua: '坎', element: '水', meaning: 'Water - Danger, flow' },
    { gua: '艮', element: '土', meaning: 'Mountain - Stillness, stop' },
    { gua: '震', element: '木', meaning: 'Thunder - Movement, awakening' },
    { gua: '巽', element: '木', meaning: 'Wind - Gentle, infiltration' },
    { gua: '离', element: '火', meaning: 'Fire - Clarity, vision' },
    { gua: '坤', element: '土', meaning: 'Earth - Receptive, nurturing' },
    { gua: '兑', element: '金', meaning: 'Lake - Joy, communication' },
  ]
  return baGua[year % 8]
}

// Calculate Life Path Number
export function getLifePathNumber(year: number, month: number, day: number): number {
  const sum = year + month + day
  let result = sum
  while (result > 9 && result !== 11 && result !== 22 && result !== 33) {
    result = String(result).split('').reduce((a, b) => a + Number(b), 0)
  }
  return result
}

// Life Path meanings
export const LIFE_PATH_MEANINGS: Record<number, { name: string; strengths: string; challenges: string }> = {
  1: { name: 'The Independent', strengths: 'Leader, innovator, determined', challenges: 'Can be selfish, impatient' },
  2: { name: 'The Diplomat', strengths: 'Cooperative, sensitive, patient', challenges: 'Can be indecisive, overly emotional' },
  3: { name: 'The Creative', strengths: 'Expressive, social, optimistic', challenges: 'Can be superficial, scattered' },
  4: { name: 'The Builder', strengths: 'Practical, organized, hardworking', challenges: 'Can be rigid, stubborn' },
  5: { name: 'The Adventurer', strengths: 'Freedom-loving, versatile, progressive', challenges: 'Can be irresponsible, scattered' },
  6: { name: 'The Nurturer', strengths: 'Responsible, caring, harmonious', challenges: 'Can be self-sacrificing, possessive' },
  7: { name: 'The Seeker', strengths: 'Analytical, introspective, wise', challenges: 'Can be aloof, secretive' },
  8: { name: 'The Achiever', strengths: 'Powerful, material, ambitious', challenges: 'Can be materialistic, dominating' },
  9: { name: 'The Humanitarian', strengths: 'Compassionate, generous, wise', challenges: 'Can be impractical, martyr-like' },
  11: { name: 'The Master', strengths: 'Intuitive, spiritual, inspirational', challenges: 'Can be over-sensitive, prone to anxiety' },
  22: { name: 'The Master Builder', strengths: 'Practical, powerful, accomplished', challenges: 'Can be overly ambitious' },
}
