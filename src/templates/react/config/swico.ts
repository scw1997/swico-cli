//swico 公共自定义配置

import { defineConfig } from 'swico/react';

export default defineConfig('base', {
    template: 'react',
    router: {
        type: 'browser',
        base: '/',
        routes: [
            {
                path: '/',
                name: 'index',
                component: 'index'
            }
        ]
    }
});
