import { Page } from '@playwright/test'

export async function addMember(page: Page, memberName: string): Promise<void> {
  await page
    .getByRole('button', { name: /manage/i })
    .first()
    .click()
  await page.getByTestId('member-add-input').waitFor({ state: 'visible' })
  await page.getByTestId('member-add-input').fill(memberName)
  await page.getByTestId('member-add-btn').click()
  await page.waitForTimeout(500)
}
