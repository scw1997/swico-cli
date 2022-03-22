// import path from 'path'
// import webpack from 'webpack'

const path = require('path')
const fs = require('fs-extra')
const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const startConfig = require('../template/config/webpack.dev')
const compiler = webpack(startConfig);

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

    //启动服务
    const devServer = new WebpackDevServer(startConfig.devServer,compiler)

    devServer.startCallback(()=>{
        console.log('本地服务启动了')
    })






}