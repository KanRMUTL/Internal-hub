import { describe, it, expect, vi, beforeEach } from 'vitest'
import { lookupImplicatedFiles } from '../lib/fsd-lookup'
import * as fs from 'fs/promises'
import type { Dirent, Stats } from 'fs'

vi.mock('fs/promises')

const mocked = vi.mocked(fs)

type DirentLike = Pick<Dirent, 'name' | 'isDirectory' | 'isFile'>

const dirEntry = (name: string): DirentLike => ({
  name,
  isDirectory: () => true,
  isFile: () => false,
})
const fileEntry = (name: string): DirentLike => ({
  name,
  isDirectory: () => false,
  isFile: () => true,
})

describe('lookupImplicatedFiles', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('returns an empty list for an empty identifier list', async () => {
    const result = await lookupImplicatedFiles([])
    expect(result).toEqual([])
  })

  it('returns files whose contents include any of the identifiers', async () => {
    mocked.stat.mockResolvedValue({ isDirectory: () => true } as unknown as Stats)
    mocked.readdir.mockImplementation(async (p: fs.PathLike): Promise<DirentLike[]> => {
      if (String(p).endsWith('features')) {
        return [dirEntry('fortune')]
      }
      if (String(p).endsWith('fortune')) {
        return [dirEntry('ui')]
      }
      if (String(p).endsWith('fortune/ui')) {
        return [fileEntry('WheelOfFortuneModern.tsx')]
      }
      return []
    })
    mocked.readFile.mockResolvedValue('// data-testid="spin-button" appears here')

    const result = await lookupImplicatedFiles(['spin-button'])
    expect(result).toEqual([expect.stringContaining('WheelOfFortuneModern.tsx')])
  })

  it('deduplicates results', async () => {
    mocked.stat.mockResolvedValue({ isDirectory: () => true } as unknown as Stats)
    mocked.readdir.mockImplementation(async (p: fs.PathLike): Promise<DirentLike[]> => {
      if (String(p).endsWith('features')) {
        return [dirEntry('fortune')]
      }
      if (String(p).endsWith('fortune')) {
        return [dirEntry('ui')]
      }
      if (String(p).endsWith('fortune/ui')) {
        return [fileEntry('WheelOfFortuneModern.tsx')]
      }
      return []
    })
    mocked.readFile.mockResolvedValue('spin-button and spin-button both here')

    const result = await lookupImplicatedFiles(['spin-button', 'spin-button'])
    expect(result).toHaveLength(1)
  })

  it('skips identifiers that are empty or whitespace-only', async () => {
    mocked.stat.mockResolvedValue({ isDirectory: () => true } as unknown as Stats)
    mocked.readdir.mockResolvedValue([] as unknown as DirentLike[])

    const result = await lookupImplicatedFiles(['', '   '])
    expect(result).toEqual([])
  })
})
