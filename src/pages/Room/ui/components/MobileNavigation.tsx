import styled from 'styled-components'
import { Users, History } from 'lucide-react'
import { Typography } from 'shared/ui'
import { motionTransition, getScale } from 'shared/styles/utils'

interface MobileNavigationProps {
  activeMobileSection: 'wheel' | 'history'
  onSectionChange: (section: 'wheel' | 'history') => void
  onMembersClick: () => void
}

const MobileNavigation = ({ activeMobileSection, onSectionChange, onMembersClick }: MobileNavigationProps) => {
  return (
    <MobileNavigationContainer>
      <MobileNavButton $active={activeMobileSection === 'wheel'} onClick={() => onSectionChange('wheel')}>
        <Typography $size="sm" $weight="medium" $inline>
          Wheel
        </Typography>
      </MobileNavButton>
      <MobileNavButton $active={false} onClick={onMembersClick}>
        <Users size={16} />
        <Typography $size="sm" $weight="medium" $inline>
          Members
        </Typography>
      </MobileNavButton>
      <MobileNavButton $active={activeMobileSection === 'history'} onClick={() => onSectionChange('history')}>
        <History size={16} />
        <Typography $size="sm" $weight="medium" $inline>
          History
        </Typography>
      </MobileNavButton>
    </MobileNavigationContainer>
  )
}

export default MobileNavigation

// Mobile navigation for switching between sections
const MobileNavigationContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.xs};
  background: ${({ theme }) => theme.background.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.grey[200]};

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: none;
  }
`

const MobileNavButton = styled.button<{ $active: boolean }>`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  background: ${({ theme, $active }) => ($active ? theme.colors.primary : 'transparent')};

  /* Typography color will be handled by the Typography component based on active state */
  ${Typography} {
    color: ${({ theme, $active }) => ($active ? theme.colors.white : theme.text)};
  }
  cursor: pointer;
  ${motionTransition(['background-color', 'color', 'transform', 'box-shadow'], 'medium', 'easeInOut')}
  min-height: 44px; /* Touch target size */
  position: relative;
  will-change: transform, background-color, box-shadow;

  &:hover {
    background: ${({ theme, $active }) => ($active ? theme.colors.primary : theme.background.elevated)};
    transform: translateY(-1px);
    box-shadow: ${({ theme }) => theme.shadow.sm};
  }

  &:active {
    transform: translateY(0) scale(${getScale('active')});
    ${motionTransition(['transform'], 'fast', 'easeIn')}
  }

  &:focus {
    outline: none;
  }

  &:focus-visible {
    box-shadow: ${({ theme }) => theme.shadow.focusVisible};
    outline: none;
  }

  /* Fallback for browsers that don't support :focus-visible */
  &:focus:not(:focus-visible) {
    box-shadow: ${({ theme }) => theme.shadow.focus};
  }

  /* Smooth active state transition */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: ${({ theme }) => theme.colors.primary};
    opacity: ${({ $active }) => ($active ? 1 : 0)};
    ${motionTransition('opacity', 'medium', 'easeInOut')}
    z-index: -1;
  }
`
