import { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { QuizService } from 'features/quiz'

export const useCreateQuiz = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0)

  const form = useForm({
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

  const { control, handleSubmit } = form
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'questions',
  })

  const toggleQuestion = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index)
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
    setExpandedIndex(fields.length)
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
          isCorrect: o.isCorrect === 'true' || o.isCorrect === true,
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

  return {
    form,
    fields,
    remove,
    isLoading,
    expandedIndex,
    toggleQuestion,
    handleAddQuestion,
    submit: handleSubmit(onSubmit),
  }
}
