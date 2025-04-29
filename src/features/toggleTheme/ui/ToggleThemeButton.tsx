import { useTheme } from 'features/toggleTheme'
import Toggle from 'shared/ui/Toggle'

const ToggleThemeButton = () => {
  const { mode, toggleTheme } = useTheme()

  return <Toggle isOn={mode === 'LIGHT'} onToggleSwitch={toggleTheme} />
}

export default ToggleThemeButton
