import { Page } from '@playwright/test'

export async function createRoom(page: Page, name: string): Promise<string> {
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  await page
    .getByRole('button', { name: /new room/i })
    .first()
    .click()
  await page.getByTestId('room-modal-name-input').waitFor({ state: 'visible' })
  await page.getByTestId('room-modal-name-input').fill(name)
  await page.getByTestId('room-modal-submit').click()
  await page.waitForTimeout(1000)
  return name
}
