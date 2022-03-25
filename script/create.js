// import path from 'path'
// import fs from 'fs-extra'
// import inquirer from 'inquirer'
// import downGit from 'download-git-repo'


const path = require('path');

// fs-extra 是对 fs 模块的扩展，支持 promise 语法
const fs = require('fs-extra');
const inquirer = require('inquirer');
const {downloadTemp} = require( '../utils/tools');

// 执行创建项目命令
module.exports = async function (name,options) {


	// 当前命令行选择的目录
	const cwd  = process.cwd();
	// 需要创建的目录地址
	const targetPath  = path.join(cwd, name);

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
					message: '目标文件夹已存在，请选择:',
					choices: [
						{
							name: '覆盖',
							value: true
						},{
							name: '取消',
							value: false
						}
					]
				}
			]);

			if(action){
				// 移除已存在的目录
				await fs.remove(targetPath);
				downloadTemp(targetPath);

			}
		}
	}else{
		downloadTemp(targetPath);
	}


};