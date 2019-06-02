import React from 'react';
import LoginForm from '@components/login-form';

import './index.pcss';


const LoginPage = (props) => {
    document.title = '登录';

    return (
        <div className="login-wrapper">
            <LoginForm onLogin={() => { props.history.push('/summary') }} />
        </div>
    );
};

export default LoginPage;