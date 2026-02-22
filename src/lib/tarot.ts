/**
 * Tarot Card Database
 * 78 cards: Major Arcana (22) + Minor Arcana (56)
 */

export interface TarotCard {
  id: number
  name: string
  nameChinese: string
  symbol: string
  upright: string
  reversed: string
  keywords: string[]
  element: string
  suit?: string
}

// Major Arcana (22 cards)
export const majorArcana: TarotCard[] = [
  {
    id: 0,
    name: 'The Fool',
    nameChinese: '愚人',
    symbol: '0',
    upright: '新的开始、天真无邪、自由自在、冒险、信任宇宙',
    reversed: '冲动、盲目冒险、缺乏计划、愚昧、不负责任',
    keywords: ['new beginnings', 'innocence', 'spontaneity', 'freedom', 'adventure'],
    element: 'Air',
  },
  {
    id: 1,
    name: 'The Magician',
    nameChinese: '魔术师',
    symbol: 'I',
    upright: '创造力、技能、意志力、资源、表达能力',
    reversed: 'Manipulation, deceit, unused potential, poor planning',
    keywords: ['willpower', 'creation', 'manifestation', 'skill', 'power'],
    element: 'Mercury',
  },
  {
    id: 2,
    name: 'The High Priestess',
    nameChinese: '女祭司',
    symbol: 'II',
    upright: '直觉、智慧、内在声音、潜意识、神秘学',
    reversed: 'Surface understanding, ignoring intuition, confusion',
    keywords: ['intuition', 'sacred knowledge', 'divine feminine', 'mystery'],
    element: 'Moon',
  },
  {
    id: 3,
    name: 'The Empress',
    nameChinese: '皇后',
    symbol: 'III',
    upright: '丰盛、母性、创造力、自然、艺术',
    reversed: 'Dependence, emptiness, creative block, over-giving',
    keywords: ['fertility', 'abundance', 'nature', 'nurturing', 'creativity'],
    element: 'Venus',
  },
  {
    id: 4,
    name: 'The Emperor',
    nameChinese: '皇帝',
    symbol: 'IV',
    upright: '权威、秩序、稳定、领导力、父亲形象',
    reversed: 'Tyranny, rigidity, lack of discipline, authoritarian',
    keywords: ['authority', 'structure', 'control', 'father figure', 'stability'],
    element: 'Aries',
  },
  {
    id: 5,
    name: 'The Hierophant',
    nameChinese: '教皇',
    symbol: 'V',
    upright: '传统、教导、信仰、精神指导、仪式',
    reversed: 'Rebellion, new approaches, unconventional beliefs',
    keywords: ['tradition', 'spirituality', 'education', 'belief', 'group'],
    element: 'Taurus',
  },
  {
    id: 6,
    name: 'The Lovers',
    nameChinese: '恋人',
    symbol: 'VI',
    upright: '爱情、和谐、选择、价值观、伙伴关系',
    reversed: 'Disharmony, misalignment, poor communication, conflict',
    keywords: ['love', 'harmony', 'relationships', 'choices', 'union'],
    element: 'Gemini',
  },
  {
    id: 7,
    name: 'The Chariot',
    nameChinese: '战车',
    symbol: 'VII',
    upright: '胜利、意志力、决心、克服障碍、旅途',
    reversed: 'Aggression, lack of direction, blocked energy',
    keywords: ['victory', 'willpower', 'determination', 'control', 'action'],
    element: 'Cancer',
  },
  {
    id: 8,
    name: 'Strength',
    nameChinese: '力量',
    symbol: 'VIII',
    upright: '勇气、耐心、内在力量、柔情、克服恐惧',
    reversed: 'Weakness, self-doubt, forcefulness, aggression',
    keywords: ['courage', 'perseverance', 'inner strength', 'compassion', 'patience'],
    element: 'Leo',
  },
  {
    id: 9,
    name: 'The Hermit',
    nameChinese: '隐士',
    symbol: 'IX',
    upright: '内省、独自、指引、智慧、灵性寻求',
    reversed: 'Isolation, loneliness, withdrawal, rejection',
    keywords: ['introspection', 'solitude', 'wisdom', 'inner guidance', 'truth'],
    element: 'Virgo',
  },
  {
    id: 10,
    name: 'Wheel of Fortune',
    nameChinese: '命运之轮',
    symbol: 'X',
    upright: '命运、转变、机遇、循环、好运',
    reversed: 'Bad luck, resistance to change, feeling stuck',
    keywords: ['destiny', 'luck', 'cycles', 'turning points', 'opportunity'],
    element: 'Jupiter',
  },
  {
    id: 11,
    name: 'Justice',
    nameChinese: '正义',
    symbol: 'XI',
    upright: '公正、平衡、真理、法律、责任',
    reversed: 'Injustice, dishonesty, legal matters, avoidance',
    keywords: ['justice', 'truth', 'law', 'balance', 'accountability'],
    element: 'Libra',
  },
  {
    id: 12,
    name: 'The Hanged Man',
    nameChinese: '倒吊人',
    symbol: 'XII',
    upright: '暂停、牺牲、新的视角、等待、臣服',
    reversed: 'Delays, wasted sacrifice, lack of progress',
    keywords: ['suspension', 'sacrifice', 'new perspective', 'waiting', 'peace'],
    element: 'Neptune',
  },
  {
    id: 13,
    name: 'Death',
    nameChinese: '死神',
    symbol: 'XIII',
    upright: '转变、结束、放下、重生、蜕变',
    reversed: 'Resistance to change, stagnation, fear of ending',
    keywords: ['ending', 'transformation', 'rebirth', 'change', 'letting go'],
    element: 'Scorpio',
  },
  {
    id: 14,
    name: 'Temperance',
    nameChinese: '节制',
    symbol: 'XIV',
    upright: '平衡、调和、耐心、适中、灵魂整合',
    reversed: 'Excess, lack of balance, impatience, moderation',
    keywords: ['balance', 'moderation', 'patience', 'harmony', 'purpose'],
    element: 'Sagittarius',
  },
  {
    id: 15,
    name: 'The Devil',
    nameChinese: '恶魔',
    symbol: 'XV',
    upright: '欲望、束缚、物质主义、阴影面、沉迷',
    reversed: 'Breaking free, liberation, awareness, recovery',
    keywords: ['addiction', 'obsession', 'materialism', 'shadow', 'bondage'],
    element: 'Capricorn',
  },
  {
    id: 16,
    name: 'The Tower',
    nameChinese: '塔',
    symbol: 'XVI',
    upright: '突变、破坏、解放、觉醒、剧变',
    reversed: 'Avoided disaster, fear of change, resistance',
    keywords: ['sudden change', 'upheaval', 'revelation', 'liberation', 'chaos'],
    element: 'Mars',
  },
  {
    id: 17,
    name: 'The Star',
    nameChinese: '星星',
    symbol: 'XVII',
    upright: '希望、灵感、疗愈、灵性、信心',
    reversed: 'Despair, hopelessness, lack of faith, barrenness',
    keywords: ['hope', 'inspiration', 'healing', 'serenity', 'spirituality'],
    element: 'Aquarius',
  },
  {
    id: 18,
    name: 'The Moon',
    nameChinese: '月亮',
    symbol: 'XVIII',
    upright: '直觉、幻觉、恐惧、潜意识、梦境',
    reversed: 'Release of fear, truth revealed, overcoming illusion',
    keywords: ['intuition', 'subconscious', 'fear', 'illusion', 'dreams'],
    element: 'Pisces',
  },
  {
    id: 19,
    name: 'The Sun',
    nameChinese: '太阳',
    symbol: 'XIX',
    upright: '成功、活力、喜悦、生命力、正能量',
    reversed: 'Temporary depression, lack of clarity, failure',
    keywords: ['success', 'vitality', 'joy', 'life force', 'positivity'],
    element: 'Sun',
  },
  {
    id: 20,
    name: 'Judgment',
    nameChinese: '审判',
    symbol: 'XX',
    upright: '觉醒、复活、内心召唤、原谅、评估',
    reversed: 'Self-doubt, rejection, ignoring the call, guilt',
    keywords: ['rebirth', 'inner calling', 'judgment', 'forgiveness', 'renewal'],
    element: 'Pluto',
  },
  {
    id: 21,
    name: 'The World',
    nameChinese: '世界',
    symbol: 'XXI',
    upright: '完成、成就、整体、旅程终点、新循环',
    reversed: 'Incomplete, endings without beginning, stagnation',
    keywords: ['completion', 'achievement', 'wholeness', 'integration', 'travel'],
    element: 'Saturn',
  },
]

// Minor Arcana - Wands (14 cards)
export const wands: TarotCard[] = [
  { id: 22, name: 'Ace of Wands', nameChinese: '权杖Ace', symbol: 'A', upright: '灵感、萌芽、热情、新机会、创造力', reversed: 'Delays, lack of direction, creative block', keywords: ['inspiration', 'new opportunity', 'creativity', 'passion'], element: 'Fire', suit: 'Wands' },
  { id: 23, name: 'Two of Wands', nameChinese: '权杖二', symbol: '2', upright: '规划、决策、扩展视野、未来计划', reversed: 'Fear of unknown, poor planning, waiting', keywords: ['planning', 'future', 'decision', 'expansion'], element: 'Fire', suit: 'Wands' },
  { id: 24, name: 'Three of Wands', nameChinese: '权杖三', symbol: '3', upright: '预见、等待、拓展、初步成功', reversed: 'Obstacles, delays, frustration, lack of foresight', keywords: ['progress', 'looking ahead', 'anticipation', 'expansion'], element: 'Fire', suit: 'Wands' },
  { id: 25, name: 'Four of Wands', nameChinese: '权杖四', symbol: '4', upright: '庆祝、和谐、休息、团队成功', reversed: 'Unstable home, conflict, celebration interrupted', keywords: ['celebration', 'harmony', 'rest', 'community'], element: 'Fire', suit: 'Wands' },
  { id: 26, name: 'Five of Wands', nameChinese: '权杖五', symbol: '5', upright: '竞争、冲突、挑战、力量竞争', reversed: 'Avoiding conflict, compromise, harmony', keywords: ['conflict', 'competition', 'challenge', 'tension'], element: 'Fire', suit: 'Wands' },
  { id: 27, name: 'Six of Wands', nameChinese: '权杖六', symbol: '6', upright: '胜利、认可、荣誉、公众形象', reversed: 'Ego, lack of recognition, public failure', keywords: ['victory', 'recognition', 'triumph', 'pride'], element: 'Fire', suit: 'Wands' },
  { id: 28, name: 'Seven of Wands', nameChinese: '权杖七', symbol: '7', upright: '防御、坚持、挑战、保护成果', reversed: 'Exhaustion, giving up, overwhelmed', keywords: ['defense', 'perseverance', 'challenge', 'holding on'], element: 'Fire', suit: 'Wands' },
  { id: 29, name: 'Eight of Wands', nameChinese: '权杖八', symbol: '8', upright: '快速移动、进展、消息、行动', reversed: 'Waiting, frustration, delayed action', keywords: ['movement', 'speed', 'progress', 'action'], element: 'Fire', suit: 'Wands' },
  { id: 30, name: 'Nine of Wands', nameChinese: '权杖九', symbol: '9', upright: '韧性、经验、坚持、最后冲刺', reversed: 'Paranoia, exhaustion, giving up too soon', keywords: ['resilience', 'perseverance', 'last stand', 'experience'], element: 'Fire', suit: 'Wands' },
  { id: 31, name: 'Ten of Wands', nameChinese: '权杖十', symbol: '10', upright: '重担、责任、压力、完成负荷', reversed: 'Inability to delegate, burnout, stress', keywords: ['burden', 'responsibility', 'stress', 'completion'], element: 'Fire', suit: 'Wands' },
  { id: 32, name: 'Page of Wands', nameChinese: '权杖侍从', symbol: 'P', upright: '探索、热情、好奇、新消息', reversed: 'Lack of direction, immaturity, delay', keywords: ['exploration', 'enthusiasm', 'curiosity', 'message'], element: 'Fire', suit: 'Wands' },
  { id: 33, name: 'Knight of Wands', nameChinese: '权杖骑士', symbol: 'K', upright: '行动、冲动、热情、冒险家', reversed: 'Arrogance, recklessness, delays', keywords: ['action', 'adventure', 'passion', 'impatience'], element: 'Fire', suit: 'Wands' },
  { id: 34, name: 'Queen of Wands', nameChinese: '权杖皇后', symbol: 'Q', upright: '自信、魅力、热情、独立', reversed: 'Jealousy, insecurity, demanding', keywords: ['confidence', 'charm', 'independence', 'passion'], element: 'Fire', suit: 'Wands' },
  { id: 35, name: 'King of Wands', nameChinese: '权杖国王', symbol: 'K', upright: '领导力、远见、创业精神、激励', reversed: 'Domineering, impulsive, lack of vision', keywords: ['leadership', 'vision', 'entrepreneurship', 'inspiration'], element: 'Fire', suit: 'Wands' },
]

// Minor Arcana - Cups (14 cards)
export const cups: TarotCard[] = [
  { id: 36, name: 'Ace of Cups', nameChinese: '圣杯Ace', symbol: 'A', upright: '爱、情感、亲密、新的感情', reversed: 'Blocked emotions, emptiness, loneliness', keywords: ['love', 'emotion', 'intimacy', 'new feelings'], element: 'Water', suit: 'Cups' },
  { id: 37, name: 'Two of Cups', nameChinese: '圣杯二', symbol: '2', upright: ' partnership, love, harmony, mutual attraction', reversed: 'Imbalance, broken communication, disharmony', keywords: ['partnership', 'love', 'harmony', 'attraction'], element: 'Water', suit: 'Cups' },
  { id: 38, name: 'Three of Cups', nameChinese: '圣杯三', symbol: '3', upright: 'celebration, friendship, creativity, gatherings', reversed: 'Isolation, overindulgence, gossip', keywords: ['celebration', 'friendship', 'joy', 'community'], element: 'Water', suit: 'Cups' },
  { id: 39, name: 'Four of Cups', nameChinese: '圣杯四', symbol: '4', upright: 'contemplation, apathy, depression, introspection', reversed: 'New perspective, awareness, awakening', keywords: ['contemplation', 'apathy', 'boredom', 'reflection'], element: 'Water', suit: 'Cups' },
  { id: 40, name: 'Five of Cups', nameChinese: '圣杯五', symbol: '5', upright: 'loss, grief, disappointment, moving on', reversed: 'Acceptance, healing, forgiveness', keywords: ['loss', 'grief', 'regret', 'moving on'], element: 'Water', suit: 'Cups' },
  { id: 41, name: 'Six of Cups', nameChinese: '圣杯六', symbol: '6', upright: 'nostalgia, childhood, innocence, reunion', reversed: 'Living in the past, unrealistic, immaturity', keywords: ['nostalgia', 'innocence', 'memory', 'reunion'], element: 'Water', suit: 'Cups' },
  { id: 42, name: 'Seven of Cups', nameChinese: '圣杯七', symbol: '7', upright: 'choices, illusions, fantasy, indecision', reversed: 'Clarity, making a choice, truth', keywords: ['choices', 'illusion', 'fantasy', 'dreaming'], element: 'Water', suit: 'Cups' },
  { id: 43, name: 'Eight of Cups', nameChinese: '圣杯八', symbol: '8', upright: 'walking away, seeking truth, disappointment', reversed: 'Fear of change, avoidance, stagnation', keywords: ['walking away', 'seeking', 'disappointment', 'truth'], element: 'Water', suit: 'Cups' },
  { id: 44, name: 'Nine of Cups', nameChinese: '圣杯九', symbol: '9', upright: 'satisfaction, contentment, wishes fulfilled', reversed: 'Dissatisfaction, greed, emptiness', keywords: ['satisfaction', 'contentment', 'fulfillment', 'wishes'], element: 'Water', suit: 'Cups' },
  { id: 45, name: 'Ten of Cups', nameChinese: '圣杯十', symbol: '10', upright: 'harmony, joy, family, fulfillment', reversed: 'Broken home, disharmony, family conflict', keywords: ['harmony', 'joy', 'family', 'blessing'], element: 'Water', suit: 'Cups' },
  { id: 46, name: 'Page of Cups', nameChinese: '圣杯侍从', symbol: 'P', upright: 'creative message, intuition, new feelings', reversed: 'Emotional immaturity, sensitivity, confusion', keywords: ['creativity', 'intuition', 'emotion', 'message'], element: 'Water', suit: 'Cups' },
  { id: 47, name: 'Knight of Cups', nameChinese: '圣杯骑士', symbol: 'K', upright: 'romantic, creative, charming, idealist', reversed: 'Unrealistic, moody, manipulative', keywords: ['romance', 'charm', 'creativity', 'idealism'], element: 'Water', suit: 'Cups' },
  { id: 48, name: 'Queen of Cups', nameChinese: '圣杯皇后', symbol: 'Q', upright: 'compassion, emotional security, intuitive', reversed: 'Insecurity, co-dependence, emotional manipulation', keywords: ['compassion', 'intuition', 'emotional security', 'nurturing'], element: 'Water', suit: 'Cups' },
  { id: 49, name: 'King of Cups', nameChinese: '圣杯国王', symbol: 'K', upright: 'emotional balance, wisdom, diplomacy', reversed: 'Cold, manipulative, emotionally distant', keywords: ['wisdom', 'diplomacy', 'emotional balance', 'control'], element: 'Water', suit: 'Cups' },
]

// Minor Arcana - Swords (14 cards)
export const swords: TarotCard[] = [
  { id: 50, name: 'Ace of Swords', nameChinese: '宝剑Ace', symbol: 'A', upright: 'truth, clarity, new ideas, breakthrough', reversed: 'Confusion, chaos, brutality, lies', keywords: ['truth', 'clarity', 'breakthrough', 'new ideas'], element: 'Air', suit: 'Swords' },
  { id: 51, name: 'Two of Swords', nameChinese: '宝剑二', symbol: '2', upright: 'difficult choice, stalemate, avoidance', reversed: 'Information revealed, decision made', keywords: ['choice', 'stalemate', 'indecision', 'blocking'], element: 'Air', suit: 'Swords' },
  { id: 52, name: 'Three of Swords', nameChinese: '宝剑三', symbol: '3', upright: 'heartbreak, grief, sorrow, betrayal', reversed: 'Healing, forgiveness, moving on', keywords: ['heartbreak', 'grief', 'sorrow', 'pain'], element: 'Air', suit: 'Swords' },
  { id: 53, name: 'Four of Swords', nameChinese: '宝剑四', symbol: '4', upright: 'rest, recuperation, meditation, peace', reversed: 'Restlessness, burnout, stress', keywords: ['rest', 'recovery', 'meditation', 'tranquility'], element: 'Air', suit: 'Swords' },
  { id: 54, name: 'Five of Swords', nameChinese: '宝剑五', symbol: '5', upright: 'conflict, defeat, winning at all costs', reversed: 'Resolution, forgiveness, moving on', keywords: ['conflict', 'defeat', 'struggle', 'tension'], element: 'Air', suit: 'Swords' },
  { id: 55, name: 'Six of Swords', nameChinese: '宝剑六', symbol: '6', upright: 'transition, moving on, healing journey', reversed: 'Stuck, emotional baggage, resisting change', keywords: ['transition', 'moving on', 'journey', 'healing'], element: 'Air', suit: 'Swords' },
  { id: 56, name: 'Seven of Swords', nameChinese: '宝剑七', symbol: '7', upright: 'deception, cunning, strategy, theft', reversed: 'Confession, exposure, admit mistakes', keywords: ['deception', 'strategy', 'stealth', 'trickery'], element: 'Air', suit: 'Swords' },
  { id: 57, name: 'Eight of Swords', nameChinese: '宝剑八', symbol: '8', upright: 'trapped, restricted, stuck, victim mentality', reversed: 'Freedom, release, self-knowledge', keywords: ['trapped', 'restriction', 'feeling stuck', 'victim'], element: 'Air', suit: 'Swords' },
  { id: 58, name: 'Nine of Swords', nameChinese: '宝剑九', symbol: '9', upright: 'anxiety, worry, fear, nightmares', reversed: 'Hope, overcoming fear, healing', keywords: ['anxiety', 'fear', 'worry', 'nightmares'], element: 'Air', suit: 'Swords' },
  { id: 59, name: 'Ten of Swords', nameChinese: '宝剑十', symbol: '10', upright: 'betrayal, pain, ending, crisis', reversed: 'Recovery, healing, rebirth', keywords: ['betrayal', 'pain', 'ending', 'crisis'], element: 'Air', suit: 'Swords' },
  { id: 60, name: 'Page of Swords', nameChinese: '宝剑侍从', symbol: 'P', upright: 'curious, communicative, mental energy', reversed: 'Insulting, cynical, harsh words', keywords: ['curiosity', 'communication', 'mental clarity', 'youth'], element: 'Air', suit: 'Swords' },
  { id: 61, name: 'Knight of Swords', nameChinese: '宝剑骑士', symbol: 'K', upright: 'action-oriented, mental clarity, direct', reversed: 'Aggressive, impatient, lacks direction', keywords: ['action', 'clarity', 'directness', 'ambition'], element: 'Air', suit: 'Swords' },
  { id: 62, name: 'Queen of Swords', nameChinese: '宝剑皇后', symbol: 'Q', upright: 'intellectual, independent, sharp-minded', reversed: 'Cold, bitter, manipulative', keywords: ['intellect', 'independence', 'clarity', 'wisdom'], element: 'Air', suit: 'Swords' },
  { id: 63, name: 'King of Swords', nameChinese: '宝剑国王', symbol: 'K', upright: 'authority, truth, mental clarity, justice', reversed: 'Tyrannical, harsh, manipulative', keywords: ['authority', 'truth', 'justice', 'clarity'], element: 'Air', suit: 'Swords' },
]

// Minor Arcana - Pentacles (14 cards)
export const pentacles: TarotCard[] = [
  { id: 64, name: 'Ace of Pentacles', nameChinese: '金币Ace', symbol: 'A', upright: 'new opportunity, prosperity, manifestation', reversed: 'Missed opportunity, bad investment', keywords: ['opportunity', 'prosperity', 'new venture', 'manifestation'], element: 'Earth', suit: 'Pentacles' },
  { id: 65, name: 'Two of Pentacles', nameChinese: '金币二', symbol: '2', upright: 'balance, priorities, juggling, adaptability', reversed: 'Imbalance, overextending, chaos', keywords: ['balance', 'priorities', 'flexibility', 'adapting'], element: 'Earth', suit: 'Pentacles' },
  { id: 66, name: 'Three of Pentacles', nameChinese: '金币三', symbol: '3', upright: 'teamwork, skills, mastery, collaboration', reversed: 'Lack of teamwork, poor craftsmanship', keywords: ['teamwork', 'skills', 'mastery', 'collaboration'], element: 'Earth', suit: 'Pentacles' },
  { id: 67, name: 'Four of Pentacles', nameChinese: '金币四', symbol: '4', upright: 'security, stability, control, possessiveness', reversed: 'Generosity, sharing, releasing control', keywords: ['security', 'stability', 'control', 'holding on'], element: 'Earth', suit: 'Pentacles' },
  { id: 68, name: 'Five of Pentacles', nameChinese: '金币五', symbol: '5', upright: 'hardship, poverty, isolation, struggle', reversed: 'Recovery, healing, financial improvement', keywords: ['hardship', 'poverty', 'isolation', 'struggle'], element: 'Earth', suit: 'Pentacles' },
  { id: 69, name: 'Six of Pentacles', nameChinese: '金币六', symbol: '6', upright: 'generosity, charity, sharing, balance', reversed: 'Debt, dependence, unequal exchange', keywords: ['generosity', 'charity', 'sharing', 'balance'], element: 'Earth', suit: 'Pentacles' },
  { id: 70, name: 'Seven of Pentacles', nameChinese: '金币七', symbol: '7', upright: 'patience, investment, long-term vision', reversed: 'Impatience, lack of vision, stagnation', keywords: ['patience', 'investment', 'growth', 'waiting'], element: 'Earth', suit: 'Pentacles' },
  { id: 71, name: 'Eight of Pentacles', nameChinese: '金币八', symbol: '8', upright: 'skill, mastery, dedication, craftsmanship', reversed: 'Lack of motivation, poor quality', keywords: ['skill', 'mastery', 'dedication', 'craftsmanship'], element: 'Earth', suit: 'Pentacles' },
  { id: 72, name: 'Nine of Pentacles', nameChinese: '金币九', symbol: '9', upright: 'abundance, independence, self-sufficiency', reversed: 'Dependency, financial loss, loneliness', keywords: ['abundance', 'independence', 'luxury', 'self-sufficiency'], element: 'Earth', suit: 'Pentacles' },
  { id: 73, name: 'Ten of Pentacles', nameChinese: '金币十', symbol: '10', upright: 'wealth, family, inheritance, stability', reversed: 'Financial loss, family conflict, instability', keywords: ['wealth', 'family', 'inheritance', 'stability'], element: 'Earth', suit: 'Pentacles' },
  { id: 74, name: 'Page of Pentacles', nameChinese: '金币侍从', symbol: 'P', upright: 'practical, learning, new opportunity', reversed: 'Lack of focus, materialistic, lazy', keywords: ['learning', 'opportunity', 'practicality', 'growth'], element: 'Earth', suit: 'Pentacles' },
  { id: 75, name: 'Knight of Pentacles', nameChinese: '金币骑士', symbol: 'K', upright: 'reliable, patient, hardworking, methodical', reversed: 'Lazy, undependable, boring', keywords: ['reliability', 'patience', 'hard work', 'methodical'], element: 'Earth', suit: 'Pentacles' },
  { id: 76, name: 'Queen of Pentacles', nameChinese: '金币皇后', symbol: 'Q', upright: 'practical, nurturing, secure, abundant', reversed: 'Jealousy, insecurity, neglect', keywords: ['practicality', 'nurturing', 'abundance', 'security'], element: 'Earth', suit: 'Pentacles' },
  { id: 77, name: 'King of Pentacles', nameChinese: '金币国王', symbol: 'K', upright: 'wealth, business, authority, stability', reversed: 'Greed, materialism, corruption', keywords: ['wealth', 'authority', 'stability', 'business'], element: 'Earth', suit: 'Pentacles' },
]

// All 78 cards combined
export const allTarotCards: TarotCard[] = [
  ...majorArcana,
  ...wands,
  ...cups,
  ...swords,
  ...pentacles,
]

// Helper function to get card by ID
export function getCardById(id: number): TarotCard | undefined {
  return allTarotCards.find(card => card.id === id)
}

// Helper function to draw random cards
export function drawRandomCards(count: number, excludeIds: number[] = []): TarotCard[] {
  const availableCards = allTarotCards.filter(card => !excludeIds.includes(card.id))
  const shuffled = [...availableCards].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

// Helper to determine if card is reversed (random)
export function isReversed(): boolean {
  return Math.random() > 0.5
}

// Chinese translations for spread positions
export const SPREAD_POSITIONS = {
  daily: {
    label: '今日卡',
    description: '今日能量指引',
  },
  threeCard: [
    { label: '过去', description: '过去的经历与影响' },
    { label: '现在', description: '当前的状况与挑战' },
    { label: '未来', description: '未来的可能性与建议' },
  ],
}

// Card suit colors for visual representation
export const SUIT_COLORS: Record<string, string> = {
  Wands: '#B8860B',    // 金色/木色
  Cups: '#4A90A4',     // 蓝色/水色
  Swords: '#708090',   // 银色/风色
  Pentacles: '#6B8E23', // 绿色/土色
  Major: '#8B4513',    // 深棕色/大秘仪
}

// Get element emoji
export function getElementEmoji(element: string): string {
  const elements: Record<string, string> = {
    Fire: '🔥',
    Water: '💧',
    Air: '💨',
    Earth: '🌍',
    Sun: '☀️',
    Moon: '🌙',
    Mercury: '☿️',
    Venus: '♀️',
    Mars: '♂️',
    Jupiter: '♃',
    Saturn: '♄',
    Uranus: '♅',
    Neptune: '♆',
    Pluto: '♇',
    Aries: '♈',
    Taurus: '♉',
    Gemini: '♊',
    Cancer: '♋',
    Leo: '♌',
    Virgo: '♍',
    Libra: '♎',
    Scorpio: '♏',
    Sagittarius: '♐',
    Capricorn: '♑',
    Aquarius: '♒',
    Pisces: '♓',
  }
  return elements[element] || '✨'
}
