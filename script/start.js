// import path from 'path'
// import webpack from 'webpack'

const path = require('path')
const fs = require('fs-extra')
const webpack = require('webpack')
//支持直接引入ts或es6模块
require("ts-node/register");

// 执行start本地启动
module.exports = async function () {


    // 当前命令行选择的目录(即项目根路径)
    const cwd  = process.cwd();
    //treo 配置目录
    const configDir = path.resolve(cwd, './config')
    // 路由文件
    const routesPath  = path.resolve(configDir,'./route.ts')
    // start对应的dev配置文件
    const configPath  = path.resolve(configDir,'./config.dev.ts')

    const {default:routeData} = require(routesPath)

    console.log('routeData',routeData.name)

    // webpack({
    //     mode:'production',
    //     entry: routesPath,
    //     //打包后文件路径
    //     output: {
    //         path:path.resolve(__dirname,'./build'),
    //         filename: 'route.js'
    //     },
    //     module: {
    //         // rules: [
    //         //     {
    //         //         test: /\.(tsx|ts)$/,
    //         //         exclude: /node_modules/,
    //         //         use: ['ts-loader',]
    //         //     },
    //         //
    //         // ]
    //     },
    //
    // },(err,stats)=>{
    //    //  const routePath = path.resolve(__dirname,'./build/route.js')
    //    // const xx = require(routePath)
    //    //  console.log('xxx',xx)
    //
    //     if (err) {
    //         console.error(err.stack || err);
    //         if (err.details) {
    //             console.error(err.details);
    //         }
    //         return;
    //     }
    //
    //     const info = stats.toJson();
    //
    //     if (stats.hasErrors()) {
    //         console.error(info.errors);
    //     }
    //
    //     if (stats.hasWarnings()) {
    //         console.warn(info.warnings);
    //     }
    //
    //
    // })





}