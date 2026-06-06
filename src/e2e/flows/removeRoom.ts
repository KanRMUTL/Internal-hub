import { Page } from '@playwright/test'

export async function removeRoom(page: Page): Promise<void> {
  await page.getByTestId('room-item-more-btn').click()
  await page.getByTestId('room-item-remove-btn').click()
  await page.getByRole('button', { name: /^remove$/i }).click()
  await page.waitForTimeout(800)
}
