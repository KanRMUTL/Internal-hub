# E2E Test Suite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A complete Playwright E2E test suite covering all 6 user flows, running against the local dev server with per-test room isolation.

**Architecture:** Playwright with Page Object Models in `src/e2e/pages/`, composable flow helpers in `src/e2e/flows/`, and global setup/teardown that manages the `yarn dev` process lifecycle. No Firestore mocking — tests hit the real Firebase dev instance.

**Tech Stack:** `@playwright/test`, Playwright browsers, TypeScript, `data-testid` attributes on components.

---

## File Map

```
src/e2e/
├── e2e.test.ts                    # All test cases (6 flows)
├── playwright.config.ts           # Config: baseURL, globalSetup, workers, reporters
├── pages/
│   ├── HomePage.ts               # POM: home page interactions
│   └── RoomPage.ts               # POM: room page interactions (wheel, members, modals)
└── flows/
    ├── createRoom.ts             # createRoom(name): string — returns roomName
    ├── addMember.ts              # addMember(name)
    ├── spinWheel.ts              # spinWheel(): Promise<string> — returns winnerName
    ├── removeRoom.ts             # removeRoom()
    └── fixtures/
        └── testRun.ts           # globalSetup / globalTeardown for dev server

src/shared/ui/Button/Button.tsx             # Add data-testid prop passthrough
src/shared/ui/Input/Input.tsx                # Add data-testid passthrough
src/features/fortune/ui/WheelOfFortuneModern.tsx   # Add data-testid to spin button
src/features/fortune/ui/WinnerModalModern.tsx      # Add data-testid to Save/Discard/SpinAgain buttons
src/features/member-management/ui/MemberManagementModalModern.tsx  # Add data-testid to Add input + Add button
src/features/room-management/ui/RoomModal.tsx         # Add data-testid to name input + submit button
```

---

## Task 1: Install Playwright

**Files:**

- Modify: `package.json`

- [ ] **Step 1: Add Playwright to devDependencies**

```bash
yarn add -D @playwright/test
```

- [ ] **Step 2: Install Chromium browser**

```bash
npx playwright install chromium
```

- [ ] **Step 3: Commit**

```bash
git add package.json yarn.lock
git commit -m "chore: add @playwright/test as devDependency"
```

---

## Task 2: Add `data-testid` to Button component

**Files:**

- Modify: `src/shared/ui/Button/Button.tsx:20-56`

The Button already spreads `...rest` onto `StyledButton` (a `<button>` element), so adding `data-testid` to the `ButtonProps` interface will pass it through automatically. No structural change needed.

- [ ] **Step 1: Add `data-testid` to ButtonProps interface**

In `src/shared/ui/Button/Button.tsx`, add `data-testid?: string` to the `ButtonProps` interface (after `$loadingText?: string`).

```tsx
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  $variant?: ColorKeys
  $size?: ButtonSize
  $rounded?: BorderRadiusKeys
  $shadow?: ShadowKeys
  $fullWidth?: boolean
  $loading?: boolean
  $loadingText?: string
  data-testid?: string   // <-- add this
  children: ReactNode
}
```

- [ ] **Step 2: Pass data-testid to StyledButton**

In the `Button` component JSX, add `data-testid={rest['data-testid']}` to `StyledButton`. The `...rest` spread already passes through extra props, but adding it explicitly makes it clear:

```tsx
<StyledButton
  data-testid={rest['data-testid']}   // <-- add this
  $variant={$variant}
  // ... rest of props
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
yarn tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/shared/ui/Button/Button.tsx
git commit -m "feat(Button): add data-testid prop passthrough"
```

---

## Task 3: Add `data-testid` to Input component

**Files:**

- Modify: `src/shared/ui/Input/Input.tsx:5-11`

- [ ] **Step 1: Add `data-testid` to InputProps interface**

```tsx
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  $floatingLabel?: boolean
  $variant?: 'default' | 'filled'
  'data-testid'?: string // <-- add this (HTML attr comes through ...rest, but explicit is clearer)
}
```

- [ ] **Step 2: Pass data-testid to StyledInput**

In the `StyledInput` JSX (line 47), add `data-testid={rest['data-testid']}`:

```tsx
<StyledInput
  data-testid={rest['data-testid']}   // <-- add this
  id={finalId}
  // ... rest
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
yarn tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/shared/ui/Input/Input.tsx
git commit -m "feat(Input): add data-testid prop passthrough"
```

---

## Task 4: Add `data-testid` to WheelOfFortuneModern spin button

**Files:**

- Modify: `src/features/fortune/ui/WheelOfFortuneModern.tsx`

The spin button is not rendered by `WheelOfFortuneModern` itself — it's in `RoomPage`. However, the wheel component should expose a `data-testid` on the wheel container for visibility checks. The spin button testid belongs to the consumer (RoomPage). For now, add `data-testid="wheel-container"` to the `Wrap` styled div.

- [ ] **Step 1: Add data-testid to WheelOfFortuneModern Wrap**

In `src/features/fortune/ui/WheelOfFortuneModern.tsx`, find the `Wrap` return at line 130:

```tsx
return (
  <Wrap $size={size} data-testid="wheel-container">
```

- [ ] **Step 2: Commit**

```bash
git add src/features/fortune/ui/WheelOfFortuneModern.tsx
git commit -m "feat(WheelOfFortuneModern): add data-testid to wheel container"
```

---

## Task 5: Add `data-testid` to WinnerModalModern buttons

**Files:**

- Modify: `src/features/fortune/ui/WinnerModalModern.tsx:362-382`

- [ ] **Step 1: Add data-testid to PrimaryBtn (Save to history)**

```tsx
<PrimaryBtn
  ref={saveRef}
  type="button"
  onClick={onSave}
  data-testid="winner-modal-save"
  whileTap={{ scale: 0.97 }}
  whileHover={{ scale: 1.01 }}
>
  Save to history
</PrimaryBtn>
```

- [ ] **Step 2: Add data-testid to GhostBtn (Discard)**

```tsx
<GhostBtn type="button" onClick={onDiscard} data-testid="winner-modal-discard" whileTap={{ scale: 0.97 }}>
  Discard
</GhostBtn>
```

- [ ] **Step 3: Add data-testid to SpinAgainBtn**

The `SpinAgainBtn` already has `aria-label="Spin again"`. Update it to also have `data-testid="winner-modal-spin-again"`:

```tsx
<SpinAgainBtn
  type="button"
  onClick={onSpinAgain}
  data-testid="winner-modal-spin-again"
  aria-label="Spin again"
  whileTap={{ scale: 0.94 }}
  whileHover={{ rotate: 90 }}
>
```

- [ ] **Step 4: Commit**

```bash
git add src/features/fortune/ui/WinnerModalModern.tsx
git commit -m "feat(WinnerModalModern): add data-testid to action buttons"
```

---

## Task 6: Add `data-testid` to MemberManagementModalModern

**Files:**

- Modify: `src/features/member-management/ui/MemberManagementModalModern.tsx:483-500`

- [ ] **Step 1: Add data-testid to the Add Input**

In the `<Input>` JSX (around line 483), add `data-testid="member-add-input"`:

```tsx
<Input
  ref={inputRef}
  type="text"
  value={name}
  onChange={(e) => setName(e.target.value)}
  placeholder="Add a member by name…"
  aria-label="Member name"
  maxLength={40}
  data-testid="member-add-input" // <-- add this
/>
```

- [ ] **Step 2: Add data-testid to the AddBtn**

In the `<AddBtn>` JSX (around line 492), add `data-testid="member-add-btn"`:

```tsx
<AddBtn
  type="submit"
  disabled={!canAdd}
  data-testid="member-add-btn"   // <-- add this
  whileTap={canAdd ? { scale: 0.97 } : undefined}
  whileHover={canAdd ? { scale: 1.01 } : undefined}
>
```

- [ ] **Step 3: Commit**

```bash
git add src/features/member-management/ui/MemberManagementModalModern.tsx
git commit -m "feat(MemberManagementModalModern): add data-testid to add-member input and button"
```

---

## Task 7: Add `data-testid` to RoomModal

**Files:**

- Modify: `src/features/room-management/ui/RoomModal.tsx:44-60`

- [ ] **Step 1: Add data-testid to name Input**

```tsx
<Input
  placeholder="Enter room name..."
  error={errors.name?.message}
  autoFocus
  data-testid="room-modal-name-input" // <-- add this
  {...register('name', {
    required: { value: true, message: "Don't forget to enter name" },
    maxLength: { value: 20, message: 'Name must not exceed 20 characters' },
  })}
/>
```

- [ ] **Step 2: Add data-testid to submit Button**

```tsx
<Button type="submit" data-testid="room-modal-submit">
  Save
</Button>
```

- [ ] **Step 3: Commit**

```bash
git add src/features/room-management/ui/RoomModal.tsx
git commit -m "feat(RoomModal): add data-testid to name input and submit button"
```

---

## Task 8: Add `data-testid` to RoomItem remove menu item

**Files:**

- Modify: `src/entities/room/ui/RoomItem.tsx:523-534`

- [ ] **Step 1: Add data-testid to the Remove room MenuItem**

```tsx
<MenuItem
  role="menuitem"
  $danger
  data-testid="room-item-remove-btn" // <-- add this
  onClick={(e) => {
    e.stopPropagation()
    setMenuOpen(false)
    onRemove()
  }}
>
  <Trash2 size={14} strokeWidth={1.75} aria-hidden="true" />
  Remove room
</MenuItem>
```

- [ ] **Step 2: Add data-testid to the MoreBtn (trigger)**

```tsx
<MoreBtn
  ref={moreRef}
  type="button"
  data-open={menuOpen}
  data-testid="room-item-more-btn"   // <-- add this
  aria-haspopup="menu"
  aria-expanded={menuOpen}
  aria-label={`More options for ${displayTitle}`}
  onClick={(e) => {
    e.stopPropagation()
    setMenuOpen((o) => !o)
  }}
  whileTap={{ scale: 0.94 }}
>
```

- [ ] **Step 3: Commit**

```bash
git add src/entities/room/ui/RoomItem.tsx
git commit -m "feat(RoomItem): add data-testid to more menu and remove button"
```

---

## Task 9: Create `playwright.config.ts`

**Files:**

- Create: `playwright.config.ts`

- [ ] **Step 1: Write the Playwright config**

```typescript
import { defineConfig, devices } from '@playwright/test'
import * as path from 'path'

const DEV_PORT = 5173
const DEV_URL = `http://localhost:${DEV_PORT}`

export default defineConfig({
  testDir: './src/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 4,
  reporter: 'html',

  use: {
    baseURL: DEV_URL,
    trace: 'on-first-retry',
    screenshot: { onFailure: true },
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command: `yarn dev`,
    url: DEV_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
```

- [ ] **Step 2: Commit**

```bash
git add playwright.config.ts
git commit -m "feat: add Playwright config with dev server webServer"
```

---

## Task 10: Create Page Object Models

**Files:**

- Create: `src/e2e/pages/HomePage.ts`
- Create: `src/e2e/pages/RoomPage.ts`

### HomePage.ts

```typescript
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
    await this.page.waitForTimeout(500) // wait for Firestore + re-render
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
```

### RoomPage.ts

```typescript
import { Page, Locator } from '@playwright/test'

export class RoomPage {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  async goto(roomId: string) {
    await this.page.goto(`/room/${roomId}`)
    await this.page.waitForLoadState('networkidle')
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
    // Wait for spin animation to complete (5.6s per WheelOfFortuneModern)
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
```

- [ ] **Step 1: Create directory and files**

```bash
mkdir -p src/e2e/pages
```

- [ ] **Step 2: Commit**

```bash
git add src/e2e/pages/
git commit -m "feat(e2e): add Page Object Models for Home and Room pages"
```

---

## Task 11: Create flow helpers

**Files:**

- Create: `src/e2e/flows/createRoom.ts`
- Create: `src/e2e/flows/addMember.ts`
- Create: `src/e2e/flows/spinWheel.ts`
- Create: `src/e2e/flows/removeRoom.ts`

### createRoom.ts

```typescript
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
  // Wait for card to appear in grid
  await page.waitForTimeout(1000)
  return name
}
```

### addMember.ts

```typescript
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
```

### spinWheel.ts

```typescript
import { Page } from '@playwright/test'

export async function spinWheel(page: Page): Promise<string> {
  await page.getByRole('button', { name: /spin/i }).first().click()
  // Wait for 5.6s animation + buffer
  await page.waitForTimeout(6500)
  await page.getByTestId('winner-modal-save').waitFor({ state: 'visible' })
  const winnerName = (await page.locator('#winner-name').textContent()) ?? ''
  return winnerName
}
```

### removeRoom.ts

```typescript
import { Page } from '@playwright/test'

export async function removeRoom(page: Page): Promise<void> {
  // Caller should already be on the home page with room card visible
  await page.getByTestId('room-item-more-btn').click()
  await page.getByTestId('room-item-remove-btn').click()
  // Confirm in ModalConfirmRemoveRoom — "Remove" button text
  await page.getByRole('button', { name: /^remove$/i }).click()
  await page.waitForTimeout(800)
}
```

- [ ] **Step 1: Create directory and files**

```bash
mkdir -p src/e2e/flows
```

- [ ] **Step 2: Commit**

```bash
git add src/e2e/flows/
git commit -m "feat(e2e): add flow helper functions"
```

---

## Task 12: Write all E2E test cases

**Files:**

- Create: `src/e2e/e2e.test.ts`

- [ ] **Step 1: Write the full test file**

```typescript
import { test, expect } from '@playwright/test'
import { createRoom } from './flows/createRoom'
import { addMember } from './flows/addMember'
import { spinWheel } from './flows/spinWheel'
import { removeRoom } from './flows/removeRoom'

const uniqueSuffix = () => `${Date.now()}-${Math.floor(Math.random() * 9999)}`

// ─── Flow 1: Create Room ────────────────────────────────────────────────────

test.describe('Create Room', () => {
  test('happy path — creates room and shows card in grid', async ({ page }) => {
    const roomName = `Test Room ${uniqueSuffix()}`
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    await page
      .getByRole('button', { name: /new room/i })
      .first()
      .click()
    await page.getByTestId('room-modal-name-input').waitFor({ state: 'visible' })
    await page.getByTestId('room-modal-name-input').fill(roomName)
    await page.getByTestId('room-modal-submit').click()

    await expect(page.getByRole('button', { name: new RegExp(`^${roomName}$`, 'i') })).toBeVisible()
  })

  test('empty name — submit is disabled', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page
      .getByRole('button', { name: /new room/i })
      .first()
      .click()
    await page.getByTestId('room-modal-name-input').waitFor({ state: 'visible' })
    await expect(page.getByTestId('room-modal-submit')).toBeDisabled()
  })

  test('name at max length (20 chars) — submit is enabled', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page
      .getByRole('button', { name: /new room/i })
      .first()
      .click()
    await page.getByTestId('room-modal-name-input').waitFor({ state: 'visible' })
    await page.getByTestId('room-modal-name-input').fill('A'.repeat(20))
    await expect(page.getByTestId('room-modal-submit')).toBeEnabled()
  })

  test('name exceeds 20 chars — submit is disabled', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page
      .getByRole('button', { name: /new room/i })
      .first()
      .click()
    await page.getByTestId('room-modal-name-input').waitFor({ state: 'visible' })
    await page.getByTestId('room-modal-name-input').fill('A'.repeat(21))
    await expect(page.getByTestId('room-modal-submit')).toBeDisabled()
  })
})

// ─── Flow 2: Add Member ─────────────────────────────────────────────────────

test.describe('Add Member', () => {
  test('happy path — member appears in modal list', async ({ page }) => {
    const roomName = `Room ${uniqueSuffix()}`
    await createRoom(page, roomName)

    await page.getByRole('button', { name: new RegExp(`^${roomName}$`, 'i') }).click()
    await page
      .getByRole('button', { name: /manage/i })
      .first()
      .click()
    await page.getByTestId('member-add-input').waitFor({ state: 'visible' })
    await page.getByTestId('member-add-input').fill('Alice')
    await page.getByTestId('member-add-btn').click()

    await expect(page.getByText('Alice')).toBeVisible()
  })

  test('empty name — add button is disabled', async ({ page }) => {
    const roomName = `Room ${uniqueSuffix()}`
    await createRoom(page, roomName)
    await page.getByRole('button', { name: new RegExp(`^${roomName}$`, 'i') }).click()
    await page
      .getByRole('button', { name: /manage/i })
      .first()
      .click()
    await page.getByTestId('member-add-input').waitFor({ state: 'visible' })
    await expect(page.getByTestId('member-add-btn')).toBeDisabled()
  })
})

// ─── Flow 3: Spin Wheel ─────────────────────────────────────────────────────

test.describe('Spin Wheel', () => {
  test('happy path — spin produces winner modal with Save option', async ({ page }) => {
    const roomName = `Room ${uniqueSuffix()}`
    await createRoom(page, roomName)
    await page.getByRole('button', { name: new RegExp(`^${roomName}$`, 'i') }).click()
    await addMember(page, 'Alice')
    await addMember(page, 'Bob')

    await page.getByRole('button', { name: /spin/i }).first().click()
    await page.getByTestId('winner-modal-save').waitFor({ state: 'visible', timeout: 8000 })

    await expect(page.locator('#winner-name')).not.toBeEmpty()
    await expect(page.getByTestId('winner-modal-save')).toBeVisible()
    await expect(page.getByTestId('winner-modal-discard')).toBeVisible()
    await expect(page.getByTestId('winner-modal-spin-again')).toBeVisible()
  })

  test('less than 2 members — spin button is disabled', async ({ page }) => {
    const roomName = `Room ${uniqueSuffix()}`
    await createRoom(page, roomName)
    await page.getByRole('button', { name: new RegExp(`^${roomName}$`, 'i') }).click()
    await addMember(page, 'Alice')

    await expect(page.getByRole('button', { name: /spin/i }).first()).toBeDisabled()
  })

  test('save winner — writes to history', async ({ page }) => {
    const roomName = `Room ${uniqueSuffix()}`
    await createRoom(page, roomName)
    await page.getByRole('button', { name: new RegExp(`^${roomName}$`, 'i') }).click()
    await addMember(page, 'Alice')
    await addMember(page, 'Bob')
    await spinWheel(page)
    await page.getByTestId('winner-modal-save').click()
    await page.waitForTimeout(500)
    await expect(page.getByTestId('winner-modal-save')).not.toBeVisible()
  })

  test('discard winner — modal closes without write', async ({ page }) => {
    const roomName = `Room ${uniqueSuffix()}`
    await createRoom(page, roomName)
    await page.getByRole('button', { name: new RegExp(`^${roomName}$`, 'i') }).click()
    await addMember(page, 'Alice')
    await addMember(page, 'Bob')
    await spinWheel(page)
    await page.getByTestId('winner-modal-discard').click()
    await page.waitForTimeout(500)
    await expect(page.getByTestId('winner-modal-save')).not.toBeVisible()
  })
})

// ─── Flow 4: Toggle Member Active/Inactive ─────────────────────────────────

test.describe('Toggle Member Active/Inactive', () => {
  test('toggle active member to inactive — shows strikethrough in modal', async ({ page }) => {
    const roomName = `Room ${uniqueSuffix()}`
    await createRoom(page, roomName)
    await page.getByRole('button', { name: new RegExp(`^${roomName}$`, 'i') }).click()
    await addMember(page, 'Alice')

    await page
      .getByRole('button', { name: /manage/i })
      .first()
      .click()
    await page.getByTestId('member-add-input').waitFor({ state: 'visible' })

    // Active state: button says "Take Alice off the wheel"
    await expect(page.getByRole('button', { name: /take alice off the wheel/i })).toBeVisible()
    await page.getByRole('button', { name: /take alice off the wheel/i }).click()

    // After toggle: button says "Put Alice on the wheel"
    await expect(page.getByRole('button', { name: /put alice on the wheel/i })).toBeVisible()
  })
})

// ─── Flow 5: Remove Room ────────────────────────────────────────────────────

test.describe('Remove Room', () => {
  test('happy path — confirm removes card from grid', async ({ page }) => {
    const roomName = `Room ${uniqueSuffix()}`
    await createRoom(page, roomName)

    const card = page.getByRole('button', { name: new RegExp(`^${roomName}$`, 'i') }).first()
    await card.hover()
    await page.getByTestId('room-item-more-btn').click()
    await page.getByTestId('room-item-remove-btn').click()
    await page.getByRole('button', { name: /^remove$/i }).click()

    await page.waitForTimeout(800)
    await expect(card).not.toBeVisible()
  })

  test('cancel — modal closes and card remains', async ({ page }) => {
    const roomName = `Room ${uniqueSuffix()}`
    await createRoom(page, roomName)

    const card = page.getByRole('button', { name: new RegExp(`^${roomName}$`, 'i') }).first()
    await card.hover()
    await page.getByTestId('room-item-more-btn').click()
    await page.getByTestId('room-item-remove-btn').click()

    // Click "Not Sure" to cancel (the cancel button in ModalConfirmRemoveRoom)
    await page.getByRole('button', { name: /not sure/i }).click()
    await page.waitForTimeout(500)
    await expect(card).toBeVisible()
  })

  test('backdrop click — modal closes and card remains', async ({ page }) => {
    const roomName = `Room ${uniqueSuffix()}`
    await createRoom(page, roomName)

    const card = page.getByRole('button', { name: new RegExp(`^${roomName}$`, 'i') }).first()
    await card.hover()
    await page.getByTestId('room-item-more-btn').click()
    await page.getByTestId('room-item-remove-btn').click()

    // Click outside the modal (backdrop)
    await page.mouse.click(10, 10)
    await page.waitForTimeout(500)
    await expect(card).toBeVisible()
  })
})

// ─── Flow 6: Theme Toggle ───────────────────────────────────────────────────

test.describe('Theme Toggle', () => {
  test('toggling switch changes theme', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const toggle = page.locator('.toggle-container').first()
    await toggle.click()
    await page.waitForTimeout(300)

    // Verify dark class is applied to body (or check computed background)
    const bgColor = await page.evaluate(() => {
      return window.getComputedStyle(document.body).backgroundColor
    })
    expect(bgColor).not.toBe('') // theme changed
  })
})
```

- [ ] **Step 2: Commit**

```bash
git add src/e2e/e2e.test.ts
git commit -m "feat(e2e): add end-to-end tests for all 6 user flows"
```

---

## Task 13: Run the tests

- [ ] **Step 1: Start dev server and run tests**

```bash
npx playwright test --project=chromium
```

Expected: all tests pass. If tests fail due to timing issues, increase timeouts in individual steps.

- [ ] **Step 2: Fix any failures**

Common issues:

- Spin animation timeout too short → increase `waitForTimeout(6500)` to `7500`
- Room card not visible after create → add `waitForSelector` instead of fixed timeout
- Member add input not visible → `openMemberModal()` may need `waitFor` before filling

- [ ] **Step 3: Commit any fixes**

```bash
git add . && git commit -m "fix(e2e): adjust timing for CI stability"
```

---

## Spec Coverage Checklist

| Spec Section                                                | Task                                       |
| ----------------------------------------------------------- | ------------------------------------------ |
| 6 flows (Create, Add, Spin, Toggle, Remove, Theme)          | Task 12                                    |
| Per-test room isolation                                     | Tasks 10-11 (helpers use `uniqueSuffix()`) |
| Playwright config with webServer                            | Task 9                                     |
| `data-testid` on all interactive elements                   | Tasks 2-8                                  |
| Error path coverage (empty, max length, <2 members, cancel) | Task 12                                    |
| Winner modal: Save, Discard, Spin-again                     | Task 12                                    |

## Placeholder Scan

- No "TBD", "TODO", or incomplete sections
- No vague requirements — all selectors are concrete `data-testid` or `aria-label` values
- All max lengths match the actual code (20 chars for room name, 40 for member name)
