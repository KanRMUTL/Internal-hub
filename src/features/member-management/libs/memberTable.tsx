import { RoomMember } from 'entities/room'
import { TableColumn, Typography } from 'shared/ui'
import { Toggle, CircularButton, withMotion } from 'shared/ui'
import { Edit, Trash } from 'lucide-react'
import { MemberItem } from 'features/member-management/ui'

type ColumnStrategyProps = {
  handleEdit: (id: string) => void
  handleDelete: (id: string) => void
  handleToggle: (id: string) => void
}

export const createMemberColumns = ({
  handleEdit,
  handleDelete,
  handleToggle,
}: ColumnStrategyProps): TableColumn<RoomMember>[] => [
  {
    id: 'name',
    key: 'name',
    label: '',
    align: 'center',
    render: (_, member) => (
      <MemberItem
        id={member.id}
        name={member.name}
        description={
          <Typography $size="sm" $color={member.isEligibleRandom ? 'success' : 'disabled'} $weight="normal" $pointer>
            {member.isEligibleRandom ? 'Eligible for selection' : 'Not eligible'}
          </Typography>
        }
        onClick={() => {}}
        typography={{ $weight: 'semibold', $size: 'lg' }}
        active={member.isEligibleRandom}
      />
    ),
  },
  {
    id: 'toggle',
    key: 'isEligibleRandom',
    label: '',
    align: 'center',
    render: (_, member) =>
      withMotion(
        <Toggle
          isOn={member.isEligibleRandom}
          onToggleSwitch={() => handleToggle(member.id)}
          offStyle={{ handle: '#ffffff', border: '#ffffff', background: '#848D9A' }}
          onStyle={{ handle: '#ffffff', border: '#ffffff', background: '#00D2BC' }}
        />
      ),
  },
  {
    id: 'edit',
    key: 'id',
    label: '',
    align: 'center',
    render: (_, member) =>
      withMotion(
        <CircularButton $variant="info" onClick={() => handleEdit(member.id)}>
          <Edit color="#fff" size={18} />
        </CircularButton>
      ),
  },
  {
    id: 'delete',
    key: 'id',
    label: '',
    align: 'center',
    render: (_, member) =>
      withMotion(
        <CircularButton $variant="danger" onClick={() => handleDelete(member.id)}>
          <Trash color="#fff" size={20} />
        </CircularButton>
      ),
  },
]
