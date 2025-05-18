import { useTheme } from 'features/toggle-theme'
import Toggle from 'shared/ui/Toggle'

const ToggleThemeButton = () => {
  const { mode, toggleTheme } = useTheme()

  return <Toggle isOn={mode === 'DARK'} onToggleSwitch={toggleTheme} />
}

export default ToggleThemeButton
