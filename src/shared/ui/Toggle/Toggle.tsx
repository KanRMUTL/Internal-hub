import * as motion from 'motion/react-client'

interface ToggleProps {
  isOn: boolean
  onToggleSwitch: VoidFunction
}

const Toggle = ({ isOn, onToggleSwitch }: ToggleProps) => {
  return (
    <div
      className="toggle-container"
      style={{
        ...container,
        backgroundColor: isOn ? '#0a0a0a' : '#1E9CED',
        justifyContent: 'flex-' + (isOn ? 'start' : 'end'),
      }}
      onClick={onToggleSwitch}
    >
      <motion.div
        className="toggle-handle"
        style={{ ...handle, backgroundColor: isOn ? '#1E9CED' : '#0a0a0a' }}
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
