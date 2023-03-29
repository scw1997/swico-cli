import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import chalk from 'chalk';
import EslintPlugin from 'eslint-webpack-plugin';
import ProgressBarPlugin from 'progress-bar-webpack-plugin';
import { initFields, ProjectConfigType } from '../utils/tools';
import os from 'os';

const coreNum = os.cpus().length;

export default function({ projectPath, entryPath, templatePath, cliConfig }: ProjectConfigType) {
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
      filename: 'js/[chunkhash].[name].js',
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
            {
              loader: 'babel-loader?cacheDirectory',
              options: {
                presets: ['@babel/preset-react', '@babel/preset-env'],
                plugins: [
                  '@babel/plugin-transform-runtime',
                  '@babel/plugin-proposal-class-properties'
                ]
              }
            },
            'ts-loader'
          ]
        },

        {
          oneOf: [
            {
              test: /\.module\.css$/,
              use: [
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
          publicPath: custCommonConfig.publicPath || initFields.publicPath
        },
        title: custCommonConfig.title || initFields.title,
        hash: true //对html引用的js文件添加hash戳
      }),

      new MiniCssExtractPlugin({
        filename: 'css/[contenthash].[name].css',
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
        format: `building ${chalk.blue.bold(':bar')} ${chalk.green.bold(
          ':percent'
        )} (:elapsed s)`,
        clear: false
      }),

      ...(custCommonConfig.plugins || initFields.plugins)
    ]
  };
}
