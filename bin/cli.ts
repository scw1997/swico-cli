#! /usr/bin/env node

// #! 符号的名称叫 Shebang，用于指定脚本的解释程序
// Node CLI 应用入口文件必须要有这样的文件头
// 如果是Linux 或者 macOS 系统下还需要修改此文件的读写权限为 755
// 具体就是通过 chmod 755 cli.js 实现修改

import { program } from 'commander';
import figlet from 'figlet';
import chalk from 'chalk';
import createApp from '../script/create';
import start from '../script/start';
import build from '../script/build';
import packageJson from '../package.json';

//创建secywo项目
program
    .command('create <app-name>')
    .description('create a new project ')
    .option('-f, --force', 'if the destination folder already exists, it will be overwritten') // 是否强制创建，当文件夹已经存在
    .action((name, options) => {
        // 在 create.js 中执行创建任务
        createApp(name, options);
    });

//项目启动开发环境服务
program
    .command('start')
    .description('start the development environment service')
    .action(() => {
        start();
    });

//打包构建
program
    .command('build')
    .description('package to build the output product')
    .action(() => {
        build();
    });

//打包构建
program
    .command('analyze')
    .description('visualize size of webpack output files with an interactive zoomable treemap')
    .action(() => {
        build();
    });

program.on('--help', () => {
    // 使用 figlet 绘制 Logo
    console.log(
        '\r\n' +
            figlet.textSync('secywo', {
                font: 'Ghost',
                horizontalLayout: 'default',
                verticalLayout: 'default',
                width: 80,
                whitespaceBreak: true
            })
    );
    // 新增说明信息
    console.log(`\r\nRun ${chalk.cyan('secywo <command> --help')} show details\r\n`);
});

program
    // 配置版本号信息
    .version(`v${packageJson.version}`)
    .usage('<command> [option]');

// 解析用户执行命令传入参数
program.parse();
