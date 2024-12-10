//swico 公共自定义配置

import { defineConfig } from 'swico';

export default defineConfig('base', {
    template: 'vue',
    router: {
        type: 'browser',
        base: '/',
        routes: [
            {
                path: '/',
                name: 'index',
                component: 'Index'
            },
            //示例页
            {
                path: '/example',
                name: 'example',
                component: 'example/Example',
                children: [
                    {
                        path: 'child', // 通过/example/child访问
                        name: 'example-child',
                        component: 'example/Child'
                    }
                ]
            },
            {
                path: '/:pathMatch(.*)*',
                name: '404',
                component: '404'
            }
        ]
    }
});
