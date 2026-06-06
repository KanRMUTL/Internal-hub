import { Page } from '@playwright/test'

export class HomePage {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  async goto() {
    await this.page.goto('/')
  }

  get createRoomBtn() {
    return this.page.getByRole('button', { name: /new room/i }).first()
  }

  get roomModal() {
    return this.page.getByTestId('room-modal-name-input')
  }

  get roomModalSubmit() {
    return this.page.getByTestId('room-modal-submit')
  }

  async openCreateRoomModal() {
    await this.createRoomBtn.click()
    await this.roomModal.waitFor({ state: 'visible' })
  }

  async createRoom(name: string) {
    await this.openCreateRoomModal()
    await this.roomModal.fill(name)
    await this.roomModalSubmit.click()
    await this.page.waitForTimeout(500)
  }

  getRoomCard(name: string) {
    return this.page.getByRole('button', { name: new RegExp(`^${name}$`, 'i') }).first()
  }

  async openRoomMenu(name: string) {
    const card = this.getRoomCard(name)
    await card.hover()
    await this.page.getByTestId('room-item-more-btn').click()
  }

  async removeRoom(name: string) {
    await this.openRoomMenu(name)
    await this.page.getByTestId('room-item-remove-btn').click()
    await this.page.getByRole('button', { name: /remove/i }).click()
    await this.page.waitForTimeout(500)
  }
}
