import ora from 'ora';
import downGit from 'download-git-repo';

const spinner = ora();

//创建项目模板
export const downloadTemp = (targetPath: string) => {
    spinner.start('Initializing the project by pulling the built-in template... ');
    console.log('\n');
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
                    spinner.succeed('Successfully initialized');
                }
            }
        );
    });
};
