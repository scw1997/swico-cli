import React, {FC, Suspense, lazy} from 'react';
import './index.css';
import RouteList from '../src/routes/router';
import {HashRouter as Router, Route, Switch} from 'react-router-dom';




const App: FC = () => {
	return <Router>
		<Switch>
			{RouteList.map(item => {
				const Component = lazy(item.component);
				return <Route key={item.path} path={item.path} exact={true} render={() => <Suspense fallback={'loading'}>
					<Component />
				</Suspense>}/>;
			})}
		</Switch>
	</Router>;
};

export default App;