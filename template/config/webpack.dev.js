const commonConfig = require('./webpack.common');
const path = require('path');

module.exports = {
	...commonConfig,
	devServer: {
		port:3001,//端口
		client: {
			progress: true,//显示进度条
		},
		compress:true,//启动gzip压缩
		hot:true,//热更新
		open:true,//自动打开浏览器
		static: {
			directory: path.join(__dirname, 'public'),//静态文件地址（默认必须有index.html文件）
		},
	}
};

