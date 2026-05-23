# Contributing

## Prerequisites

- Node.js >= 22
- pnpm >= 9

## Setup

```bash
git clone https://github.com/ahmadalfy/tapx.git
cd tapx
pnpm install
```

## Project structure

```
apps/
  docs/          # Docusaurus documentation site
packages/
  columns/       # @tapx/columns extension
```

## Development

Run everything in watch mode:

```bash
pnpm dev
```

Or work on a specific package:

```bash
# columns package in watch mode
pnpm --filter @tapx/columns dev

# docs dev server
pnpm --filter docs start
```

## Testing

```bash
# All packages
pnpm test

# columns only
pnpm --filter @tapx/columns test
```

## Building

```bash
pnpm build
```

The columns package must be built before the docs site can reference it.

## Commit style

Conventional commits: `type(scope): description`

Common types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`

Examples:
- `feat(columns): add setColumnsGap command`
- `fix(columns): preserve selection when changing column count`
- `docs: update bubble toolbar reference implementation`

## Pull requests

- Open an issue first for non-trivial changes
- Keep PRs focused — one concern per PR
- Make sure `pnpm test` and `pnpm build` pass before submitting
