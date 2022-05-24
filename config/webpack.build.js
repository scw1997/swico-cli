const getCommonConfig = require('./webpack.common.js');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const TerserPlugin = require('terser-webpack-plugin');
const path = require('path');


const { ANALYZE } = process.env;

module.exports = (options)=> {
	const {entryPath} = options;
	const commonConfig = getCommonConfig(options);

	return {
		...commonConfig,
		mode: 'production',
		devtool: 'nosources-source-map', // production
		optimization: {
			//减少 entry chunk 体积，提高性能。
			runtimeChunk: true,
			minimize: true,
			minimizer: [
				//压缩css
				new CssMinimizerPlugin({
					parallel: true, // 启动多线程压缩
					minimizerOptions: {
						preset: ['advanced'], // cssnano https://cssnano.co/docs/optimisations/
					},

				}),
				//webpack5默认压缩js，但是用了css-miniizer，需要手动压缩js
				new TerserPlugin({
					test: /\.js$/,
				}),
			],
			splitChunks: {
				// include all types of chunks
				chunks: 'all',
				// 重复打包问题
				cacheGroups: {
					vendors: { // node_modules里的代码
						test: /[\\/]node_modules[\\/]/,
						chunks: 'all',
						// name: 'vendors', //一定不要定义固定的name
						priority: 10, // 优先级
						enforce: true,
					},
				},
			},


		},
		plugins: [
			...commonConfig.plugins,
			new CleanWebpackPlugin(),
			new CssMinimizerPlugin(),
			new BundleAnalyzerPlugin({

				analyzerMode: ANALYZE === 'true' ? 'server' : 'disabled',
				analyzerHost: '127.0.0.1',
				analyzerPort: 8888, // 运行后的端口号
				reportFilename: 'report.html',
				defaultSizes: 'parsed',
				openAnalyzer: true,
				generateStatsFile: ANALYZE === 'true', //非anlayze模式的打包不生成分析文件
				statsFilename: 'analyze.json',
				statsOptions: null,
				logLevel: 'info',
			}),
		],

	};
};
