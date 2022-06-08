const getCommonConfig = require('./webpack.common.js');
const {getPort} = require('../utils/tools');
const path = require('path');

module.exports =async(options)=> {
	const {projectPath} = options;
	const commonConfig = getCommonConfig(options);
	const port = await getPort();

	return {
		...commonConfig,
		watch: true,
		watchOptions: {
			aggregateTimeout: 600,
			ignored: path.resolve(projectPath, './node_modules'),
			poll: 1000, // 每秒检查一次变动
		},
		mode: 'development',
		devtool: 'eval-cheap-module-source-map', // development
		devServer: {
			//使用HTML5 History API时，index.html可能需要提供页面来代替任何404响应。
			historyApiFallback: true,
			port, //端口
			client: {
				progress: true, //显示进度条
				//警告不会显示页面
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

