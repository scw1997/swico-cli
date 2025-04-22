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
            }
        ]
    }
});
