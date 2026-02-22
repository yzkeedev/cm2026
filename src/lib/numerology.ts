// Numerology calculations for Western Numerology
// Life Path, Expression, Soul Urge, Personality, and Birthday Numbers

import { getLifePathNumber, LIFE_PATH_MEANINGS } from './bazi'

// Letter to number mapping (A=1, B=2, ... Z=9, with repeating pattern)
const LETTER_VALUES: Record<string, number> = {
  a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9,
  j: 1, k: 2, l: 3, m: 4, n: 5, o: 6, p: 7, q: 8, r: 9,
  s: 1, t: 2, u: 3, v: 4, w: 5, x: 6, y: 7, z: 8,
}

// Vowels for Soul Urge calculation
const VOWELS = new Set(['a', 'e', 'i', 'o', 'u'])

// Reduce number to single digit (or master numbers 11, 22, 33)
export function reduceToSingleDigit(num: number): number {
  let result = num
  while (result > 9 && result !== 11 && result !== 22 && result !== 33) {
    result = String(result).split('').reduce((a, b) => a + Number(b), 0)
  }
  return result
}

// Calculate the numeric value of a name
function getNameValue(name: string): number {
  const cleanName = name.toLowerCase().replace(/[^a-z]/g, '')
  let sum = 0
  for (const char of cleanName) {
    sum += LETTER_VALUES[char] || 0
  }
  return sum
}

// Calculate Expression Number (from full name)
export function getExpressionNumber(name: string): number {
  const value = getNameValue(name)
  return reduceToSingleDigit(value)
}

// Calculate Soul Urge Number (from vowels in name)
export function getSoulUrgeNumber(name: string): number {
  const cleanName = name.toLowerCase().replace(/[^a-z]/g, '')
  let sum = 0
  for (const char of cleanName) {
    if (VOWELS.has(char)) {
      sum += LETTER_VALUES[char] || 0
    }
  }
  return reduceToSingleDigit(sum)
}

// Calculate Personality Number (from consonants in name)
export function getPersonalityNumber(name: string): number {
  const cleanName = name.toLowerCase().replace(/[^a-z]/g, '')
  let sum = 0
  for (const char of cleanName) {
    if (!VOWELS.has(char) && LETTER_VALUES[char]) {
      sum += LETTER_VALUES[char]
    }
  }
  return reduceToSingleDigit(sum)
}

// Calculate Birthday Number (just the day of month)
export function getBirthdayNumber(day: number): number {
  return day
}

// Numerology Number meanings
export const NUMEROLOGY_MEANINGS: Record<number, {
  name: string
  chinese: string
  personality: string
  strengths: string[]
  challenges: string[]
  careers: string[]
  relationships: string
  advice: string
}> = {
  1: {
    name: 'The Independent',
    chinese: '独立者',
    personality: '自然领袖，創新者，意志堅定。你天生具有領導才能，喜歡開創新道路，不甘於平凡。你的能量充滿陽光和活力，總是勇於挑戰現狀。',
    strengths: ['領導力', '創新精神', '意志堅定', '獨立自主', '勇氣'],
    challenges: ['過於自我', '固執己見', '缺乏耐心', '過度競爭'],
    careers: ['企業家', '發明家', 'CEO', '創意總監', '創業者'],
    relationships: '你欣賞有獨立精神的伴侶，需要空間和自由。最適合欣賞你才華、支持你夢想的人。',
    advice: '學會倾听他人意見，適當妥協會讓你更成功。記住，團隊合作能放大你的個人能力。'
  },
  2: {
    name: 'The Diplomat',
    chinese: '外交官',
    personality: '天生合作者，敏感細膩，耐性極強。你善于调和差异，在关系中寻求和谐。你的直覺敏銳，能察覺他人情緒。',
    strengths: ['合作精神', '敏感直覺', '耐心包容', '外交能力', '藝術氣質'],
    challenges: ['過度敏感', '優柔寡斷', '過度犧牲', '依賴他人'],
    careers: ['外交官', '調解員', '藝術家', '設計師', '心理諮詢師'],
    relationships: '你渴望深度情感連接，需要伴侶的溫柔與理解。學會設立界限，避免過度付出。',
    advice: '相信自己的決定，你比想象中更有力量。勇敢表達真實想法，不要為了迎合他人而失去自我。'
  },
  3: {
    name: 'The Creative',
    chinese: '創造者',
    personality: '表達者，社交達人，樂觀積極。你用創意看待世界，總能找到生活中的美好。你的能量具有感染力，能激勵周圍的人。',
    strengths: ['表達能力', '社交魅力', '創意無限', '樂觀開朗', '藝術天賦'],
    challenges: ['過度理想化', '逃避現實', '難以專注', '情緒波動'],
    careers: ['藝術家', '演員', '作家', '音樂家', '公關專家'],
    relationships: '你需要能欣賞你創造力、分享生活樂趣的伴侶。避免過度依賴他人認可來獲得快樂。',
    advice: '將創意付諸實踐，讓夢想成真。學會面對困難，因為才華需要責任來支撐。'
  },
  4: {
    name: 'The Builder',
    chinese: '建設者',
    personality: '務實者，有組織，勤奮踏實。你相信努力工作會有回報，善於建立穩固的基礎。你的能量是穩定和可靠。',
    strengths: ['實幹精神', '組織能力', '勤奮努力', '穩定可靠', '系統思維'],
    challenges: ['過度固執', '不懂變通', '工作狂傾向', '過度保守'],
    careers: ['建築師', '工程師', '財務專家', '管理人員', '教育工作者'],
    relationships: '你是忠誠可靠的伴侶，但需要學會表達情感。找到工作與生活的平衡對你很重要。',
    advice: '學會靈活變通，接納變化。偶爾放慢腳步，享受生活中的小確幸。'
  },
  5: {
    name: 'The Adventurer',
    chinese: '探險家',
    personality: '自由靈魂，多才多藝，追求變化。你厭倦一成不变的生活，渴望體驗各種可能性。你的能量是冒險和突破。',
    strengths: ['適應能力', '多才多藝', '冒險精神', '溝通能力', '正向思維'],
    challenges: ['逃避責任', '難以專一', '過度活躍', '決策草率'],
    careers: ['旅行作家', '營銷專家', '投資者', '媒體人', '企業家'],
    relationships: '你需要能支持你冒險精神、給予自由的伴侶。學會為關係承擔責任，承諾是成長的開始。',
    advice: '找到內心的確定性，自由不等於無根。將冒險精神與長期目標結合，創造有意義的人生。'
  },
  6: {
    name: 'The Nurturer',
    chinese: '滋養者',
    personality: '責任擔當，富有愛心，追求和諧。你是天生照顧者，總是將他人需求放在首位。你的能量是溫暖和奉獻。',
    strengths: ['關懷他人', '責任感強', '和家庭諧', '審美能力', '調解能力'],
    challenges: ['過度付出', '控制欲強', '自我犧牲', '逃避問題'],
    careers: ['教師', '醫護人員', '社工', '室內設計師', '家庭顧問'],
    relationships: '你渴望穩定的家庭生活，但需要學會愛自己的同時愛他人。不要讓照顧他人成為逃避自我的藉口。',
    advice: '照顧好自己才能更好地照顧他人。學會說「不」，你的價值不在於被需要而在於被珍惜。'
  },
  7: {
    name: 'The Seeker',
    chinese: '探索者',
    personality: '分析大師，內省智者，追求真理。你喜歡深入思考，探索生命的意義。你的直覺和智慧是天生稟賦。',
    strengths: ['分析能力', '直覺敏銳', '智慧深邃', '專注持久', '思想獨立'],
    challenges: ['過度內向', '封閉自我', '過度懷疑', '情感疏離'],
    careers: ['科學家', '哲學家', '心理學家', '研究者', '開發者'],
    relationships: '你需要能理解你深度思考、尊重你獨處空間的伴侶。學會敞開心扉，連接比獨立更重要。',
    advice: '與他人分享你的智慧，讓你的洞見照亮他人。信任是打開心門的鑰匙。'
  },
  8: {
    name: 'The Achiever',
    chinese: '成就者',
    personality: '權力追求者，物質豐盛，野心勃勃。你相信成功需要努力和決心。你的能量是力量和影響力。',
    strengths: ['領導能力', '決斷力強', '事業心重', '執行力高', '財務智商'],
    challenges: ['過度物質', '控制欲強', '工作狂', '忽視情感'],
    careers: ['企業家', '投資銀行家', 'CEO', '政治家', '房地產開發商'],
    relationships: '你需要能理解你事業追求的伴侶。學會在成功路上照顧情感需求，金錢無法買到真愛。',
    advice: '平衡物質與精神，成功不等於快樂。真正的力量在於服務他人而非控制。'
  },
  9: {
    name: 'The Humanitarian',
    chinese: '人道主義者',
    personality: '博愛者，智慧導師，慈悲為懷。你關心人類命運，願意為他人奉獻。你的能量是無私和智慧。',
    strengths: ['慈悲心腸', '智慧深邃', '藝術天賦', '寬容大度', '直覺敏銳'],
    challenges: ['過度理想', '難以拒絕', '情緒波動', '過度犧牲'],
    careers: ['人道主義工作者', '藝術家', '導師', '環保倡導者', '社會運動者'],
    relationships: '你愛得深沉無私，但需要學會愛自己。找到給予和接受的平衡點。',
    advice: '你的慈悲是珍貴禮物，但要先照顧好自己。學會設立界限，無私不等於無我。'
  },
  11: {
    name: 'The Master Teacher',
    chinese: '大師導師',
    personality: '靈性導師，直覺超群，啟發他人。你是靈性橋樑，帶來啟蒙與覺醒。你的存在本身就是一種啟示。',
    strengths: ['靈性直覺', '啟發能力', '創造力強', '慈悲智慧', '超凡影響'],
    challenges: ['過度敏感', '焦慮傾向', '承受壓力', '難以落地'],
    careers: ['靈性導師', '治療師', '教育家', '發明家', '政治家'],
    relationships: '你需要能理解你靈性追求的深度伴侶。學會在物質世界與精神世界之間找到平衡。',
    advice: '你是帶來光明的橋樑，但要先學會讓自己成為光源。信任你的直覺，你的天賦是珍貴禮物。'
  },
  22: {
    name: 'The Master Builder',
    chinese: '大師建設者',
    personality: '巨匠能量，實際與夢想結合。你能將宏大願景化為現實，是真正改變世界的力量。你的能量是建設性的。',
    strengths: ['建設能力', '執行力強', '願景宏大', '實際智慧', '領袖氣質'],
    challenges: ['壓力巨大', '完美主義', '過度野心', '忽視健康'],
    careers: ['大型項目管理者', '建築師', '企業家', '政治家', '改革者'],
    relationships: '你能為伴侶創造穩定的未來，但需要記得情感連接同樣重要。成功需要愛來滋養。',
    advice: '你是建設未來的大師，但記得照顧好自己。偉大夢想需要健康的身心來實現。'
  },
  33: {
    name: 'The Master Healer',
    chinese: '大師療癒者',
    personality: '療癒大師，無私奉獻，靈性巅峰。你代表純粹的奉獻精神，是人類精神的最高表達。你的存在是為了服務。',
    strengths: ['療癒能力', '無私奉獻', '靈性高度', '創造奇蹟', '啟發他人'],
    challenges: ['過度犧牲', '難以自救', '聖人情結', '承受重量'],
    careers: ['療癒師', '靈性導師', '社會工作者', '人道主義者', '教育改革者'],
    relationships: '你渴望深度靈性的連結，但需要記得先療癒自己才能療癒他人。學會讓自己也被愛。',
    advice: '你的使命是療癒世界，但請記得你也需要被療癒。學會接收，這是給予的前提。'
  }
}

// Get detailed numerology reading
export interface NumerologyReading {
  lifePath: {
    number: number
    name: string
    chinese: string
    personality: string
    strengths: string[]
    challenges: string[]
  }
  expression: {
    number: number
    name: string
    chinese: string
    personality: string
    strengths: string[]
    challenges: string[]
  }
  soulUrge: {
    number: number
    name: string
    chinese: string
    personality: string
    strengths: string[]
    challenges: string[]
  }
  personality: {
    number: number
    name: string
    chinese: string
    personality: string
    strengths: string[]
    challenges: string[]
  }
  birthday: {
    number: number
    meaning: string
  }
}

// Calculate complete numerology reading
export function getNumerologyReading(birthDate: Date, name: string): NumerologyReading {
  const year = birthDate.getFullYear()
  const month = birthDate.getMonth() + 1
  const day = birthDate.getDate()

  const lifePathNum = getLifePathNumber(year, month, day)
  const expressionNum = getExpressionNumber(name)
  const soulUrgeNum = getSoulUrgeNumber(name)
  const personalityNum = getPersonalityNumber(name)
  const birthdayNum = getBirthdayNumber(day)

  const getMeaning = (num: number) => {
    const meaning = NUMEROLOGY_MEANINGS[num]
    if (meaning) {
      return {
        name: meaning.name,
        chinese: meaning.chinese,
        personality: meaning.personality,
        strengths: meaning.strengths,
        challenges: meaning.challenges
      }
    }
    // Fallback to life path meanings for basic numbers
    const lp = LIFE_PATH_MEANINGS[num] || LIFE_PATH_MEANINGS[1]
    return {
      name: lp.name,
      chinese: NUMEROLOGY_MEANINGS[1]?.chinese || '未知',
      personality: lp.strengths + ' - ' + lp.challenges,
      strengths: lp.strengths.split(', '),
      challenges: lp.challenges.split(', ')
    }
  }

  const birthdayMeanings: Record<number, string> = {
    1: '獨立原創 - 你喜歡成為第一，天生具有領導特質',
    2: '合作平衡 - 你善於調和差異，追求和諧關係',
    3: '表達創造 - 你用創意表達自我，天生具有藝術氣質',
    4: '穩定建設 -你相信努力工作，追求長久穩定',
    5: '自由變化 - 你討厭束縛，渴望多元體驗',
    6: '責任照顧 - 你天生照顧者，重視家庭和諧',
    7: '深度探索 - 你喜歡思考，追求真理和智慧',
    8: '權力成就 - 你追求成功和影響力',
    9: '博愛奉獻 - 你關心他人，富有同理心',
    10: '轉化蛻變 - 你具有重新開始的能量',
    11: '靈性使命 - 你帶有特殊的靈性天賦',
    12: '藝術表達 - 你用藝術方式療癒他人',
    13: '轉化重生 - 你有蛻變再生的力量',
    14: '自由精神 - 你追求內心真正的自由',
    15: 'earth Connection - 你與大地有深厚連結',
    16: '靈性覺醒 - 你經歷靈性的重大轉折',
    17: '靈性整合 - 你整合靈性與物質世界',
    18: '突破超越 - 你突破舊有限制，迎接新生',
    19: '領導服務 - 你在服務中展現領導力',
    20: '平衡和諧 - 你帶來各方平衡與和諧',
    21: '創意表達 - 你用創意影響世界',
    22: '建設實現 - 你能實現宏大願景',
    23: '冒險表達 - 你在冒險中展現創意',
    24: '療癒給予 - 你通過給予來療癒世界',
    25: '深度探索 - 你探索深層真理',
    26: '責任轉化 - 你在責任中實現轉化',
    27: '靈性使命 - 你肩負特殊使命',
    28: '力量平衡 - 你平衡力量與柔軟',
    29: '啟發他人 - 你啟發他人覺醒',
    30: '創意表達 - 你盡情展現創造力',
    31: '創意落地 - 你的創意能付諸實踐'
  }

  return {
    lifePath: {
      number: lifePathNum,
      ...getMeaning(lifePathNum)
    },
    expression: {
      number: expressionNum,
      ...getMeaning(expressionNum)
    },
    soulUrge: {
      number: soulUrgeNum,
      ...getMeaning(soulUrgeNum)
    },
    personality: {
      number: personalityNum,
      ...getMeaning(personalityNum)
    },
    birthday: {
      number: birthdayNum,
      meaning: birthdayMeanings[birthdayNum] || `${birthdayNum}是一個具有獨特能量的數字`
    }
  }
}

// Get compatible numbers for a given number
export function getCompatibleNumbers(num: number): number[] {
  const compatibilityMap: Record<number, number[]> = {
    1: [1, 3, 5, 7, 9],
    2: [2, 4, 8],
    3: [1, 3, 5, 9],
    4: [2, 4, 8],
    5: [1, 3, 5, 7, 9],
    6: [2, 4, 6, 8],
    7: [1, 3, 5, 7, 9],
    8: [2, 4, 6, 8],
    9: [1, 3, 5, 7, 9],
    11: [1, 2, 3, 5, 7, 9, 11],
    22: [1, 2, 3, 4, 6, 8, 22],
    33: [1, 3, 5, 7, 9, 33]
  }
  return compatibilityMap[num] || [num]
}
