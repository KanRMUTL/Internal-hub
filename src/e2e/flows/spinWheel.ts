import { Page } from '@playwright/test'

export async function spinWheel(page: Page): Promise<string> {
  const spinBtn = page.getByRole('button', { name: /spin/i }).first()
  await spinBtn.waitFor({ state: 'visible' })
  await spinBtn.waitFor({ state: 'enabled', timeout: 8000 })
  await spinBtn.click()
  await page.waitForTimeout(7500)
  await page.getByTestId('winner-modal-save').waitFor({ state: 'visible' })
  const winnerName = (await page.locator('#winner-name').textContent()) ?? ''
  return winnerName
}
