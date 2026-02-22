"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

const navItems = [
  { href: "/", label: "首页", icon: HomeIcon },
  { href: "/bazi", label: "排盘", icon: CalendarIcon },
  { href: "/numerology", label: "灵数", icon: NumerologyIcon },
  { href: "/astrology", label: "占星", icon: AstrologyIcon },
  { href: "/tarot", label: "塔罗", icon: TarotIcon },
  { href: "/wuxing", label: "五行", icon: SparklesIcon },
  { href: "/iching", label: "易经", icon: IChingIcon },
  { href: "/fortune", label: "抽签", icon: TargetIcon },
  { href: "/meditate", label: "静心", icon: MeditationIcon },
]

function HomeIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9,22 9,12 15,12 15,22"/>
    </svg>
  )
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
      <line x1="16" x2="16" y1="2" y2="6"/>
      <line x1="8" x2="8" y1="2" y2="6"/>
      <line x1="3" x2="21" y1="10" y2="10"/>
    </svg>
  )
}

function TarotIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M5 5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5Z"/>
      <path d="M5 10h14"/>
      <path d="M5 14h14"/>
      <circle cx="12" cy="7" r="1"/>
      <circle cx="12" cy="12" r="1"/>
      <circle cx="12" cy="17" r="1"/>
    </svg>
  )
}

function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
      <path d="M5 3v4"/>
      <path d="M19 17v4"/>
      <path d="M3 5h4"/>
      <path d="M17 19h4"/>
    </svg>
  )
}

function TargetIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10"/>
      <circle cx="12" cy="12" r="6"/>
      <circle cx="12" cy="12" r="2"/>
    </svg>
  )
}

function MeditationIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10"/>
      <path d="M12 8v4l2 2"/>
      <path d="M8 14c.5 1 1.5 2 4 2s3.5-1 4-2"/>
      <path d="M9.5 9c.5-1 1.5-1.5 2.5-1.5s2 .5 2.5 1.5"/>
    </svg>
  )
}

function IChingIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4 4h4v4"/>
      <path d="M4 10h4v4"/>
      <path d="M4 16h4v4"/>
      <path d="M10 4h4v4"/>
      <path d="M10 16h4v4"/>
      <path d="M16 4h4v4"/>
      <path d="M16 10h4v4"/>
      <path d="M16 16h4v4"/>
    </svg>
  )
}

function AstrologyIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10"/>
      <path d="M12 2v4"/>
      <path d="m4.93 4.93 2.83 2.83"/>
      <path d="M2 12h4"/>
      <path d="m4.93 19.07 2.83-2.83"/>
      <path d="M12 18v4"/>
      <path d="m19.07 4.93-2.83 2.83"/>
      <path d="M22 12h-4"/>
      <path d="m19.07 19.07-2.83-2.83"/>
    </svg>
  )
}

function NumerologyIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 2v4"/>
      <path d="M12 18v4"/>
      <path d="M4.93 4.93l2.83 2.83"/>
      <path d="M16.24 16.24l2.83 2.83"/>
      <path d="M2 12h4"/>
      <path d="M18 12h4"/>
      <path d="M4.93 19.07l2.83-2.83"/>
      <path d="M16.24 7.76l2.83-2.83"/>
    </svg>
  )
}

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-primary/20 z-50 md:top-0 md:bottom-auto md:border-b md:border-t-0 shadow-lg md:shadow-none" role="navigation" aria-label="Main navigation">
      <div className="max-w-md mx-auto md:max-w-full md:flex md:justify-center">
        <div className="flex justify-around md:gap-8 p-1.5 md:py-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg transition-colors cursor-pointer md:px-3 md:py-2",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-primary"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute inset-0 bg-secondary rounded-lg -z-10"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                <Icon className="w-4 h-4 md:w-5 md:h-5" />
                <span className="text-[10px] md:text-xs font-medium">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
