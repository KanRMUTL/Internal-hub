import { UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form'
import { QuestionItem } from '../QuestionItem/QuestionItem'

interface QuestionListProps {
  fields: any[]
  expandedIndex: number | null
  toggleQuestion: (index: number) => void
  remove: (index: number) => void
  register: UseFormRegister<any>
  watch: UseFormWatch<any>
  setValue: UseFormSetValue<any>
}

export const QuestionList = ({
  fields,
  expandedIndex,
  toggleQuestion,
  remove,
  register,
  watch,
  setValue,
}: QuestionListProps) => {
  return (
    <>
      {fields.map((field, index) => (
        <QuestionItem
          key={field.id}
          index={index}
          isExpanded={expandedIndex === index}
          toggleQuestion={toggleQuestion}
          remove={remove}
          register={register}
          watch={watch}
          setValue={setValue}
          showRemove={fields.length > 1}
        />
      ))}
    </>
  )
}
