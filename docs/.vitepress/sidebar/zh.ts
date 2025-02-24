import { DefaultTheme } from 'vitepress'
import { commonDirectoryName } from '../utils/constant'

// 中文侧边栏
export const zhSidebar: DefaultTheme.Sidebar = {
  '/': [
    {
      text: 'Windows 系统',
      collapsed: true,
      items: [
        { text: 'Win/Office 下载、安装和激活', link: `/01_win/01_${commonDirectoryName}/` },
        { text: 'Windows 软件包管理', link: `/01_win/02_${commonDirectoryName}/` },
        { text: 'WSL2 的安装和配置', link: `/01_win/03_${commonDirectoryName}/` },
      ]
    },
    {
      text: 'MacOS 系统',
      collapsed: true,
      items: [
      ]
    },
  ],
}