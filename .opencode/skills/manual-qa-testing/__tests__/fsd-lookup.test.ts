import { describe, it, expect, vi, beforeEach } from 'vitest'
import { lookupImplicatedFiles } from '../lib/fsd-lookup'
import * as fs from 'fs/promises'

vi.mock('fs/promises')

const mocked = vi.mocked(fs)

describe('lookupImplicatedFiles', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('returns an empty list for an empty identifier list', async () => {
    const result = await lookupImplicatedFiles([])
    expect(result).toEqual([])
  })

  it('returns files whose contents include any of the identifiers', async () => {
    mocked.stat.mockResolvedValue({ isDirectory: () => true } as any)
    mocked.readdir.mockImplementation(async (p: any) => {
      const dirEntry = (name: string) => ({
        name,
        isDirectory: () => true,
        isFile: () => false,
      })
      const fileEntry = (name: string) => ({
        name,
        isDirectory: () => false,
        isFile: () => true,
      })
      if (String(p).endsWith('features')) {
        return [dirEntry('fortune')] as any
      }
      if (String(p).endsWith('fortune')) {
        return [dirEntry('ui')] as any
      }
      if (String(p).endsWith('fortune/ui')) {
        return [fileEntry('WheelOfFortuneModern.tsx')] as any
      }
      return [] as any
    })
    mocked.readFile.mockResolvedValue('// data-testid="spin-button" appears here')

    const result = await lookupImplicatedFiles(['spin-button'])
    expect(result).toEqual([expect.stringContaining('WheelOfFortuneModern.tsx')])
  })

  it('deduplicates results', async () => {
    mocked.stat.mockResolvedValue({ isDirectory: () => true } as any)
    mocked.readdir.mockImplementation(async (p: any) => {
      const dirEntry = (name: string) => ({
        name,
        isDirectory: () => true,
        isFile: () => false,
      })
      const fileEntry = (name: string) => ({
        name,
        isDirectory: () => false,
        isFile: () => true,
      })
      if (String(p).endsWith('features')) {
        return [dirEntry('fortune')] as any
      }
      if (String(p).endsWith('fortune')) {
        return [dirEntry('ui')] as any
      }
      if (String(p).endsWith('fortune/ui')) {
        return [fileEntry('WheelOfFortuneModern.tsx')] as any
      }
      return [] as any
    })
    mocked.readFile.mockResolvedValue('spin-button and spin-button both here')

    const result = await lookupImplicatedFiles(['spin-button', 'spin-button'])
    expect(result).toHaveLength(1)
  })

  it('skips identifiers that are empty or whitespace-only', async () => {
    mocked.stat.mockResolvedValue({ isDirectory: () => true } as any)
    mocked.readdir.mockResolvedValue([] as any)

    const result = await lookupImplicatedFiles(['', '   '])
    expect(result).toEqual([])
  })
})
