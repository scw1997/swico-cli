import { downloadTemp } from '../utils/tools';

// 执行创建项目命令
export default async function (name, options) {
    const cwd = process.cwd();
    // 当前命令行所在路径初始化项目

    downloadTemp(cwd);
}
