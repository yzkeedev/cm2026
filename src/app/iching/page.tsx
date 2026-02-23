"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  tossHexagram,
  YaoResult,
  getHexagramDisplay,
  HEXAGRAM_DETAILS,
} from "@/lib/bazi"

// 爻类型
type Yao = {
  value: number
  isYang: boolean
  isOld: boolean
  line: number
}

// 八卦符号
const TRIGRAM_SYMBOLS: Record<number, string> = {
  1: '☰',  // 乾
  2: '☳',  // 震
  3: '☴',  // 巽
  4: '☲',  // 离
  5: '☵',  // 坎
  6: '☷',  // 坤
  7: '☶',  // 艮
  8: '☱',  // 兑
}

// 爻的显示
function YaoLine({ yao, index }: { yao: Yao; index: number }) {
  const isYin = !yao.isYang

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`flex items-center justify-center h-8 my-0.5 ${
        yao.isOld ? 'text-fire' : 'text-primary'
      }`}
    >
      {isYin ? (
        // 阴爻 - 断开的两段
        <div className="flex flex-col gap-0.5">
          <div className={`h-1.5 w-16 rounded ${yao.isOld ? 'bg-fire' : 'bg-primary/60'}`} />
          <div className={`h-1.5 w-16 rounded ${yao.isOld ? 'bg-fire' : 'bg-primary/60'}`} />
        </div>
      ) : (
        // 阳爻 - 完整的一画
        <div className={`h-1.5 w-16 rounded ${yao.isOld ? 'bg-fire' : 'bg-primary/60'}`} />
      )}
    </motion.div>
  )
}

// 铜钱动画
function Coin({ isAnimating, showValue }: { isAnimating: boolean; showValue?: number }) {
  const [displayValue, setDisplayValue] = useState<number | null>(null)

  return (
    <motion.div
      animate={isAnimating ? {
        rotateX: [0, 360, 720, 1080],
        rotateY: [0, 180, 360, 540],
        scale: [1, 1.2, 1, 1.1],
      } : {}}
      transition={{ duration: 1.5, repeat: isAnimating ? Infinity : 0, ease: "easeInOut" }}
      className="relative w-16 h-16"
    >
      <div
        className="absolute inset-0 rounded-full flex items-center justify-center text-xl font-bold text-amber-100 shadow-lg"
        style={{
          background: 'linear-gradient(135deg, #fbbf24 0%, #b45309 100%)',
          boxShadow: '0 4px 8px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.3)'
        }}
      >
        {showValue !== undefined ? (showValue === 1 ? '背' : '字') : '?'}
      </div>
    </motion.div>
  )
}

// 卦象显示组件
function HexagramDisplay({
  lines,
  upperSymbol,
  lowerSymbol,
  hexagramNumber,
  changedHexagramNumber,
  detail,
}: {
  lines: Yao[]
  upperSymbol: string
  lowerSymbol: string
  hexagramNumber: number
  changedHexagramNumber: number | null
  detail: ReturnType<typeof getHexagramDisplay>['detail']
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-xl p-5 shadow-md border border-primary/20"
    >
      {/* 卦名 */}
      <div className="text-center mb-4">
        <div className="flex justify-center items-center gap-4 mb-2">
          <span className="text-4xl text-primary">{upperSymbol}</span>
          <span className="text-4xl text-primary">{lowerSymbol}</span>
        </div>
        <h2 className="font-serif text-2xl text-primary">
          {detail.chinese} {detail.name}
        </h2>
        <p className="text-muted-foreground text-sm">{detail.meaning}</p>
      </div>

      {/* 六爻 */}
      <div className="flex justify-center mb-6">
        <div className="flex flex-col-reverse items-center">
          {lines.map((yao, index) => (
            <div key={index} className="flex items-center gap-3">
              <span className={`text-xs w-4 ${yao.isOld ? 'text-fire font-bold' : 'text-muted-foreground'}`}>
                {['初', '二', '三', '四', '五', '上'][index]}
              </span>
              <YaoLine yao={yao} index={index} />
              <span className={`text-xs w-4 text-right ${yao.isOld ? 'text-fire font-bold' : 'text-muted-foreground'}`}>
                {yao.isOld ? (yao.isYang ? '九' : '六') : (yao.isYang ? '七' : '八')}
                {['九', '九', '九', '九', '九', '九'][index]}
                {['六', '六', '六', '六', '六', '六'][index]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 变卦提示 */}
      {changedHexagramNumber && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-4 p-3 bg-secondary rounded-lg"
        >
          <p className="text-sm text-muted-foreground mb-1">变卦</p>
          <p className="font-serif text-lg text-primary">
            {HEXAGRAM_DETAILS[changedHexagramNumber]?.chinese || ''}{' '}
            {HEXAGRAM_DETAILS[changedHexagramNumber]?.name || ''}
          </p>
        </motion.div>
      )}

      {/* 卦辞 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-4"
      >
        <h3 className="text-sm font-medium text-primary mb-2 border-l-2 border-primary pl-2">
          彖曰
        </h3>
        <p className="text-accent font-serif leading-relaxed text-sm">
          {detail.judgment || ''}
        </p>
      </motion.div>

      {/* 象辞 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mb-4"
      >
        <h3 className="text-sm font-medium text-primary mb-2 border-l-2 border-primary pl-2">
          象曰
        </h3>
        <p className="text-accent font-serif leading-relaxed text-sm">
          {detail.image}
        </p>
      </motion.div>

      {/* 爻辞 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="text-sm font-medium text-primary mb-2 border-l-2 border-primary pl-2">
          爻辞
        </h3>
        <div className="space-y-2">
          {lines.map((yao, index) => {
            const yaoNames = ['初九', '九二', '九三', '九四', '九五', '上九']
            const yaoYinNames = ['初六', '六二', '六三', '六四', '六五', '上六']
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className={`p-2 rounded ${yao.isOld ? 'bg-fire/10 border border-fire/30' : 'bg-muted/50'}`}
              >
                <span className={`text-xs font-medium ${yao.isOld ? 'text-fire' : 'text-muted-foreground'}`}>
                  {yao.isYang ? yaoNames[index] : yaoYinNames[index]}：
                </span>
                <span className="text-accent text-sm">{detail.lines[index] || ''}</span>
              </motion.div>
            )
          })}
        </div>
      </motion.div>
    </motion.div>
  )
}

// 爻名映射
const YAO_NAMES = ['初九', '九二', '九三', '九四', '九五', '上九']
const YAO_YIN_NAMES = ['初六', '六二', '六三', '六四', '六五', '上六']

// 将coin sum转换为爻
function coinSumToYao(sum: number, line: number): Yao {
  const isYang = sum >= 5
  const isOld = sum === 3 || sum === 6
  return { value: sum, isYang, isOld, line }
}

export default function IChingPage() {
  const [step, setStep] = useState<'idle' | 'tossing' | 'complete'>('idle')
  const [currentYao, setCurrentYao] = useState(0)
  const [allLines, setAllLines] = useState<Yao[]>([])
  const [coinResults, setCoinResults] = useState<number[]>([])
  const [hexagram, setHexagram] = useState<ReturnType<typeof getHexagramDisplay> | null>(null)

  // AI Analysis state
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null)
  const [aiLoading, setAiLoading] = useState(false)

  // AI Analysis handler
  const handleAiAnalysis = async () => {
    if (!hexagram) return
    setAiLoading(true)
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'iching',
          hexagram: {
            number: hexagram.hexagramNumber,
            name: hexagram.detail.name,
            changedLines: allLines.filter(l => l.isOld).map(l => l.line)
          }
        })
      })
      const result = await response.json()
      if (result.success) {
        setAiAnalysis(result.data.analysis)
      }
    } catch (error) {
      console.error('AI Analysis failed:', error)
    } finally {
      setAiLoading(false)
    }
  }

  const handleToss = useCallback(async () => {
    if (step !== 'idle') return

    setStep('tossing')
    setAllLines([])
    setCoinResults([])
    setHexagram(null)

    const newLines: Yao[] = []

    // 掷六次
    for (let i = 0; i < 6; i++) {
      setCurrentYao(i)

      // 模拟掷三枚铜钱
      const results: number[] = []
      for (let j = 0; j < 3; j++) {
        await new Promise(resolve => setTimeout(resolve, 200))
        const coin = Math.random() > 0.5 ? 2 : 1
        results.push(coin)
      }

      setCoinResults([...results])

      const sum = results[0] + results[1] + results[2]
      const yao = coinSumToYao(sum, i + 1)

      newLines.push(yao)
      setAllLines([...newLines])

      // 短暂显示结果后继续下一爻
      await new Promise(resolve => setTimeout(resolve, 800))
    }

    // 生成完整卦象
    const display = getHexagramDisplay(newLines)
    setHexagram(display)
    setStep('complete')
  }, [step])

  // Reset
  const handleReset = () => {
    setStep('idle')
    setCurrentYao(0)
    setAllLines([])
    setCoinResults([])
    setHexagram(null)
  }

  return (
    <div className="min-h-screen pb-20 md:pb-4 pt-2 px-3 md:px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-4"
      >
        <h1 className="font-serif text-2xl md:text-3xl text-primary mb-2">易经占卜</h1>
        <p className="text-muted-foreground text-sm">三枚铜钱，掷六次成卦</p>
      </motion.div>

      {/* 掷卦区域 */}
      <div className="mb-6">
        {step === 'tossing' && (
          <div className="text-center">
            <p className="text-primary font-medium mb-4">
              第 {currentYao + 1} 爻 ({['初', '二', '三', '四', '五', '上'][currentYao]})
            </p>
            <div className="flex justify-center gap-4 mb-6">
              {[0, 1, 2].map((i) => (
                <Coin
                  key={i}
                  isAnimating={true}
                  showValue={coinResults[i]}
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              掷三枚铜钱中...
            </p>
          </div>
        )}

        {step === 'idle' && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleToss}
            className="w-full py-4 bg-primary text-white rounded-xl font-medium shadow-md"
          >
            开始掷卦
          </motion.button>
        )}

        {step === 'complete' && hexagram && (
          <HexagramDisplay
            lines={hexagram.lines}
            upperSymbol={TRIGRAM_SYMBOLS[hexagram.upperTrigram]}
            lowerSymbol={TRIGRAM_SYMBOLS[hexagram.lowerTrigram]}
            hexagramNumber={hexagram.hexagramNumber}
            changedHexagramNumber={hexagram.changedHexagramNumber}
            detail={hexagram.detail}
          />
        )}
      </div>

      {/* 重新掷卦 */}
      {step === 'complete' && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleReset}
          className="w-full py-3 bg-secondary text-accent rounded-xl font-medium"
        >
          再掷一次
        </motion.button>
      )}

      {/* AI Analysis */}
      {step === 'complete' && hexagram && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 space-y-3"
        >
          {!aiAnalysis && !aiLoading && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAiAnalysis}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-medium shadow-md"
            >
              🔮 AI智能解读
            </motion.button>
          )}

          {aiLoading && (
            <div className="bg-white rounded-2xl p-8 text-center">
              <div className="animate-spin w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-muted-foreground">AI正在分析卦象...</p>
            </div>
          )}

          {aiAnalysis && (
            <div className="bg-white rounded-2xl p-4 shadow-md">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-serif text-lg text-amber-700">🔮 AI深度解读</h3>
                <button
                  onClick={() => setAiAnalysis(null)}
                  className="text-muted-foreground text-sm hover:text-amber-500"
                >
                  关闭
                </button>
              </div>
              <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-wrap">
                {aiAnalysis}
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAiAnalysis}
                className="w-full mt-4 py-2 bg-amber-100 text-amber-700 rounded-lg text-sm font-medium"
              >
                🔄 重新解读
              </motion.button>
            </div>
          )}
        </motion.div>
      )}

      {/* 说明 */}
      {step === 'idle' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 p-4 bg-white/50 rounded-xl"
        >
          <h3 className="font-medium text-primary mb-2">掷卦说明</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>三枚铜钱同时掷出</li>
            <li>背面(阴)记作1，正面(阳)记作2</li>
            <li>三枚合计：3=老阴(动)，4=少阴，5=少阳，6=老阳(动)</li>
            <li>动爻会发生阴阳变化，产生变卦</li>
          </ul>
        </motion.div>
      )}
    </div>
  )
}
