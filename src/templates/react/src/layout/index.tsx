import React from 'react';
import { Outlet } from 'swico';

const Layout: React.FC = () => {
    return (
        /*全体路由在此渲染*/
        <Outlet />
    );
};

export default Layout;
