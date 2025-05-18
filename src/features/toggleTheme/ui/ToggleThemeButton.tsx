import { useTheme } from 'features/toggleTheme'
import Toggle from 'shared/ui/Toggle'

const ToggleThemeButton = () => {
  const { mode, toggleTheme } = useTheme()

  return <Toggle isOn={mode === 'DARK'} onToggleSwitch={toggleTheme} />
}

export default ToggleThemeButton
