export interface FormState<T = Record<string, unknown>> {
  isSuccess: boolean
  errors?: Record<string, string>
  message?: string
  data?: T
}

export interface TableColumn<T> {
  key: string
  label: string
  render: (item: T) => React.ReactNode
  width?: string
  sortable?: boolean
  align?: 'left' | 'center' | 'right'
}
