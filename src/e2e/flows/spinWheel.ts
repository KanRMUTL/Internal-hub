import { Page } from '@playwright/test'

export async function spinWheel(page: Page): Promise<string> {
  await page.getByRole('button', { name: /spin/i }).first().click()
  await page.waitForTimeout(7500)
  await page.getByTestId('winner-modal-save').waitFor({ state: 'visible' })
  const winnerName = (await page.locator('#winner-name').textContent()) ?? ''
  return winnerName
}
