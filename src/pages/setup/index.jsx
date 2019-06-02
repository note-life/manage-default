import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import message from '@components/message';

import { isEmail } from '@helper/utils';
import { postJSON } from '@helper/fetch';

import './index.pcss';


class SetupPage extends React.Component {
    queue = []

    state = {
        email: '',
        nickname: '',
        password: '',
        password2: '',
        loading: false
    }

    componentDidMount () {
        document.title = '登录';
    }

    handleSetup = async (data) => {
        this.setState({ loading: true });
        const res = await postJSON('/setup/admin', data);
        
        if (res.error) {
            message.error(res.error.message);
            this.setState({ loading: false });
        } else {
            message.success('Congratulations! everything is ok.')
            localStorage.setItem('ut', res.token);
            localStorage.setItem('user', JSON.stringify(res.user));

            setTimeout(() => {
                this.props.history.push('/');
            }, 2222);
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();

        const { email, nickname, password, password2 } = this.state;

        if (!isEmail(email)) {
            message.error('错误的邮箱格式');
            return;
        }

        if (password !== password2) {
            message.error('两次输入的密码不一致');
            return;
        }

        this.handleSetup({ email, nickname, password })
    }

    handleInput = (field, e) => {
        const value = e.target.value;

        this.setState({ [field]: value });
    }

    processQueue = () => {
        if (this.queue.length > 0) {
            this.setState({
                messageInfo: this.queue.shift(),
                open: true,
            });
        }
    }

    handleExited = () => {
        this.processQueue();
    }

    handleClose = (e, reason) => {
        if (reason === 'clickaway') return;

        this.setState({ open: false });
    }

    render () {
        const { email, nickname, password, password2, loading } = this.state;
        const diffPassword = password2 ? password2 !== password : false;
        const empty = !email || !nickname || !password || !password2;

        return (
            <div className="setup-wrapper">
                <form action="" className="login-form" onSubmit={this.handleSubmit}>
                    <TextField
                        error={!!email && !isEmail(email)}
                        id="email-input"
                        className="user-input"
                        label="Email"
                        type="text"
                        variant="outlined"
                        value={email}
                        onChange={this.handleInput.bind(null, 'email')}
                    />
                    <TextField
                        id="nickname-input"
                        className="user-input"
                        label="Nickname"
                        type="text"
                        variant="outlined"
                        value={nickname}
                        onChange={this.handleInput.bind(null, 'nickname')}
                    />
                    <TextField
                        error={diffPassword}
                        id="password-input"
                        className="password-input"
                        label="Password"
                        type="password"
                        autoComplete="current-password"
                        variant="outlined"
                        value={password}
                        onChange={this.handleInput.bind(null, 'password')}
                    />
                    <TextField
                        error={diffPassword}
                        id="password-input-2"
                        className="password-input"
                        label="Check Password"
                        type="password"
                        autoComplete="current-password"
                        variant="outlined"
                        value={password2}
                        onChange={this.handleInput.bind(null, 'password2')}
                    />
                    <Button disabled={empty || loading} variant="contained" color="primary" type="submit" onClick={this.handleSigin}>
                        SET UP NOW <i className="material-icons">arrow_forward</i>
                    </Button>
                </form>
            </div>
        );
    }
}

export default SetupPage;