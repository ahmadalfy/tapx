import { Extension, mergeAttributes, Node } from '@tiptap/core'
import type { Node as PMNode } from '@tiptap/pm/model'
import type { ColumnsGap } from './types'

/**
 * Inner column node. Holds standard block content by default.
 * Extend with `.extend({ content: '...' })` to allow custom node types inside columns.
 *
 * HTML: <div data-col>…</div>
 * The `flex` attribute is only written when != 1 so old content without it defaults correctly via CSS.
 */
export const Column = Node.create({
  name: 'column',
  group: 'column',
  content: '(paragraph | heading | bulletList | orderedList | blockquote | horizontalRule | image)+',
  defining: true,
  isolating: true,

  addAttributes() {
    return {
      flex: {
        default: 1,
        parseHTML: (el) => Number(el.getAttribute('data-col-flex') ?? 1),
        renderHTML: (attrs) => (attrs.flex !== 1 ? { 'data-col-flex': attrs.flex } : {}),
      },
    }
  },

  parseHTML() {
    return [{ tag: 'div[data-col]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-col': '' }), 0]
  },
})

function createColumnsNode(cols: 2 | 3) {
  const content = cols === 2 ? 'column column' : 'column column column'
  const name = cols === 2 ? 'columns2' : 'columns3'
  const colsAttr = String(cols) as '2' | '3'

  return Node.create({
    name,
    group: 'block',
    content,
    defining: true,
    isolating: true,

    addAttributes() {
      return {
        // Only written to HTML when not the default — old content keeps gap via CSS.
        gap: {
          default: 'normal' as ColumnsGap,
          parseHTML: (el) => (el.getAttribute('data-col-gap') as ColumnsGap) ?? 'normal',
          renderHTML: (attrs) => (attrs.gap !== 'normal' ? { 'data-col-gap': attrs.gap } : {}),
        },
        // Only written when false — old content defaults to stacking via CSS.
        mobileStack: {
          default: true,
          parseHTML: (el) => el.getAttribute('data-col-mobile') !== 'side',
          renderHTML: (attrs) => (!attrs.mobileStack ? { 'data-col-mobile': 'side' } : {}),
        },
      }
    },

    parseHTML() {
      return [{ tag: `div[data-cols="${colsAttr}"]` }]
    },

    renderHTML({ HTMLAttributes }) {
      return ['div', mergeAttributes(HTMLAttributes, { 'data-cols': colsAttr }), 0]
    },
  })
}

export const Columns2 = createColumnsNode(2)
export const Columns3 = createColumnsNode(3)

function findColumnsAncestor(state: {
  selection: {
    $from: {
      depth: number
      node: (d: number) => PMNode
      before: (d: number) => number
    }
  }
}) {
  const { $from } = state.selection
  for (let d = $from.depth; d >= 1; d--) {
    const node = $from.node(d)
    if (node.type.name === 'columns2' || node.type.name === 'columns3') {
      return { node, pos: $from.before(d) }
    }
  }
  return null
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    columns: {
      insertColumns: (count: 2 | 3) => ReturnType
      setColumnCount: (count: 2 | 3) => ReturnType
      setColumnsGap: (gap: ColumnsGap) => ReturnType
      setColumnsMobileStack: (value: boolean) => ReturnType
      setColumnsLayout: (flexValues: number[]) => ReturnType
    }
  }
}

const emptyColumn = () => ({ type: 'column', content: [{ type: 'paragraph' }] })

export const ColumnsCommands = Extension.create({
  name: 'columnsCommands',

  addCommands() {
    return {
      insertColumns:
        (count: 2 | 3) =>
        ({ commands }) =>
          commands.insertContent({
            type: `columns${count}`,
            content: Array.from({ length: count }, () => emptyColumn()),
          }),

      setColumnCount:
        (count: 2 | 3) =>
        ({ tr, state, dispatch }) => {
          const found = findColumnsAncestor(state)
          if (!found) return false

          const { node: colsNode, pos: colsPos } = found
          const currentCount = colsNode.type.name === 'columns2' ? 2 : 3
          if (currentCount === count) return false

          const newType = state.schema.nodes[`columns${count}`]
          if (!newType) return false
          if (!dispatch) return true

          const existingColumns: PMNode[] = []
          colsNode.forEach((col: PMNode) => existingColumns.push(col))

          let newColumns: PMNode[]
          if (count > currentCount) {
            const emptyCol = state.schema.nodes.column.create(
              { flex: 1 },
              state.schema.nodes.paragraph.create(),
            )
            newColumns = [...existingColumns, ...Array(count - currentCount).fill(emptyCol)]
          } else {
            newColumns = existingColumns.slice(0, count)
          }

          const newNode = newType.create(colsNode.attrs, newColumns)
          tr.replaceWith(colsPos, colsPos + colsNode.nodeSize, newNode)
          dispatch(tr)
          return true
        },

      setColumnsGap:
        (gap: ColumnsGap) =>
        ({ tr, state, dispatch }) => {
          const found = findColumnsAncestor(state)
          if (!found) return false
          if (!dispatch) return true
          tr.setNodeMarkup(found.pos, undefined, { ...found.node.attrs, gap })
          dispatch(tr)
          return true
        },

      setColumnsMobileStack:
        (value: boolean) =>
        ({ tr, state, dispatch }) => {
          const found = findColumnsAncestor(state)
          if (!found) return false
          if (!dispatch) return true
          tr.setNodeMarkup(found.pos, undefined, { ...found.node.attrs, mobileStack: value })
          dispatch(tr)
          return true
        },

      setColumnsLayout:
        (flexValues: number[]) =>
        ({ tr, state, dispatch }) => {
          const found = findColumnsAncestor(state)
          if (!found) return false
          if (!dispatch) return true
          found.node.forEach((colNode: PMNode, colOffset: number, colIndex: number) => {
            const flex = flexValues[colIndex] ?? 1
            tr.setNodeMarkup(found.pos + 1 + colOffset, undefined, { ...colNode.attrs, flex })
          })
          dispatch(tr)
          return true
        },
    }
  },
})
