module.exports = {
    // 继承的规则
    extends: ['@commitlint/config-conventional'],
    // 定义规则类型
    rules: {
        // type 类型定义，表示 git 提交的 type 必须在以下类型范围内
        'type-enum': [
            2,
            'always',
            [
                'add', // 新功能 feature
                'fix', // 修复 bug
                'docs', // 文档注释
                'config', // 架构配置修改
                'perf', // 性能优化
                'test', // 增加测试
                'revert', // 回退
                'others' // 其他
            ]
        ],
        // subject 大小写不做校验
        'subject-case': [0]
    }
};
