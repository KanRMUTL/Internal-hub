import styled, { css } from 'styled-components'
import { Card } from 'shared/ui'

export const QuestionCard = styled(Card)<{ $isExpanded?: boolean }>`
  margin-bottom: 1rem;
  padding: 0;
  border: 1px solid #e9ecef;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: all 0.2s ease;

  ${({ $isExpanded }) =>
    $isExpanded &&
    css`
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
      border-color: #dee2e6;
    `}
`

export const QuestionHeader = styled.div`
  padding: 1rem 1.5rem;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  border-bottom: 1px solid transparent;

  &:hover {
    background-color: #f8f9fa;
  }
`

export const QuestionBody = styled.div<{ $isOpen: boolean }>`
  padding: 1.5rem;
  display: ${({ $isOpen }) => ($isOpen ? 'block' : 'none')};
  background-color: #fff;
  border-top: 1px solid #f1f3f5;
`

export const OptionRow = styled.div<{ $isCorrect: boolean }>`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.75rem;
  padding: 0.75rem;
  border-radius: 8px;
  background-color: ${({ $isCorrect }) => ($isCorrect ? '#f0fdf4' : '#fff')};
  border: 1px solid ${({ $isCorrect }) => ($isCorrect ? '#86efac' : '#e9ecef')};
  transition: all 0.2s;

  &:focus-within {
    border-color: ${({ $isCorrect }) => ($isCorrect ? '#22c55e' : '#3b82f6')};
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
  }
`

export const CorrectToggle = styled.label`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  color: ${({ theme }) => theme.colors.success};

  input {
    display: none;
  }
`

export const Badge = styled.span`
  background: #e9ecef;
  color: #495057;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-right: 0.5rem;
`
