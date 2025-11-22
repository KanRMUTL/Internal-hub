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
  caption?: string
  ariaLabel?: string
  emptyMessage?: string
}

const Table = <T extends BaseData>({
  columns,
  data,
  caption,
  ariaLabel,
  emptyMessage = 'No data available',
}: DynamicTableProps<T>) => {
  // Check if any column has a non-empty label
  const hasHeaders = columns.some((col) => col.label && col.label.trim() !== '')

  if (data.length === 0) {
    return (
      <div role="table" aria-label={ariaLabel || caption}>
        {caption && <div role="caption">{caption}</div>}
        <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>{emptyMessage}</div>
      </div>
    )
  }

  return (
    <table role="table" aria-label={ariaLabel}>
      {caption && <caption>{caption}</caption>}
      {hasHeaders && (
        <thead>
          <tr role="row">
            {columns.map((col, i) => (
              <th
                key={`${String(col.id)}-${i}`}
                role="columnheader"
                scope="col"
                style={{ textAlign: col.align || 'left', width: col.width, padding: 16 }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
      )}
      <tbody>
        {data.map((row, i) => (
          <tr key={`${String(row.id)}-${i}`} role="row">
            {columns.map((col, j) => (
              <td
                key={`${String(col.id)}-${j}`}
                role="cell"
                style={{ textAlign: col.align || 'left', padding: '12px 24px' }}
              >
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
