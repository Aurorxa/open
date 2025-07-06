import {defineConfig, type UserConfig} from 'vitepress'
import timeline from "vitepress-markdown-timeline"
import {groupIconMdPlugin, groupIconVitePlugin, localIconLoader} from 'vitepress-plugin-group-icons'
import {figure} from '@mdit/plugin-figure'
import {loadEnv} from 'vite'
import {withMermaid} from 'vitepress-plugin-mermaid'
import Permalink from "vitepress-plugin-permalink"
import {
  InlineLinkPreviewElementTransform
} from '@nolebase/vitepress-plugin-inline-link-preview/markdown-it'
import terser from '@rollup/plugin-terser'
import {vitepressDemoPlugin} from 'vitepress-demo-plugin'
import markdownItTaskCheckbox from 'markdown-it-task-checkbox'
import path from 'path'
import {VitePressSidebarOptions} from "vitepress-sidebar/types"
import {withSidebar} from "vitepress-sidebar"
const mode = process.env.NODE_ENV || 'development'
const {VITE_BASE_URL} = loadEnv(mode, process.cwd())
console.log('Mode:', process.env.NODE_ENV)
console.log('VITE_BASE_URL:', VITE_BASE_URL)
const vitePressOptions = withMermaid(defineConfig({
  rewrites: {
    'zh/:rest*': ':rest*'
  },
  metaChunk: true,
  lang: 'zh-CN', // 语言
  title: "许大仙", // 站点名称
  titleTemplate: "Hi，终于等到你", // 网页标题
  description: "许大仙、前端、Java、大数据、云原生", // 站点描述
  head: [ // favicon.ico 图标等
    ['link', {rel: "shortcut icon", href: `${VITE_BASE_URL || '/'}logo.svg`}],
    // 网站 favicon.ico 图标
    ['link', {rel: "icon", href: `${VITE_BASE_URL || '/'}logo.svg`, type: "image/svg+xml"}],
    // 引入 Google Fonts
    ['link', {rel: 'preconnect', href: 'https://fonts.googleapis.com'}],
    ['link', {rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: ''}],
    ['link', {
      href: 'https://fonts.googleapis.com/css?family=Roboto+Slab:300,300i,400,400i,700,700i%7CRoboto+Mono:400,400i,700,700i&display=fallback',
      rel: 'stylesheet'
    }],
    // 网页视口
    ['meta', {
      name: "viewport",
      content: "width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no,shrink-to-fit=no"
    }],
    // 关键词和描述
    ['meta', {name: "keywords", content: "许大仙、Java、C、C++、大数据、前端、云原生、Go、Python"}],
    ['meta', {charset: 'UTF-8'}],
  ],
  appearance: true, // 主题模式，默认浅色且开启切换
  base: VITE_BASE_URL,
  lastUpdated: true, // 上次更新
  vite: {
    build: {
      chunkSizeWarningLimit: 2000,
    },
    ssr: {
      noExternal: [
        '@nolebase/vitepress-plugin-enhanced-readabilities',
        '@nolebase/ui',
        '@nolebase/vitepress-plugin-highlight-targeted-heading',
        '@nolebase/vitepress-plugin-inline-link-preview'
      ],
    },
    optimizeDeps: {
      exclude: [
        '@nolebase/vitepress-plugin-enhanced-readabilities/client',
        'vitepress',
        '@nolebase/vitepress-plugin-inline-link-preview/client',
      ],
    },
    plugins: [
      terser(),
      //代码组图标
      (groupIconVitePlugin({
        customIcon: {
          'c': localIconLoader(import.meta.url, '../../public/iconify/c.svg'),
          'java': 'vscode-icons:file-type-java',
          'winget': 'vscode-icons:file-type-shell',
          'choco': localIconLoader(import.meta.url, '../../public/iconify/choco.svg'),
          "控制台":localIconLoader(import.meta.url, '../../public/iconify/terminal.svg'),
          'cmd': 'vscode-icons:file-type-shell',
          'powershell': 'vscode-icons:file-type-powershell',
          'maven': 'vscode-icons:file-type-apache',
          'gradle': 'vscode-icons:file-type-light-gradle',
          'git': 'vscode-icons:file-type-git',
          'bash': 'vscode-icons:file-type-gnu',
          'shell': 'vscode-icons:file-type-gnu',
          'sh': 'vscode-icons:file-type-gnu',
        }
      }) as any),
      Permalink(),
    ],
    server: {
      port: 10089
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: "modern-compiler" // or 'modern'
        }
      }
    },
  },
  sitemap: {
    hostname: `https://java.weiweixu.cn${VITE_BASE_URL}`,
  },
  markdown: { // markdown 配置
    math: true,
    lineNumbers: true, // 行号显示
    image: {
      // 开启图片懒加载
      lazyLoading: true
    },
    // md 配置
    config: (md) => {
      // 创建 markdown-it 插件
      md.use((md) => {
        const defaultRender = md.render
        md.render = (...args) => {
          const [content, env] = args
          const currentLang = env?.localeIndex || 'root'
          const isHomePage = env?.path === '/' || env?.relativePath === 'index.md'  // 判断是否是首页

          if (isHomePage) {
            return defaultRender.apply(md, args) // 如果是首页，直接渲染内容
          }
          // 调用原始渲染
          let defaultContent = defaultRender.apply(md, args)
          // 替换内容
          if (currentLang === 'root') {
            defaultContent = defaultContent.replace(/NOTE/g, '提醒')
              .replace(/TIP/g, '建议')
              .replace(/IMPORTANT/g, '重要')
              .replace(/WARNING/g, '警告')
              .replace(/CAUTION/g, '注意')
          } else if (currentLang === 'ko') {
            // 韩文替换
            defaultContent = defaultContent.replace(/NOTE/g, '알림')
              .replace(/TIP/g, '팁')
              .replace(/IMPORTANT/g, '중요')
              .replace(/WARNING/g, '경고')
              .replace(/CAUTION/g, '주의')
          }
          // 返回渲染的内容
          return defaultContent
        }

        // 获取原始的 fence 渲染规则
        const defaultFence = md.renderer.rules.fence?.bind(md.renderer.rules) ?? ((...args) => args[0][args[1]].content)

        // 重写 fence 渲染规则
        md.renderer.rules.fence = (tokens, idx, options, env, self) => {
          const token = tokens[idx]
          const info = token.info.trim()

          // 判断是否为 md:img 类型的代码块
          if (info.includes('md:img')) {
            // 只渲染图片，不再渲染为代码块
            return `<div class="rendered-md">${md.render(token.content)}</div>`
          }

          // 其他代码块按默认规则渲染（如 java, js 等）
          return defaultFence(tokens, idx, options, env, self)
        }
      })
      md.use(timeline)
      md.use(groupIconMdPlugin) //代码组图标
      md.use(InlineLinkPreviewElementTransform)
      md.use(figure, {figcaption: 'alt', copyAttrs: '^class$', lazy: true})
      md.use(markdownItTaskCheckbox)
      md.use(vitepressDemoPlugin, {
        demoDir: path.resolve(__dirname, '../demos'),
      })
    }
  },
  themeConfig: { // 主题设置
    logo: '/logo.svg',  // 左上角logo
    //社交链接
    socialLinks: [
      {icon: 'github', link: 'https://github.com/Aurorxa/java'},
    ],
    editLink: {
      pattern: 'https://github.com/Aurorxa/java/edit/master/docs/:path',
      text: 'Edit this page on GitHub'
    },
    externalLinkIcon: true,
    search: {
      provider: 'algolia',
      options: {
        appId: 'LVMA83X0DG',
        apiKey: 'a8cbc88742b5e45d822f3a9607ff5122',
        indexName: 'java-weiweixu',
        locales: {
          zh: {
            placeholder: '搜索文档',
            translations: {
              button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档'
              },
              modal: {
                searchBox: {
                  resetButtonTitle: '清除查询条件',
                  resetButtonAriaLabel: '清除查询条件',
                  cancelButtonText: '取消',
                  cancelButtonAriaLabel: '取消'
                },
                startScreen: {
                  recentSearchesTitle: '搜索历史',
                  noRecentSearchesText: '没有搜索历史',
                  saveRecentSearchButtonTitle: '保存至搜索历史',
                  removeRecentSearchButtonTitle: '从搜索历史中移除',
                  favoriteSearchesTitle: '收藏',
                  removeFavoriteSearchButtonTitle: '从收藏中移除'
                },
                errorScreen: {
                  titleText: '无法获取结果',
                  helpText: '你可能需要检查你的网络连接'
                },
                footer: {
                  selectText: '选择',
                  navigateText: '切换',
                  closeText: '关闭',
                  searchByText: '搜索提供者'
                },
                noResultsScreen: {
                  noResultsText: '无法找到相关结果',
                  suggestedQueryText: '你可以尝试查询',
                  reportMissingResultsText: '你认为该查询应该有结果？',
                  reportMissingResultsLinkText: '点击反馈'
                },
              },
            },
          },
        },
      },
    },
  }
}))

const vitePressSidebarOption: VitePressSidebarOptions | VitePressSidebarOptions[] = {
  documentRootPath: 'docs',
  debugPrint: true,
  basePath: `${VITE_BASE_URL}`,
  collapsed: true,
  excludePattern: ['assets', 'public', 'index.md', 'about'],
  includeDotFiles: true,
  includeRootIndexFile: false,
  includeEmptyFolder: true,
  includeFolderIndexFile: false,
  removePrefixAfterOrdering: true,
  prefixSeparator: '.',
  useFolderLinkFromIndexFile: true,
  useTitleFromFrontmatter: true,
  folderLinkNotIncludesFileName: true,
  keepMarkdownSyntaxFromTitle: true
}

const rootLocale = 'zh'
const supportedLocales = [rootLocale, 'en']

const vitePressSidebarOptions = [
  ...supportedLocales.map((lang) => {
    return {
      ...vitePressSidebarOption,
      ...(rootLocale === lang ? {} : {basePath: `/${lang}/`}), // If using `rewrites` option
      documentRootPath: `/docs/${lang}`,
      resolvePath: rootLocale === lang ? '/' : `/${lang}/`,
    }
  })
]

export const sharedConfig = withSidebar(vitePressOptions, vitePressSidebarOptions)