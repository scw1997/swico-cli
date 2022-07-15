#! /usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var commander_1 = require("commander");
var figlet_1 = __importDefault(require("figlet"));
var chalk_1 = __importDefault(require("chalk"));
var init_1 = __importDefault(require("../command/init"));
var start_1 = __importDefault(require("../command/start"));
var build_1 = __importDefault(require("../command/build"));
var package_json_1 = __importDefault(require("../../package.json"));
// //初始化secywo项目
commander_1.program
    .command('init')
    .description('init a new secywo project ')
    .action(function (name, options) {
    // 在 create.js 中执行创建任务
    (0, init_1.default)(name, options);
});
//项目启动开发环境服务
commander_1.program
    .command('start')
    .description('start the development environment service')
    .action(function () {
    (0, start_1.default)();
});
//打包构建
commander_1.program
    .command('build')
    .description('package to build the output product')
    .action(function () {
    (0, build_1.default)();
});
commander_1.program.on('--help', function () {
    // 使用 figlet 绘制 Logo
    console.log('\r\n' +
        figlet_1.default.textSync('secywo', {
            font: 'Ghost',
            horizontalLayout: 'default',
            verticalLayout: 'default',
            width: 80,
            whitespaceBreak: true
        }));
    // 新增说明信息
    console.log("\r\nRun " + chalk_1.default.cyan('secywo <command> --help') + " show details\r\n");
});
commander_1.program
    // 配置版本号信息
    .version("v" + package_json_1.default.version)
    .usage('<command> [option]');
// 解析用户执行命令传入参数
commander_1.program.parse(process.argv);
