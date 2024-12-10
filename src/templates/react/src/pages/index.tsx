import './index.less';
import React from 'react';

const Index: React.FC = () => {
    return (
        <div className={'welcome'}>
            <img alt="logo" src="/logo.png" />
            <h2 style={{ color: '#3a95a7' }}>Welcome to Swico</h2>
        </div>
    );
};

export default Index;
