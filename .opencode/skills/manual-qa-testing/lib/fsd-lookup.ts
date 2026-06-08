import { readdir, readFile, stat } from 'fs/promises'
import { join, relative } from 'path'

const SCAN_ROOTS = ['src/features', 'src/entities', 'src/pages', 'src/shared/ui']

const TEXT_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx'])

const MAX_DEPTH = 6
const MAX_FILES_PER_ROOT = 200

/**
 * Recursively walks SCAN_ROOTS, returns the unique list of source files whose
 * contents include any of the given identifiers (substring match). Limit:
 * MAX_FILES_PER_ROOT per root to keep the scan fast.
 */
export async function lookupImplicatedFiles(identifiers: string[]): Promise<string[]> {
  const needles = identifiers.map((s) => s.trim()).filter(Boolean)
  if (needles.length === 0) return []

  const matches = new Set<string>()

  for (const root of SCAN_ROOTS) {
    let rootStat
    try {
      rootStat = await stat(root)
    } catch {
      continue
    }
    if (!rootStat.isDirectory()) continue

    const files: string[] = []
    await walk(root, files, 0)

    for (const file of files) {
      let content: string
      try {
        content = await readFile(file, 'utf8')
      } catch {
        continue
      }
      if (needles.some((n) => content.includes(n))) {
        matches.add(relative(process.cwd(), file))
      }
    }
  }

  return [...matches].sort()
}

async function walk(dir: string, out: string[], depth: number): Promise<void> {
  if (out.length >= MAX_FILES_PER_ROOT || depth > MAX_DEPTH) return
  let entries
  try {
    entries = await readdir(dir, { withFileTypes: true })
  } catch {
    return
  }
  for (const e of entries) {
    if (out.length >= MAX_FILES_PER_ROOT) return
    const full = join(dir, e.name)
    if (e.isDirectory()) {
      if (e.name === 'node_modules' || e.name === '__tests__' || e.name.startsWith('.')) continue
      await walk(full, out, depth + 1)
    } else if (e.isFile()) {
      const ext = e.name.slice(e.name.lastIndexOf('.'))
      if (TEXT_EXTENSIONS.has(ext)) out.push(full)
    }
  }
}
