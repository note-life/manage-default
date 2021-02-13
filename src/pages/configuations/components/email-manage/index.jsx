import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import message from '@components/message';
import { getData, putJSON, postJSON } from '@helper/fetch';
import './index.pcss';

class EmailMange extends React.Component {
    state = {
        authUser: '',
        authPass: '',
        port: '',
        host: '',
        enabled: false
    }

    componentDidMount() {
        this.fetchMailConfig();
    }

    togglePassword = () => {
        this.setState({ visible: !this.state.visible });
    }

    handleInput = (field, e) => {
        this.setState({ [field]: e.target.value });
    }

    handleEnabled = (e) => {
        this.setState({ enabled: e.target.checked });
    }

    fetchMailConfig = async () => {
        const headers = { ut: localStorage.getItem('ut') };
        const res = await getData(`/configurations`, { key: 'EMAIL' }, headers);

        if (res.error) {
            message.error(res.error.message);
        } else {
            const { _id, options, enabled } = res || {};

            this.setState({ _id, ...options, enabled });
        }
    }

    handleSubmit = async (e) => {
        e.preventDefault();

        const { authUser, authPass, host, port, _id } = this.state;
        const headers = { ut: localStorage.getItem('ut') };
        const data = {
            key: 'EMAIL',
            name: '邮箱',
            freeze: true,
            private: true,
            options: {
                authUser,
                authPass,
                host,
                port
            }
        };
        const res = _id ? await putJSON(`/configurations/${_id}`, data, headers) : await postJSON('/configurations', data, headers);

        if (res.error) {
            message.error(res.error.message);
        } else {
            message.success('设置成功');
        }

    }

    render() {
        const { authUser, authPass, host, port, visible, enabled = false } = this.state;

        return (
            <div className="email-manage">
                <div className="help-tips">
                    设置邮箱信息，用于新用户邀请，以及其它邮件服务。邮箱如何开启POP3/SMTP/IMAP服务可询问邮箱服务商。
                </div>
                <form action="" onSubmit={this.handleSubmit}>
                    <div className="item">
                        <label htmlFor="">Email:</label>
                        <TextField type="email" value={authUser || ''} onChange={this.handleInput.bind(null, 'authUser')} />
                    </div>
                    <div className="item">
                        <label htmlFor="">Pass:</label>
                        <TextField value={authPass || ''} type={visible ? 'text' : 'password'} onChange={this.handleInput.bind(null, 'authPass')} />
                        <span className="toggle-password" onClick={this.togglePassword}>{visible ? '隐藏' : '显示'}</span>
                    </div>
                    <div className="item">
                        <label htmlFor="">Host:</label>
                        <TextField value={host || ''} onChange={this.handleInput.bind(null, 'host')} />
                    </div>
                    <div className="item">
                        <label htmlFor="">Port:</label>
                        <TextField type="number" value={port || ''} onChange={this.handleInput.bind(null, 'port')} />
                    </div>
                    <div className="item">
                        <label htmlFor="">Enabled:</label>
                        <Checkbox checked={enabled} onChange={this.handleEnabled} />
                    </div>
                    <Button variant="contained" color="primary" type="submit">保存信息</Button>
                </form>
            </div>
        )
    }
}

export default EmailMange;
