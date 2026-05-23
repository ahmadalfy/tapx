import { Editor } from '@tiptap/core'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { Column, Columns2, Columns3, ColumnsCommands } from '../src'

// Restrict column content to paragraph-only for the minimal test schema.
// In real usage, extend Column with the node types your editor supports.
const TestColumn = Column.extend({ content: 'paragraph+' })

function createEditor() {
  const element = document.createElement('div')
  document.body.appendChild(element)
  return new Editor({
    element,
    extensions: [Document, Paragraph, Text, TestColumn, Columns2, Columns3, ColumnsCommands],
  })
}

describe('@tapx/columns', () => {
  let editor: Editor

  beforeEach(() => {
    editor = createEditor()
  })

  afterEach(() => {
    editor.destroy()
  })

  describe('insertColumns', () => {
    it('inserts a 2-column block', () => {
      editor.commands.insertColumns(2)
      const node = editor.getJSON().content?.[0]
      expect(node?.type).toBe('columns2')
      expect(node?.content).toHaveLength(2)
    })

    it('inserts a 3-column block', () => {
      editor.commands.insertColumns(3)
      const node = editor.getJSON().content?.[0]
      expect(node?.type).toBe('columns3')
      expect(node?.content).toHaveLength(3)
    })

    it('each column starts with an empty paragraph', () => {
      editor.commands.insertColumns(2)
      const cols = editor.getJSON().content?.[0]?.content
      expect(cols?.[0]?.content?.[0]?.type).toBe('paragraph')
      expect(cols?.[1]?.content?.[0]?.type).toBe('paragraph')
    })
  })

  describe('setColumnCount', () => {
    it('expands 2 columns to 3, preserving existing content', () => {
      editor.commands.insertColumns(2)
      editor.commands.setColumnCount(3)
      const node = editor.getJSON().content?.[0]
      expect(node?.type).toBe('columns3')
      expect(node?.content).toHaveLength(3)
    })

    it('shrinks 3 columns to 2, dropping the last column', () => {
      editor.commands.insertColumns(3)
      editor.commands.setColumnCount(2)
      const node = editor.getJSON().content?.[0]
      expect(node?.type).toBe('columns2')
      expect(node?.content).toHaveLength(2)
    })

    it('is a no-op when count is unchanged', () => {
      editor.commands.insertColumns(2)
      const before = editor.getHTML()
      editor.commands.setColumnCount(2)
      expect(editor.getHTML()).toBe(before)
    })
  })

  describe('setColumnsGap', () => {
    it('sets gap to wide', () => {
      editor.commands.insertColumns(2)
      editor.commands.setColumnsGap('wide')
      expect(editor.getJSON().content?.[0]?.attrs?.gap).toBe('wide')
    })

    it('sets gap to tight', () => {
      editor.commands.insertColumns(2)
      editor.commands.setColumnsGap('tight')
      expect(editor.getJSON().content?.[0]?.attrs?.gap).toBe('tight')
    })
  })

  describe('setColumnsMobileStack', () => {
    it('disables mobile stacking', () => {
      editor.commands.insertColumns(2)
      editor.commands.setColumnsMobileStack(false)
      expect(editor.getJSON().content?.[0]?.attrs?.mobileStack).toBe(false)
    })

    it('enables mobile stacking', () => {
      editor.commands.insertColumns(2)
      editor.commands.setColumnsMobileStack(false)
      editor.commands.setColumnsMobileStack(true)
      expect(editor.getJSON().content?.[0]?.attrs?.mobileStack).toBe(true)
    })
  })

  describe('setColumnsLayout', () => {
    it('sets flex values on individual columns', () => {
      editor.commands.insertColumns(2)
      editor.commands.setColumnsLayout([2, 1])
      const cols = editor.getJSON().content?.[0]?.content
      expect(cols?.[0]?.attrs?.flex).toBe(2)
      expect(cols?.[1]?.attrs?.flex).toBe(1)
    })

    it('defaults missing flex values to 1', () => {
      editor.commands.insertColumns(3)
      editor.commands.setColumnsLayout([2])
      const cols = editor.getJSON().content?.[0]?.content
      expect(cols?.[1]?.attrs?.flex).toBe(1)
      expect(cols?.[2]?.attrs?.flex).toBe(1)
    })
  })

  describe('HTML output', () => {
    it('wraps 2-column block in data-cols="2"', () => {
      editor.commands.insertColumns(2)
      expect(editor.getHTML()).toContain('data-cols="2"')
    })

    it('wraps 3-column block in data-cols="3"', () => {
      editor.commands.insertColumns(3)
      expect(editor.getHTML()).toContain('data-cols="3"')
    })

    it('marks each column with data-col', () => {
      editor.commands.insertColumns(2)
      expect(editor.getHTML()).toContain('data-col')
    })

    it('does not write data-col-gap for the default (normal)', () => {
      editor.commands.insertColumns(2)
      expect(editor.getHTML()).not.toContain('data-col-gap')
    })

    it('writes data-col-gap for non-default values', () => {
      editor.commands.insertColumns(2)
      editor.commands.setColumnsGap('wide')
      expect(editor.getHTML()).toContain('data-col-gap="wide"')
    })

    it('writes data-col-mobile="side" when mobile stacking is off', () => {
      editor.commands.insertColumns(2)
      editor.commands.setColumnsMobileStack(false)
      expect(editor.getHTML()).toContain('data-col-mobile="side"')
    })

    it('does not write data-col-mobile when stacking is on (default)', () => {
      editor.commands.insertColumns(2)
      expect(editor.getHTML()).not.toContain('data-col-mobile')
    })

    it('writes data-col-flex only for non-1 values', () => {
      editor.commands.insertColumns(2)
      editor.commands.setColumnsLayout([2, 1])
      const html = editor.getHTML()
      expect(html).toContain('data-col-flex="2"')
      expect(html).not.toContain('data-col-flex="1"')
    })
  })

  describe('HTML parsing (round-trip)', () => {
    it('parses 2-column HTML back into the correct node structure', () => {
      const html = '<div data-cols="2"><div data-col><p>A</p></div><div data-col><p>B</p></div></div>'
      editor.commands.setContent(html)
      const node = editor.getJSON().content?.[0]
      expect(node?.type).toBe('columns2')
      expect(node?.content).toHaveLength(2)
    })

    it('parses wide gap from HTML', () => {
      const html = '<div data-cols="2" data-col-gap="wide"><div data-col><p>A</p></div><div data-col><p>B</p></div></div>'
      editor.commands.setContent(html)
      expect(editor.getJSON().content?.[0]?.attrs?.gap).toBe('wide')
    })

    it('parses side-by-side mobile from HTML', () => {
      const html = '<div data-cols="2" data-col-mobile="side"><div data-col><p>A</p></div><div data-col><p>B</p></div></div>'
      editor.commands.setContent(html)
      expect(editor.getJSON().content?.[0]?.attrs?.mobileStack).toBe(false)
    })

    it('parses column flex from HTML', () => {
      const html = '<div data-cols="2"><div data-col data-col-flex="2"><p>A</p></div><div data-col><p>B</p></div></div>'
      editor.commands.setContent(html)
      const cols = editor.getJSON().content?.[0]?.content
      expect(cols?.[0]?.attrs?.flex).toBe(2)
      expect(cols?.[1]?.attrs?.flex).toBe(1)
    })
  })
})
