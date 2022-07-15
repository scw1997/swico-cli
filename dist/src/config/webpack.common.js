"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var html_webpack_plugin_1 = __importDefault(require("html-webpack-plugin"));
var mini_css_extract_plugin_1 = __importDefault(require("mini-css-extract-plugin"));
var chalk_1 = __importDefault(require("chalk"));
var progress_bar_webpack_plugin_1 = __importDefault(require("progress-bar-webpack-plugin"));
var tools_1 = require("../utils/tools");
function default_1(_a) {
    var projectPath = _a.projectPath, entryPath = _a.entryPath, templatePath = _a.templatePath, cliConfig = _a.cliConfig;
    //开发者的自定义配置
    var custCommonCfg = cliConfig.common || {};
    return {
        //入口文件路径，必须为js
        entry: entryPath,
        //打包后文件路径
        output: {
            path: path_1.default.resolve(projectPath, './dist'),
            filename: 'js/[chunkhash].[name].js',
            // 静态文件打包后的路径及文件名（默认是走全局的，如果有独立的设置就按照自己独立的设置来。）
            assetModuleFilename: 'assets/[name]_[chunkhash][ext]',
            publicPath: custCommonCfg.publicPath || tools_1.initFields.publicPath
        },
        target: ['web', 'es5'],
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
                            loader: 'babel-loader',
                            options: {
                                presets: ['@babel/preset-react', '@babel/preset-env'],
                                plugins: [
                                    '@babel/plugin-transform-runtime',
                                    '@babel/plugin-proposal-class-properties'
                                ]
                            }
                        },
                        'ts-loader',
                        'eslint-loader'
                    ]
                },
                {
                    oneOf: [
                        {
                            test: /\.module\.css$/,
                            use: [
                                mini_css_extract_plugin_1.default.loader,
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
                                mini_css_extract_plugin_1.default.loader,
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
                                mini_css_extract_plugin_1.default.loader,
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
                                mini_css_extract_plugin_1.default.loader,
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
                            type: 'asset',
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
                '@': path_1.default.resolve(projectPath, './src')
            }
        },
        plugins: __spreadArray([
            new html_webpack_plugin_1.default({
                //不使用默认html文件，使用自己定义的html模板并自动引入打包后的js/css
                template: templatePath,
                filename: 'index.html',
                minify: {
                    //压缩和简化代码
                    collapseWhitespace: true,
                    removeAttributeQuotes: true //去掉html标签属性的引号
                },
                templateParameters: {
                    routerBase: custCommonCfg.publicPath || tools_1.initFields.publicPath
                },
                title: custCommonCfg.title || tools_1.initFields.title,
                hash: true //对html引用的js文件添加hash戳
            }),
            new mini_css_extract_plugin_1.default({
                filename: 'css/[contenthash].[name].css'
            }),
            // 进度条
            new progress_bar_webpack_plugin_1.default({
                format: "building " + chalk_1.default.blue.bold(':bar') + " " + chalk_1.default.green.bold(':percent') + " (:elapsed s)",
                clear: false
            })
        ], (custCommonCfg.plugins || tools_1.initFields.plugins), true)
    };
}
exports.default = default_1;
