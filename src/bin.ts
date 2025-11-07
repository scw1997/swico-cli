#! /usr/bin/env node

// //初始化swico项目
import { program } from 'commander';
import handleInitApp from './command/create';
import packageJson from '../package.json';
import chalk from 'chalk';
import { logoText } from './utils/tools';

program
    .command('create <project-name>')
    .description('create a new project with the built-in template')
    .option('-f, --force', 'If the destination folder already exists, it will be overwritten') // 是否强制创建，当文件夹已经存在
    .action((name, options) => {
        // 拉取内置模板创建项目
        handleInitApp(name, options);
    });

program.on('--help', () => {
    // 使用 figlet 绘制 Logo
    console.log(logoText);

    // 新增说明信息
    console.log(`\r\nRun ${chalk.cyan('swico <command> --help')} show details\r\n`);
});

program
    .option('-v, -V', 'display the CLI version') // 是否强制创建，当文件夹已经存在
    .action(() => {
        // 拉取内置模板创建项目
        console.log(`v${packageJson.version}`);
    });

// 解析用户执行命令传入参数
program.parse(process.argv);
