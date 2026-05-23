import type { ReactNode } from 'react'
import BrowserOnly from '@docusaurus/BrowserOnly'
import styles from './styles.module.css'

function EditorInner(): ReactNode {
  const { useState } = require('react')
  const { html: beautify } = require('js-beautify')
  const { useEditor, EditorContent } = require('@tiptap/react')
  const StarterKit = require('@tiptap/starter-kit').default
  const { Column, Columns2, Columns3, ColumnsCommands } = require('@tapx/columns')

  const [showHtml, setShowHtml] = useState(false)

  const editor = useEditor({
    extensions: [StarterKit, Column, Columns2, Columns3, ColumnsCommands],
    content: `
      <p>Try inserting columns using the toolbar above. Click inside a column block to see layout controls.</p>
      <div data-cols="2">
        <div data-col><p>This is the <strong>left column</strong>.</p></div>
        <div data-col><p>This is the <strong>right column</strong>. Select a layout preset to change the widths.</p></div>
      </div>
      <p></p>
    `,
  })

  if (!editor) return null

  const inColumns = editor.isActive('columns2') || editor.isActive('columns3')

  return (
    <div className={styles.playground}>
      <div className={styles.toolbar}>
        <div className={styles.group}>
          <span className={styles.label}>Insert</span>
          <button
            type="button"
            className={styles.btn}
            onClick={() => editor.chain().focus().insertColumns(2).run()}
          >
            2 columns
          </button>
          <button
            type="button"
            className={styles.btn}
            onClick={() => editor.chain().focus().insertColumns(3).run()}
          >
            3 columns
          </button>
        </div>

        {inColumns && (
          <>
            <span className={styles.divider} aria-hidden />

            <div className={styles.group}>
              <span className={styles.label}>Layout</span>
              {editor.isActive('columns2') ? (
                <>
                  {([[1, 1], [2, 1], [1, 2]] as [number, number][]).map((flexes) => (
                    <button
                      key={flexes.join('+')}
                      type="button"
                      className={`${styles.btn} ${editor.isActive('columns2') ? '' : ''}`}
                      onClick={() => editor.chain().focus().setColumnsLayout(flexes).run()}
                      title={flexes.map(f => `${f}`).join('/')}
                    >
                      <LayoutIcon flexes={flexes} />
                    </button>
                  ))}
                </>
              ) : (
                <>
                  {([[1, 1, 1], [2, 1, 1], [1, 2, 1], [1, 1, 2]] as [number, number, number][]).map((flexes) => (
                    <button
                      key={flexes.join('+')}
                      type="button"
                      className={styles.btn}
                      onClick={() => editor.chain().focus().setColumnsLayout(flexes).run()}
                      title={flexes.map(f => `${f}`).join('/')}
                    >
                      <LayoutIcon flexes={flexes} />
                    </button>
                  ))}
                </>
              )}
            </div>

            <span className={styles.divider} aria-hidden />

            <div className={styles.group}>
              <span className={styles.label}>Gap</span>
              {(['tight', 'normal', 'wide'] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  className={styles.btn}
                  onClick={() => editor.chain().focus().setColumnsGap(g).run()}
                >
                  {g[0].toUpperCase()}
                </button>
              ))}
            </div>

            <span className={styles.divider} aria-hidden />

            <div className={styles.group}>
              <span className={styles.label}>Mobile</span>
              <button
                type="button"
                className={styles.btn}
                onClick={() => editor.chain().focus().setColumnsMobileStack(true).run()}
                title="Stack on mobile"
              >
                Stack
              </button>
              <button
                type="button"
                className={styles.btn}
                onClick={() => editor.chain().focus().setColumnsMobileStack(false).run()}
                title="Side by side on mobile"
              >
                Side by side
              </button>
            </div>
          </>
        )}
      </div>

      <div className={styles.editorWrapper}>
        <EditorContent editor={editor} />
      </div>

      <button
        type="button"
        className={styles.htmlToggle}
        onClick={() => setShowHtml((v: boolean) => !v)}
      >
        {showHtml ? '▾' : '▸'} HTML output
      </button>
      {showHtml && (
        <div className={styles.htmlOutput}>
          {(() => {
            const CodeBlock = require('@theme/CodeBlock').default
            return (
              <CodeBlock language="html">
                {beautify(editor.getHTML(), { indent_size: 2, wrap_line_length: 0 })}
              </CodeBlock>
            )
          })()}
        </div>
      )}
    </div>
  )
}

function LayoutIcon({ flexes }: { flexes: number[] }) {
  return (
    <span className={styles.layoutIcon} aria-hidden>
      {flexes.map((f, i) => (
        <span key={i} className={styles.layoutBar} style={{ flex: f }} />
      ))}
    </span>
  )
}

export function ColumnsPlayground(): ReactNode {
  return (
    <BrowserOnly fallback={<div className={styles.loading}>Loading playground…</div>}>
      {() => <EditorInner />}
    </BrowserOnly>
  )
}
