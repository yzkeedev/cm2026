import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const AnalysisRequestSchema = z.object({
  type: z.enum(['bazi', 'tarot', 'iching', 'numerology', 'astrology', 'wuxing']).default('bazi'),
  bazi: z.object({
    year: z.string().optional(),
    month: z.string().optional(),
    day: z.string().optional(),
    time: z.string().optional(),
    dayStem: z.string().optional(),
    dayBranch: z.string().optional(),
    yearStem: z.string().optional(),
    yearBranch: z.string().optional(),
    monthStem: z.string().optional(),
    monthBranch: z.string().optional(),
    timeStem: z.string().optional(),
    timeBranch: z.string().optional(),
  }).optional(),
  birthDate: z.object({
    year: z.number(),
    month: z.number(),
    day: z.number(),
  }).optional(),
  gender: z.string().optional(),
  zodiac: z.string().optional(),
  westernZodiac: z.string().optional(),
  // Tarot specific
  cards: z.array(z.object({
    name: z.string(),
    nameChinese: z.string(),
    suit: z.string().optional(),
    isReversed: z.boolean().optional(),
  })).optional(),
  // I Ching specific
  hexagram: z.object({
    number: z.number(),
    name: z.string(),
    changedLines: z.array(z.number()).optional(),
  }).optional(),
  // Numerology specific
  lifePath: z.number().optional(),
  expression: z.number().optional(),
  soulUrge: z.number().optional(),
  personality: z.number().optional(),
  // Astrology specific
  sunSign: z.string().optional(),
  moonSign: z.string().optional(),
  risingSign: z.string().optional(),
  // Wuxing specific
  elementStrength: z.record(z.string(), z.number()).optional(),
})

// MiniMax API call
async function callMiniMaxAI(prompt: string): Promise<string> {
  const apiKey = process.env.ANTHROPIC_AUTH_TOKEN || process.env.ANTHROPIC_API_KEY

  if (!apiKey) {
    throw new Error('API key not configured')
  }

  // Use the env base URL (user has ANTHROPIC_BASE_URL=https://api.minimax.io/anthropic)
  const baseUrl = process.env.ANTHROPIC_BASE_URL || 'https://api.minimax.io/anthropic'

  // Try Anthropic-compatible endpoints
  const configs = [
    // Anthropic-compatible /messages API
    { url: `${baseUrl}/v1/messages`, model: 'claude-sonnet-4-20250514', auth: `Bearer ${apiKey}` },
    { url: `${baseUrl}/v1/messages`, model: 'claude-3-5-sonnet-20241022', auth: `Bearer ${apiKey}` },
    // Chat completions
    { url: `${baseUrl}/v1/chat/completions`, model: 'abab6.5s-chat', auth: `Bearer ${apiKey}` },
  ]

  let lastError = ''

  for (const config of configs) {
    console.log('Trying config:', config.url, config.model)

    try {
      const requestBody = {
        model: config.model,
        messages: [
          { role: 'system', content: `你是中国八字命理专家。

回答要求：
1. 主要用简体中文（简体字）回答
2. 重要的专业术语后面用括号加上简单的英文翻译
3. 内容要简单明了，老百姓能看懂
4. 少用古文，多用现代白话
5. 尽量用短句子，不要太长的段落
6. 多用bullet points列表，让人一目了然

例如：
- 日主（Day Master）：代表你本人的能量
- 五行（Five Elements）：金木水火土五种能量
- 纳音（NaYin）：根据出生年份计算的五行属性` },
          { role: 'user', content: '请用简单易懂的中文回答：' + prompt.slice(0, 600) }
        ],
        temperature: 0.7,
        max_tokens: 2000
      }

      const response = await fetch(config.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': config.auth!
        },
        body: JSON.stringify(requestBody),
        signal: AbortSignal.timeout(60000)
      })

      const data = await response.json()
      console.log('Response:', JSON.stringify(data).slice(0, 300))

      // Check for success - Anthropic/MiniMax format (content is array with text)
      if (data?.content) {
        let contentArray = data.content

        // If content is a string, it might be stringified JSON
        if (typeof data.content === 'string') {
          try {
            contentArray = JSON.parse(data.content)
          } catch {
            // Not a stringified JSON, return as-is
            return data.content
          }
        }

        if (Array.isArray(contentArray)) {
          // Extract ONLY text type content, skip thinking/reflection
          const textContent = contentArray.find((c: Record<string, unknown>) => c.type === 'text')
          if (textContent?.text) {
            return textContent.text as string
          }
        }
      }

      // Also check for text field directly
      if (data?.text) {
        return data.text
      }

      // Standard chat completion format
      if (data?.choices?.[0]?.message?.content) {
        const content = data.choices[0].message.content
        // If content is an array, find text type
        if (Array.isArray(content)) {
          const textItem = content.find((c: Record<string, unknown>) => c.type === 'text')
          if (textItem?.text) return textItem.text as string
        }
        return content
      }

      // MiniMax base_resp success
      if (data?.base_resp?.status_code === 0) {
        return data?.choices?.[0]?.message?.content || data?.text || JSON.stringify(data)
      }

      if (data?.base_resp?.status_msg) {
        lastError = `${data.base_resp.status_msg} (${data.base_resp.status_code})`
        console.log('Failed with:', lastError)
        continue
      }

      if (data?.error) {
        lastError = data.error
        continue
      }

    } catch (err) {
      lastError = String(err)
      console.log('Error:', lastError)
      continue
    }
  }

  throw new Error(`All API attempts failed. Last error: ${lastError}`)
}

// Generate comprehensive analysis prompt
function generateAnalysisPrompt(data: {
  bazi: {
    year?: string
    month?: string
    day?: string
    time?: string
    dayStem?: string
    dayBranch?: string
    yearStem?: string
    yearBranch?: string
    monthStem?: string
    monthBranch?: string
    timeStem?: string
    timeBranch?: string
  }
  birthDate: { year: number; month: number; day: number }
  gender?: string
  zodiac?: string
  westernZodiac?: string
}): string {
  return `
请为以下八字信息生成专业的命理分析报告。使用标准Markdown格式，确保每个章节都有完整内容。

出生信息：
- 出生日期：${data.birthDate.year}年${data.birthDate.month}月${data.birthDate.day}日
- 性别：${data.gender}
- 生肖：${data.zodiac}

八字：
- 年柱：${data.bazi.year || ((data.bazi.yearStem || '') + (data.bazi.yearBranch || ''))}
- 月柱：${data.bazi.month || ((data.bazi.monthStem || '') + (data.bazi.monthBranch || ''))}
- 日柱：${data.bazi.day || ((data.bazi.dayStem || '') + (data.bazi.dayBranch || ''))}
- 时柱：${data.bazi.time || ((data.bazi.timeStem || '') + (data.bazi.timeBranch || ''))}

请按以下Markdown格式返回（使用##标记章节，###标记子章节）：

## 丙子日主八字全面分析

## 一、日主分析
### 日主特质
[详细描述日主性格，80-150字]

### 五行属性
[列出日主对应的五行强弱，30-50字]

## 二、五行平衡
### 五行分布
木: X个 - 状态
火: X个 - 状态
土: X个 - 状态
金: X个 - 状态
水: X个 - 状态

### 强弱分析
[详细分析五行强弱，80-120字]

### 调补建议
[建议补充的五行，30-50字]

## 三、优势与挑战
### 优势领域
- [优势1]
- [优势2]
- [优势3]
- [优势4]
- [优势5]

### 挑战注意
- [挑战1]
- [挑战2]
- [挑战3]
- [挑战4]

## 四、事业与财运
### 适合行业
[行业1]、[行业2]、[行业3]

### 事业建议
[事业方向建议，60-100字]

### 财运分析
[财运描述，40-60字]

### 幸运方位
[方位1]、[方位2]

## 五、2026年丙午火马年展望
### 整体运势
[2026年整体分析，80-120字]

### 事业运势
[事业方面]

### 财运运势
[财运方面]

### 健康运势
[健康方面]

### 感情运势
[感情方面]

### 年度建议
[具体建议，40-60字]

## 六、幸运元素
### 幸运色
[颜色1]、[颜色2]、[颜色3]

### 幸运数字
[数字1]、[数字2]

### 幸运方位
[方向1]、[方向2]

### 贵人属相
[属相1]、[属相2]

## 七、个人建议
1. [建议1]
2. [建议2]
3. [建议3]
4. [建议4]
5. [建议5]

请确保每个章节都有完整内容，不要省略。
`
}

// Generate prompts for different types
function getPromptForType(data: z.infer<typeof AnalysisRequestSchema>): string {
  const type = data.type || 'bazi'

  switch (type) {
    case 'tarot':
      return generateTarotPrompt(data)
    case 'iching':
      return generateIChingPrompt(data)
    case 'numerology':
      return generateNumerologyPrompt(data)
    case 'astrology':
      return generateAstrologyPrompt(data)
    case 'wuxing':
      return generateWuxingPrompt(data)
    default:
      return generateBaziPrompt(data)
  }
}

// Tarot AI Prompt
function generateTarotPrompt(data: z.infer<typeof AnalysisRequestSchema>): string {
  const cards = data.cards || []
  const cardList = cards.map((c, i) =>
    `${i + 1}. ${c.nameChinese} (${c.name})${c.isReversed ? ' - 逆位' : ''}`
  ).join('\n')

  return `
请为以下塔罗牌阵生成专业的解读报告。使用简单的简体中文，让人容易看懂。

抽到的牌：
${cardList}

请按以下格式返回：

## 牌阵总览
[整体能量解读，100-150字，用大白话]

## 每张牌解读
[逐张解读，每张50-80字，说明正位/逆位的含义]

## 建议
[给问卜者的建议，3-5条，每条20-30字]

## 能量提示
[今天的能量提示，30-50字]
`
}

// I Ching AI Prompt
function generateIChingPrompt(data: z.infer<typeof AnalysisRequestSchema>): string {
  const hex = data.hexagram
  if (!hex) return '请提供卦象信息'

  const changedLines = hex.changedLines || []
  const linesInfo = changedLines.length > 0 ? `变爻：${changedLines.join(', ')}位置` : '无变爻'

  return `
请为以下易经卦象生成专业的解读报告。使用简单的简体中文，让人容易看懂。

卦象：${hex.number}. ${hex.name}
${linesInfo}

请按以下格式返回：

## 卦象总览
[整体含义，100-150字，用大白话]

## 卦辞解读
[卦辞含义，60-100字]

## 变爻含义
${changedLines.length > 0 ? '[如果有变爻，说明变化带来的影响，80-120字]' : '本卦无变爻，保持不变'}

## 建议
[给问卜者的建议，3-5条，每条20-30字]
`
}

// Numerology AI Prompt
function generateNumerologyPrompt(data: z.infer<typeof AnalysisRequestSchema>): string {
  return `
请为以下生命灵数信息生成专业的解读报告。使用简单的简体中文，让人容易看懂。

生命灵数：${data.lifePath || '未计算'}
表达数：${data.expression || '未计算'}
心灵数：${data.soulUrge || '未计算'}
人格数：${data.personality || '未计算'}

请按以下格式返回：

## 生命灵数解读
[生命灵数的整体含义，100-150字，用大白话]

## 各数字详解
- 生命灵数 ${data.lifePath}：代表的人生课题
- 表达数 ${data.expression}：代表的天赋
- 心灵数 ${data.soulUrge}：内心真正的渴望
- 人格数 ${data.personality}：给别人展现的一面

## 建议
[3-5条建议，每条20-30字]

## 今年能量
[2026年对你的能量提示，50-80字]
`
}

// Astrology AI Prompt
function generateAstrologyPrompt(data: z.infer<typeof AnalysisRequestSchema>): string {
  return `
请为以下西方占星信息生成专业的解读报告。使用简单的简体中文，让人容易看懂。

太阳星座：${data.sunSign || '未知'}
月亮星座：${data.moonSign || '未知'}
上升星座：${data.risingSign || '未知'}

请按以下格式返回：

## 星座总览
[整体性格特点，100-150字，用大白话]

## 太阳星座 ${data.sunSign}
[太阳星座代表的核心特质，60-100字]

## 月亮星座 ${data.moonSign}
[月亮星座代表的内心世界，50-80字]

## 上升星座 ${data.risingSign}
[上升星座代表的外在表现，50-80字]

## 建议
[3-5条建议，每条20-30字]

## 今年运势
[2026年整体运势，50-80字]
`
}

// Wuxing AI Prompt
function generateWuxingPrompt(data: z.infer<typeof AnalysisRequestSchema>): string {
  const elements = data.elementStrength || {}
  const elementList = Object.entries(elements).map(([el, val]) => `${el}: ${val}%`).join(', ')

  return `
请为以下五行信息生成专业的解读报告。使用简单的简体中文，让人容易看懂。

五行分布：${elementList}

请按以下格式返回：

## 五行总览
[整体五行强弱分析，100-150字，用大白话]

## 各元素分析
- 木：${elements['木'] || 0}% - [强弱说明]
- 火：${elements['火'] || 0}% - [强弱说明]
- 土：${elements['土'] || 0}% - [强弱说明]
- 金：${elements['金'] || 0}% - [强弱说明]
- 水：${elements['水'] || 0}% - [强弱说明]

## 喜忌分析
[需要补充和避免的元素，60-100字]

## 建议
[3-5条建议，每条20-30字，包括颜色、数字、方位等]
`
}

// Bazi AI Prompt (refactored)
function generateBaziPrompt(data: z.infer<typeof AnalysisRequestSchema>): string {
  return `
请为以下八字信息生成专业的命理分析报告。使用简单的简体中文，让人容易看懂。

出生信息：
- 出生日期：${data.birthDate?.year || '未知'}年${data.birthDate?.month || '未知'}月${data.birthDate?.day || '未知'}日
- 性别：${data.gender || '未知'}
- 生肖：${data.zodiac || '未知'}

八字：
- 年柱：${data.bazi?.year || ((data.bazi?.yearStem || '') + (data.bazi?.yearBranch || ''))}
- 月柱：${data.bazi?.month || ((data.bazi?.monthStem || '') + (data.bazi?.monthBranch || ''))}
- 日柱：${data.bazi?.day || ((data.bazi?.dayStem || '') + (data.bazi?.dayBranch || ''))}
- 时柱：${data.bazi?.time || ((data.bazi?.timeStem || '') + (data.bazi?.timeBranch || ''))}

请按以下Markdown格式返回（用##标记章节）：

## 八字总览
[日主分析，整体五行强弱，100-150字]

## 日主分析
[日主性格特点，60-100字]

## 五行平衡
[五行分布，各元素强弱，80-120字]

## 优势与挑战
- 优势：[3-5条]
- 挑战：[3-5条]

## 事业与财运
[事业方向，财运分析，80-120字]

## 2026年展望
[今年整体运势，80-120字]

## 建议
[3-5条实用建议]
`
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = AnalysisRequestSchema.parse(body)

    // Generate the analysis prompt based on type
    const prompt = getPromptForType(validated)

    // Call MiniMax AI
    const analysis = await callMiniMaxAI(prompt)

    return NextResponse.json({
      success: true,
      data: {
        analysis,
        type: validated.type,
        generatedAt: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('AI Analysis error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.issues },
        { status: 400 }
      )
    }

    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: 'Failed to generate analysis', details: errorMessage },
      { status: 500 }
    )
  }
}
