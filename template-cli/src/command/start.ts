import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import getStartConfig from '../config/webpack.start';
import { getProjectConfig } from '../utils/tools';
import ora from 'ora';
import chokidar from 'chokidar';
import path from 'path';
import chalk from 'chalk';

const spinner = ora();

//监听ts全局声明文件和cli config文件修改
const handleWatch = (projectPath, devServer) => {
  const typingsWatcher = chokidar
    .watch(
      [
        path.resolve(projectPath, './src/typings/**/*.ts'),
        path.resolve(projectPath, './config/*.ts'),
        path.resolve(projectPath, './tsconfig.json'),
        path.resolve(projectPath, './commitlint.config.js')
      ],
      {
        interval: 500,
        binaryInterval: 500
      }
    )
    .on('change', async () => {
      console.log(
        `\n${chalk.blue.bold('Global config changes, restarting the server...')}\n`
      );
      await devServer.stop();
      typingsWatcher.close();
      start(false);
    });
};

// 执行start本地启动
export default async function start(open?: boolean) {
  const projectConfig = await getProjectConfig();
  const { projectPath } = projectConfig;

  const startConfig = await getStartConfig(projectConfig, open);
  const compiler = webpack(startConfig as any);
  //启动服务
  const devServer = new WebpackDevServer(startConfig.devServer, compiler);

  spinner.start('Starting server...\n');

  try {
    await devServer.start();
    spinner.succeed(
      `Successfully started server on http://localhost:${startConfig.devServer.port}`
    );
    handleWatch(projectPath, devServer);
  } catch (e) {
    spinner.fail(`出错了:${e.toString()}`);
  }


}
