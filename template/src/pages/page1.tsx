import React, {FC} from 'react';
import testImg from '@/assets/test.png';
import Style from './style.module.less';


const Page1: FC = () => {
	return <div className={Style.Xx}><img src={testImg} alt=""/>会话</div>;
};
export default Page1;