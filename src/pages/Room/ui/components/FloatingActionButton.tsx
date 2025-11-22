import styled from 'styled-components'
import { Users } from 'lucide-react'
import { CircularButton, withMotion } from 'shared/ui'
import { motionTransition } from 'shared/styles/utils'

interface FloatingActionButtonProps {
  onClick: () => void
}

const FloatingActionButton = ({ onClick }: FloatingActionButtonProps) => {
  return (
    <FloatingActionButtonContainer>
      {withMotion(
        <CircularButton $size={56} $variant="info" onClick={onClick} aria-label="Manage members">
          <Users size={24} />
        </CircularButton>
      )}
    </FloatingActionButtonContainer>
  )
}

export default FloatingActionButton

// Floating action button for desktop
const FloatingActionButtonContainer = styled.div`
  display: none;

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    display: block;
    position: fixed;
    bottom: ${({ theme }) => theme.spacing.xl};
    right: ${({ theme }) => theme.spacing.sm};
    z-index: 100;

    /* Enhanced shadow and hover effects */
    & > * {
      &:focus {
        outline: none;
      }
    }
  }

  /* Responsive positioning for different screen sizes */
  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) and (max-width: 1400px) {
    bottom: ${({ theme }) => theme.spacing.xl};
    right: ${({ theme }) => theme.spacing.lg};
  }

  @media (min-width: 1400px) {
    bottom: ${({ theme }) => theme.spacing.xl};
    right: ${({ theme }) => theme.spacing.xl};
  }

  /* Ensure proper accessibility */
  & button {
    position: relative;

    &::before {
      content: '';
      position: fixed;
      inset: -8px;
      border-radius: 50%;
      background: transparent;
      ${motionTransition('background-color', 'fast', 'easeOut')}
    }

    &:focus {
      outline: none;
    }

    &:focus-visible {
      box-shadow: ${({ theme }) => theme.shadow.focusVisible};
    }

    /* Fallback for browsers that don't support :focus-visible */
    &:focus:not(:focus-visible) {
      box-shadow: ${({ theme }) => theme.shadow.focus};
    }

    &:focus-visible::before {
      background: ${({ theme }) => theme.colors.primary}20;
    }
  }
`
