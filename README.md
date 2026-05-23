# tapx

Free, production-quality TipTap extensions for editorial workflows.

## Extensions

| Package | Status | Description |
|---|---|---|
| [`@tapx/columns`](./packages/columns) | ✅ Available | Multi-column layouts with configurable widths, gap, and mobile stacking |
| `@tapx/image` | 🚧 Coming soon | Upload, crop, and insert images with responsive AVIF/WebP variants |

## Documentation

**[tapx.alfy.blog](https://tapx.alfy.blog)**

## Quick start

```bash
npm install @tapx/columns
```

```ts
import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import { columnsKit } from '@tapx/columns'

const editor = new Editor({
  extensions: [StarterKit, ...columnsKit],
})
```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

[MIT](./LICENSE)
