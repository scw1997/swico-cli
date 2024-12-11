import ora from 'ora';
import spawn from 'cross-spawn';
import figlet from 'figlet';
import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';

const spinner = ora();

//拉取远程git项目模板
export const downloadTemp = (targetPath: string, templateType: 'react' | 'vue') => {
  spinner.start('pulling the built-in template... ');
  console.log('\n');
  return new Promise((resolve, reject) => {
    // downGit(
    //   templateType === 'react' ? 'https://gitee.com:fanlaBoy/swico-template-react#v1' : 'https://gitee.com:fanlaBoy/swico-template-vue#v1',
    //   targetPath,
    //   { clone: true },
    //   (e) => {
    //     if (e) {
    //       const err = e.toString();
    //       spinner.fail(chalk.red(err));
    //       reject(err);
    //     } else {
    //       resolve(null);
    //       spinner.succeed(chalk.green('Successfully pulled!'));
    //     }
    //   }
    // );
    copyDirFiles(path.resolve(__dirname, `../templates/${templateType}`), targetPath).then(res => {
      resolve(null);
      spinner.succeed(chalk.green('Successfully pulled!'));
    }).catch(e => {
      const err = e.toString();
      spinner.fail(chalk.red(err));
      reject(err);
    });


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
  console.log(`\n${chalk.hex('#5f72f5')('Installing dependencies...')} \n`);
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


//复制文件夹
export const copyDirFiles = async (src, dest, filter?: (fileName) => boolean) => {
  const _copy = async (src, dest) => {
    const files = await fs.readdir(src);
    //过滤文件
    const filterFiles = files.filter((fileName) => (filter ? filter(fileName) === true : true));
    for await (const file of filterFiles) {
      const srcPath = path.join(src, file);
      const destPath = path.join(dest, file);
      const srcStat = await fs.stat(srcPath);
      if (srcStat.isDirectory()) {
        // 如果是目录，先在目标路径创建其文件夹，再递归复制
        await fs.mkdir(destPath, { recursive: true });
        _copy(srcPath, destPath);
      } else {
        // 如果是文件，则直接复制
        await fs.copyFile(srcPath, destPath);
      }
    }
    return null; // 所有文件复制完成后调用回调
  };

  try {
    await fs.access(dest);
  } catch (e) {
    // 如果目标文件夹不存在，则创建它
    await fs.mkdir(dest, { recursive: true });
  }
  await _copy(src, dest);
};
