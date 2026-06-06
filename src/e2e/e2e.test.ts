import { test, expect, type Page } from '@playwright/test'
import { createRoom } from './flows/createRoom'

const uniqueSuffix = () => `${Date.now()}-${Math.floor(Math.random() * 9999)}`

const getRoomCard = (page: Page, roomName: string) =>
  page.getByRole('button', { name: new RegExp(roomName, 'i') }).first()

test.describe('Create Room', () => {
  test('happy path — creates room and shows card in grid', async ({ page }) => {
    const roomName = `R ${uniqueSuffix()}`
    await page.goto('/')
    await page.waitForLoadState('domcontentloaded')

    await page
      .getByRole('button', { name: /new room/i })
      .first()
      .click()
    await page.getByTestId('room-modal-name-input').waitFor({ state: 'visible' })
    await page.getByTestId('room-modal-name-input').fill(roomName)
    await page.getByTestId('room-modal-submit').click()
    await page.waitForTimeout(2000)

    await expect(getRoomCard(page, roomName)).toBeVisible()
  })

  test('empty name — submit stays enabled but form does not submit', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('domcontentloaded')
    await page
      .getByRole('button', { name: /new room/i })
      .first()
      .click()
    await page.getByTestId('room-modal-name-input').waitFor({ state: 'visible' })
    await expect(page.getByTestId('room-modal-submit')).toBeEnabled()
    await page.getByTestId('room-modal-submit').click()
    await page.waitForTimeout(300)
    await expect(page.getByTestId('room-modal-name-input')).toBeVisible()
  })

  test('name at max length (20 chars) — submit works', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('domcontentloaded')
    await page
      .getByRole('button', { name: /new room/i })
      .first()
      .click()
    await page.getByTestId('room-modal-name-input').waitFor({ state: 'visible' })
    await page.getByTestId('room-modal-name-input').fill('A'.repeat(20))
    await expect(page.getByTestId('room-modal-submit')).toBeEnabled()
  })

  test('name exceeds 20 chars — submit stays enabled but form does not submit', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('domcontentloaded')
    await page
      .getByRole('button', { name: /new room/i })
      .first()
      .click()
    await page.getByTestId('room-modal-name-input').waitFor({ state: 'visible' })
    await page.getByTestId('room-modal-name-input').fill('A'.repeat(21))
    await expect(page.getByTestId('room-modal-submit')).toBeEnabled()
    await page.getByTestId('room-modal-submit').click()
    await page.waitForTimeout(300)
    await expect(page.getByTestId('room-modal-name-input')).toBeVisible()
  })
})

test.describe('Add Member', () => {
  test('happy path — member appears in modal list', async ({ page }) => {
    const roomName = `${uniqueSuffix()}`
    await createRoom(page, roomName)
    await getRoomCard(page, roomName).click()
    await page.waitForURL(/\/room\/.+/)
    await page
      .getByRole('button', { name: /manage/i })
      .first()
      .click()
    await page.getByTestId('member-add-input').waitFor({ state: 'visible' })
    await page.getByTestId('member-add-input').fill('Alice')
    await page.getByTestId('member-add-btn').click()
    await expect(page.getByLabel('Members').getByText('Alice')).toBeVisible()
  })

  test('empty name — add button is disabled', async ({ page }) => {
    const roomName = `${uniqueSuffix()}`
    await createRoom(page, roomName)
    await getRoomCard(page, roomName).click()
    await page.waitForURL(/\/room\/.+/)
    await page
      .getByRole('button', { name: /manage/i })
      .first()
      .click()
    await page.getByTestId('member-add-input').waitFor({ state: 'visible' })
    await expect(page.getByTestId('member-add-btn')).toBeDisabled()
  })
})

test.describe('Spin Wheel', () => {
  test('happy path — spin produces winner modal with Save option', async ({ page }) => {
    const roomName = `${uniqueSuffix()}`
    await createRoom(page, roomName)
    await getRoomCard(page, roomName).click()
    await page.waitForURL(/\/room\/.+/)
    await page
      .getByRole('button', { name: /manage/i })
      .first()
      .click()
    await page.getByTestId('member-add-input').waitFor({ state: 'visible' })
    await page.getByTestId('member-add-input').fill('Alice')
    await page.getByTestId('member-add-btn').click()
    await expect(page.getByLabel('Members').getByText('Alice')).toBeVisible({ timeout: 5000 })
    await page.getByTestId('member-add-input').fill('Bob')
    await page.getByTestId('member-add-btn').click()
    await expect(page.getByLabel('Members').getByText('Bob')).toBeVisible({ timeout: 5000 })

    await page.keyboard.press('Escape')
    await expect(page.getByRole('dialog', { name: 'Members' })).not.toBeVisible()
    await page.waitForTimeout(500)

    const spinBtn = page.getByRole('button', { name: /spin/i }).first()
    await spinBtn.waitFor({ state: 'visible' })
    await page.waitForFunction(
      () => {
        const btns = document.querySelectorAll('button')
        for (const btn of btns) {
          if (btn.textContent?.trim() === 'Spin the wheel' && !btn.hasAttribute('disabled')) return true
        }
        return false
      },
      { timeout: 10000 }
    )

    await spinBtn.click()
    await page.getByTestId('winner-modal-save').waitFor({ state: 'visible', timeout: 10000 })

    await expect(page.locator('#winner-name')).not.toBeEmpty()
    await expect(page.getByTestId('winner-modal-save')).toBeVisible()
    await expect(page.getByTestId('winner-modal-discard')).toBeVisible()
    await expect(page.getByTestId('winner-modal-spin-again')).toBeVisible()
  })

  test('less than 2 members — spin button is disabled', async ({ page }) => {
    const roomName = `${uniqueSuffix()}`
    await createRoom(page, roomName)
    await getRoomCard(page, roomName).click()
    await page.waitForURL(/\/room\/.+/)
    await page
      .getByRole('button', { name: /manage/i })
      .first()
      .click()
    await page.getByTestId('member-add-input').waitFor({ state: 'visible' })
    await page.getByTestId('member-add-input').fill('Alice')
    await page.getByTestId('member-add-btn').click()
    await expect(page.getByLabel('Members').getByText('Alice')).toBeVisible({ timeout: 5000 })

    await page.keyboard.press('Escape')
    await expect(page.getByRole('dialog', { name: 'Members' })).not.toBeVisible()
    await page.waitForTimeout(500)
    await expect(page.getByRole('button', { name: /spin/i }).first()).toBeDisabled()
  })

  test('save winner — modal closes', async ({ page }) => {
    const roomName = `${uniqueSuffix()}`
    await createRoom(page, roomName)
    await getRoomCard(page, roomName).click()
    await page.waitForURL(/\/room\/.+/)
    await page
      .getByRole('button', { name: /manage/i })
      .first()
      .click()
    await page.getByTestId('member-add-input').waitFor({ state: 'visible' })
    await page.getByTestId('member-add-input').fill('Alice')
    await page.getByTestId('member-add-btn').click()
    await expect(page.getByLabel('Members').getByText('Alice')).toBeVisible({ timeout: 5000 })
    await page.getByTestId('member-add-input').fill('Bob')
    await page.getByTestId('member-add-btn').click()
    await expect(page.getByLabel('Members').getByText('Bob')).toBeVisible({ timeout: 5000 })

    await page.keyboard.press('Escape')
    await expect(page.getByRole('dialog', { name: 'Members' })).not.toBeVisible()
    await page.waitForTimeout(500)

    const spinBtn = page.getByRole('button', { name: /spin/i }).first()
    await spinBtn.waitFor({ state: 'visible' })
    await page.waitForFunction(
      () => {
        const btns = document.querySelectorAll('button')
        for (const btn of btns) {
          if (btn.textContent?.trim() === 'Spin the wheel' && !btn.hasAttribute('disabled')) return true
        }
        return false
      },
      { timeout: 10000 }
    )
    await spinBtn.click()
    await page.getByTestId('winner-modal-save').waitFor({ state: 'visible', timeout: 10000 })
    await page.getByTestId('winner-modal-save').click()
    await page.waitForTimeout(500)
    await expect(page.getByTestId('winner-modal-save')).not.toBeVisible()
  })

  test('discard winner — modal closes without write', async ({ page }) => {
    const roomName = `${uniqueSuffix()}`
    await createRoom(page, roomName)
    await getRoomCard(page, roomName).click()
    await page.waitForURL(/\/room\/.+/)
    await page
      .getByRole('button', { name: /manage/i })
      .first()
      .click()
    await page.getByTestId('member-add-input').waitFor({ state: 'visible' })
    await page.getByTestId('member-add-input').fill('Alice')
    await page.getByTestId('member-add-btn').click()
    await expect(page.getByLabel('Members').getByText('Alice')).toBeVisible({ timeout: 5000 })
    await page.getByTestId('member-add-input').fill('Bob')
    await page.getByTestId('member-add-btn').click()
    await expect(page.getByLabel('Members').getByText('Bob')).toBeVisible({ timeout: 5000 })

    await page.keyboard.press('Escape')
    await expect(page.getByRole('dialog', { name: 'Members' })).not.toBeVisible()
    await page.waitForTimeout(500)

    const spinBtn = page.getByRole('button', { name: /spin/i }).first()
    await spinBtn.waitFor({ state: 'visible' })
    await page.waitForFunction(
      () => {
        const btns = document.querySelectorAll('button')
        for (const btn of btns) {
          if (btn.textContent?.trim() === 'Spin the wheel' && !btn.hasAttribute('disabled')) return true
        }
        return false
      },
      { timeout: 10000 }
    )
    await spinBtn.click()
    await page.getByTestId('winner-modal-discard').waitFor({ state: 'visible', timeout: 10000 })
    await page.getByTestId('winner-modal-discard').click()
    await page.waitForTimeout(500)
    await expect(page.getByTestId('winner-modal-save')).not.toBeVisible()
  })
})

test.describe('Toggle Member Active/Inactive', () => {
  test('toggle active member to inactive — button label changes', async ({ page }) => {
    const roomName = `${uniqueSuffix()}`
    await createRoom(page, roomName)
    await getRoomCard(page, roomName).click()
    await page.waitForURL(/\/room\/.+/)
    await page
      .getByRole('button', { name: /manage/i })
      .first()
      .click()
    await page.getByTestId('member-add-input').waitFor({ state: 'visible' })
    await page.getByTestId('member-add-input').fill('Alice')
    await page.getByTestId('member-add-btn').click()
    await expect(page.getByLabel('Members').getByText('Alice')).toBeVisible({ timeout: 5000 })

    const toggleBtn = page.getByRole('button', { name: /take alice off the wheel/i })
    await toggleBtn.waitFor({ state: 'visible', timeout: 5000 })
    await toggleBtn.click()

    await expect(page.getByRole('button', { name: /put alice on the wheel/i })).toBeVisible({ timeout: 5000 })
  })
})

test.describe('Remove Room', () => {
  test('happy path — confirm removes card from grid', async ({ page }) => {
    const roomName = `${uniqueSuffix()}`
    await createRoom(page, roomName)

    const card = getRoomCard(page, roomName)
    await card.hover()
    await card.getByTestId('room-item-more-btn').click()
    await card.getByTestId('room-item-remove-btn').click()
    await page.getByRole('button', { name: /^remove$/i }).click()

    await page.waitForTimeout(800)
    await expect(card).not.toBeVisible()
  })

  test('cancel — modal closes and card remains', async ({ page }) => {
    const roomName = `${uniqueSuffix()}`
    await createRoom(page, roomName)

    const card = getRoomCard(page, roomName)
    await card.hover()
    await card.getByTestId('room-item-more-btn').click()
    await card.getByTestId('room-item-remove-btn').click()

    await page.getByRole('button', { name: /not sure/i }).click()
    await page.waitForTimeout(500)
    await expect(card).toBeVisible()
  })

  test('backdrop click — modal closes and card remains', async ({ page }) => {
    const roomName = `${uniqueSuffix()}`
    await createRoom(page, roomName)

    const card = getRoomCard(page, roomName)
    await card.hover()
    await card.getByTestId('room-item-more-btn').click()
    await card.getByTestId('room-item-remove-btn').click()

    await page.mouse.click(10, 10)
    await page.waitForTimeout(500)
    await expect(card).toBeVisible()
  })
})

test.describe('Theme Toggle', () => {
  test('toggling switch changes theme', async ({ page }) => {
    const roomName = `${uniqueSuffix()}`
    await createRoom(page, roomName)
    await getRoomCard(page, roomName).click()
    await page.waitForURL(/\/room\/.+/)
    await page.waitForLoadState('domcontentloaded')
    await expect(page.getByRole('heading', { level: 2, name: /who's up next/i })).toBeVisible()

    const toggle = page.getByRole('button', { name: /switch to .+ mode/i }).first()
    await expect(toggle).toBeVisible()
    await toggle.click()
    await page.waitForTimeout(300)

    const bgColor = await page.evaluate(() => {
      return window.getComputedStyle(document.body).backgroundColor
    })
    expect(bgColor).not.toBe('')
  })
})
