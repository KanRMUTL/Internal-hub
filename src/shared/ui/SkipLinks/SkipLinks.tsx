import styled from 'styled-components'

interface SkipLink {
  href: string
  label: string
}

interface SkipLinksProps {
  links: SkipLink[]
}

const SkipLinks = ({ links }: SkipLinksProps) => {
  return (
    <SkipLinksContainer>
      {links.map((link) => (
        <SkipLink key={link.href} href={link.href}>
          {link.label}
        </SkipLink>
      ))}
    </SkipLinksContainer>
  )
}

export default SkipLinks

const SkipLinksContainer = styled.div`
  position: absolute;
  top: -100px;
  left: 0;
  z-index: 9999;
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
`

const SkipLink = styled.a`
  position: absolute;
  top: -100px;
  left: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  text-decoration: none;
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  box-shadow: ${({ theme }) => theme.shadow.lg};
  transition: all ${({ theme }) => theme.motion.duration.fast} ${({ theme }) => theme.motion.easing.easeOut};
  z-index: 9999;

  &:focus {
    position: static;
    top: auto;
    transform: translateY(0);
    outline: 2px solid ${({ theme }) => theme.colors.white};
    outline-offset: 2px;
  }

  &:hover:focus {
    background: ${({ theme }) => theme.colors.secondary};
    transform: translateY(-1px);
    box-shadow: ${({ theme }) => theme.shadow.xl};
  }

  /* Ensure high contrast in both themes */
  ${({ theme }) =>
    theme.mode === 'dark' &&
    `
    background: ${theme.colors.white};
    color: ${theme.colors.black};
    
    &:hover:focus {
      background: ${theme.colors.grey[100]};
    }
  `}
`
