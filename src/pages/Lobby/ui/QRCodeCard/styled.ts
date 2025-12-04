import styled, { keyframes } from 'styled-components'
import { Card, Typography } from 'shared/ui'
import { motion } from 'motion/react'

export const PageWrapper = styled.div`
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  padding: 2rem 0;
`

export const LobbyCard = styled(Card)`
  background: white;
  color: ${({ theme }) => theme.text};
  text-align: center;
  box-shadow:
    0 10px 25px -5px rgba(0, 0, 0, 0.1),
    0 8px 10px -6px rgba(0, 0, 0, 0.1);
`

export const PinDisplay = styled.div`
  background: #f3f4f6;
  padding: 1.5rem;
  border-radius: 12px;
  margin: 1rem 0;
  border: 2px dashed #d1d5db;
`

export const PlayerGridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 1rem;
`

export const PlayerCard = styled(motion.div)`
  background: white;
  padding: 1rem;
  border-radius: 12px;
  text-align: center;
  font-weight: bold;
  color: #1f2937;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
`

export const Avatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  font-weight: bold;
`

const Pulse = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
`

export const WaitingText = styled(Typography)`
  animation: ${Pulse} 2s infinite ease-in-out;
`
