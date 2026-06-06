import { Page, Locator } from '@playwright/test'

export class RoomPage {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  async goto(roomId: string) {
    await this.page.goto(`/room/${roomId}`)
    await this.page.waitForLoadState('domcontentloaded')
  }

  get spinBtn() {
    return this.page.getByRole('button', { name: /spin/i }).first()
  }

  get memberManageBtn() {
    return this.page.getByRole('button', { name: /manage/i }).first()
  }

  get memberAddInput() {
    return this.page.getByTestId('member-add-input')
  }

  get memberAddBtn() {
    return this.page.getByTestId('member-add-btn')
  }

  get themeToggle() {
    return this.page.locator('.toggle-container').first()
  }

  async openMemberModal() {
    await this.memberManageBtn.click()
    await this.page.waitForTimeout(300)
  }

  async addMember(name: string) {
    await this.openMemberModal()
    await this.memberAddInput.fill(name)
    await this.memberAddBtn.click()
    await this.page.waitForTimeout(300)
  }

  async spinWheel() {
    await this.spinBtn.click()
    await this.page.waitForTimeout(6500)
    await this.page.getByTestId('winner-modal-save').waitFor({ state: 'visible' })
  }

  async saveWinner() {
    await this.page.getByTestId('winner-modal-save').click()
    await this.page.waitForTimeout(500)
  }

  async toggleMemberActive(memberName: string) {
    await this.openMemberModal()
    await this.page.getByRole('button', { name: new RegExp(`take ${memberName} off the wheel`, 'i') }).click()
    await this.page.waitForTimeout(300)
  }

  async toggleTheme() {
    await this.themeToggle.click()
    await this.page.waitForTimeout(300)
  }
}
