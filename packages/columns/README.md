# @tapx/columns

Multi-column layout extension for [TipTap](https://tiptap.dev). Supports 2 and 3 column layouts with configurable widths, gap, and mobile behaviour.

## Installation

```bash
npm install @tapx/columns
# or
pnpm add @tapx/columns
```

## Usage

```ts
import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import { columnsKit } from '@tapx/columns'

const editor = new Editor({
  extensions: [StarterKit, ...columnsKit],
})

// Insert a 2-column block
editor.commands.insertColumns(2)

// Insert a 3-column block
editor.commands.insertColumns(3)
```

## Commands

| Command | Description |
|---|---|
| `insertColumns(count)` | Insert a new 2 or 3 column block at the current position |
| `setColumnCount(count)` | Change the column count of the columns block the cursor is in |
| `setColumnsGap(gap)` | Set the gap between columns: `'tight'`, `'normal'` (default), `'wide'` |
| `setColumnsMobileStack(value)` | Toggle whether columns stack vertically on mobile (`true` = stack, default) |
| `setColumnsLayout(flexValues)` | Set the relative widths of each column, e.g. `[2, 1]` for 2/3 + 1/3 |

## Layout presets

```ts
// Equal columns
editor.commands.setColumnsLayout([1, 1])

// 2/3 + 1/3
editor.commands.setColumnsLayout([2, 1])

// 1/3 + 2/3
editor.commands.setColumnsLayout([1, 2])

// Three equal columns
editor.commands.setColumnsLayout([1, 1, 1])

// 1/2 + 1/4 + 1/4
editor.commands.setColumnsLayout([2, 1, 1])
```

## Customising allowed content

By default, columns accept standard block nodes (paragraph, heading, lists, blockquote, image). To allow additional node types, extend the `Column` node:

```ts
import { Column, Columns2, Columns3, ColumnsCommands } from '@tapx/columns'

const CustomColumn = Column.extend({
  content: '(paragraph | heading | bulletList | orderedList | blockquote | image | video)+',
})

const editor = new Editor({
  extensions: [StarterKit, CustomColumn, Columns2, Columns3, ColumnsCommands],
})
```

## CSS

The extension renders semantic HTML with data attributes. Style it however you like:

```css
[data-cols] {
  display: flex;
  gap: 1rem; /* normal gap */
}

[data-col-gap="tight"] { gap: 0.5rem; }
[data-col-gap="wide"]  { gap: 2rem; }

[data-col] {
  flex: 1;
  min-width: 0;
}

/* Mobile: stack by default */
@media (max-width: 640px) {
  [data-cols]:not([data-col-mobile="side"]) {
    flex-direction: column;
  }
}
```

## HTML output

```html
<!-- 2-column, wide gap, 2/3 + 1/3, no mobile stack -->
<div data-cols="2" data-col-gap="wide" data-col-mobile="side">
  <div data-col data-col-flex="2">
    <p>Left content</p>
  </div>
  <div data-col>
    <p>Right content</p>
  </div>
</div>
```

Attributes with default values are omitted from the HTML output to keep markup clean.

## License

MIT
