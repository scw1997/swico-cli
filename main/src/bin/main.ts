#! /usr/bin/env node

import { program } from 'commander';

import chalk from 'chalk';
import handleStartDevServer from '../command/start';
import handleBuild from '../command/build';

//支持直接引入ts或es6模块
import('ts-node/register');

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
