export interface TableColumn<T> {
  key: keyof T
  label: string
  render?: (value: T[keyof T], row: T) => React.ReactNode
  align?: 'left' | 'center' | 'right'
  width?: string
}

export interface DynamicTableProps<T> {
  columns: TableColumn<T>[]
  data: T[]
  rowkey: keyof T
}

const Table = <T,>({ columns, data, rowkey }: DynamicTableProps<T>) => {
  return (
    <table>
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={String(col.key)} style={{ textAlign: col.align || 'left', width: col.width, padding: 16 }}>
              {col.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, idx) => (
          <tr key={String(row[rowkey]) || idx}>
            {columns.map((col) => (
              <td key={String(col.key)} style={{ textAlign: col.align || 'left', padding: '12px 24px' }}>
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
