export { Column, Columns2, Columns3, ColumnsCommands } from './columns'
export type { ColumnsGap } from './types'

export { Column as default } from './columns'

/**
 * Convenience array — spread into your editor extensions list.
 *
 * @example
 * import { columnsKit } from '@tapx/columns'
 * new Editor({ extensions: [...columnsKit, ...yourOtherExtensions] })
 */
export { columnsKit } from './kit'
