import path from 'path';
import { copyDirFiles } from './utils/tools';


const main = () => {
  const targetPath = path.resolve(__dirname, '../dist/src/templates/');
  copyDirFiles(path.resolve(__dirname, './templates/'), targetPath);

};
main();
