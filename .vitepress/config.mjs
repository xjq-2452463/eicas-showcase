import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "EICAS 仿真系统",
  description: "C++ 双发涡扇发动机监测系统 - 高保真航电仿真",
  
  base: '/eicas-showcase/', 
  
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'theme-color', content: '#1a73e8' }],
  ],

  markdown: {
    math: true,
    lineNumbers: true
  },

  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'EICAS Simulator',
    
    nav: [
      { text: '🏠 首页', link: '/' },
      { text: '📘 项目概述', link: '/overview' },
      { text: '⚙️ 物理模型', link: '/physics' },
      { text: '💻 核心代码', link: '/code' },
      { text: '📖 操作手册', link: '/manual' },
      { text: '⚠️ 故障代码', link: '/faults' }
    ],

    sidebar: {
      '/': [
        {
          text: '🚀 快速开始',
          collapsed: false,
          items: [
            { text: '项目概述', link: '/overview' },
            { text: '快速上手', link: '/manual' }
          ]
        },
        {
          text: '📐 技术文档',
          collapsed: false,
          items: [
            { text: '物理模型与算法', link: '/physics' },
            { text: '代码架构详解', link: '/code' },
            { text: '故障注入系统', link: '/faults' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/xjq-2452463/Virtual_engine_detection_module' }
    ],

    footer: {
      message: '虚拟飞机发动机性能监控系统 - 高级语言程序设计(进阶)课程作业',
      copyright: '© 2025 徐佳琪 | Built with <a href="https://vitepress.dev/" target="_blank">VitePress</a>'
    },

    outline: {
      level: [2, 3],
      label: '页面导航'
    },

    docFooter: {
      prev: '上一篇',
      next: '下一篇'
    },

    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: '搜索文档',
            buttonAriaLabel: '搜索文档'
          },
          modal: {
            noResultsText: '无法找到相关结果',
            resetButtonTitle: '清除查询条件',
            footer: {
              selectText: '选择',
              navigateText: '切换'
            }
          }
        }
      }
    }
  }
})
