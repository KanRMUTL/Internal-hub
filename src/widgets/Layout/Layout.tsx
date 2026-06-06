import { Wrapper, Nav, Main } from './styled'
import { useTheme } from 'features/toggle-theme'
import { Outlet } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { masterLogo } from 'shared/assets'
import styled from 'styled-components'
import { motion } from 'motion/react'
import { Sun, Moon } from 'lucide-react'

const LogoLink = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 6px 10px 6px 8px;
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

const LogoLockup = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 4px 10px 4px 6px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme }) => theme.background.surface};
  border: 1px solid ${({ theme }) => theme.colors.grey[100]};
`

const Hat = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 6px;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  font-size: 11px;
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.02em;
`

const Wordmark = styled.span`
  font-size: 14px;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.text};
  font-feature-settings: 'cv11', 'ss01', 'ss03';
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

const Layout = () => {
  const { mode, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const isDark = mode === 'DARK'

  return (
    <Wrapper>
      <Nav>
        <LogoLink type="button" onClick={() => navigate('/')} aria-label="Go to home">
          <LogoLockup>
            <img src={masterLogo} height={22} alt="" style={{ display: 'block' }} />
            <Hat aria-hidden="true">H</Hat>
            <Wordmark>Internal Hub</Wordmark>
          </LogoLockup>
        </LogoLink>
        <ThemeToggle
          type="button"
          onClick={toggleTheme}
          aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
          whileTap={{ scale: 0.94 }}
        >
          <motion.span
            key={mode}
            initial={{ opacity: 0, rotate: -45 }}
            animate={{ opacity: 1, rotate: 0 }}
            transition={{ duration: 0.2 }}
            style={{ display: 'inline-flex' }}
          >
            {isDark ? <Sun size={16} strokeWidth={1.75} /> : <Moon size={16} strokeWidth={1.75} />}
          </motion.span>
        </ThemeToggle>
      </Nav>
      <Main>
        <Outlet />
      </Main>
    </Wrapper>
  )
}

export default Layout
