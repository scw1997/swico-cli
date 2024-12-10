import { Outlet } from 'swico';
import React from 'react';

const Example: React.FC = () => {
    return (
        <div>
            example示例页
            {/*子路由组件在此渲染*/}
            <Outlet />
        </div>
    );
};

export default Example;
