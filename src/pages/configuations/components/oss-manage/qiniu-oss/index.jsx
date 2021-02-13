import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import message from '@components/message';
import { getData, putJSON, postJSON } from '@helper/fetch';
import './index.pcss';

class QiniuOSS extends React.Component {
    state = {
        enabled: false,
        options: {
            acrive: null,
            list: []
        }
    }

    componentDidMount() {
        this.fetchOSSConfig();
    }

    togglePassword = () => {
        this.setState({ visible: !this.state.visible });
    }

    handleInput = (field, e) => {
        const activeData = this.state.options.list.find(v => v.type === 'qiniu-oss') || {};

        activeData[field] =  e.target.value;
        this.setState({ options: this.state.options });
    }

    handleEnabled = (e) => {
        const { options, oldActive } = this.state;
        const enabled = e.target.checked;

        options.active = enabled ? 'qiniu-oss' : (oldActive === 'qiniu-oss' ? null : oldActive);
        this.setState({ options });
    }

    fetchOSSConfig = async () => {
        const headers = { ut: localStorage.getItem('ut') };
        const res = await getData(`/configurations`, { key: 'OSS' }, headers);

        if (res.error) {
            message.error(res.error.message);
        } else {
            const { _id, options } = res || {};
            const activeData = options.list.find(v => v.type === 'qiniu-oss');
            const emptyData = {
                type: 'qiniu-oss',
                accessKey : '',
                secretKey: '',
                scope: '',
                domain: '',
            };

            console.log('activeData', activeData)

            if (_id) {
                if (!activeData) {
                    options.list.push(emptyData);
                }

                this.setState({
                    _id,
                    options,
                    oldActive: options.active
                });
            } else {
                this.setState({
                    options: {
                        list: [emptyData]
                    }
                });
            }
        }
    }

    handleSubmit = async (e) => {
        e.preventDefault();

        const { options, _id } = this.state;
        const headers = { ut: localStorage.getItem('ut') };
        const data = {
            key: 'OSS',
            name: '对象储存',
            freeze: true,
            private: true,
            enabled: true,
            options
        };
        const res = _id ? await putJSON(`/configurations/${_id}`, data, headers) : await postJSON('/configurations', data, headers);

        if (res.error) {
            message.error(res.error.message);
        } else {
            message.success('设置成功');
        }

    }

    render() {
        const { visible, options } = this.state;
        const activeData = options.list.find(v => v.type === 'qiniu-oss') || {};

        return (
            <div className="oss-config">
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
                        <TextField type="text" value={activeData.accessKey || ''} onChange={this.handleInput.bind(null, 'accessKey')} />
                    </div>
                    <div className="item">
                        <label htmlFor="">SecretKey:</label>
                        <TextField value={activeData.secretKey || ''} type={visible ? 'text' : 'password'} onChange={this.handleInput.bind(null, 'secretKey')} />
                        <span className="toggle-password" onClick={this.togglePassword}>{visible ? '隐藏' : '显示'}</span>
                    </div>
                    <div className="item">
                        <label htmlFor="">Scope:</label>
                        <TextField value={activeData.scope || ''} placeholder="空间名称" onChange={this.handleInput.bind(null, 'scope')} />
                    </div>
                    <div className="item">
                        <label htmlFor="">Domain:</label>
                        <TextField value={activeData.domain || ''} placeholder="公开访问的域名" onChange={this.handleInput.bind(null, 'domain')} />
                    </div>
                    <div className="item">
                        <label htmlFor="">Enabled:</label>
                        <Checkbox checked={options.active === 'qiniu-oss'} onChange={this.handleEnabled} />
                        启用后将禁用其它对象储存
                    </div>
                    <Button variant="contained" color="primary" type="submit">保存信息</Button>
                </form>
            </div>
        )
    }
}

export default QiniuOSS;
