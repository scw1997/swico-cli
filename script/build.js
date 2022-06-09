//支持直接引入ts或es6模块
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import path, { dirname } from 'path';
import ProgressBarPlugin from 'progress-bar-webpack-plugin';
import chalk from 'chalk';
import { fileURLToPath } from 'url';
import('ts-node/register');
const __dirname = dirname(fileURLToPath(import.meta.url));

// 执行start本地启动
export default {
    //入口文件路径，必须为js
    entry: path.resolve(__dirname, '../cli/bin/main.ts'),
    //打包后文件路径
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: 'js/[chunkhash].[name].js'
    },
    target: ['web', 'es5'], //webpack5默认生成es6，设置编译打包生成es5代码
    // cache: {
    //     type: 'filesystem' // 使用文件缓存
    // },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: [
                    // {
                    //     loader: 'babel-loader',
                    //     options: {
                    //         presets: ['@babel/preset-env'],
                    //         plugins: [
                    //             '@babel/plugin-transform-runtime',
                    //             '@babel/plugin-proposal-class-properties'
                    //         ]
                    //     }
                    // },
                    'ts-loader'
                    // 'eslint-loader'
                ]
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js'],
        alias: {
            cli: path.resolve(__dirname, '../cli')
        }
    },
    plugins: [
        // 进度条
        new ProgressBarPlugin({
            format: `building ${chalk.blue.bold(':bar')} ${chalk.green.bold(
                ':percent'
            )} (:elapsed s)`,
            clear: false
        })
    ],
    // //控制输出文件大小的警告提示
    // performance: {
    //     maxAssetSize: 1000000,
    //     maxEntrypointSize: 1000000
    // },
    mode: 'production',
    devtool: 'nosources-source-map' // production
    // optimization: {
    //     //减少 entry chunk 体积，提高性能。
    //     runtimeChunk: true
    //     // minimize: true,
    //     // minimizer: [
    //     //     //压缩css
    //     //     new CssMinimizerPlugin({
    //     //         parallel: true, // 启动多线程压缩
    //     //         minimizerOptions: {
    //     //             preset: 'advanced' // cssnano https://cssnano.co/docs/optimisations/
    //     //         }
    //     //     }),
    //     //     //webpack5默认压缩js，但是用了css-miniizer，需要手动压缩js
    //     //     new TerserPlugin({
    //     //         test: /\.js$/,
    //     //         terserOptions: {
    //     //             compress: {
    //     //                 // eslint-disable-next-line camelcase
    //     //                 drop_console: true, //删除console
    //     //                 // eslint-disable-next-line camelcase
    //     //                 drop_debugger: true // 删除deubgger语句
    //     //             },
    //     //
    //     //             output: {
    //     //                 comments: false // 删除注释
    //     //             }
    //     //         }
    //     //     })
    //     // ],
    //     // splitChunks: {
    //     //     // include all types of chunks
    //     //     chunks: 'all',
    //     //     // 重复打包问题
    //     //     cacheGroups: {
    //     //         vendors: {
    //     //             // node_modules里的代码
    //     //             test: /[\\/]node_modules[\\/]/,
    //     //             chunks: 'all',
    //     //             // name: 'vendors', //一定不要定义固定的name
    //     //             priority: 10, // 优先级
    //     //             enforce: true
    //     //         }
    //     //     }
    //     // }
    // }
};
