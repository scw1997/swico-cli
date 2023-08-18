import getCommonConfig from './webpack.common';
import { getPort, initFields, ProjectConfigType } from '../utils/tools';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';
import webpack from 'webpack';

export default async function(options: ProjectConfigType, open?: boolean) {
  const { projectPath, cliConfig, templatePath } = options;
  const commonConfig = getCommonConfig(options);
  //获取可用端口
  const port = await getPort();
  //获取开发者自定义添加的脚手架的plugin配置
  const custDevCfg = cliConfig.dev || {};
  const custCommonCfg = cliConfig.common || {};
  //获取自定义变量
  const defineVars = { ...(custCommonCfg.define ?? {}), ...(custDevCfg.define ?? {}) };
  //basic plugins
  const basicPlugins: any[] = [
    new HtmlWebpackPlugin({
      //不使用默认html文件，使用自己定义的html模板并自动引入打包后的js/css
      template: templatePath,
      filename: 'index.html', //打包后的文件名
      minify: {
        //压缩和简化代码
        collapseWhitespace: true, //去掉空行和空格
        removeAttributeQuotes: true //去掉html标签属性的引号
      },
      templateParameters: {
        publicPath:
          custDevCfg.publicPath ?? custCommonCfg.publicPath ?? initFields.publicPath
      },
      title: custDevCfg.title ?? custCommonCfg.title ?? initFields.title,
      hash: true //对html引用的js文件添加hash戳
    })
  ];
  //处理自定义变量设置
  if (Object.keys(defineVars).length !== 0) {
    basicPlugins.push(
      new webpack.DefinePlugin({
        ...defineVars
      })
    );
  }

  return {
    ...commonConfig,
    //打包后文件路径
    output: {
      ...commonConfig.output,
      publicPath: custDevCfg.publicPath ?? custCommonCfg.publicPath ?? initFields.publicPath
    },
    mode: 'development',
    devtool: 'eval-cheap-module-source-map', // development
    devServer: {
      //使用HTML5 History API时，index.html可能需要提供页面来代替任何404响应。
      historyApiFallback: true,
      port, //端口
      client: {
        progress: true, //显示进度条
        //警告不会覆盖页面
        overlay: {
          errors: true,
          warnings: false
        }
      },
      proxy: custDevCfg.proxy ?? custCommonCfg.proxy,
      compress: true, //启动gzip压缩
      hot: true, //热更新
      open: true, //自动打开浏览器,
      static: {
        //提供静态文件服务的路径
        directory: path.join(projectPath, './public')
      }
    },
    plugins: [
      ...basicPlugins,
      ...commonConfig.plugins,
      ...(custDevCfg.plugins ?? initFields.plugins)
    ]
  };
}
