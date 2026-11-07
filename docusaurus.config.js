// @ts-check
const {themes: prismThemes} = require('prism-react-renderer');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Draxis Digital Docs',
  tagline: 'Documentation for Lophiarch, Axionorm, Parabiont Protocol, and PARALAX MCP.',
  favicon: 'img/favicon.svg',

  url: 'https://amiencoy.github.io',
  baseUrl: '/docs/',

  organizationName: 'amiencoy',
  projectName: 'docs',
  deploymentBranch: 'gh-pages',
  trailingSlash: true,

  onBrokenLinks: 'throw',

  markdown: {
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  themes: [
    '@docusaurus/theme-mermaid',
    [
      require.resolve('@easyops-cn/docusaurus-search-local'),
      /** @type {import('@easyops-cn/docusaurus-search-local').PluginOptions} */
      ({
        hashed: true,
        indexDocs: true,
        indexBlog: false,
        indexPages: false,
        docsRouteBasePath: [
          '/library',
          '/lophiarch',
          '/axionorm',
          '/parabiont',
          '/paralax',
        ],
        docsDir: [
          'docs/library',
          'docs/lophiarch',
          'docs/axionorm',
          'docs/parabiont',
          'docs/paralax',
        ],
        searchResultLimits: 8,
        highlightSearchTermsOnTargetPage: true,
      }),
    ],
  ],

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: false,
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'default',
        path: 'docs/library',
        routeBasePath: 'library',
        sidebarPath: require.resolve('./sidebars.library.js'),
        editUrl: 'https://github.com/amiencoy/docs/tree/main/',
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'lophiarch',
        path: 'docs/lophiarch',
        routeBasePath: 'lophiarch',
        sidebarPath: require.resolve('./sidebars.lophiarch.js'),
        editUrl: 'https://github.com/amiencoy/docs/tree/main/',
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'axionorm',
        path: 'docs/axionorm',
        routeBasePath: 'axionorm',
        sidebarPath: require.resolve('./sidebars.axionorm.js'),
        editUrl: 'https://github.com/amiencoy/docs/tree/main/',
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'parabiont',
        path: 'docs/parabiont',
        routeBasePath: 'parabiont',
        sidebarPath: require.resolve('./sidebars.parabiont.js'),
        editUrl: 'https://github.com/amiencoy/docs/tree/main/',
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'paralax',
        path: 'docs/paralax',
        routeBasePath: 'paralax',
        sidebarPath: require.resolve('./sidebars.paralax.js'),
        editUrl: 'https://github.com/amiencoy/docs/tree/main/',
      },
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/social-card.svg',
      colorMode: {
        defaultMode: 'light',
        respectPrefersColorScheme: true,
      },
      navbar: {
        title: 'Docs Library',
        logo: {
          alt: 'Draxis Digital',
          src: 'img/logo.svg',
        },
        hideOnScroll: true,
        items: [
          {to: '/', label: 'Library', position: 'left'},
          {type: 'doc', docId: 'index', docsPluginId: 'lophiarch', label: 'Lophiarch', position: 'left'},
          {type: 'doc', docId: 'index', docsPluginId: 'axionorm', label: 'Axionorm', position: 'left'},
          {type: 'doc', docId: 'index', docsPluginId: 'parabiont', label: 'Parabiont', position: 'left'},
          {type: 'doc', docId: 'index', docsPluginId: 'paralax', label: 'PARALAX', position: 'left'},
          {
            href: 'https://github.com/amiencoy',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Documented',
            items: [
              {label: 'Lophiarch', to: '/lophiarch'},
              {label: 'Axionorm', to: '/axionorm'},
              {label: 'Parabiont Protocol', to: '/parabiont'},
              {label: 'PARALAX MCP', to: '/paralax'},
            ],
          },
          {
            title: 'Source',
            items: [
              {label: 'Lophiarch', href: 'https://github.com/amiencoy/lophiarch'},
              {label: 'Axionorm', href: 'https://github.com/amiencoy/axionorm'},
              {label: 'Parabiont Protocol', href: 'https://github.com/amiencoy/parabiont-protocol'},
              {label: 'PARALAX MCP', href: 'https://github.com/amiencoy/paralax-mcp'},
            ],
          },
          {
            title: 'Practice',
            items: [
              {label: 'Draxis Digital', href: 'https://draxis-digital.my.id/'},
              {label: 'GitHub profile', href: 'https://github.com/amiencoy'},
              {label: 'This repository', href: 'https://github.com/amiencoy/docs'},
            ],
          },
        ],
        copyright: `© ${new Date().getFullYear()} Draxis Digital. Documentation is checked against the tagged source.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        additionalLanguages: ['bash', 'yaml', 'json', 'powershell', 'python', 'docker'],
      },
      mermaid: {
        theme: {light: 'neutral', dark: 'dark'},
      },
    }),
};

module.exports = config;
