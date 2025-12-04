import styled, { css } from 'styled-components'
import { Card } from 'shared/ui'
import { motion } from 'motion/react'

export const PageWrapper = styled.div`
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  padding: 2rem 0;
  overflow-x: hidden;
`

export const QuestionCard = styled(Card)`
  background: white;
  color: ${({ theme }) => theme.text};
  text-align: center;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
`

export const OptionCard = styled(motion.div)<{ $isCorrect?: boolean; $showResult?: boolean; $color?: string }>`
  padding: 2rem;
  text-align: center;
  font-weight: bold;
  font-size: 1.5rem;
  border-radius: 16px;
  background-color: ${({ theme, $isCorrect, $showResult }) =>
    $showResult ? ($isCorrect ? theme.colors.success : theme.colors.grey[200]) : 'white'};
  border: ${({ theme, $showResult, $isCorrect }) =>
    $showResult ? ($isCorrect ? `4px solid ${theme.colors.success}` : 'none') : `none`};
  box-shadow: ${({ $showResult }) => ($showResult ? 'none' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)')};
  color: ${({ theme, $showResult, $isCorrect }) => ($showResult && $isCorrect ? theme.colors.white : theme.text)};
  opacity: ${({ $showResult, $isCorrect }) => ($showResult && !$isCorrect ? 0.4 : 1)};

  ${({ $showResult, $color }) =>
    !$showResult &&
    $color &&
    css`
      border-left: 8px solid ${$color};
    `}
`

export const PodiumContainer = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 1rem;
  height: 300px;
  margin-bottom: 2rem;
`

export const PodiumStep = styled(motion.div)<{ $rank: number; $height: string; $color: string }>`
  width: 100px;
  height: ${({ $height }) => $height};
  background: ${({ $color }) => $color};
  border-radius: 12px 12px 0 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: 1rem;
  color: white;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  position: relative;
`

export const AvatarCircle = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: white;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  border: 4px solid rgba(255, 255, 255, 0.3);
  position: absolute;
  top: -30px;
`

export const RankBadge = styled.div`
  background: rgba(0, 0, 0, 0.2);
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: bold;
  margin-top: 2rem;
`

export const TimerCircle = styled.svg`
  transform: rotate(-90deg);
  width: 60px;
  height: 60px;
`

export const TimerCircleBackground = styled.circle`
  fill: none;
  stroke: #e5e7eb;
  stroke-width: 6;
`

export const TimerCircleProgress = styled(motion.circle)`
  fill: none;
  stroke: #f59e0b;
  stroke-width: 6;
  stroke-linecap: round;
`

export const COLORS = ['#ef4444', '#3b82f6', '#eab308', '#22c55e']
