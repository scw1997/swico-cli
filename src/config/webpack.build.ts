import getCommonConfig from './webpack.common';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import BundleAnalyzer from 'webpack-bundle-analyzer';
import TerserPlugin from 'terser-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';
import fs from 'fs';
import { initFields, ProjectConfigType } from '../utils/tools';
import webpack from 'webpack';
const BundleAnalyzerPlugin = BundleAnalyzer.BundleAnalyzerPlugin;
const { ANALYZE } = process.env;

export default function (options: ProjectConfigType) {
    const { projectPath, cliConfig, templatePath } = options;

    //获取开发者自定义添加的脚手架的plugin配置
    const custPrdCfg = cliConfig.prd || {};
    const custCommonCfg = cliConfig.common || {};
    //获取自定义变量
    const defineVars = { ...(custCommonCfg.define ?? {}), ...(custPrdCfg.define ?? {}) };
    const commonConfig = getCommonConfig(options);
    const basicPlugins = [
        ...commonConfig.plugins.slice(1), //去掉htmlWebpackPlugin配置
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
            logLevel: 'info'
        }),
        new HtmlWebpackPlugin({
            //不使用默认html文件，使用自己定义的html模板并自动引入打包后的js/css
            template: templatePath,
            filename: 'index.html', //打包后的文件名
            minify: {
                //压缩和简化代码
                collapseWhitespace: true, //去掉空行和空格
                removeAttributeQuotes: true //去掉html标签属性的引号
            },
            title: custPrdCfg.title ?? custCommonCfg.title ?? initFields.title,
            templateParameters: {
                routerBase:
                    custPrdCfg.publicPath ?? custCommonCfg.publicPath ?? initFields.publicPath
            },
            hash: true //对html引用的js文件添加hash戳
        })
    ];

    //自定义变量注入配置
    if (Object.keys(defineVars).length !== 0) {
        basicPlugins.push(
            new webpack.DefinePlugin({
                ...defineVars
            })
        );
    }

    //处理public文件夹（静态资源）
    const copyPath = path.resolve(projectPath, './public');
    const isCopyPathExist = fs.existsSync(copyPath);

    if (isCopyPathExist) {
        //项目存在该路径则打包时复制文件，否则不操作
        basicPlugins.push(
            new CopyPlugin({
                patterns: [path.resolve(projectPath, './public')]
            })
        );
    }

    return {
        ...commonConfig,
        //打包后文件路径
        output: {
            ...commonConfig.output,
            publicPath: custPrdCfg.publicPath ?? custCommonCfg.publicPath ?? initFields.publicPath
        },
        //控制输出文件大小的警告提示
        performance: {
            maxAssetSize: 1000000,
            maxEntrypointSize: 1000000
        },
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
                        preset: 'advanced' // cssnano https://cssnano.co/docs/optimisations/
                    }
                }),
                //webpack5默认压缩js，但是用了css-miniizer，需要手动压缩js
                new TerserPlugin({
                    test: /\.js$/,
                    terserOptions: {
                        compress: {
                            // eslint-disable-next-line camelcase
                            drop_console:
                                custPrdCfg.console === undefined ? initFields.console : !console, //删除console
                            // eslint-disable-next-line camelcase
                            drop_debugger: true // 删除deubgger语句
                        },

                        output: {
                            comments: false // 删除注释
                        }
                    }
                })
            ],
            splitChunks: {
                // include all types of chunks
                chunks: 'all',
                // 重复打包问题
                cacheGroups: {
                    vendors: {
                        // node_modules里的代码
                        test: /[\\/]node_modules[\\/]/,
                        chunks: 'all',
                        // name: 'vendors', //一定不要定义固定的name
                        priority: 10, // 优先级
                        enforce: true
                    }
                }
            }
        },
        plugins: [...basicPlugins, ...(custPrdCfg.plugins ?? [])]
    };
}
