import path from 'path';
import { copyDir } from './utils/tools';


const main = () => {
  const targetPath = path.resolve(__dirname, '../dist/src/templates/');
  copyDir(path.resolve(__dirname, './templates/'), targetPath);

};
main();
