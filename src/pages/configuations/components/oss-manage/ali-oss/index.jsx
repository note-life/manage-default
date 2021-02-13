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
            active: null,
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
        const activeData = this.state.options.list.find(v => v.type === 'ali-oss') || {};

        activeData[field] =  e.target.value;
        this.setState({ options: this.state.options });
    }

    handleEnabled = (e) => {
        const { options, oldActive } = this.state;
        const enabled = e.target.checked;

        options.active = enabled ? 'ali-oss' : (oldActive === 'qiniu-oss' ? null : oldActive);
        this.setState({ options });
    }

    fetchOSSConfig = async () => {
        const headers = { ut: localStorage.getItem('ut') };
        const res = await getData(`/configurations`, { key: 'OSS' }, headers);

        if (res.error) {
            message.error(res.error.message);
        } else {
            const { _id, options } = res || {};
            const activeData = options ? options.list.find(v => v.type === 'ali-oss') : null;
            const emptyData = {
                type: 'ali-oss',
                region : '',
                accessKeyId: '',
                accessKeySecret: '',
                bucket: '',
                domain: ''
            };

            if (_id) {
                if (!activeData) {
                    options.list.push(activeData)
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
            options,
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
        const activeData = options.list.find(v => v.type === 'ali-oss') || {};

        return (
            <div className="oss-config">
                <div className="help-tips">
                    阿里云 OSS Node.js SDK 的所有的功能，都需要合法的授权。授权凭证的签算需要阿里云账号下的一对有效的 <strong>AccessKeyId</strong> 和 <strong>AccessKeySecret</strong>，这对密钥可以通过如下步骤获得： 
                    <ul>
                        <li><a href="https://www.aliyun.com/" rel="noopener noreferrer" target="_blank">点击注册🔗开通阿里云帐号 </a></li>
                        <li>如果已有账号，直接登录阿里云开后台，进入 RAM 访问控制页面，<a href="https://ram.console.aliyun.com/users" rel="noopener noreferrer" target="_blank">点击这里🔗</a>，进行新增用户（勾选编程访问），创建成功后便会看到 Access Key和 Secret Key，其中 Secret Key 需要及时记住，无法后续查看，否则再次创建 RAM 用户</li>
                        <li>给创建的 RAM 用户添加对象储存的读写权限，比如：<strong>AliyunOSSFullAccess</strong></li>
                        <li>详看<a href="https://help.aliyun.com/document_detail/63482.html">官方指导🔗</a></li>
                    </ul>
                </div>
                <form action="" onSubmit={this.handleSubmit}>
                    <div className="item">
                        <label htmlFor="">AccessKeyId:</label>
                        <TextField type="text" value={activeData.accessKeyId || ''} onChange={this.handleInput.bind(null, 'accessKeyId')} />
                    </div>
                    <div className="item">
                        <label htmlFor="">accessKeySecret:</label>
                        <TextField value={activeData.accessKeySecret || ''} type={visible ? 'text' : 'password'} onChange={this.handleInput.bind(null, 'accessKeySecret')} />
                        <span className="toggle-password" onClick={this.togglePassword}>{visible ? '隐藏' : '显示'}</span>
                    </div>
                    <div className="item">
                        <label htmlFor="">OSS Bucket:</label>
                        <TextField value={activeData.bucket || ''} placeholder="空间名称" onChange={this.handleInput.bind(null, 'bucket')} />
                    </div>
                    <div className="item">
                        <label htmlFor="">Region:</label>
                        <TextField value={activeData.region || ''} placeholder="OSS 服务时的地域，例如oss-cn-hangzhou" onChange={this.handleInput.bind(null, 'region')} />
                    </div>
                    <div className="item">
                        <label htmlFor="">Domain:</label>
                        <TextField value={activeData.domain || ''} placeholder="公开访问的域名" onChange={this.handleInput.bind(null, 'domain')} />
                    </div>
                    <div className="item">
                        <label htmlFor="">Enabled:</label>
                        <Checkbox checked={options.active === 'ali-oss'} onChange={this.handleEnabled} />
                        启用后将禁用其它对象储存
                    </div>
                    <Button variant="contained" color="primary" type="submit">保存信息</Button>
                </form>
            </div>
        )
    }
}

export default QiniuOSS;
