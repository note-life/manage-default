import React from 'react';
import LoginForm from '@components/login-form';
import confirm from '@components/confirm';

const showLogin = () => {
    let form = null;

    confirm({
        title: '请重新登录',
        content: (
            <LoginForm submitButton={null} ref={ref => form = ref} />
        ),
        onOk: () => {
            form.submit();
        }
    });
};

export default showLogin;
