const spinner = require('ora')();
const downGit = require('download-git-repo');
const fs = require('fs-extra');
const path = require('path');
const portfinder = require('portfinder');

//创建项目模板
const downloadTemp = (targetPath)=>{
	spinner.start('creating a project template');
	
return new Promise((resolve, reject) => {
		downGit('https://gitee.com:fanlaBoy/secywo-template#master', targetPath, {clone: true}, (e)=>{
			if (e) {
				const err = e.toString();

				spinner.fail(err);
				reject(err);
			} else {
				resolve();
				spinner.succeed('Successfully created');
			}

		});
	});
};

//获取开发者的自定义项目配置和相关参数
const getProjectConfig = ()=>{
	// 当前命令行选择的目录(即项目根路径)
	const cwd = process.cwd();
	//treo 配置目录
	const configDir = path.resolve(cwd, './config');
	// 脚手架对应的配置文件信息
	const configPath = {
		dev: path.resolve(configDir, './config.dev.ts'),
		prd: path.resolve(configDir, './config.prd.ts'),
		common: path.resolve(configDir, './config.ts'),
	};

	const kevalConfig = {
		dev: null,
		prd: null,
		common: null,
	};
	//读取各环境配置文件并写入

	Object.keys(configPath).forEach(async (key)=>{
		const curCfgPath = configPath[key];
		const exists = await fs.pathExists(curCfgPath);
		//存在则读取

		if (exists) {
			const curtCfgData = require(configPath[key]);

			kevalConfig[key] = curtCfgData;
		}
	});
	//webpack入口文件
	const entryPath = path.resolve(cwd, './src/index.tsx');
	//webpack html template
	const templatePath = path.resolve(cwd, './src/index.html');

	return {
		projectPath: cwd,
		entryPath,
		templatePath,
		kevalConfig,
	};
};

//获取随机可用的接口（解决devServer接口占用报错的问题）
const getPort = ()=>{
	return portfinder.getPortPromise({
		port: 3000, // minimum port
		stopPort: 3333, //
	});
};


module.exports = {
	downloadTemp,
	getProjectConfig,
	getPort,
};