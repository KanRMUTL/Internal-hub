import { UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form'
import { Box, Input, Button, Typography } from 'shared/ui'
import { Trash2, ChevronDown, ChevronUp, CheckCircle } from 'lucide-react'
import { QuestionCard, QuestionHeader, QuestionBody, Badge, OptionRow, CorrectToggle } from './styled'

interface QuestionItemProps {
  index: number
  isExpanded: boolean
  toggleQuestion: (index: number) => void
  remove: (index: number) => void
  register: UseFormRegister<any>
  watch: UseFormWatch<any>
  setValue: UseFormSetValue<any>
  showRemove: boolean
}

export const QuestionItem = ({
  index,
  isExpanded,
  toggleQuestion,
  remove,
  register,
  watch,
  setValue,
  showRemove,
}: QuestionItemProps) => {
  const questionText = watch(`questions.${index}.text`) || 'New Question'
  const options = watch(`questions.${index}.options`)

  return (
    <QuestionCard $isExpanded={isExpanded}>
      <QuestionHeader onClick={() => toggleQuestion(index)}>
        <Box display="flex" align="center" gap="sm">
          <Badge>#{index + 1}</Badge>
          <Typography
            weight="medium"
            style={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '400px',
            }}
          >
            {questionText}
          </Typography>
        </Box>
        <Box display="flex" align="center" gap="sm">
          {showRemove && (
            <Button
              type="button"
              variant="danger"
              onClick={(e) => {
                e.stopPropagation()
                remove(index)
              }}
              size="sm"
              style={{ padding: '0.25rem 0.5rem' }}
            >
              <Trash2 size={14} />
            </Button>
          )}
          {isExpanded ? <ChevronUp size={20} color="#6c757d" /> : <ChevronDown size={20} color="#6c757d" />}
        </Box>
      </QuestionHeader>

      <QuestionBody $isOpen={isExpanded}>
        <Box display="flex" gap="md" mb="lg">
          <Box width="100%">
            <Input
              label="Question Text"
              placeholder="e.g. What is the capital of France?"
              {...register(`questions.${index}.text`, { required: true })}
              autoFocus={isExpanded}
            />
          </Box>
          <Box width="150px">
            <Input
              type="number"
              label="Time (sec)"
              {...register(`questions.${index}.timeLimit`, { required: true, min: 5 })}
            />
          </Box>
        </Box>

        <Typography weight="medium" size="sm" color="secondary" style={{ marginBottom: '0.5rem', display: 'block' }}>
          Answer Options (Select correct one)
        </Typography>

        {[0, 1, 2, 3].map((optIndex) => {
          const option = options?.[optIndex]
          const isCorrect = option?.isCorrect === true || String(option?.isCorrect) === 'true'

          return (
            <OptionRow key={optIndex} $isCorrect={isCorrect}>
              <CorrectToggle
                onClick={() => {
                  options.forEach((_: any, i: number) => {
                    setValue(`questions.${index}.options.${i}.isCorrect`, i === optIndex)
                  })
                }}
              >
                <input
                  type="radio"
                  name={`question_${index}_correct`}
                  checked={isCorrect}
                  readOnly
                  style={{ display: 'none' }}
                />
                {isCorrect ? (
                  <CheckCircle size={24} fill="#22c55e" color="white" />
                ) : (
                  <div style={{ width: 24, height: 24, borderRadius: '50%', border: '2px solid #cbd5e1' }} />
                )}
              </CorrectToggle>

              <input
                type="hidden"
                {...register(`questions.${index}.options.${optIndex}.isCorrect`)}
                value={String(isCorrect)}
              />

              <Box width="100%">
                <Input
                  placeholder={`Option ${optIndex + 1}`}
                  {...register(`questions.${index}.options.${optIndex}.text`, { required: true })}
                  style={{ border: 'none', background: 'transparent', padding: 0, height: 'auto' }}
                />
              </Box>
            </OptionRow>
          )
        })}
      </QuestionBody>
    </QuestionCard>
  )
}
