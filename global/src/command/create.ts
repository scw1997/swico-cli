import { downloadTemp, installModules, logoText } from '../utils/tools';
// fs-extra 是对 fs 模块的扩展，支持 promise 语法
import fs from 'fs-extra';
import inquirer from 'inquirer';
import path from 'path';
import chalk from 'chalk';

const createSecywoApp = async (targetPath, projectName) => {
    //拉取模板
    await downloadTemp(targetPath);
    //下载依赖
    await installModules({ targetPath, packageType: 'npm' });
    console.log(chalk.green('Successfully Created!' + '\n'));
    //绘制logo
    console.log(logoText + '\n');
    //可以启动项目啦
    console.log(
        'Now you can',
        chalk.cyan(`cd ${projectName}`),
        `and ${chalk.cyan('npm run start')} to start your Secywo App!`
    );
};

// 执行创建项目命令
export default async function (projectName: string, options: Record<string, any>) {
    // 当前命令行选择的目录
    const cwd = process.cwd();
    // 需要创建的目录地址
    const targetPath = path.join(cwd, projectName);

    // 目录是否已经存在？
    if (fs.existsSync(targetPath)) {
        // 是否为强制创建？
        if (options.force) {
            await fs.remove(targetPath);
        } else {
            // 询问用户是否确定要覆盖
            const { action } = await inquirer.prompt([
                {
                    name: 'action',
                    type: 'list',
                    message: chalk.yellow('the destination folder already exists, please select:'),
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
                // 移除已存在的目录
                await fs.remove(targetPath);
                createSecywoApp(targetPath, projectName);
            }
        }
    } else {
        createSecywoApp(targetPath, projectName);
    }
}
