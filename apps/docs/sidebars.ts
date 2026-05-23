import type { SidebarsConfig } from '@docusaurus/plugin-content-docs'

const sidebars: SidebarsConfig = {
  extensionsSidebar: [
    {
      type: 'category',
      label: 'Extensions',
      collapsed: false,
      items: ['extensions/columns'],
    },
  ],
}

export default sidebars
