import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import LightTooltip from '@components/light-tooltip';
import message from '@components/message';
import { getData, postJSON } from '@helper/fetch';
import './index.pcss';

const statusIcons = {
    removed: (<LightTooltip title="已删除" placement="top"><i className="material-icons"> block </i></LightTooltip>),
    inactivated: (<LightTooltip title="未激活" placement="top"><i className="material-icons">https</i></LightTooltip>),
    actived:  (<LightTooltip title="已激活" placement="top"><i className="material-icons">done</i></LightTooltip>),
}

class UsersPage extends PureComponent {
    state = {
        userStatus: localStorage.getItem('userStatus') || 'all',
        email: '',
        users: [],
        filterUsers: [],
        open: false
    }

    componentDidMount() {
        this.fetchUsers();
    }

    fetchUsers = async () => {
        const headers = { ut: localStorage.getItem('ut') };
        const res = await getData('/users', null, headers);

        if (res.error) {
            message.error(res.error.message);
        } else {
            this.setState({ users: res, filterUsers: res });
            this.filterUsers(this.state.userStatus);
        }
    }

    filterUsers = (status) => {
        if (status === 'all') {
            this.setState(({ users }) => ({
                filterUsers: users
            }));
        } else {
            this.setState(({ users }) => ({
                filterUsers: users.filter((user) => user.status === status)
            }));
        }
    }

    filterUserStatus = (e) => {
        const userStatus = e.target.value;

        this.setState({ userStatus });
        localStorage.setItem('userStatus', userStatus);
        this.filterUsers(userStatus);
    }

    handleEmail = (e) => {
        this.setState({ email: e.target.value });
    }

    showInviteModal = () => {
        this.setState({ open: true });
    }

    closeInviteModal = () => {
        this.setState({ open: false });
    }

    handleOk = async () => {
        const headers = { ut: localStorage.getItem('ut') };
        const data = { email: this.state.email };
        const res = await postJSON('/users', data, headers);

        if (res.error) {
            message.error(res.error.message);
        } else {
            message.success('已发送邀请邮件');
            this.fetchUsers();
            this.closeInviteModal();
        }
    }

    render() {
        const { open, email, userStatus, filterUsers } = this.state;

        return (
            <div className="users-page">
                <div className="header">
                    <Select value={userStatus} onChange={this.filterUserStatus} className="filter-selector">
                        <MenuItem value="all">全部</MenuItem>
                        <MenuItem value="actived">已激活</MenuItem>
                        <MenuItem value="inactivated">未激活</MenuItem>
                        <MenuItem value="removed">已删除</MenuItem>
                    </Select>
                    <Button variant="outlined" onClick={this.showInviteModal}>
                        <i className="material-icons">person_add</i> Invite
                    </Button>
                </div>
                <div className="content">
                    {
                        filterUsers.map(({ avator, _id, nickname, joinedDate, status }, i) => (
                            <div className={`user ${status}`} key={_id}>
                                <div className="avator"> <img src={avator} alt="avator"/></div>
                                <div className="info">
                                    <h1>{statusIcons[status]}{nickname}</h1>
                                    <p>
                                        <span>Joined {joinedDate.split('T')[0]}</span>
                                        <Link to={`/users/${_id}`}><i className="material-icons">border_color</i></Link>
                                    </p>
                                </div>
                            </div>
                        ))
                    }
                </div>
                <Modal
                    className="invite-modal-wrapper"
                    open={open}
                    onClose={this.closeInviteModal}
                >
                    <div className="modal-content">
                        <header>
                            <h1>邀请小伙伴</h1>
                        </header>
                        <main>
                            <TextField
                                fullWidth
                                placeholder="请输入邮箱地址"
                                value={email}
                                onChange={this.handleEmail}
                                type="email"
                            />
                        </main>
                        <footer>
                            <Button color="primary" onClick={this.closeInviteModal}>Cancel</Button>
                            <Button color="primary" onClick={this.handleOk}>OK</Button>
                        </footer>
                    </div>
                </Modal>
            </div>
        );
    }
}

export default UsersPage;