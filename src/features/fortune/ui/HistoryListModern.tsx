import { motion } from 'motion/react'
import styled from 'styled-components'

export interface HistoryRow {
  id: string
  winnerName: string
  winnerHue: number
  spunAt: string
  timeAgo: string
}

interface HistoryListModernProps {
  entries: HistoryRow[]
  highlightId?: string
}

const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
`

const Row = styled(motion.li)<{ $highlighted: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm} 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.grey[100]};

  &:last-child {
    border-bottom: 0;
  }

  ${({ $highlighted, theme }) =>
    $highlighted &&
    `
    background: ${theme.colors.focus};
    border-radius: ${theme.borderRadius.md};
    padding-left: ${theme.spacing.sm};
    padding-right: ${theme.spacing.sm};
    margin-left: -${theme.spacing.sm};
    margin-right: -${theme.spacing.sm};
  `}
`

const Avatar = styled.span<{ $hue: number }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${({ $hue }) => `oklch(78% 0.10 ${$hue})`};
  color: ${({ $hue }) => `oklch(30% 0.08 ${$hue})`};
  font-size: 13px;
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  flex-shrink: 0;
`

const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
  flex: 1;
  min-width: 0;
`

const Name = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  color: ${({ theme }) => theme.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const Time = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.caption};
  color: ${({ theme }) => theme.colors.grey[500]};
  font-variant-numeric: tabular-nums;
`

const HistoryListModern = ({ entries, highlightId }: HistoryListModernProps) => {
  if (entries.length === 0) {
    return (
      <div
        style={{
          padding: '24px 12px',
          textAlign: 'center',
          fontSize: 13,
          color: 'var(--grey-500, #6b7280)',
        }}
      >
        No spins yet. Press the wheel to get started.
      </div>
    )
  }
  return (
    <List>
      {entries.map((row, i) => {
        const initial = row.winnerName.trim().charAt(0).toUpperCase() || '?'
        return (
          <Row
            key={row.id}
            $highlighted={row.id === highlightId}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04, duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          >
            <Avatar $hue={row.winnerHue} aria-hidden="true">
              {initial}
            </Avatar>
            <Body>
              <Name>{row.winnerName}</Name>
              <Time>
                {row.spunAt} · {row.timeAgo}
              </Time>
            </Body>
          </Row>
        )
      })}
    </List>
  )
}

export default HistoryListModern
