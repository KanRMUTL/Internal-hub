import { Container, Box, Typography, Input, Button } from 'shared/ui'
import { Plus, Save } from 'lucide-react'
import { PageWrapper, Header, StickyFooter } from './styled'
import { QuestionList } from '../QuiestionList/QuestionList'
import { useCreateQuiz } from '../../hooks/useCreateQuiz'

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
    <PageWrapper>
      <form onSubmit={submit}>
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
