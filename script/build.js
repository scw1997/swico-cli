//支持直接引入ts或es6模块
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import path, { dirname } from 'path';
import ProgressBarPlugin from 'progress-bar-webpack-plugin';
import chalk from 'chalk';
import { fileURLToPath } from 'url';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
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
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env'],
                            plugins: [
                                '@babel/plugin-transform-runtime',
                                '@babel/plugin-proposal-class-properties'
                            ]
                        }
                    },
                    'ts-loader',
                    'eslint-loader'
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
        new CleanWebpackPlugin(),
        // 进度条
        new ProgressBarPlugin({
            format: `building ${chalk.blue.bold(':bar')} ${chalk.green.bold(
                ':percent'
            )} (:elapsed s)`,
            clear: false
        })
    ],
    //控制输出文件大小的警告提示
    performance: {
        maxAssetSize: 1000000,
        maxEntrypointSize: 1000000
    },
    mode: 'production',
    devtool: 'nosources-source-map', // production
    optimization: {
        //减少 entry chunk 体积，提高性能。
        runtimeChunk: true
    }
};
