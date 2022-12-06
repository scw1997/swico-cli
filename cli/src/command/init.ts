import { downloadTemp } from '../utils/tools';
// fs-extra 是对 fs 模块的扩展，支持 promise 语法
import fs from 'fs-extra';
import inquirer from 'inquirer';
import path from 'path';

// 执行创建项目命令
export default async function (name, options) {
    // 当前命令行选择的目录
    const cwd = process.cwd();
    // 需要创建的目录地址
    const targetPath = path.join(cwd, name);

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
                    message: 'the destination folder already exists, please select:',
                    choices: [
                        {
                            name: 'overwritten',
                            value: true
                        },
                        {
                            name: 'cancel',
                            value: false
                        }
                    ]
                }
            ]);

            if (action) {
                // 移除已存在的目录
                await fs.remove(targetPath);
                downloadTemp(targetPath);
            }
        }
    } else {
        downloadTemp(targetPath);
    }
}
