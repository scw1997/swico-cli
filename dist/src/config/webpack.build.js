"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var webpack_common_1 = __importDefault(require("./webpack.common"));
var css_minimizer_webpack_plugin_1 = __importDefault(require("css-minimizer-webpack-plugin"));
var clean_webpack_plugin_1 = require("clean-webpack-plugin");
var webpack_bundle_analyzer_1 = __importDefault(require("webpack-bundle-analyzer"));
var terser_webpack_plugin_1 = __importDefault(require("terser-webpack-plugin"));
var copy_webpack_plugin_1 = __importDefault(require("copy-webpack-plugin"));
var html_webpack_plugin_1 = __importDefault(require("html-webpack-plugin"));
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
var tools_1 = require("../utils/tools");
var webpack_1 = __importDefault(require("webpack"));
var BundleAnalyzerPlugin = webpack_bundle_analyzer_1.default.BundleAnalyzerPlugin;
var ANALYZE = process.env.ANALYZE;
function default_1(options) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    var projectPath = options.projectPath, cliConfig = options.cliConfig, templatePath = options.templatePath;
    //获取开发者自定义添加的脚手架的plugin配置
    var custPrdCfg = cliConfig.prd || {};
    var custCommonCfg = cliConfig.common || {};
    //获取自定义变量
    var defineVars = __assign(__assign({}, ((_a = custCommonCfg.define) !== null && _a !== void 0 ? _a : {})), ((_b = custPrdCfg.define) !== null && _b !== void 0 ? _b : {}));
    var commonConfig = (0, webpack_common_1.default)(options);
    var basicPlugins = __spreadArray(__spreadArray([], commonConfig.plugins.slice(1), true), [
        new clean_webpack_plugin_1.CleanWebpackPlugin(),
        new css_minimizer_webpack_plugin_1.default(),
        new BundleAnalyzerPlugin({
            analyzerMode: ANALYZE === 'true' ? 'server' : 'disabled',
            analyzerHost: '127.0.0.1',
            analyzerPort: 8888,
            reportFilename: 'report.html',
            defaultSizes: 'parsed',
            openAnalyzer: true,
            generateStatsFile: ANALYZE === 'true',
            statsFilename: 'analyze.json',
            statsOptions: null,
            logLevel: 'info'
        }),
        new html_webpack_plugin_1.default({
            //不使用默认html文件，使用自己定义的html模板并自动引入打包后的js/css
            template: templatePath,
            filename: 'index.html',
            minify: {
                //压缩和简化代码
                collapseWhitespace: true,
                removeAttributeQuotes: true //去掉html标签属性的引号
            },
            title: (_d = (_c = custPrdCfg.title) !== null && _c !== void 0 ? _c : custCommonCfg.title) !== null && _d !== void 0 ? _d : tools_1.initFields.title,
            templateParameters: {
                routerBase: (_f = (_e = custPrdCfg.publicPath) !== null && _e !== void 0 ? _e : custCommonCfg.publicPath) !== null && _f !== void 0 ? _f : tools_1.initFields.publicPath
            },
            hash: true //对html引用的js文件添加hash戳
        })
    ], false);
    //自定义变量注入配置
    if (Object.keys(defineVars).length !== 0) {
        basicPlugins.push(new webpack_1.default.DefinePlugin(__assign({}, defineVars)));
    }
    //处理public文件夹（静态资源）
    var copyPath = path_1.default.resolve(projectPath, './public');
    var isCopyPathExist = fs_1.default.existsSync(copyPath);
    if (isCopyPathExist) {
        //项目存在该路径则打包时复制文件，否则不操作
        basicPlugins.push(new copy_webpack_plugin_1.default({
            patterns: [path_1.default.resolve(projectPath, './public')]
        }));
    }
    return __assign(__assign({}, commonConfig), { 
        //打包后文件路径
        output: __assign(__assign({}, commonConfig.output), { publicPath: (_h = (_g = custPrdCfg.publicPath) !== null && _g !== void 0 ? _g : custCommonCfg.publicPath) !== null && _h !== void 0 ? _h : tools_1.initFields.publicPath }), 
        //控制输出文件大小的警告提示
        performance: {
            maxAssetSize: 1000000,
            maxEntrypointSize: 1000000
        }, mode: 'production', devtool: 'nosources-source-map', optimization: {
            //减少 entry chunk 体积，提高性能。
            runtimeChunk: true,
            minimize: true,
            minimizer: [
                //压缩css
                new css_minimizer_webpack_plugin_1.default({
                    parallel: true,
                    minimizerOptions: {
                        preset: 'advanced' // cssnano https://cssnano.co/docs/optimisations/
                    }
                }),
                //webpack5默认压缩js，但是用了css-miniizer，需要手动压缩js
                new terser_webpack_plugin_1.default({
                    test: /\.js$/,
                    terserOptions: {
                        compress: {
                            // eslint-disable-next-line camelcase
                            drop_console: custPrdCfg.console === undefined ? tools_1.initFields.console : !console,
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
                        priority: 10,
                        enforce: true
                    }
                }
            }
        }, plugins: __spreadArray(__spreadArray([], basicPlugins, true), ((_j = custPrdCfg.plugins) !== null && _j !== void 0 ? _j : []), true) });
}
exports.default = default_1;
