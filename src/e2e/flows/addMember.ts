import { Page, expect } from '@playwright/test'

export async function addMember(page: Page, memberName: string): Promise<void> {
  const inputVisible = await page
    .getByTestId('member-add-input')
    .isVisible({ timeout: 100 })
    .catch(() => false)
  if (!inputVisible) {
    await page
      .getByRole('button', { name: /manage/i })
      .first()
      .click()
    await page.getByTestId('member-add-input').waitFor({ state: 'visible' })
  }
  await page.getByTestId('member-add-input').fill(memberName)
  await page.getByTestId('member-add-btn').click()
  await expect(page.getByText(memberName, { exact: true })).toBeVisible({ timeout: 5000 })
}
