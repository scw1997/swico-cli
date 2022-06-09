import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import getStartConfig from '../config/webpack.start';
import { getProjectConfig } from '../utils/tools';
import ora from 'ora';
//支持直接引入ts或es6模块
import('ts-node/register');

const spinner = ora();

// 执行start本地启动
export default async function () {
    const projectConfig = await getProjectConfig();

    const startConfig = await getStartConfig(projectConfig);
    const compiler = webpack(startConfig as any);
    //启动服务
    const devServer = new WebpackDevServer(startConfig.devServer, compiler);

    spinner.start('Starting server...\n');

    devServer.startCallback((err) => {
        if (err) {
            spinner.fail(`出错了:${err.toString()}`);
        } else {
            spinner.succeed(
                `Successfully started server on http://localhost:${startConfig.devServer.port}`
            );
        }
    });
}
