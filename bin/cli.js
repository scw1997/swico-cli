#! /usr/bin/env node

// #! 符号的名称叫 Shebang，用于指定脚本的解释程序
// Node CLI 应用入口文件必须要有这样的文件头
// 如果是Linux 或者 macOS 系统下还需要修改此文件的读写权限为 755
// 具体就是通过 chmod 755 cli.js 实现修改


const program = require('commander')
const figlet = require('figlet')
const chalk = require('chalk')
const createApp = require('../lib/create')


program
    .command('create <app-name>')
    .description('create a new project')
    .option('-f, --force', 'overwrite target directory if it exist') // 是否强制创建，当文件夹已经存在
    .action((name, options) => {
        // 在 create.js 中执行创建任务
        createApp(name, options)
    })


program
    .command('config [value]')
    .description('inspect and modify the config')
    .option('-g, --get <path>', 'get value from option')
    .option('-s, --set <path> <value>')
    .option('-d, --delete <path>', 'delete option from config')
    .action((value, options) => {
        console.log(value, options)
    })

// // 配置 ui 命令
// program
//     .command('ui')
//     .description('start add open roc-cli ui')
//     .option('-p, --port <port>', 'Port used for the UI Server')
//     .action((option) => {
//         console.log(option)
//     })


program
    .on('--help', () => {
        // 使用 figlet 绘制 Logo
        console.log('\r\n' + figlet.textSync('treo', {
            font: 'Ghost',
            horizontalLayout: 'default',
            verticalLayout: 'default',
            width: 80,
            whitespaceBreak: true
        }));
        // 新增说明信息
        console.log(`\r\nRun ${chalk.cyan(`ts-react-cli <command> --help`)} show details\r\n`)
    })



program
// 配置版本号信息
    .version(`v${require('../package.json').version}`)
    .usage('<command> [option]')

// 解析用户执行命令传入参数
program.parse(process.argv);





