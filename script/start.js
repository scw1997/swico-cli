const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const getStartConfig = require('../config/webpack.start.js');
const {getProjectConfig} = require('../utils/tools');
const projectConfig = getProjectConfig();
const spinner = require('ora')();

//支持直接引入ts或es6模块
require('ts-node/register');

// 执行start本地启动
module.exports = async function () {
	const {entryPath, templatePath, projectPath} = projectConfig;
	const startConfig = await getStartConfig({entryPath, templatePath, projectPath});
	const compiler = webpack(startConfig);
	//启动服务
	const devServer = new WebpackDevServer(startConfig.devServer, compiler);

	spinner.start('Starting server...\n');

	devServer.startCallback((err)=>{
		if (err) {
			spinner.fail('出错了', err.toString());
		} else {
			spinner.succeed(`Successfully started server on http://localhost:${startConfig.devServer.port}`);
		}

	});


};