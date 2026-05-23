import type { Editor } from '@tiptap/core'
import type { Node as PMNode } from '@tiptap/pm/model'
import type { ColumnLayoutPreset, ColumnsGap, ColumnsState } from './types'

export function isColumnsActive(editor: Editor): boolean {
  return editor.isActive('columns2') || editor.isActive('columns3')
}

export function getColumnsDomNode(editor: Editor): HTMLElement | null {
  const { $from } = editor.state.selection
  for (let d = $from.depth; d >= 1; d--) {
    const node = $from.node(d)
    if (node.type.name === 'columns2' || node.type.name === 'columns3') {
      const dom = editor.view.nodeDOM($from.before(d))
      if (dom instanceof HTMLElement) return dom
    }
  }
  return null
}

export function readColumnsState(editor: Editor): ColumnsState | null {
  const { $from } = editor.state.selection
  for (let d = $from.depth; d >= 1; d--) {
    const node = $from.node(d)
    if (node.type.name === 'columns2' || node.type.name === 'columns3') {
      const flexValues: number[] = []
      node.forEach((col: PMNode) => flexValues.push(col.attrs.flex ?? 1))
      return {
        count: node.type.name === 'columns2' ? 2 : 3,
        gap: (node.attrs.gap as ColumnsGap) ?? 'normal',
        mobileStack: node.attrs.mobileStack ?? true,
        flexValues,
      }
    }
  }
  return null
}

export function flexesMatch(a: number[], b: number[]): boolean {
  return a.length === b.length && a.every((v, i) => v === b[i])
}

export function getColumnPresets(count: 2 | 3): ColumnLayoutPreset[] {
  return count === 2 ? TWO_COL_PRESETS : THREE_COL_PRESETS
}

export const TWO_COL_PRESETS: ColumnLayoutPreset[] = [
  { label: '1/2 + 1/2', flexes: [1, 1] },
  { label: '2/3 + 1/3', flexes: [2, 1] },
  { label: '1/3 + 2/3', flexes: [1, 2] },
]

export const THREE_COL_PRESETS: ColumnLayoutPreset[] = [
  { label: '1/3 + 1/3 + 1/3', flexes: [1, 1, 1] },
  { label: '1/2 + 1/4 + 1/4', flexes: [2, 1, 1] },
  { label: '1/4 + 1/2 + 1/4', flexes: [1, 2, 1] },
  { label: '1/4 + 1/4 + 1/2', flexes: [1, 1, 2] },
]
