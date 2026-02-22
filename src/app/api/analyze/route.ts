import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const AnalysisRequestSchema = z.object({
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
  }),
  birthDate: z.object({
    year: z.number(),
    month: z.number(),
    day: z.number(),
  }),
  gender: z.string().optional(),
  zodiac: z.string().optional(),
  westernZodiac: z.string().optional(),
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
          { role: 'system', content: '你是中国八字命理专家。你必须用简体中文回答所有问题。不要用英文。' },
          { role: 'user', content: '请用中文回答：' + prompt.slice(0, 600) }
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = AnalysisRequestSchema.parse(body)

    // Generate the analysis prompt
    const prompt = generateAnalysisPrompt(validated)

    // Call MiniMax AI
    const analysis = await callMiniMaxAI(prompt)

    return NextResponse.json({
      success: true,
      data: {
        analysis,
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
