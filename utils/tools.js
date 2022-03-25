const loading = require('ora')();
const downGit = require('download-git-repo');
const fs = require('fs-extra');
const path = require('path');

//创建项目模板
const downloadTemp = (targetPath)=>{
	loading.start('正在创建项目模板');
	return new Promise((resolve, reject) => {
		downGit('https://gitee.com:fanlaBoy/treo-typescript-temp#master',targetPath,{clone:true},(e)=>{
			if(e){
				const err = e.toString();
				loading.fail(err);
				reject(err);
			}else{
				resolve();
				loading.succeed('创建完成');
			}

		});
	});
};

//获取开发者的自定义项目配置和相关参数
const getProjectConfig = ()=>{
	// 当前命令行选择的目录(即项目根路径)
	const cwd  = process.cwd();
	//treo 配置目录
	const configDir = path.resolve(cwd, './config');
	// 脚手架对应的配置文件信息
	const configPath  = {
		dev:path.resolve(configDir,'./config.dev.ts'),
		prd:path.resolve(configDir,'./config.prd.ts'),
		common:path.resolve(configDir,'./config.ts')
	};

	const kevalConfig = {
		dev:null,
		prd:null,
		common:null
	};
	Object.keys(configPath).forEach(async key=>{
		const curCfgPath = configPath[key];
		const exists = await fs.pathExists(curCfgPath);
		//存在则读取
		if(exists){
			const curtCfgData = require(configPath[key]);
			kevalConfig[key] = curtCfgData;
		}
	});
	//webpack入口文件
	const entryPath = path.resolve(cwd,'./src/index.tsx');
	//webpack html template
	const templatePath = path.resolve(cwd,'./src/index.html');

	return {
		projectPath:cwd,
		entryPath,
		templatePath,
		kevalConfig,
	};
};


module.exports = {
	downloadTemp,
	getProjectConfig
};