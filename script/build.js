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
			spinner.fail((err.stack || err)?.toString());
			if (err.details) {
				spinner.fail(err.details);
			}

			return;
		}
		const info = stats.toJson();

		if (stats.hasErrors()) {
			spinner.fail(info.errors?.toString());

			return;
		}

		if (stats.hasWarnings()) {
			spinner.warn(info.warnings?.toString());

			return;
		}


		compiler.close((closeErr) => {
			if (closeErr) {
				spinner.fail(closeErr?.toString());

				return;
			}

			spinner.succeed('Packaging complete');

		});
	});


};