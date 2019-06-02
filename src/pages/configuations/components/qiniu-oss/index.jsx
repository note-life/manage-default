import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import message from '@components/message';
import { getData, putJSON, postJSON } from '@helper/fetch';
import './index.pcss';

class QiniuOSS extends React.Component {
    state = {
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
        const res = await getData(`/configurations`, { key: 'QINIU_OSS' }, headers);

        if (res.error) {
            message.error(res.error.message);
        } else {
            const { _id, options, enabled } = res[0] || {};

            this.setState({ _id, ...options, enabled });
        }
    }

    handleSubmit = async (e) => {
        e.preventDefault();

        const { accessKey, secretKey, scope, enabled, domain, _id } = this.state;
        const headers = { ut: localStorage.getItem('ut') };
        const data = {
            key: 'QINIU_OSS',
            name: '七牛云对象储存',
            freeze: true,
            private: true,
            enabled: enabled,
            options: {
                accessKey,
                secretKey,
                scope,
                domain
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
        const { accessKey, secretKey, scope, domain, enabled = false, visible } = this.state;

        return (
            <div className="email-manage">
                <div className="help-tips">
                    七牛 Node.js SDK 的所有的功能，都需要合法的授权。授权凭证的签算需要七牛账号下的一对有效的<strong>Access Key</strong>和<strong>Secret Key</strong>，这对密钥可以通过如下步骤获得： 
                    <ul>
                        <li><a href="https://portal.qiniu.com/signup" rel="noopener noreferrer" target="_blank">点击注册🔗开通七牛开发者帐号 </a></li>
                        <li>如果已有账号，直接登录七牛开发者后台，<a href="https://portal.qiniu.com/user/key" rel="noopener noreferrer" target="_blank">点击这里🔗</a>查看 Access Key 和 Secret Key</li>
                    </ul>
                </div>
                <form action="" onSubmit={this.handleSubmit}>
                    <div className="item">
                        <label htmlFor="">AccessKey:</label>
                        <TextField type="text" value={accessKey || ''} onChange={this.handleInput.bind(null, 'accessKey')} />
                    </div>
                    <div className="item">
                        <label htmlFor="">SecretKey:</label>
                        <TextField value={secretKey || ''} type={visible ? 'text' : 'password'} onChange={this.handleInput.bind(null, 'secretKey')} />
                        <span className="toggle-password" onClick={this.togglePassword}>{visible ? '隐藏' : '显示'}</span>
                    </div>
                    <div className="item">
                        <label htmlFor="">Scope:</label>
                        <TextField value={scope || ''} placeholder="空间名称" onChange={this.handleInput.bind(null, 'scope')} />
                    </div>
                    <div className="item">
                        <label htmlFor="">Domain:</label>
                        <TextField value={domain || ''} placeholder="公开访问的域名" onChange={this.handleInput.bind(null, 'domain')} />
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

export default QiniuOSS;
