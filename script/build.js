const webpack = require('webpack');
const getBuildConfig = require('../config/webpack.build.js');
const {getProjectConfig} = require('../utils/tools');
const projectConfig = getProjectConfig();
const spinner = require('ora')();

//支持直接引入ts或es6模块
require('ts-node/register');

// 执行start本地启动
module.exports = function () {
	const {entryPath, templatePath, projectPath} = projectConfig;
	const buildConfig = getBuildConfig({entryPath, templatePath, projectPath});
	const compiler = webpack(buildConfig);

	spinner.start('Packaging\n');
	compiler.run((err, stats) => { // [Stats Object](#stats-object)
		if (err) {
			console.error((err.stack || err));
			if (err.details) {
				console.error(err.details);
			}

			return;
		}
		const info = stats.toJson();

		if (stats.hasErrors()) {
			console.error(info.errors);

			return;
		}

		if (stats.hasWarnings()) {
			console.error(info.warnings);

			return;
		}


		compiler.close((closeErr) => {
			if (closeErr) {
				console.error(closeErr);

				return;
			}

			spinner.succeed('Packaging complete');

		});
	});


};