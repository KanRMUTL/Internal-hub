import { useLocation, Link } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface BreadcrumbsProps {
  className?: string
  labels?: Record<string, string>
}

const defaultLabels: Record<string, string> = {
  room: 'Rooms',
  quiz: 'Quizzes',
  host: 'Lobby',
  create: 'New Quiz',
  join: 'Join Quiz',
  play: 'Playing',
  game: 'Game',
}

const Breadcrumbs = ({ className, labels = {} }: BreadcrumbsProps) => {
  const location = useLocation()
  const pathnames = location.pathname.split('/').filter((x) => x)

  const mergedLabels = { ...defaultLabels, ...labels }

  const getLabel = (path: string) => {
    return mergedLabels[path] || path
  }

  if (pathnames.length === 0) return null

  return (
    <nav aria-label="Breadcrumb" className={cn('flex py-3 text-grey-600 dark:text-grey-400', className)}>
      <ol className="flex items-center space-x-2">
        <li>
          <Link
            to="/"
            className="flex items-center hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
          >
            <Home className="w-4 h-4" />
            <span className="sr-only">Home</span>
          </Link>
        </li>

        {pathnames.map((value, index) => {
          const last = index === pathnames.length - 1
          const to = `/${pathnames.slice(0, index + 1).join('/')}`
          const label = getLabel(value)

          return (
            <li key={to} className="flex items-center space-x-2">
              <ChevronRight className="w-4 h-4 text-grey-400" />
              {last ? (
                <span className="font-semibold text-primary dark:text-primary" aria-current="page">
                  {label}
                </span>
              ) : (
                <Link
                  to={to}
                  className="hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                >
                  {label}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export default Breadcrumbs
