//swico 公共自定义配置

import { defineConfig } from 'swico/vue';

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
