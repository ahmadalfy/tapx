import { themes as prismThemes } from 'prism-react-renderer'
import type { Config } from '@docusaurus/types'
import type * as Preset from '@docusaurus/preset-classic'

const config: Config = {
  title: 'tapx',
  tagline: 'Free, open-source extensions for TipTap',
  favicon: 'img/favicon.svg',

  future: {
    v4: true,
  },

  url: 'https://tapx.dev',
  baseUrl: '/',

  organizationName: 'ahmadalfy',
  projectName: 'tapx',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/ahmadalfy/tapx/tree/main/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'tapx',
      logo: {
        alt: 'tapx logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'extensionsSidebar',
          position: 'left',
          label: 'Extensions',
        },
        {
          href: 'https://github.com/ahmadalfy/tapx',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Extensions',
          items: [
            {
              label: 'Columns',
              to: '/docs/extensions/columns',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/ahmadalfy/tapx',
            },
            {
              label: 'npm',
              href: 'https://www.npmjs.com/org/tapx',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} tapx. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'diff'],
    },
  } satisfies Preset.ThemeConfig,
}

export default config
