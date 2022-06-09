import ora from 'ora';
import downGit from 'download-git-repo';
import fs from 'fs';
import path from 'path';
import portFinder from 'portfinder';
//支持直接引入ts或es6模块
import('ts-node/register');
const spinner = ora();

export interface ProjectConfigType {
    projectPath: string; //项目路径
    entryPath: string; //入口文件路径
    templatePath: string; //html模板文件路径
    cliConfig: {
        //脚手架自定义配置
        common: Record<string, any>; //公共通用
        dev: Record<string, any>; //开发环境专用
        prd: Record<string, any>; //生产环境专用
    };
}

//创建项目模板
export const downloadTemp = (targetPath: string) => {
    spinner.start('creating a project template');

    return new Promise((resolve, reject) => {
        downGit(
            'https://gitee.com:fanlaBoy/secywo-template#master',
            targetPath,
            { clone: true },
            (e) => {
                if (e) {
                    const err = e.toString();
                    spinner.fail(err);
                    reject(err);
                } else {
                    resolve(null);
                    spinner.succeed('Successfully created');
                }
            }
        );
    });
};

//获取开发者的自定义项目配置和相关参数
export const getProjectConfig: () => Promise<ProjectConfigType> = async () => {
    // 当前命令行选择的目录(即项目根路径)
    const cwd = process.cwd();
    //treo 配置目录
    const configDir = path.resolve(cwd, './config');
    // 脚手架对应的配置文件信息
    const configPath = {
        dev: path.resolve(configDir, './secywo.dev.ts'),
        prd: path.resolve(configDir, './secywo.prd.ts'),
        common: path.resolve(configDir, './secywo.ts')
    };

    const cliConfig = {
        dev: undefined, //对应公共webpack start配置
        prd: undefined, //对应webpack build配置
        common: undefined //对应公共webpack配置
    };
    //读取各环境配置文件并写入

    for (const key of Object.keys(configPath)) {
        const curCfgPath = configPath[key];
        const exists = fs.existsSync(curCfgPath);
        //存在则读取

        if (exists) {
            const curtCfgData = (await import(curCfgPath)).default;

            cliConfig[key] = curtCfgData;
        }
    }

    //webpack入口文件
    const entryPath = path.resolve(cwd, './src/index.tsx');
    //webpack html template
    const templatePath = path.resolve(cwd, './src/index.html');

    return {
        projectPath: cwd,
        entryPath,
        templatePath,
        cliConfig
    };
};

//获取随机可用的接口（解决devServer接口占用报错的问题）
export const getPort = () => {
    return portFinder.getPortPromise({
        port: 3000, // minimum port
        stopPort: 3333 //
    });
};
