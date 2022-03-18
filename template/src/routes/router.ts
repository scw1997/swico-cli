import { Route,Page } from './router.d';

const Page1:Page = ()=>import('../pages/page1');



const Router:Route[] = [
	{
		path:'/page1',
		component:Page1
	}
];




export default Router;