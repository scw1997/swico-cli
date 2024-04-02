import ora from 'ora';
import downGit from 'download-git-repo';
import spawn from 'cross-spawn';
import figlet from 'figlet';
import chalk from 'chalk';

const spinner = ora();

//拉取远程git项目模板
export const downloadTemp = (targetPath: string, templateType: 'react' | 'vue') => {
  spinner.start('pulling the built-in template... ');
  console.log('\n');
  return new Promise((resolve, reject) => {
    downGit(
      templateType === 'react' ? 'https://gitee.com:fanlaBoy/swico-template-react#v1' : 'https://gitee.com:fanlaBoy/swico-template-vue#v1',
      targetPath,
      { clone: true },
      (e) => {
        if (e) {
          const err = e.toString();
          spinner.fail(chalk.red(err));
          reject(err);
        } else {
          resolve(null);
          spinner.succeed(chalk.green('Successfully pulled!'));
        }
      }
    );
  });
};

interface installProps {
  targetPath: string; // 项目根路径
  packageType?: 'npm' | 'pnpm'; //包管理工具
}

//自动安装依赖
export const installModules = async (options: installProps) => {
  const { targetPath, packageType = 'npm' } = options;
  //报错处理
  const handleErr = (reject) => {
    const errMsg = chalk.red('Error occurred while installing dependencies!');
    spinner.fail(errMsg);
    process.exit(1);
    return reject(errMsg);
  };
  //开始安装
  spinner.start('installing dependencies... \n');
  return new Promise((resolve, reject) => {
    // const args = ['install', '--save', '--save-exact', '--loglevel', 'error'];
    const args = ['install'];
    const child = spawn(packageType, args, {
      cwd: targetPath,
      stdio: ['pipe', process.stdout, process.stderr]
    });

    child.once('close', (code: number) => {
      if (code !== 0) {
        handleErr(reject);
      }
      spinner.succeed(chalk.green('Install finished!\n '));
      resolve(null);
    });
    child.once('error', (...args) => {
      handleErr(reject);
    });
  });
};

export const logoText =
  '\r\n' +
  figlet.textSync('swico', {
    font: 'Ghost',
    horizontalLayout: 'default',
    verticalLayout: 'default',
    width: 80,
    whitespaceBreak: true
  });
