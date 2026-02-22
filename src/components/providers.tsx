"use client"

import { BirthDateProvider } from "@/hooks/useBirthDate"

export function Providers({ children }: { children: React.ReactNode }) {
  return <BirthDateProvider>{children}</BirthDateProvider>
}
