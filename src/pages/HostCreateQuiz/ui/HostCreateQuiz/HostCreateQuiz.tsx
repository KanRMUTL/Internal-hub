import { Container, Box, Typography, Input, Button } from 'shared/ui'
import { Plus, Save } from 'lucide-react'
import { QuestionList } from '../QuiestionList/QuestionList'
import { useCreateQuiz } from '../../hooks/useCreateQuiz'
import { cva } from 'class-variance-authority'

const pageWrapperVariants = cva('pb-20 min-h-screen bg-surface-light dark:bg-surface-dark')

const headerVariants = cva('bg-white dark:bg-gray-900 py-6 shadow-sm mb-8')

const stickyFooterVariants = cva(
  'fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 p-4 shadow-[0_-4px_6px_rgba(0,0,0,0.05)] flex justify-end gap-4 z-[100]'
)

export const HostCreateQuiz = () => {
  const {
    form: {
      register,
      watch,
      setValue,
      formState: { errors },
    },
    fields,
    remove,
    isLoading,
    expandedIndex,
    toggleQuestion,
    handleAddQuestion,
    submit,
  } = useCreateQuiz()

  return (
    <div className={pageWrapperVariants()}>
      <form onSubmit={submit}>
        <div className={headerVariants()}>
          <Container maxWidth="md">
            <Box display="flex" justify="space-between" align="center">
              <Box>
                <Typography size="3xl" weight="bold">
                  Create Quiz
                </Typography>
                <Typography color="secondary" size="sm">
                  Design your challenge
                </Typography>
              </Box>
              <Box width="200px">
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
        </div>

        <Container maxWidth="md">
          <Box mb="md" display="flex" justify="space-between" align="center">
            <Typography size="xl" weight="bold">
              Questions ({fields.length})
            </Typography>
            <Button type="button" variant="secondary" onClick={handleAddQuestion} size="sm">
              <Plus size={16} className="mr-2" />
              Add Question
            </Button>
          </Box>

          <QuestionList
            fields={fields}
            expandedIndex={expandedIndex}
            toggleQuestion={toggleQuestion}
            remove={remove}
            register={register}
            watch={watch}
            setValue={setValue}
          />
        </Container>

        <div className={stickyFooterVariants()}>
          <Container maxWidth="md" style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
            <Button type="submit" disabled={isLoading} size="lg">
              <Save size={18} className="mr-2" />
              {isLoading ? 'Creating...' : 'Create Room'}
            </Button>
          </Container>
        </div>
      </form>
    </div>
  )
}
