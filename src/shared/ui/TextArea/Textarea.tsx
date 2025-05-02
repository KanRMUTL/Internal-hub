import React, { forwardRef } from 'react'
import styled from 'styled-components'
import { motion, AnimatePresence } from 'motion/react'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({ label, error, name, ...props }, ref) => {
  return (
    <TextareaWrapper>
      {label && <Label htmlFor={name}>{label}</Label>}
      <StyledTextarea id={name} name={name} $hasError={!!error} ref={ref} {...props} />
      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}>
            <ErrorMessage>{error}</ErrorMessage>
          </motion.div>
        )}
      </AnimatePresence>
    </TextareaWrapper>
  )
})

Textarea.displayName = 'Textarea'

export default Textarea

const TextareaWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  width: 100%;
`

const Label = styled.label`
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  color: ${({ theme }) => theme.text};
`

const StyledTextarea = styled.textarea<{ $hasError?: boolean }>`
  padding: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.fontSizes.base};
  border: 1px solid ${({ theme, $hasError }) => ($hasError ? theme.colors.danger : theme.colors.grey)};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme }) => theme.background.surface};
  color: ${({ theme }) => theme.text};
  resize: vertical;
  min-height: 100px;
  box-shadow: ${({ theme }) => theme.shadow.sm};
  transition:
    border 0.2s,
    box-shadow 0.2s;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(0, 209, 178, 0.2);
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.grey};
    opacity: 0.6;
  }
`

const ErrorMessage = styled.span`
  color: ${({ theme }) => theme.colors.danger};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeight.normal};
`
