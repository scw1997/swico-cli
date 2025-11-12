import path from 'path';
import { copyDirFiles } from './utils';
import fs from 'fs-extra';

const copyTemplateFiles = async () => {
    const targetPath = path.resolve(__dirname, '../dist/src/templates/');
    await copyDirFiles(path.resolve(__dirname, './templates/'), targetPath);
};

const copyReadMeFiles = async () => {
    const filePath = path.resolve(__dirname, '../README.md');
    const targetPath = path.resolve(__dirname, '../dist/README.md');
    await fs.copyFile(filePath, targetPath);
};
const main = () => {
    copyTemplateFiles();
    copyReadMeFiles();
};
main();
