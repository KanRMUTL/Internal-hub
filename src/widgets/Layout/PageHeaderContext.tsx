import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'

export interface PageHeaderSlots {
  left?: ReactNode
  right?: ReactNode
}

interface PageHeaderContextValue {
  slots: PageHeaderSlots
  setSlots: (next: PageHeaderSlots) => void
  clearSlots: () => void
}

const PageHeaderContext = createContext<PageHeaderContextValue | null>(null)

export const PageHeaderProvider = ({ children }: { children: ReactNode }) => {
  const [slots, setSlotsState] = useState<PageHeaderSlots>({})
  const setSlots = useCallback((next: PageHeaderSlots) => setSlotsState((prev) => ({ ...prev, ...next })), [])
  const clearSlots = useCallback(() => setSlotsState({}), [])

  return <PageHeaderContext.Provider value={{ slots, setSlots, clearSlots }}>{children}</PageHeaderContext.Provider>
}

export const usePageHeader = (): PageHeaderContextValue => {
  const ctx = useContext(PageHeaderContext)
  if (!ctx) throw new Error('usePageHeader must be used inside PageHeaderProvider')
  return ctx
}
