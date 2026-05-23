export type ColumnsGap = 'tight' | 'normal' | 'wide'

export interface ColumnsState {
  count: 2 | 3
  gap: ColumnsGap
  mobileStack: boolean
  flexValues: number[]
}

export interface ColumnLayoutPreset {
  label: string
  flexes: number[]
}
