const commonConfig = require('./webpack.common');
const cssMinimizerPlugin = require("css-minimizer-webpack-plugin")
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {

	...commonConfig,

	optimization: {
		minimizer: [
			//压缩css
			new cssMinimizerPlugin({
				parallel: true,   // 启动多线程压缩
				minimizerOptions: {
					preset: ["advanced"],  // cssnano https://cssnano.co/docs/optimisations/
				}

			}),
		],
	},
	plugins: [
		...commonConfig.plugins,
		new CleanWebpackPlugin(),
		new cssMinimizerPlugin()
	]

};