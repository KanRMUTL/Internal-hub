import { useState } from 'react'
import { ColorKeys } from 'shared/styles'

type FlashAlertState = {
  type: ColorKeys
  message: string
}

export const useFlashAlert = () => {
  const [state, set] = useState<FlashAlertState>({ type: 'success', message: '' })

  const reset = () => {
    set({ type: 'success', message: '' })
  }

  return {
    state,
    set,
    reset,
  }
}
