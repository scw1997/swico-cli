import fs from 'fs';
import path from 'path';
import portFinder from 'portfinder';

interface CliConfigFields {
  plugins?: any[];
  publicPath?: string;
  title?: string;
  console?: boolean;
  define?: Record<string, any>;
  alias?: Record<string, any>;
  proxy?: Record<string, any>;
}

export interface ProjectConfigType {
  projectPath: string; //项目路径
  entryPath: string; //入口文件路径
  templatePath: string; //html模板文件路径
  cliConfig: {
    //脚手架自定义配置
    common: CliConfigFields; //公共通用
    dev: CliConfigFields; //开发环境专用
    prd: CliConfigFields; //生产环境专用
  };
}

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
      cliConfig[key] = (await import(curCfgPath)).default;
    }
  }

  //webpack入口文件
  const entryPath = path.resolve(cwd, './src/index.tsx');
  //webpack html template
  const templatePath = path.resolve(cwd, './src/index.ejs');

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

//部分webpack配置项的初始默认值
export const initFields: CliConfigFields = {
  console: false, //生产环境是否去掉console打印信息
  plugins: [],
  publicPath: '/',
  title: 'Secywo App',
  proxy: null
};
