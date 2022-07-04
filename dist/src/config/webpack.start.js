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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
var tools_1 = require("../utils/tools");
var html_webpack_plugin_1 = __importDefault(require("html-webpack-plugin"));
var path_1 = __importDefault(require("path"));
function default_1(options) {
    var _a, _b, _c, _d, _e, _f, _g;
    return __awaiter(this, void 0, void 0, function () {
        var projectPath, cliConfig, templatePath, commonConfig, port, custDevCfg, custCommonCfg;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    projectPath = options.projectPath, cliConfig = options.cliConfig, templatePath = options.templatePath;
                    commonConfig = (0, webpack_common_1.default)(options);
                    return [4 /*yield*/, (0, tools_1.getPort)()];
                case 1:
                    port = _h.sent();
                    custDevCfg = cliConfig.dev || {};
                    custCommonCfg = cliConfig.common || {};
                    return [2 /*return*/, __assign(__assign({}, commonConfig), { 
                            // watch: true,
                            // watchOptions: {
                            //     aggregateTimeout: 600,
                            //     ignored: path.resolve(projectPath, './node_modules'),
                            //     poll: 1000 // 每秒检查一次变动
                            // },
                            //打包后文件路径
                            output: __assign(__assign({}, commonConfig.output), { publicPath: (_b = (_a = custDevCfg.publicPath) !== null && _a !== void 0 ? _a : custCommonCfg.publicPath) !== null && _b !== void 0 ? _b : '/' }), mode: 'development', devtool: 'eval-cheap-module-source-map', devServer: {
                                //使用HTML5 History API时，index.html可能需要提供页面来代替任何404响应。
                                historyApiFallback: true,
                                port: port,
                                client: {
                                    progress: true,
                                    //警告不会显示页面
                                    overlay: {
                                        errors: true,
                                        warnings: false
                                    }
                                },
                                compress: true,
                                hot: true,
                                open: true,
                                static: {
                                    //提供静态文件服务的路径
                                    directory: path_1.default.join(projectPath, './public')
                                }
                            }, plugins: __spreadArray(__spreadArray([
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
                                        routerBase: (_d = (_c = custDevCfg.publicPath) !== null && _c !== void 0 ? _c : custCommonCfg.publicPath) !== null && _d !== void 0 ? _d : '/'
                                    },
                                    title: (_f = (_e = custDevCfg.title) !== null && _e !== void 0 ? _e : custCommonCfg.title) !== null && _f !== void 0 ? _f : 'Secywo App',
                                    hash: true //对html引用的js文件添加hash戳
                                })
                            ], commonConfig.plugins, true), ((_g = custDevCfg.plugins) !== null && _g !== void 0 ? _g : []), true) })];
            }
        });
    });
}
exports.default = default_1;
