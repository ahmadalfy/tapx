import type { ReactNode } from 'react'
import BrowserOnly from '@docusaurus/BrowserOnly'
import styles from './styles.module.css'

function EditorInner(): ReactNode {
  const { useState, useEffect, useReducer } = require('react')
  const { createPortal } = require('react-dom')
  const { useEditor, EditorContent } = require('@tiptap/react')
  const StarterKit = require('@tiptap/starter-kit').default
  const { Column, Columns2, Columns3, ColumnsCommands, readColumnsState, flexesMatch, getColumnPresets } = require('@tapx/columns')
  const { useFloating, offset, flip, shift, autoUpdate } = require('@floating-ui/react')
  const { html: beautify } = require('js-beautify')

  const [showHtml, setShowHtml] = useState(false)
  const [, forceUpdate] = useReducer((x: number) => x + 1, 0)

  const editor = useEditor({
    extensions: [StarterKit, Column, Columns2, Columns3, ColumnsCommands],
    content: `
      <p>Click inside a column block to see the floating bubble toolbar.</p>
      <div data-cols="2">
        <div data-col><p>Left column — click here and the bubble will appear above.</p></div>
        <div data-col><p>Right column — use the bubble to change layout, gap, or mobile behaviour.</p></div>
      </div>
      <p></p>
    `,
    onTransaction: () => forceUpdate(),
  })

  const { refs, floatingStyles } = useFloating({
    placement: 'top',
    middleware: [offset(8), flip(), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate,
  })

  useEffect(() => {
    if (!editor) return
    const sync = () => {
      const { $from } = editor.state.selection
      for (let d = $from.depth; d >= 1; d--) {
        const node = $from.node(d)
        if (node.type.name === 'columns2' || node.type.name === 'columns3') {
          const dom = editor.view.nodeDOM($from.before(d))
          if (dom instanceof HTMLElement) refs.setReference(dom)
          break
        }
      }
    }
    editor.on('transaction', sync)
    sync()
    return () => { editor.off('transaction', sync) }
  }, [editor, refs])

  if (!editor) return null

  const isActive = editor.isActive('columns2') || editor.isActive('columns3')
  const cols = isActive ? readColumnsState(editor) : null
  const presets = cols ? getColumnPresets(cols.count) : []

  return (
    <div className={styles.playground}>
      <div className={styles.hint}>
        💡 Click inside a column block to reveal the bubble toolbar
      </div>
      <div className={styles.editorWrapper}>
        <EditorContent editor={editor} />

        {isActive && cols && (
          createPortal(
            <div ref={refs.setFloating} style={{ ...floatingStyles, zIndex: 100 }} className={styles.bubble}>
              {/* Column count */}
              <button type="button" className={`${styles.bubbleBtn} ${cols.count === 2 ? styles.bubbleBtnActive : ''}`} onClick={() => editor.chain().focus().setColumnCount(2).run()} aria-label="2 columns">2</button>
              <button type="button" className={`${styles.bubbleBtn} ${cols.count === 3 ? styles.bubbleBtnActive : ''}`} onClick={() => editor.chain().focus().setColumnCount(3).run()} aria-label="3 columns">3</button>

              <span className={styles.bubbleDivider} aria-hidden />

              {/* Layout presets */}
              {presets.map((preset: any) => {
                const active = flexesMatch(cols.flexValues, preset.flexes)
                return (
                  <button key={preset.label} type="button" className={`${styles.bubbleBtn} ${active ? styles.bubbleBtnActive : ''}`} onClick={() => editor.chain().focus().setColumnsLayout(preset.flexes).run()} aria-label={preset.label}>
                    <span className={styles.layoutIcon} aria-hidden>
                      {preset.flexes.map((f: number, i: number) => <span key={i} className={styles.layoutBar} style={{ flex: f }} />)}
                    </span>
                  </button>
                )
              })}

              <span className={styles.bubbleDivider} aria-hidden />

              {/* Gap */}
              {(['tight', 'normal', 'wide'] as const).map((g) => (
                <button key={g} type="button" className={`${styles.bubbleBtn} ${cols.gap === g ? styles.bubbleBtnActive : ''}`} onClick={() => editor.chain().focus().setColumnsGap(g).run()} aria-label={`Gap: ${g}`} title={g.charAt(0).toUpperCase() + g.slice(1)}>
                  {g[0].toUpperCase()}
                </button>
              ))}

              <span className={styles.bubbleDivider} aria-hidden />

              {/* Mobile stacking */}
              <button type="button" className={`${styles.bubbleBtn} ${cols.mobileStack ? styles.bubbleBtnActive : ''}`} onClick={() => editor.chain().focus().setColumnsMobileStack(true).run()} aria-label="Stack on mobile">
                <span className={styles.mobileIcon} aria-hidden><span className={styles.mobileBar} /><span className={styles.mobileBar} /></span>
              </button>
              <button type="button" className={`${styles.bubbleBtn} ${!cols.mobileStack ? styles.bubbleBtnActive : ''}`} onClick={() => editor.chain().focus().setColumnsMobileStack(false).run()} aria-label="Side by side on mobile">
                <span className={styles.mobileIcon} style={{ flexDirection: 'row' } as any} aria-hidden><span className={styles.mobileBar} style={{ width: 6, height: 12 } as any} /><span className={styles.mobileBar} style={{ width: 6, height: 12 } as any} /></span>
              </button>
            </div>,
            document.body,
          )
        )}
      </div>

      <button type="button" className={styles.htmlToggle} onClick={() => setShowHtml((v: boolean) => !v)}>
        {showHtml ? '▾' : '▸'} HTML output
      </button>
      {showHtml && (
        <div className={styles.htmlOutput}>
          {(() => {
            const CodeBlock = require('@theme/CodeBlock').default
            return (
              <CodeBlock language="html">
                {beautify(editor.getHTML(), { indent_size: 2, wrap_line_length: 0 }).replace(/=""/g, '')}
              </CodeBlock>
            )
          })()}
        </div>
      )}
    </div>
  )
}

export function ColumnsBubblePlayground(): ReactNode {
  return (
    <BrowserOnly fallback={<div className={styles.loading}>Loading playground…</div>}>
      {() => <EditorInner />}
    </BrowserOnly>
  )
}
