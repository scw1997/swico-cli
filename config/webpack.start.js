const getCommonConfig = require('./webpack.common.js');

module.exports =(options)=> {
	const commonConfig = getCommonConfig(options);

	return {
		...commonConfig,
		mode: 'development',
		devtool: 'eval-cheap-module-source-map', // development
		devServer: {
			port:3000,//端口
			client: {
				progress: true,//显示进度条
			},
			compress:true,//启动gzip压缩
			hot:true,//热更新
			open:true,//自动打开浏览器
		},
		plugins: [
			...commonConfig.plugins,

		]
	};

};

