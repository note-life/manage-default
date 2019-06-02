import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import PicUploader from '@components/pic-uploader';
import PermissionPicker from '@components/permission-picker';
import SiteInput from '@components/site-input';
import message from '@components/message';
import confirm from '@components/confirm';
import { getData, putJSON } from '@helper/fetch';
import { getSiginedUserInfo } from '@helper/utils';
import './detail.pcss';

class UserDetailPage extends PureComponent {
    state = {
        user: {}
    }

    componentDidMount() {
        this.fetchUserInfo();
    }

    handleStatus = (status) => {
        const statusText = {
            removed: '移除',
            actived: '激活',
            inactivated: '撤销移除'
        };

        confirm({
            title: '提示',
            content: `确认${statusText[status]}改用户`,
            onOk: () => {
                this.channgeStatus(status);
            }
        });
    }

    channgeStatus = async (status) => {
        const userId = this.props.match.params.id;
        const headers = { ut: localStorage.getItem('ut') };
        const res = await putJSON(`/users/${userId}`, { status }, headers);

        if (res.error) {
            message.error(res.error.message);
        } else {
            this.props.history.push('/users');
        }
    }

    fetchUserInfo = async () => {
        const userId = this.props.match.params.id;
        const headers = { ut: localStorage.getItem('ut') };
        const res = await getData(`/users/${userId}`, null, headers);

        if (res.error) {
            message.error(res.error.message);
        } else {
            this.setState({ user: res });
        }
    }

    handleInput = (field, e) => {
        const { user } = this.state;

        if (field === 'avator' || field === 'sites' || field === 'permissions') {
            user[field] = e;
        } else {
            user[field] = e.target.value;
        }

        this.setState({ user: {...user} });
    }

    handleSubmit = async (type, e) => {
        e.preventDefault();

        const userId = this.props.match.params.id;
        const headers = { ut: localStorage.getItem('ut') };
        const { user } = this.state;
        
        let data = {};

        if (type === 'normal') {
            data = {
                nickname: user.nickname,
                email: user.email,
                intro: user.intro,
                avator: user.avator,
                sites: user.sites
            };
        }

        if (type === 'password') {
            data = {
                password: user.password,
                oldPassword: user.oldPassword
            };
        }

        if (type === 'permissions') {
            data = { permissions: user.permissions };
        }

        const res = await putJSON(`/users/${userId}`, data, headers);

        if (res.error) {
            message.error(res.error.message);
        } else {
            message.success('操作成功');
            this.setState({ user: res });
            const siginedUser = getSiginedUserInfo();

            userId === siginedUser._id && localStorage.setItem('user', JSON.stringify({...res}));
            this.props.history.push(`/users/${userId}/${(Date.now())}`);
        }
    }

    render() {
        const {
            nickname = '', email = '', avator, sites,
            intro = '', permissions = [], password = '',
            password2 = '', oldPassword = '', status
        } = this.state.user;
        const siginedUser = getSiginedUserInfo();

        const unEqualPassword = password !== password2;
        const disabled = ['removed', 'inactivated'].includes(status);
        const isAdmin = siginedUser.permissions.includes('admin');

        return (
            <div className="user-detail-page">
                <div className="header">
                    <Link to="/users">
                        <Button variant="outlined">
                            <i className="material-icons">keyboard_backspace</i> Back
                        </Button>
                    </Link>
                    <div>
                        {isAdmin && status !== 'removed' && <Button className="dele" variant="contained" onClick={this.handleStatus.bind(null, 'removed')}>
                            <i className="material-icons">delete</i> Remove
                        </Button>}
                        {isAdmin && status === 'removed' && <Button className="restore" variant="contained" onClick={this.handleStatus.bind(null, 'inactivated')}>
                            <i className="material-icons">restore</i> restore
                        </Button>}
                        {isAdmin && status === 'inactivated' && <Button className="active" variant="contained" onClick={this.handleStatus.bind(null, 'actived')}>
                            <i className="material-icons">how_to_reg</i> Active
                        </Button>}
                    </div>
                </div>
                <h1 className="sub-title sub-title-1">基础信息</h1>
                <form onSubmit={this.handleSubmit.bind(null, 'normal')}>
                    <div className="form-item">
                        <label>NickName: </label>
                        <TextField
                            disabled={disabled}
                            value={nickname}
                            onChange={this.handleInput.bind(null, 'nickname')}
                            variant="outlined"
                            placeholder="请输入昵称"
                        />
                    </div>
                    <div className="form-item">
                        <label>E-mail: </label>
                        <TextField
                            disabled={disabled}
                            value={email}
                            onChange={this.handleInput.bind(null, 'email')}
                            type="email"
                            variant="outlined"
                            placeholder="请输入邮箱地址"
                        />
                    </div>
                    <div className="form-item">
                        <label>Avator: </label>
                        <PicUploader
                            disabled={disabled}
                            value={avator}
                            onChange={this.handleInput.bind(null, 'avator')}
                        />
                    </div>
                    <div className="form-item">
                        <label>Introduction: </label>
                        <TextField
                            disabled={disabled}
                            multiline
                            rows="6"
                            value={intro}
                            onChange={this.handleInput.bind(null, 'intro')}
                            variant="outlined"
                            placeholder="请输入邮箱地址"
                        />
                    </div>
                    <div className="form-item">
                        <label>Sites: </label>
                        <SiteInput value={sites} onChange={this.handleInput.bind(null, 'sites')} />
                    </div>
                    {!disabled && <div className="form-item">
                        <Button variant="contained" color="primary" type="submit">保存信息</Button>
                    </div>}
                </form>
                <h1 className="sub-title">密码</h1>
                <form onSubmit={this.handleSubmit.bind(null, 'password')}>
                    <div className="form-item">
                        <label>Current Password: </label>
                        <TextField
                            disabled={disabled}
                            value={oldPassword}
                            onChange={this.handleInput.bind(null, 'oldPassword')}
                            variant="outlined"
                            type="password"
                            placeholder="当前密码"
                        />
                    </div>
                    <div className="form-item">
                        <label>New Password: </label>
                        <TextField
                            disabled={disabled}
                            error={unEqualPassword}
                            value={password}
                            onChange={this.handleInput.bind(null, 'password')}
                            variant="outlined"
                            type="password"
                            placeholder="新密码"
                        />
                    </div>
                    <div className="form-item">
                        <label>New Password(again): </label>
                        <TextField
                            disabled={disabled}
                            error={unEqualPassword}
                            value={password2}
                            onChange={this.handleInput.bind(null, 'password2')}
                            variant="outlined"
                            type="password"
                            placeholder="确认密码"
                        />
                    </div>
                    <div className="form-item">
                        <Button disabled={unEqualPassword || !oldPassword || !password} variant="contained" color="primary" type="submit">修改密码</Button>
                    </div>
                </form>
                {permissions.includes('admin') && <>
                <h1 className="sub-title">权限</h1>
                <form onSubmit={this.handleSubmit.bind(null, 'permissions')}>
                    <div className="form-item">
                        <label>Permissions: </label>
                        <PermissionPicker value={permissions} onChange={this.handleInput.bind(null, 'permissions')} />
                    </div>
                    <div className="form-item">
                        <Button variant="contained" color="primary" type="submit">修改权限</Button>
                    </div>
                </form>
                </>}
            </div>
        );
    }
}

export default UserDetailPage;