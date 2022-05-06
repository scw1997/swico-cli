const getCommonConfig = require('./webpack.common.js');
const {getPort} = require('../utils/tools');
const path = require('path');

module.exports =async(options)=> {
	const {projectPath} = options;
	const commonConfig = getCommonConfig(options);
	const port = await getPort();

	return {
		...commonConfig,
		watchOptions: {
			aggregateTimeout: 600,
			ignored: path.join(projectPath, './node_modules'),
		},
		mode: 'development',
		devtool: 'eval-cheap-module-source-map', // development
		devServer: {
			//使用HTML5 History API时，index.html可能需要提供页面来代替任何404响应。
			historyApiFallback: true,
			port, //端口
			client: {
				progress: true, //显示进度条
				overlay: {
					errors: true,
					warnings: false,
				},
			},
			compress: true, //启动gzip压缩
			hot: true, //热更新
			open: true, //自动打开浏览器,
			static: {
				//提供静态文件服务的路径
				directory: path.join(projectPath, './public'),
			},
		},
		plugins: [
			...commonConfig.plugins,

		],
	};

};

