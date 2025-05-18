interface BaseData {
  id: string
}
export interface TableColumn<T> extends BaseData {
  key: keyof T
  label: string
  render?: (value: T[keyof T], row: T) => React.ReactNode
  align?: 'left' | 'center' | 'right'
  width?: string
}

export interface DynamicTableProps<T extends BaseData> {
  columns: TableColumn<T>[]
  data: T[]
  rowkey: keyof T
}

const Table = <T extends BaseData>({ columns, data }: DynamicTableProps<T>) => {
  return (
    <table>
      <thead>
        <tr>
          {columns.map((col, i) => (
            <th
              key={`${String(col.id)}-${i}`}
              style={{ textAlign: col.align || 'left', width: col.width, padding: 16 }}
            >
              {col.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={`${String(row.id)}-${i}`}>
            {columns.map((col, j) => (
              <td key={`${String(col.id)}-${j}`} style={{ textAlign: col.align || 'left', padding: '12px 24px' }}>
                {col.render ? col.render(row[col.key], row) : String(row[col.key])}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default Table
