import styled from 'styled-components'
import { useTheme } from 'features/toggle-theme'
import { Outlet } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { masterLogo } from 'shared/assets'
import { motion } from 'motion/react'
import { Sun, Moon } from 'lucide-react'
import { PageHeaderProvider, usePageHeader } from './PageHeaderContext'

const Shell = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`

const NavBar = styled.header`
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  height: 56px;
  padding: 0 ${({ theme }) => theme.spacing.xl};
  background: ${({ theme }) => theme.background.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.grey[100]};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 0 ${({ theme }) => theme.spacing.md};
  }
`

const NavSlot = styled.div<{ $align: 'start' | 'end' }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  min-width: 0;
  flex: 1 1 auto;
  justify-content: ${({ $align }) => ($align === 'end' ? 'flex-end' : 'flex-start')};
`

const Main = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing['3xl']} ${({ theme }) => theme.spacing.xl};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.md};
  }
`

const LogoLink = styled.button`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing['2xs']};
  border: 0;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: transparent;
  cursor: pointer;
  transition: background-color 180ms ${({ theme }) => theme.motion.easing.easeOut};

  &:hover {
    background: ${({ theme }) => theme.colors.hover};
  }

  &:focus-visible {
    outline: none;
    box-shadow: ${({ theme }) => theme.shadow.focusVisible};
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`

const Wordmark = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.text};
  font-feature-settings: 'cv11', 'ss01', 'ss03';
`

const LogoImage = styled.img`
  display: block;
  height: 22px;
`

const ToggleIconWrap = styled(motion.span)`
  display: inline-flex;
`

const ThemeToggle = styled(motion.button)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  border: 1px solid ${({ theme }) => theme.colors.grey[200]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme }) => theme.background.surface};
  color: ${({ theme }) => theme.text};
  cursor: pointer;
  transition:
    background-color 180ms ${({ theme }) => theme.motion.easing.easeOut},
    border-color 180ms ${({ theme }) => theme.motion.easing.easeOut};

  &:hover {
    background: ${({ theme }) => theme.colors.hover};
    border-color: ${({ theme }) => theme.colors.grey[300]};
  }

  &:focus-visible {
    outline: none;
    box-shadow: ${({ theme }) => theme.shadow.focusVisible};
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`

const Brand = () => {
  const navigate = useNavigate()
  return (
    <LogoLink type="button" onClick={() => navigate('/')} aria-label="Go to home">
      <LogoImage src={masterLogo} alt="" />
      <Wordmark>Internal Hub</Wordmark>
    </LogoLink>
  )
}

const ThemeToggleButton = () => {
  const { mode, toggleTheme } = useTheme()
  const isDark = mode === 'DARK'
  return (
    <ThemeToggle
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      whileTap={{ scale: 0.94 }}
    >
      <ToggleIconWrap key={mode} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.15 }}>
        {isDark ? <Sun size={16} strokeWidth={1.75} /> : <Moon size={16} strokeWidth={1.75} />}
      </ToggleIconWrap>
    </ThemeToggle>
  )
}

const NavContent = () => {
  const { slots } = usePageHeader()
  const hasCustomLeft = slots.left !== undefined
  const hasCustomRight = slots.right !== undefined
  return (
    <NavBar>
      <NavSlot $align="start">{hasCustomLeft ? slots.left : <Brand />}</NavSlot>
      <NavSlot $align="end">{hasCustomRight ? slots.right : <ThemeToggleButton />}</NavSlot>
    </NavBar>
  )
}

const Layout = () => (
  <PageHeaderProvider>
    <Shell>
      <NavContent />
      <Main>
        <Outlet />
      </Main>
    </Shell>
  </PageHeaderProvider>
)

export default Layout
