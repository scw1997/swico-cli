const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const getStartConfig = require('../config/webpack.start.js');
const {getProjectConfig} = require('../utils/tools');
const projectConfig = getProjectConfig();



//支持直接引入ts或es6模块
require('ts-node/register');

// 执行start本地启动
module.exports = async function () {
	const {entryPath,templatePath,projectPath} = projectConfig;
	const startConfig = getStartConfig({entryPath,templatePath,projectPath});
	const compiler = webpack(startConfig);

	//启动服务
	const devServer = new WebpackDevServer(startConfig.devServer,compiler);

	devServer.startCallback(()=>{
		console.log('本地服务启动了');
	});






};