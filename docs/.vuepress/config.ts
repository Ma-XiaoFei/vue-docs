import { defineConfig } from 'vuepress/config'

export default defineConfig({
    title: 'Vue 学习与实践',
    description: 'vue项目实践',
    themeConfig: {
        nav: [
            { "link": '/guide/', text: '指南' },
            { "link": '/difference/', text: 'v2与v3区别' },
            { "link": '/reactivity/', text: 'Vue3响应式原理' }
        ],
        // sidebar: 'auto',
        sidebarDepth: 2,
        activeHeaderLinks: true,
        smoothScroll: true,
        sidebar: {
            "/guide/": [
                {
                    title: '指南',
                    sidebarDepth: 2,
                    collapsable: false,
                    children: [
                        ['/guide/', '介绍'],
                        ['/guide/start', 'Vue项目搭建'],
                        ['/guide/vue3', 'Vue3'],
                    ]
                }
            ],
            "/reactivity": [
                {
                    title: 'Vue3响应式原理',
                    path: '/reactivity/',
                    sidebarDepth: 2,
                    collapsable: false,
                }
            ]
        }
    },
})
