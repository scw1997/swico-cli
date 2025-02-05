//swico 公共自定义配置

import { defineConfig } from 'swico'

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
      },
      //示例页
      {
        path: '/example',
        name: 'example',
        component: 'example',
        children: [
          {
            path: 'child', // 通过/example/child访问
            name: 'example-child',
            component: 'example/child'
          }
        ]
      },
      {
        path: '*',
        name: '404',
        component: '404'
      }
    ]
  }
});
