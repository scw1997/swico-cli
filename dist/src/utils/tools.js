"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPort = exports.getProjectConfig = exports.downloadTemp = void 0;
var ora_1 = __importDefault(require("ora"));
var download_git_repo_1 = __importDefault(require("download-git-repo"));
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var portfinder_1 = __importDefault(require("portfinder"));
//支持直接引入ts或es6模块
Promise.resolve().then(function () { return __importStar(require('ts-node/register')); });
var spinner = (0, ora_1.default)();
//创建项目模板
var downloadTemp = function (targetPath) {
    spinner.start('creating a project template');
    return new Promise(function (resolve, reject) {
        (0, download_git_repo_1.default)('https://gitee.com:fanlaBoy/secywo-template#master', targetPath, { clone: true }, function (e) {
            if (e) {
                var err = e.toString();
                spinner.fail(err);
                reject(err);
            }
            else {
                resolve(null);
                spinner.succeed('Successfully created');
            }
        });
    });
};
exports.downloadTemp = downloadTemp;
//获取开发者的自定义项目配置和相关参数
var getProjectConfig = function () { return __awaiter(void 0, void 0, void 0, function () {
    var cwd, configDir, configPath, cliConfig, _i, _a, key, curCfgPath, exists, curtCfgData, entryPath, templatePath;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                cwd = process.cwd();
                configDir = path_1.default.resolve(cwd, './config');
                configPath = {
                    dev: path_1.default.resolve(configDir, './secywo.dev.ts'),
                    prd: path_1.default.resolve(configDir, './secywo.prd.ts'),
                    common: path_1.default.resolve(configDir, './secywo.ts')
                };
                cliConfig = {
                    dev: undefined,
                    prd: undefined,
                    common: undefined //对应公共webpack配置
                };
                _i = 0, _a = Object.keys(configPath);
                _b.label = 1;
            case 1:
                if (!(_i < _a.length)) return [3 /*break*/, 4];
                key = _a[_i];
                curCfgPath = configPath[key];
                exists = fs_1.default.existsSync(curCfgPath);
                if (!exists) return [3 /*break*/, 3];
                return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require(curCfgPath)); })];
            case 2:
                curtCfgData = (_b.sent()).default;
                cliConfig[key] = curtCfgData;
                _b.label = 3;
            case 3:
                _i++;
                return [3 /*break*/, 1];
            case 4:
                entryPath = path_1.default.resolve(cwd, './src/index.tsx');
                templatePath = path_1.default.resolve(cwd, './src/index.ejs');
                return [2 /*return*/, {
                        projectPath: cwd,
                        entryPath: entryPath,
                        templatePath: templatePath,
                        cliConfig: cliConfig
                    }];
        }
    });
}); };
exports.getProjectConfig = getProjectConfig;
//获取随机可用的接口（解决devServer接口占用报错的问题）
var getPort = function () {
    return portfinder_1.default.getPortPromise({
        port: 3000,
        stopPort: 3333 //
    });
};
exports.getPort = getPort;
