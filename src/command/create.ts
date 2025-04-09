import { downloadTemp, installModules, logoText } from '../utils/tools';
// fs-extra 是对 fs 模块的扩展，支持 promise 语法
import inquirer from 'inquirer';
import path from 'path';
import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs-extra';
import spawn from 'cross-spawn';

const spinner = ora();

// 项目husky初始化
const initHusky = async (targetPath)=>{
  //报错处理
  const handleErr = (reject) => {
    const errMsg = chalk.red('Error occurred while Husky initialization!');
    spinner.fail(errMsg);
    process.exit(1);
    return reject(errMsg);
  };
  return new Promise((resolve, reject) => {
    const args = ['husky','init'];
    const child = spawn('npx', args, {
      cwd: targetPath,
      stdio: ['pipe', process.stdout, process.stderr]
    });

    child.once('close', (code: number) => {
      if (code !== 0) {
        handleErr(reject);
      }
      resolve(null);
    });
    child.once('error', (...args) => {
      handleErr(reject);
    });
  });
};

// 项目git初始化
const initGit = async (targetPath)=>{
  //报错处理
  const handleErr = (reject) => {
    const errMsg = chalk.red('Error occurred while Git initialization!');
    spinner.fail(errMsg);
    process.exit(1);
    return reject(errMsg);
  };
  return new Promise((resolve, reject) => {
    const args = ['init'];
    const child = spawn('git', args, {
      cwd: targetPath,
      stdio: ['pipe', process.stdout, process.stderr]
    });

    child.once('close', (code: number) => {
      if (code !== 0) {
        handleErr(reject);
      }
      resolve(null);
    });
    child.once('error', (...args) => {
      handleErr(reject);
    });
  });
};



const createSwicoApp = async ({ targetPath, projectName, templateType, npmType,needGitHooks }) => {
  //拉取模板
  await downloadTemp(targetPath, templateType,needGitHooks);
  //下载依赖
  await installModules({ targetPath, packageType: npmType });
  // git和husky初始化(先git)
  await initGit(targetPath);
  if(needGitHooks){
    await initHusky(targetPath);
  }


  console.log(chalk.green('Successfully Created!' + '\n'));
  //绘制logo
  console.log(logoText + '\n');
  //可以启动项目啦

  console.log(
    'Now you can',
    chalk.cyan(`cd ${projectName}`),
    `and ${chalk.cyan(`${npmType} run start`)} to start your Swico App!`
  );
};


const handlePrompt: () => Promise<{ templateType: string, npmType: string,needGitHooks:boolean }> = async () => {

  const { templateType,npmType,needGitHooks } = await inquirer.prompt([
    // 选择模板类型
    {
      name: 'templateType',
      type: 'list',
      message: chalk.yellowBright('Please select the template type:'),
      choices: [
        {
          name: 'React18.2 + Typescript5.3',
          value: 'react'
        },
        {
          name: 'Vue3.4 + Typescript5.3',
          value: 'vue'
        }
      ]
    },
    // 是否需要Git Hooks
    {
      name: 'needGitHooks',
      type: 'list',
      message: chalk.yellowBright('Do you need Git Hooks？'),
      choices: [
        {
          name: 'Yes',
          value: true
        },
        {
          name: 'No',
          value: false
        }
      ]
    },
    //选择npm管理工具
    {
      name: 'npmType',
      type: 'list',
      message: chalk.yellowBright('Please select the npm type:'),
      choices: [
        {
          name: 'npm',
          value: 'npm'
        },
        {
          name: 'pnpm',
          value: 'pnpm'
        }
      ]
    }
  ]);


  return { templateType, needGitHooks,npmType};
};

// 执行创建项目命令
export default async function(projectName: string, options: Record<string, any>) {
  // 当前命令行选择的目录
  const cwd = process.cwd();
  // 需要创建的目录地址
  const targetPath = path.join(cwd, projectName);

  //选择npm包管理工具和模板类型
  const { npmType, templateType,needGitHooks } = await handlePrompt();

  // 目录是否已经存在？
  const isDirExists = fs.existsSync(targetPath);
  if(isDirExists){
      // 是否为强制创建？
      if (options.force) {
        spinner.start('The target project name already exists, removing... ');
        await fs.remove(targetPath);
        spinner.succeed('Removed');
        console.log('\n');
      } else {
        // 询问用户是否确定要覆盖
        const { action } = await inquirer.prompt([
          {
            name: 'action',
            type: 'list',
            message: chalk.yellowBright('The destination folder already exists, please select:'),
            choices: [
              {
                name: 'Overwritten',
                value: true
              },
              {
                name: 'Cancel',
                value: false
              }
            ]
          }
        ]);

        if (action) {
          spinner.start('Removing The existing project with the same name... ');

          // 移除已存在的目录
          await fs.remove(targetPath);
          spinner.succeed('Removed');
          console.log('\n');

        }
      }
    }
  // 执行创建项目
  createSwicoApp({ targetPath, projectName, templateType, npmType,needGitHooks });


}
