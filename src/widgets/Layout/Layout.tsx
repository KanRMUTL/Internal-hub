import { ToggleThemeButton, useTheme } from 'features/toggle-theme'
import { Outlet, useNavigate } from 'react-router-dom'
import { masterLogo, hatohub } from 'shared/assets'
import { Breadcrumbs, Container } from 'shared/ui'
import { cva } from 'class-variance-authority'

const navVariants = cva('flex items-center justify-between p-2 shadow-md', {
  variants: {
    light: {
      true: 'bg-blue-700',
      false: 'bg-gray-900',
    },
  },
  defaultVariants: {
    light: true,
  },
})

const logoWrapperVariants = cva('flex items-center gap-2 rounded-md bg-white pb-1 pl-2 pr-4 pt-1')

const Layout = () => {
  const { mode } = useTheme()
  const navigate = useNavigate()

  return (
    <div className="flex flex-col p-0">
      <nav className={navVariants({ light: mode === 'LIGHT' })}>
        <div className={logoWrapperVariants()}>
          <img
            src={masterLogo}
            height={42}
            className="cursor-pointer"
            onClick={() => navigate('/')}
            alt="Master Logo"
          />
          <img src={hatohub} height={22} className="cursor-pointer" onClick={() => navigate('/')} alt="Hatohub Logo" />
        </div>
        <div>
          <ToggleThemeButton />
        </div>
      </nav>
      <main className="w-full">
        <Container>
          <Breadcrumbs />
          <Outlet />
        </Container>
      </main>
    </div>
  )
}

export default Layout
