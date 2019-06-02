import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import message from '@components/message';
import { postJSON } from '@helper/fetch';
import { isEmail } from '@helper/utils';

import './index.pcss';

class LoginForm extends React.Component {

    state = {
        user: '',
        password: '',
        loading: false
    }

    handleSigin = async (data) => {
        this.setState({ loading: true });

        const res = await postJSON('/users/authenticate', data);

        this.setState({ loading: false });
        if (res.error) {
            message.error(res.error.message);
        } else {
            message.success('登录成功');
            localStorage.setItem('ut', res.token);
            localStorage.setItem('user', JSON.stringify(res.user));
            this.props.onLogin && this.props.onLogin();
        }
    }

    submit = (e) => {
        e && e.preventDefault();
        const { password, user } = this.state;

        const data = {};

        data.password = password;
        isEmail(user) ? data.email = user : data.nickname = user;

        this.handleSigin(data);
    }

    handleInput = (field, e) => {
        const value = e.target.value;

        this.setState({ [field]: value });
    }

    render () {
        const { submitButton } = this.props;
        const { user, password, loading } = this.state;

        return (
            <form action="" className="login-form" onSubmit={this.submit}>
                <TextField
                    id="user-input"
                    className="user-input"
                    label="User"
                    type="text"
                    variant="outlined"
                    value={user}
                    onChange={this.handleInput.bind(null, 'user')}
                />
                <TextField
                    id="password-input"
                    className="password-input"
                    label="Password"
                    type="password"
                    autoComplete="current-password"
                    variant="outlined"
                    value={password}
                    onChange={this.handleInput.bind(null, 'password')}
                />
                {
                    submitButton === null
                        ? null
                        : <Button
                            className="submit-btn"
                            variant="contained"
                            disabled={!user || !password || loading}
                            color="primary"
                            type="submit"
                        >
                            SIGN IN NOW
                            {loading && <CircularProgress className="circle-progress" />}
                        </Button>
                }
            </form>
        );
    }
}

LoginForm.defaultProps = {
    onLogin: null
}

export default LoginForm;