"use strict";
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
var webpack_1 = __importDefault(require("webpack"));
var webpack_dev_server_1 = __importDefault(require("webpack-dev-server"));
var webpack_start_1 = __importDefault(require("../config/webpack.start"));
var tools_1 = require("../utils/tools");
var ora_1 = __importDefault(require("ora"));
var chokidar_1 = __importDefault(require("chokidar"));
var path_1 = __importDefault(require("path"));
var chalk_1 = __importDefault(require("chalk"));
var spinner = (0, ora_1.default)();
//监听ts全局声明文件和cli config文件修改
var handleWatch = function (projectPath, devServer) {
    var typingsWatcher = chokidar_1.default
        .watch([
        path_1.default.resolve(projectPath, './src/typings/**/*.ts'),
        path_1.default.resolve(projectPath, './config/*.ts')
    ], {
        interval: 500,
        binaryInterval: 500
    })
        .on('change', function () {
        console.log("\n" + chalk_1.default.blue.bold('global config changes, restarting server...') + "\n");
        devServer.stopCallback(function () {
            typingsWatcher.close();
            start(false);
        });
    });
};
// 执行start本地启动
function start(open) {
    return __awaiter(this, void 0, void 0, function () {
        var projectConfig, projectPath, startConfig, compiler, devServer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, tools_1.getProjectConfig)()];
                case 1:
                    projectConfig = _a.sent();
                    projectPath = projectConfig.projectPath;
                    return [4 /*yield*/, (0, webpack_start_1.default)(projectConfig, open)];
                case 2:
                    startConfig = _a.sent();
                    compiler = (0, webpack_1.default)(startConfig);
                    devServer = new webpack_dev_server_1.default(startConfig.devServer, compiler);
                    spinner.start('Starting server...\n');
                    devServer.startCallback(function (err) {
                        if (err) {
                            spinner.fail("\u51FA\u9519\u4E86:" + err.toString());
                        }
                        else {
                            spinner.succeed("Successfully started server on http://localhost:" + startConfig.devServer.port);
                            handleWatch(projectPath, devServer);
                        }
                    });
                    return [2 /*return*/];
            }
        });
    });
}
exports.default = start;
