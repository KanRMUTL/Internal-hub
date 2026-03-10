import { ReactNode, ElementType } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

const screenReaderOnlyVariants = cva('sr-only')

interface ScreenReaderOnlyProps extends VariantProps<typeof screenReaderOnlyVariants> {
  children: ReactNode
  as?: ElementType
  id?: string
}

const ScreenReaderOnly = ({ children, as: Component = 'span', id }: ScreenReaderOnlyProps) => {
  return (
    <Component className={screenReaderOnlyVariants()} id={id}>
      {children}
    </Component>
  )
}

export default ScreenReaderOnly
