import getCommonConfig from './webpack.common';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import BundleAnalyzer from 'webpack-bundle-analyzer';
import TerserPlugin from 'terser-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import path from 'path';
import fs from 'fs';
import { ProjectConfigType } from '../utils/tools';
const { BundleAnalyzerPlugin } = BundleAnalyzer.BundleAnalyzerPlugin;
const { ANALYZE } = process.env;

const getBuildConfig = (options: ProjectConfigType) => {
    const { projectPath, cliConfig } = options;

    //获取开发者自定义添加的脚手架的plugin配置
    const { plugins: extralPlugins = [] } = cliConfig.prd || {};

    const commonConfig = getCommonConfig(options);
    const plugins = [
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
            logLevel: 'info'
        }),
        ...extralPlugins
    ];

    //处理public文件夹（静态资源）
    const copyPath = path.resolve(projectPath, './public');
    const isCopyPathExist = fs.existsSync(copyPath);

    if (isCopyPathExist) {
        //项目存在该路径则打包时复制文件，否则不操作
        plugins.push(
            new CopyPlugin({
                patterns: [path.resolve(projectPath, './public')]
            })
        );
    }

    return {
        ...commonConfig,
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
                            drop_console: true, //删除console
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
        plugins
    };
};

export default getBuildConfig;
