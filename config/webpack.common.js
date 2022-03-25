const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
const miniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports=({projectPath,entryPath,templatePath,})=>({

	//入口文件路径，必须为js
	entry: entryPath,
	//打包后文件路径
	output: {
		path:path.resolve(projectPath,'./dist'),
		filename: '[chunkhash].[name].js',
		// 静态文件打包后的路径及文件名（默认是走全局的，如果有独立的设置就按照自己独立的设置来。）
		assetModuleFilename: 'assets/[name]_[chunkhash][ext]'
	},
	module: {
		rules: [
			{
				test: /\.(tsx|ts)$/,
				exclude: /node_modules/,
				use: [{
					loader: 'babel-loader', options: {
						presets: [
							'@babel/preset-react',
							'@babel/preset-env'
						],
						plugins: [
							'@babel/plugin-transform-runtime',
							'@babel/plugin-proposal-class-properties'
						]
					}}, 'ts-loader','eslint-loader']
			},

			{
				oneOf: [
					{
						test:/\.module\.css$/,
						use:[
							'style-loader',
							{
								loader:'css-loader',
								options: {
									modules: {
										localIdentName:'moduleStyle_[contenthash:8]'
									},

								}
							},
							{
								loader: 'postcss-loader',
								options: {
									postcssOptions: {
										plugins: [
											[
												'autoprefixer',
											],
										],
									},
								},
							},

						]},
					{
						test:/\.css$/,
						use:[
							miniCssExtractPlugin.loader,
							'css-loader',
							{
								loader: 'postcss-loader',
								options: {
									postcssOptions: {
										plugins: [
											[
												'autoprefixer',
											],
										],
									},
								},
							},

						]
					},
					{
						test:/\.module\.less$/,

						use:[
							'style-loader',
							{
								loader: 'css-loader',
								options: {
									modules: {
										localIdentName:'moduleStyle_[contenthash:8]'
									},
								},
							},
							'less-loader',
							{
								loader: 'postcss-loader',
								options: {
									postcssOptions: {
										plugins: [
											[
												'autoprefixer',
											],
										],
									},
								},
							},
						]
					},
					{
						test:/\.less$/,
						use:[
							miniCssExtractPlugin.loader,
							'css-loader',
							'less-loader',
							{
								loader: 'postcss-loader',
								options: {
									postcssOptions: {
										plugins: [
											[
												'autoprefixer',
											],
										],
									},
								},
							},
						]
					},
					{
						test: /\.(jpg|png|gif|webp|bmp|jpeg)$/,
						type: 'asset', //在导出一个 data URI 和发送一个单独的文件之间自动选择
						generator: {
							filename: 'images/[name]_[hash][ext]', // 独立的配置
						},
					},
					// 字体文件
					{
						test: /\.(otf|eot|woff2?|ttf|svg)$/i,
						type: 'asset',
						generator: {
							filename: 'fonts/[name]_[hash][ext]',
						},
					},
					// 数据文件
					{
						test: /\.(txt|xml)$/i,
						type: 'asset/source',
					},
					{
						test: /\.html$/,
						loader: 'html-loader'
					},
				]

			},

		]
	},
	resolve: {
		extensions: ['.ts', '.tsx', '.js', '.jsx'],
		alias:{
			'@':path.resolve(projectPath,'./src')
		}
	},
	plugins: [
		new htmlWebpackPlugin({
			//不使用默认html文件，使用自己定义的html模板并自动引入打包后的js/css
			template: templatePath,
			filename: 'index.html', //打包后的文件名
			minify: { //压缩和简化代码
				collapseWhitespace:true, //去掉空行和空格
				removeAttributeQuotes:true //去掉html标签属性的引号
			},
			hash: true //对html引用的js文件添加hash戳
		}),


		new miniCssExtractPlugin({
			filename: '[contenthash].[name].css'
		})


	]
});