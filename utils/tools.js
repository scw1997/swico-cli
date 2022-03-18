const loading = require('ora')()
const downGit = require('download-git-repo')

 //创建项目模板
 const downloadTemp = (targetPath)=>{
    loading.start('正在创建项目模板')
    return new Promise((resolve, reject) => {
        downGit('https://gitee.com:fanlaBoy/treo-typescript-temp#master',targetPath,{clone:true},(e)=>{
            resolve()
            loading.succeed('创建完成')
        })
    })
}


module.exports = {
    downloadTemp
}