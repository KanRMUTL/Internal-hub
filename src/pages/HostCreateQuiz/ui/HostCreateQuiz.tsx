import { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { QuizService } from 'features/quiz'
import { Button, Input, Card, Typography, Box, Container } from 'shared/ui'
import { Plus, Trash2, Save, ChevronDown, ChevronUp, CheckCircle } from 'lucide-react'
import styled, { css } from 'styled-components'

const PageWrapper = styled.div`
  padding-bottom: 80px; // Space for sticky footer
  min-height: 100vh;
  background-color: #f8f9fa;
`

const Header = styled.div`
  background: white;
  padding: 1.5rem 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
`

const QuestionCard = styled(Card)<{ $isExpanded?: boolean }>`
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

const QuestionHeader = styled.div`
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

const QuestionBody = styled.div<{ $isOpen: boolean }>`
  padding: 1.5rem;
  display: ${({ $isOpen }) => ($isOpen ? 'block' : 'none')};
  background-color: #fff;
  border-top: 1px solid #f1f3f5;
`

const OptionRow = styled.div<{ $isCorrect: boolean }>`
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

const CorrectToggle = styled.label`
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

const StickyFooter = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  padding: 1rem;
  box-shadow: 0 -4px 6px rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  z-index: 100;
`

const Badge = styled.span`
  background: #e9ecef;
  color: #495057;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-right: 0.5rem;
`

export const HostCreateQuiz = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0)

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      password: '',
      questions: [
        {
          text: '',
          timeLimit: 30,
          options: [
            { text: '', isCorrect: true },
            { text: '', isCorrect: false },
            { text: '', isCorrect: false },
            { text: '', isCorrect: false },
          ],
        },
      ],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'questions',
  })

  const questions = watch('questions')

  const toggleQuestion = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index)
  }

  const onSubmit = async (data: any) => {
    setIsLoading(true)
    try {
      const hostId = Math.random().toString(36).substring(7)
      localStorage.setItem('quiz_host_token', hostId)

      const questionsWithIds = data.questions.map((q: any, index: number) => ({
        id: `q_${Date.now()}_${index}`,
        ...q,
        options: q.options.map((o: any, optIndex: number) => ({
          id: `o_${Date.now()}_${index}_${optIndex}`,
          ...o,
          isCorrect: o.isCorrect === 'true' || o.isCorrect === true, // Handle string/boolean from radio
        })),
        timeLimit: Number(q.timeLimit),
      }))

      const roomId = await QuizService.createRoom(hostId, data.password, questionsWithIds)
      navigate(`/quiz/host/${roomId}`)
    } catch (error) {
      console.error('Failed to create room', error)
      alert('Failed to create room')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddQuestion = () => {
    append({
      text: '',
      timeLimit: 30,
      options: [
        { text: '', isCorrect: true },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
      ],
    })
    setExpandedIndex(fields.length) // Open the new question
  }

  return (
    <PageWrapper>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Header>
          <Container $maxWidth="md">
            <Box $display="flex" $justify="space-between" $align="center">
              <Box>
                <Typography as="h1" $size="2xl" $weight="bold">
                  Create Quiz
                </Typography>
                <Typography $color="secondary" $size="sm">
                  Design your challenge
                </Typography>
              </Box>
              <Box $width="200px">
                <Input
                  label="Room PIN"
                  placeholder="1234"
                  maxLength={4}
                  {...register('password', { required: 'Required', minLength: 4, maxLength: 4 })}
                  error={errors.password?.message as string}
                  style={{ textAlign: 'center', letterSpacing: '2px', fontWeight: 'bold' }}
                />
              </Box>
            </Box>
          </Container>
        </Header>

        <Container $maxWidth="md">
          <Box $mb="md" $display="flex" $justify="space-between" $align="center">
            <Typography as="h2" $size="xl" $weight="bold">
              Questions ({fields.length})
            </Typography>
            <Button type="button" $variant="secondary" onClick={handleAddQuestion} $size="sm">
              <Plus size={16} style={{ marginRight: '0.5rem' }} />
              Add Question
            </Button>
          </Box>

          {fields.map((field, index) => {
            const isExpanded = expandedIndex === index
            const questionText = questions[index]?.text || 'New Question'

            return (
              <QuestionCard key={field.id} $isExpanded={isExpanded}>
                <QuestionHeader onClick={() => toggleQuestion(index)}>
                  <Box $display="flex" $align="center" $gap="sm">
                    <Badge>#{index + 1}</Badge>
                    <Typography
                      $weight="medium"
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
                  <Box $display="flex" $align="center" $gap="sm">
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        $variant="danger"
                        onClick={(e) => {
                          e.stopPropagation()
                          remove(index)
                        }}
                        $size="sm"
                        style={{ padding: '0.25rem 0.5rem' }}
                      >
                        <Trash2 size={14} />
                      </Button>
                    )}
                    {isExpanded ? <ChevronUp size={20} color="#6c757d" /> : <ChevronDown size={20} color="#6c757d" />}
                  </Box>
                </QuestionHeader>

                <QuestionBody $isOpen={isExpanded}>
                  <Box $display="flex" $gap="md" $mb="lg">
                    <Box $width="100%">
                      <Input
                        label="Question Text"
                        placeholder="e.g. What is the capital of France?"
                        {...register(`questions.${index}.text`, { required: true })}
                        autoFocus={isExpanded}
                      />
                    </Box>
                    <Box $width="150px">
                      <Input
                        type="number"
                        label="Time (sec)"
                        {...register(`questions.${index}.timeLimit`, { required: true, min: 5 })}
                      />
                    </Box>
                  </Box>

                  <Typography
                    $weight="medium"
                    $size="sm"
                    $color="secondary"
                    style={{ marginBottom: '0.5rem', display: 'block' }}
                  >
                    Answer Options (Select correct one)
                  </Typography>

                  {[0, 1, 2, 3].map((optIndex) => {
                    const option = questions[index]?.options?.[optIndex]
                    // Handle potential string/boolean mismatch from form state
                    const isCorrect = option?.isCorrect === true || String(option?.isCorrect) === 'true'

                    return (
                      <OptionRow key={optIndex} $isCorrect={isCorrect}>
                        <CorrectToggle
                          onClick={() => {
                            // Set this option to true and others to false
                            questions[index].options.forEach((_, i) => {
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

                        {/* Hidden inputs to actually register the values with RHF */}
                        <input
                          type="hidden"
                          {...register(`questions.${index}.options.${optIndex}.isCorrect`)}
                          value={String(isCorrect)}
                        />

                        <Box $width="100%">
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
          })}
        </Container>

        <StickyFooter>
          <Container $maxWidth="md" style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
            <Button type="submit" disabled={isLoading} $size="lg">
              <Save size={18} style={{ marginRight: '0.5rem' }} />
              {isLoading ? 'Creating...' : 'Create Room'}
            </Button>
          </Container>
        </StickyFooter>
      </form>
    </PageWrapper>
  )
}
