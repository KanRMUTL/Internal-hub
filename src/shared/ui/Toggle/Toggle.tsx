import * as motion from 'motion/react-client'

interface ToggleColor {
  handle: string
  background: string
  border: string
}
interface ToggleProps {
  isOn: boolean
  onStyle?: ToggleColor
  offStyle?: ToggleColor
  onToggleSwitch: VoidFunction
}

const Toggle = ({
  isOn,
  offStyle = {
    handle: '#1E9CED',
    background: '#0a0a0a',
    border: '#0a0a0a',
  },
  onStyle = {
    handle: '#F3C623',
    background: '#3C3D37',
    border: '#F3C623',
  },
  onToggleSwitch,
}: ToggleProps) => {
  return (
    <div
      className="toggle-container"
      style={{
        ...container,
        backgroundColor: isOn ? onStyle.background : offStyle.background,
        justifyContent: 'flex-' + (isOn ? 'end' : 'start'),
        borderWidth: 2,
        borderStyle: 'solid',
        borderColor: isOn ? onStyle.border : offStyle.border,
      }}
      onClick={onToggleSwitch}
    >
      <motion.div
        className="toggle-handle"
        style={{ ...handle, backgroundColor: isOn ? onStyle.handle : offStyle.handle }}
        layout
        transition={{
          type: 'spring',
          visualDuration: 0.2,
          bounce: 0.2,
        }}
      />
    </div>
  )
}

export default Toggle

const container = {
  height: 30,
  aspectRatio: '2/1',
  borderRadius: 50,
  cursor: 'pointer',
  display: 'flex',
  padding: 5,
}

const handle = {
  aspectRatio: '1/1',
  height: '100%',
  borderRadius: '50%',
}
