import path from 'path';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import EslintPlugin from 'eslint-webpack-plugin';
import { initFields, ProjectConfigType } from '../utils/tools';
import os from 'os';
import chalk from 'chalk';
import ProgressBarPlugin from 'progress-bar-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';

const coreNum = os.cpus().length;

export default function({ projectPath, entryPath, env, cliConfig }: ProjectConfigType) {
  //开发者的自定义配置
  const custCommonConfig = cliConfig.common || {};
  //处理alias 自定义配置
  const getCustAliasConfig = () => {
    const { alias } = custCommonConfig;
    const custConfig = {};
    if (alias) {
      Object.keys(alias).forEach(key => {
        custConfig[key] = path.resolve(projectPath, `./${alias[key]}`);
      });
    }
    return custConfig;
  };
  return {
    //入口文件路径，必须为js
    entry: entryPath,
    //打包后文件路径
    output: {
      path: path.resolve(projectPath, './dist'),
      filename: 'js/[name].[chunkhash].js',
      // 静态文件打包后的路径及文件名（默认是走全局的，如果有独立的设置就按照自己独立的设置来。）
      assetModuleFilename: 'assets/[name]_[chunkhash][ext]',
      publicPath: custCommonConfig.publicPath || initFields.publicPath
    },
    target: ['web', 'es5'], //webpack5默认生成es6，设置编译打包生成es5代码
    cache: {
      type: 'filesystem' // 使用文件缓存
    },
    module: {
      rules: [
        {
          test: /\.(tsx|ts)$/,
          exclude: /node_modules/,
          use: [
            'thread-loader', //多进程打包，建议只用于耗时较长的loader前面
            {
              loader: 'babel-loader?cacheDirectory',
              options: {
                'presets': [
                  '@babel/preset-env',
                  //react17以后不需要再引入react
                  ['@babel/preset-react', { 'runtime': 'automatic' }]
                ],
                plugins: [
                  '@babel/plugin-transform-runtime',
                  '@babel/plugin-proposal-class-properties'
                ]
              }
            },
            {
              loader: 'ts-loader',
              options: {
                //配置了thread-loader必须加这个选项,否则报错
                //开启此选项会默认忽略ts类型检查校验且编译时不报类型错误，需配合fork-ts-checker-webpack-plugin使用
                happyPackMode: true
              }
            }
          ]
        },

        {
          oneOf: [
            {
              test: /\.module\.css$/,
              use: [
                // env === 'prod' ? MiniCssExtractPlugin.loader : 'style-loader',
                MiniCssExtractPlugin.loader,
                {
                  loader: 'css-loader',
                  options: {
                    modules: {
                      localIdentName: 'moduleStyle_[local]_[contenthash:8]'
                    }
                  }
                },
                {
                  loader: 'postcss-loader',
                  options: {
                    postcssOptions: {
                      plugins: [['autoprefixer']]
                    }
                  }
                }
              ]
            },
            {
              test: /\.css$/,
              use: [
                // env === 'prod' ? MiniCssExtractPlugin.loader : 'style-loader',
                MiniCssExtractPlugin.loader,
                'css-loader',
                {
                  loader: 'postcss-loader',
                  options: {
                    postcssOptions: {
                      plugins: [['autoprefixer']]
                    }
                  }
                }
              ]
            },
            {
              test: /\.module\.less$/,

              use: [
                // env === 'prod' ? MiniCssExtractPlugin.loader : 'style-loader',
                MiniCssExtractPlugin.loader,
                {
                  loader: 'css-loader',
                  options: {
                    modules: {
                      localIdentName: 'moduleStyle_[local]_[contenthash:8]'
                    }
                  }
                },

                {
                  loader: 'postcss-loader',
                  options: {
                    postcssOptions: {
                      plugins: [['autoprefixer']]
                    }
                  }
                },
                'less-loader'
              ]
            },
            {
              test: /\.less$/,
              use: [
                // env === 'prod' ? MiniCssExtractPlugin.loader : 'style-loader',
                MiniCssExtractPlugin.loader,
                'css-loader',
                {
                  loader: 'postcss-loader',
                  options: {
                    postcssOptions: {
                      plugins: [['autoprefixer']]
                    }
                  }
                },
                'less-loader'
              ]
            },
            {
              test: /\.(jpg|png|gif|webp|bmp|jpeg)$/,
              type: 'asset', //在导出一个 data URI 和发送一个单独的文件之间自动选择
              generator: {
                filename: 'images/[name]_[hash][ext]' // 独立的配置
              }
            },
            // 字体文件
            {
              test: /\.(otf|eot|woff2?|ttf|svg)$/i,
              type: 'asset',
              generator: {
                filename: 'fonts/[name]_[hash][ext]'
              }
            },
            // 数据文件
            {
              test: /\.(txt|xml)$/i,
              type: 'asset/source'
            },
            {
              test: /\.html$/,
              loader: 'html-loader'
            }
          ]
        }
      ]
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
      alias: {
        '@': path.resolve(projectPath, './src'),
        ...getCustAliasConfig()
      }
    },
    plugins: [
      new ForkTsCheckerWebpackPlugin({
        typescript: {
          diagnosticOptions: {
            semantic: true,
            syntactic: true
          }
        }
      }),
      new MiniCssExtractPlugin({
        filename: env === 'dev' ? 'css/[name].css' : 'css/[name].[contenthash].css',
        ignoreOrder: true
      }),
      new EslintPlugin({
        // exclude: path.resolve(__dirname, '../src/components/'),
        context: path.resolve(projectPath, './src'),
        // 开启缓存
        cache: true,
        // 指定缓存目录
        // cacheLocation: path.resolve(__dirname, '../node_modules/.cache/eslintCache'),
        // 开启多进程和进程数量
        threads: coreNum
      }),
      // 进度条
      new ProgressBarPlugin({
        width: 50, 					 // 默认20，进度格子数量即每个代表进度数，如果是20，那么一格就是5。
        format: chalk.blue.bold('building') + chalk.yellow('[:bar] ') + chalk.green.bold(':percent') + ' (:elapsed秒)',
        stream: process.stderr,        // 默认stderr，输出流
        complete: '#',                 // 默认“=”，完成字符
        clear: false,                  // 默认true，完成时清除栏的选项
        renderThrottle: ''            // 默认16，更新之间的最短时间（以毫秒为单位）
        // callback() {                   // 进度条完成时调用的可选函数
        //   console.log(chalk.blue.bold('完成'));
        // }

      }),
      ...(custCommonConfig.plugins || initFields.plugins)
    ]
  };
}
