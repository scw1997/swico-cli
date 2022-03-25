const getCommonConfig = require('./webpack.common.js');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const { ANALYZE } = process.env;

module.exports = (options)=> {
	const commonConfig = getCommonConfig(options);

	return {
		...commonConfig,
		mode: 'production',
		devtool: 'nosources-source-map', // production
		optimization: {
			minimizer: [
				//压缩css
				new CssMinimizerPlugin({
					parallel: true, // 启动多线程压缩
					minimizerOptions: {
						preset: ['advanced'], // cssnano https://cssnano.co/docs/optimisations/
					},

				}),
			],
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
				generateStatsFile: true,
				statsFilename: 'analyze.json',
				statsOptions: null,
				logLevel: 'info',
			}),
		],
	};
};
