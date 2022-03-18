const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
const miniCssExtractPlugin = require('mini-css-extract-plugin');


module.exports={

	//入口文件路径，必须为js
	entry: path.join(__dirname,'../src/index.tsx'),
	//打包后文件路径
	output: {
		path:path.join(__dirname,'../build'),
		filename: '[chunkhash].[name].js'
	},
	module: {
		rules: [
			{
				test: /\.(tsx|ts)$/,
				exclude: /node_modules/,
				use: ['babel-loader','ts-loader','eslint-loader']
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
						test: /\.(jpg|png|gif)$/,
						loader: 'url-loader',
						options: {
							//小于8k则处理成base64，否则处理成文件形式
							limit:8*1024,
							//配置输出名称规则
							//ext源文件扩展名，hash哈希随机值，name源文件基本名
							name:'[hash:10].[name].[ext]',
							//outputPath可以设置该loader打包后相对于output中的path属性值的输出路径(例如output中的path值为build，则这里的图片资源打包输出路径为build/imgs)
							outputPath:'imgs'
						}
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
			'@':path.resolve(__dirname,'../src')
		}
	},
	plugins: [
		new htmlWebpackPlugin({
			//不使用默认html文件，使用自己定义的html模板并自动引入打包后的js/css
			template: path.resolve(__dirname,'../src/template/index.html'),
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
};