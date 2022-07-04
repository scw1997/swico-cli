#! /usr/bin/env node

import { program } from 'commander';
import figlet from 'figlet';
import chalk from 'chalk';
import handleInitApp from '../command/init';
import handleStartDevServer from '../command/start';
import handleBuild from '../command/build';
import packageJson from '../../package.json';

// //初始化secywo项目
program
    .command('init')
    .description('init a new secywo project ')
    .action((name, options) => {
        // 在 create.js 中执行创建任务
        handleInitApp(name, options);
    });

//项目启动开发环境服务
program
    .command('start')
    .description('start the development environment service')
    .action(() => {
        handleStartDevServer();
    });

//打包构建
program
    .command('build')
    .description('package to build the output product')
    .action(() => {
        handleBuild();
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
program.parse(process.argv);
