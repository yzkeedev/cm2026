"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  drawRandomCards,
  getElementEmoji,
  isReversed,
  SPREAD_POSITIONS,
  SUIT_COLORS,
  type TarotCard,
} from "@/lib/tarot"

type SpreadType = "daily" | "threeCard" | null

// Card Flip Component with Framer Motion
function TarotCardFlip({
  card,
  isReversed: reversed,
  onClick,
  index,
  position,
}: {
  card: TarotCard
  isReversed: boolean
  onClick: () => void
  index: number
  position?: { label: string; description: string }
}) {
  const [isFlipped, setIsFlipped] = useState(false)

  // Auto-flip after draw
  useEffect(() => {
    const timer = setTimeout(() => setIsFlipped(true), 500 + index * 300)
    return () => clearTimeout(timer)
  }, [index])

  const suitColor = card.suit
    ? SUIT_COLORS[card.suit]
    : SUIT_COLORS.Major

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.2 }}
      className="flex flex-col items-center"
    >
      {/* Position Label */}
      {position && (
        <div className="text-center mb-2">
          <p className="font-serif text-lg text-primary">{position.label}</p>
          <p className="text-xs text-muted-foreground">{position.description}</p>
        </div>
      )}

      {/* Card */}
      <motion.div
        className="relative w-40 h-56 md:w-48 md:h-72 cursor-pointer"
        onClick={() => {
          setIsFlipped(!isFlipped)
          onClick()
        }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        style={{ perspective: 1000 }}
      >
        <motion.div
          className="w-full h-full relative"
          initial={false}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Card Back (未翻开) */}
          <div
            className="absolute inset-0 rounded-xl shadow-lg"
            style={{
              backfaceVisibility: "hidden",
              background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
              border: "3px solid #d4af37",
            }}
          >
            {/* Card Back Pattern */}
            <div className="absolute inset-2 rounded-lg overflow-hidden">
              <div
                className="w-full h-full opacity-20"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0L40 20L20 40L0 20Z' fill='none' stroke='%23d4af37' stroke-width='1'/%3E%3C/svg%3E")`,
                  backgroundSize: "20px 20px",
                }}
              />
            </div>
            {/* Star Symbol */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl text-amber-400/60">✦</span>
            </div>
          </div>

          {/* Card Front (已翻开) */}
          <div
            className="absolute inset-0 rounded-xl shadow-lg p-3 flex flex-col"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              background: "linear-gradient(180deg, #faf8f5 0%, #f5f0e8 100%)",
              border: `3px solid ${suitColor}`,
            }}
          >
            {/* Card Number/Symbol */}
            <div className="text-center mb-1">
              <span
                className="text-xs font-bold"
                style={{ color: suitColor }}
              >
                {card.symbol}
              </span>
            </div>

            {/* Card Art Placeholder */}
            <div
              className="flex-1 rounded-lg mb-2 flex items-center justify-center text-4xl"
              style={{
                background: `linear-gradient(135deg, ${suitColor}20 0%, ${suitColor}10 100%)`,
              }}
            >
              {getElementEmoji(card.element)}
            </div>

            {/* Card Name */}
            <div className="text-center">
              <p
                className="font-serif text-sm font-bold leading-tight"
                style={{ color: suitColor }}
              >
                {card.nameChinese}
              </p>
              <p className="text-[10px] text-muted-foreground truncate">
                {card.name}
              </p>
            </div>

            {/* Reversed Indicator */}
            {reversed && (
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-fire rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">逆</span>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

// Card Detail Modal
function CardDetail({
  card,
  isReversed,
  onClose,
}: {
  card: TarotCard
  isReversed: boolean
  onClose: () => void
}) {
  const suitColor = card.suit
    ? SUIT_COLORS[card.suit]
    : SUIT_COLORS.Major

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="rounded-t-2xl p-6 text-white"
          style={{ background: `linear-gradient(135deg, ${suitColor} 0%, ${suitColor}dd 100%)` }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-4xl mb-2">{getElementEmoji(card.element)}</p>
              <h2 className="font-serif text-2xl font-bold">{card.nameChinese}</h2>
              <p className="text-white/80">{card.name}</p>
            </div>
            <div className="text-right">
              <span className="text-4xl font-bold opacity-50">{card.symbol}</span>
              {isReversed && (
                <span className="block mt-2 px-2 py-1 bg-white/20 rounded text-xs">
                  逆位
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Keywords */}
          <div>
            <h3 className="font-serif text-sm font-semibold text-accent mb-2 flex items-center gap-2">
              <span className="w-1 h-4 bg-primary rounded-full"></span>
              关键词 Keywords
            </h3>
            <div className="flex flex-wrap gap-2">
              {card.keywords.map((keyword, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-secondary text-xs rounded-full text-accent"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          {/* Element */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">元素:</span>
            <span className="text-sm font-medium text-accent">
              {getElementEmoji(card.element)} {card.element}
            </span>
          </div>

          {/* Upright Meaning */}
          <div className="bg-gradient-to-br from-secondary/50 to-transparent rounded-xl p-4 border border-secondary">
            <h3 className="font-serif text-sm font-semibold text-primary mb-2">
              {isReversed ? "逆位含义" : "正位含义"}
            </h3>
            <p className="text-sm text-accent leading-relaxed">
              {isReversed ? card.reversed : card.upright}
            </p>
          </div>

          {/* Alternative Position */}
          <div className="bg-muted/50 rounded-xl p-4">
            <h3 className="font-serif text-sm font-semibold text-muted-foreground mb-2">
              {isReversed ? "正位含义" : "逆位含义"}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {isReversed ? card.upright : card.reversed}
            </p>
          </div>
        </div>

        {/* Close Button */}
        <div className="p-4 border-t border-secondary">
          <button
            onClick={onClose}
            className="w-full py-3 bg-primary text-white rounded-xl font-medium"
          >
            关闭
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// Daily Card View
function DailyCardView({
  card,
  reversed,
  onDraw,
  isDrawing,
}: {
  card: TarotCard | null
  reversed: boolean
  onDraw: () => void
  isDrawing: boolean
}) {
  return (
    <div className="space-y-6">
      {/* Draw Button Area */}
      <div className="flex flex-col items-center">
        {!card && !isDrawing && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onDraw}
            className="w-full max-w-xs py-4 bg-gradient-to-r from-primary to-water text-white rounded-xl font-medium shadow-lg"
          >
            抽今日卡
          </motion.button>
        )}

        {isDrawing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center"
          >
            <div className="relative w-32 h-48 mb-4">
              {/* Shuffling Animation */}
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="absolute inset-0 rounded-xl shadow-lg"
                  style={{
                    background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
                    border: "3px solid #d4af37",
                  }}
                  animate={{
                    x: Math.sin(i * 2) * 20,
                    y: Math.cos(i * 2) * 10,
                    rotate: [0, -5, 5, 0],
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: Infinity,
                    delay: i * 0.1,
                  }}
                />
              ))}
            </div>
            <p className="text-muted-foreground animate-pulse">
              洗牌中...
            </p>
          </motion.div>
        )}
      </div>

      {/* Card Display */}
      {card && !isDrawing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center"
        >
          <TarotCardFlip
            card={card}
            isReversed={reversed}
            onClick={() => {}}
            index={0}
            position={SPREAD_POSITIONS.daily}
          />
        </motion.div>
      )}

      {/* Card Details */}
      {card && !isDrawing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-4"
        >
          {/* Meaning */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-secondary">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">
                {reversed ? "逆位" : "正位"}
              </span>
              <span className="text-sm text-muted-foreground">
                {reversed ? "Reversed" : "Upright"}
              </span>
            </div>
            <p className="text-accent text-sm leading-relaxed">
              {reversed ? card.reversed : card.upright}
            </p>
          </div>

          {/* Keywords */}
          <div className="flex flex-wrap gap-2 justify-center">
            {card.keywords.map((keyword, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-secondary text-xs rounded-full text-accent"
              >
                {keyword}
              </span>
            ))}
          </div>

          {/* Redraw Button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onDraw}
            className="w-full py-3 bg-secondary text-accent rounded-xl font-medium"
          >
            重新抽牌
          </motion.button>
        </motion.div>
      )}
    </div>
  )
}

// Three Card Spread View
function ThreeCardSpreadView({
  cards,
  reversed,
  onDraw,
  isDrawing,
  selectedCard,
  setSelectedCard,
}: {
  cards: TarotCard[]
  reversed: boolean[]
  onDraw: () => void
  isDrawing: boolean
  selectedCard: number | null
  setSelectedCard: (index: number | null) => void
}) {
  return (
    <div className="space-y-6">
      {/* Draw Button */}
      {!isDrawing && cards.length === 0 && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onDraw}
          className="w-full max-w-xs mx-auto block py-4 bg-gradient-to-r from-primary to-water text-white rounded-xl font-medium shadow-lg"
        >
          抽三张牌
        </motion.button>
      )}

      {/* Drawing Animation */}
      {isDrawing && (
        <div className="flex justify-center items-end gap-4 h-72">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-24 h-36 rounded-xl"
              style={{
                background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
                border: "2px solid #d4af37",
              }}
              initial={{ y: -200, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.3, type: "spring" }}
            />
          ))}
          <p className="absolute bottom-4 text-muted-foreground animate-pulse">
            洗牌中...
          </p>
        </div>
      )}

      {/* Cards Display */}
      {!isDrawing && cards.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-wrap justify-center gap-4 md:gap-8"
        >
          {cards.map((card, index) => (
            <div key={index} onClick={() => setSelectedCard(index)}>
              <TarotCardFlip
                card={card}
                isReversed={reversed[index]}
                onClick={() => setSelectedCard(index)}
                index={index}
                position={SPREAD_POSITIONS.threeCard[index]}
              />
            </div>
          ))}
        </motion.div>
      )}

      {/* Interpretation Summary */}
      {!isDrawing && cards.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white rounded-xl p-4 shadow-sm border border-secondary"
        >
          <h3 className="font-serif text-lg text-primary mb-3 text-center">
            三牌阵解读
          </h3>
          <div className="space-y-3">
            {cards.map((card, index) => (
              <div key={index} className="flex items-start gap-3">
                <span className="text-primary font-serif text-sm font-bold min-w-[40px]">
                  {SPREAD_POSITIONS.threeCard[index].label}
                </span>
                <p className="text-sm text-accent flex-1">
                  {card.nameChinese} ({card.name}) -{" "}
                  <span className={reversed[index] ? "text-fire" : ""}>
                    {reversed[index] ? "逆位" : "正位"}
                  </span>
                  : {reversed[index] ? card.reversed.split(",")[0] : card.upright.split(",")[0]}
                </p>
              </div>
            ))}
          </div>

          {/* Redraw Button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onDraw}
            className="w-full mt-4 py-3 bg-secondary text-accent rounded-xl font-medium"
          >
            重新抽牌
          </motion.button>
        </motion.div>
      )}

      {/* Card Detail Modal */}
      <AnimatePresence>
        {selectedCard !== null && cards[selectedCard] && (
          <CardDetail
            card={cards[selectedCard]}
            isReversed={reversed[selectedCard]}
            onClose={() => setSelectedCard(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

// Main Component
export default function TarotPage() {
  const [spreadType, setSpreadType] = useState<SpreadType>(null)
  const [isDrawing, setIsDrawing] = useState(false)

  // Daily card state
  const [dailyCard, setDailyCard] = useState<TarotCard | null>(null)
  const [dailyReversed, setDailyReversed] = useState(false)

  // Three card spread state
  const [threeCards, setThreeCards] = useState<TarotCard[]>([])
  const [threeReversed, setThreeReversed] = useState<boolean[]>([])
  const [selectedCard, setSelectedCard] = useState<number | null>(null)

  // Draw daily card
  const drawDailyCard = () => {
    setIsDrawing(true)

    setTimeout(() => {
      const cards = drawRandomCards(1)
      const reversed = isReversed()
      setDailyCard(cards[0])
      setDailyReversed(reversed)
      setIsDrawing(false)
    }, 1500)
  }

  // Draw three card spread
  const drawThreeCards = () => {
    setIsDrawing(true)
    setThreeCards([])
    setThreeReversed([])

    setTimeout(() => {
      const cards = drawRandomCards(3)
      const reversed = [isReversed(), isReversed(), isReversed()]
      setThreeCards(cards)
      setThreeReversed(reversed)
      setIsDrawing(false)
    }, 1500)
  }

  // Handle spread type change
  const handleSpreadTypeChange = (type: SpreadType) => {
    setSpreadType(type)
    setDailyCard(null)
    setThreeCards([])
    setSelectedCard(null)
  }

  return (
    <div className="min-h-screen pb-20 md:pb-4 pt-2 px-3 md:px-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-4"
      >
        <h1 className="font-serif text-2xl md:text-3xl text-primary mb-2">
          塔罗占卜
        </h1>
        <p className="text-muted-foreground text-sm">
          Tarot Reading · 78 cards
        </p>
      </motion.div>

      {/* Spread Type Selection */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex gap-2 mb-6"
      >
        <button
          onClick={() => handleSpreadTypeChange("daily")}
          className={`flex-1 py-3 rounded-xl font-medium transition-all ${
            spreadType === "daily"
              ? "bg-primary text-white shadow-md"
              : "bg-white text-accent border border-secondary hover:bg-secondary"
          }`}
        >
          每日一张
        </button>
        <button
          onClick={() => handleSpreadTypeChange("threeCard")}
          className={`flex-1 py-3 rounded-xl font-medium transition-all ${
            spreadType === "threeCard"
              ? "bg-primary text-white shadow-md"
              : "bg-white text-accent border border-secondary hover:bg-secondary"
          }`}
        >
          三牌阵
        </button>
      </motion.div>

      {/* Spread Content */}
      <AnimatePresence mode="wait">
        {spreadType === "daily" && (
          <motion.div
            key="daily"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <DailyCardView
              card={dailyCard}
              reversed={dailyReversed}
              onDraw={drawDailyCard}
              isDrawing={isDrawing}
            />
          </motion.div>
        )}

        {spreadType === "threeCard" && (
          <motion.div
            key="threeCard"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <ThreeCardSpreadView
              cards={threeCards}
              reversed={threeReversed}
              onDraw={drawThreeCards}
              isDrawing={isDrawing}
              selectedCard={selectedCard}
              setSelectedCard={setSelectedCard}
            />
          </motion.div>
        )}

        {!spreadType && (
          <motion.div
            key="initial"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">🔮</div>
            <p className="text-muted-foreground mb-6">
              选择一种占卜方式
            </p>
            <div className="grid gap-3 max-w-sm mx-auto">
              <button
                onClick={() => handleSpreadTypeChange("daily")}
                className="p-4 bg-white rounded-xl border border-secondary text-left hover:bg-secondary/50 transition-colors"
              >
                <p className="font-serif text-primary mb-1">每日一张</p>
                <p className="text-xs text-muted-foreground">
                  抽取今日能量牌，获得每日指引
                </p>
              </button>
              <button
                onClick={() => handleSpreadTypeChange("threeCard")}
                className="p-4 bg-white rounded-xl border border-secondary text-left hover:bg-secondary/50 transition-colors"
              >
                <p className="font-serif text-primary mb-1">三牌阵</p>
                <p className="text-xs text-muted-foreground">
                  过去·现在·未来，三张牌解读人生
                </p>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Card Detail Modal for Daily Card */}
      <AnimatePresence>
        {dailyCard && !isDrawing && spreadType === "daily" && (
          <CardDetail
            card={dailyCard}
            isReversed={dailyReversed}
            onClose={() => setDailyCard(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
