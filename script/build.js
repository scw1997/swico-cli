const webpack = require('webpack');
const getBuildConfig = require('../config/webpack.build.js');
const {getProjectConfig} = require('../utils/tools');
const projectConfig = getProjectConfig();
const chalk = require('chalk');

//支持直接引入ts或es6模块
require('ts-node/register');

// 执行start本地启动
module.exports = function () {
	const {entryPath, templatePath, projectPath, cliConfig} = projectConfig;
	const buildConfig = getBuildConfig({entryPath, templatePath, projectPath, cliConfig});
	const compiler = webpack(buildConfig);

	compiler.run((err, stats) => { // [Stats Object](#stats-object)
		if (err) {
			console.log(`- ${chalk.red.bold(err.stack||err)} \n`);
			if (err.details) {

				console.log(`- ${chalk.red.bold(err.details.toString())} \n`);
			}

			return;
		}
		const info = stats.toJson();

		if (stats.hasErrors()) {

			console.log(`- ${chalk.bold('There are some errors：')} \n`);

			info.errors.forEach(item=>{
				console.log(`- ${chalk.red.bold(item.message)} \n`);
			});

			return;
		}

		if (stats.hasWarnings()) {
			console.log(`- ${chalk.bold('There are some warnings：')} \n`);

			info.warnings.forEach(item=>{
				console.log(`- ${chalk.yellow.bold(item.message)} \n`);
			});

		}


		compiler.close((closeErr) => {
			if (closeErr) {
				console.log(`- ${chalk.bold('There are some errors：')} \n`);

				console.log(`- ${chalk.red.bold(closeErr.toString())} \n`);

			}

		});
	});


};