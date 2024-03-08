import { downloadTemp, installModules, logoText } from '../utils/tools';
// fs-extra 是对 fs 模块的扩展，支持 promise 语法
import inquirer from 'inquirer';
import path from 'path';
import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs-extra';

const spinner = ora();


//根据npmType动态调整模板配置secywo.ts文件
const rewriteSecywoConfigFile = (targetPath, npmType) => {
  return new Promise((resolve, reject) => {
    const textData = `//secywo脚手架公共自定义配置

import { defineConfig } from 'secywo-template-cli';
export default defineConfig('base', {
    npmType:'${npmType}'
});
`;
    fs.writeFile(`${targetPath}/config/secywo.ts`, textData, 'utf8', (err) => {
      if (err) {
        return reject('An error occurred during the npm configuration.');
      }
      resolve(null);
    });
  });

};

const getStartScript = (npmType) => {
  switch (npmType) {
    case 'npm':
      return 'npm run start';
    case 'pnpm':
      return 'pnpm run start';
  }
};

const createSecywoApp = async ({ targetPath, projectName, templateType, npmType }) => {
  //拉取模板
  await downloadTemp(targetPath, templateType);
  //下载依赖
  await installModules({ targetPath, packageType: npmType });
  //根据npmType动态调整模板配置secywo.ts文件
  await rewriteSecywoConfigFile(targetPath, npmType);
  console.log(chalk.green('Successfully Created!' + '\n'));
  //绘制logo
  console.log(logoText + '\n');
  //可以启动项目啦

  console.log(
    'Now you can',
    chalk.cyan(`cd ${projectName}`),
    `and ${chalk.cyan(`${getStartScript(npmType)}`)} to start your Secywo App!`
  );
};


const handlePrompt: () => Promise<{ templateType: string, npmType: string }> = async () => {
  // 选择模板类型
  const { templateType } = await inquirer.prompt([
    {
      name: 'templateType',
      type: 'list',
      message: chalk.yellowBright('Please select the template type:'),
      choices: [
        {
          name: 'React18.2 + Typescript5',
          value: 'react'
        },
        {
          name: 'Vue3.4 + Typescript5',
          value: 'vue'
        }
      ]
    }
  ]);
  // 选择模板类型
  const { npmType } = await inquirer.prompt([
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
        // {
        //   name: 'yarn',
        //   value: 'yarn'
        // }
      ]
    }
  ]);
  return { templateType, npmType };
};

// 执行创建项目命令
export default async function(projectName: string, options: Record<string, any>) {
  // 当前命令行选择的目录
  const cwd = process.cwd();
  // 需要创建的目录地址
  const targetPath = path.join(cwd, projectName);


  // 目录是否已经存在？
  if (fs.existsSync(targetPath)) {
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

      } else {
        return;
      }
    }
  }
  const { npmType, templateType } = await handlePrompt();
  createSecywoApp({ targetPath, projectName, templateType, npmType });


}
