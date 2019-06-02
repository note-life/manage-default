import React, { useState } from 'react';
import { NavLink, withRouter, Link } from 'react-router-dom';
import IconButton from '@material-ui/core/IconButton';
import LightTooltip from '@components/light-tooltip';
import message from '@components/message';
import LazyImg from '@components/lazy-img';
import confirm from '@components/confirm';
import { postJSON } from '@helper/fetch';
import { formatDate, getSiginedUserInfo } from '@helper/utils';
import './index.pcss';

const handleSignOut = (history) => {
    confirm({
        title: '提示',
        content: '确认退出登录？',
        onOk: async () => {
            const res = await postJSON('/users/revoke', null, { ut: localStorage.getItem('ut') });

            if (res.error && res.error.type !== 'authentication_error') {
                message.error(res.error.message);
            }

            localStorage.clear();
            history.push('/');
        }
    });
};

const navPathName = {
    '/summary': '概要',
    '/notes': '文章',
    '/users': '用户',
    '/configuations': '设置'
};

const layout = (WrappedComponent) => {
    return class CP extends React.Component {
        state = {
            title: '概要',
            visible: localStorage.getItem('hideAside') === 'true' || false,
        }

        componentDidMount() {
            window.addEventListener('pushState', (e) => {
                const path = e.arguments[2];
                let title = navPathName[path];
        
                if (!title) {
                    if (/users/.test(path)) {
                        title = '用户';
                    }
        
                    if (/notes/.test(path)) {
                        title = '文章';
                    }
                }
        
                document.title = `NOTE.LIFE ${title}`;
            }, false);
        }

        handleAside = () => {
            const { visible } = this.state;

            this.setState({ visible: !visible })
            localStorage.setItem('hideAside', !visible);
        }

        render() {
            const user = getSiginedUserInfo();
            const { handleAside, props } = this;
            const { visible } = this.state;

            return (
                <div className={`layout-wrapper ${visible ? '' : 'hide'}`}>
                    <div className="aside">
                        <div className="brand">Note.Life</div>
                        <div className="avator">
                            <Link to={`/users/${user._id}`}><img src={user.avator} alt="avator"/></Link>
                            <h1>{user.nickname}</h1>
                            <p>上次登录: {formatDate(user.authTime)}</p>
                        </div>
                        <div className="nav-items">
                            <NavLink exact to="/summary" activeClassName="actived">
                                <i className="material-icons">show_chart</i>
                                概要
                            </NavLink>
                            <NavLink to="/notes" activeClassName="actived">
                                <i className="material-icons">insert_drive_file</i>
                                文章
                            </NavLink>
                            <NavLink to="/users" activeClassName="actived">
                                <i className="material-icons">group</i>
                                用户
                            </NavLink>
                            <NavLink to="/configuations" activeClassName="actived">
                                <i className="material-icons">settings</i>
                                设置
                            </NavLink>
                        </div>
                    </div>
                    <div className="small-aside">
                        <div className="avator">
                            <Link to={`/users/${user._id}`}><img src={user.avator} alt="avator"/></Link>
                        </div>
                        <div className="nav-items">
                            <LightTooltip title="概要" placement="right">
                                <NavLink exact to="/summary" activeClassName="actived">
                                    <i className="material-icons">show_chart</i>
                                </NavLink>
                            </LightTooltip>
                            <LightTooltip title="文章" placement="right">
                                <NavLink to="/notes" activeClassName="actived">
                                    <i className="material-icons">insert_drive_file</i>
                                </NavLink>
                            </LightTooltip>
                            <LightTooltip title="用户" placement="right">
                                <NavLink to="/users" activeClassName="actived">
                                    <i className="material-icons">group</i>
                                </NavLink>
                            </LightTooltip>
                            <LightTooltip title="设置" placement="right">
                                <NavLink to="/configuations" activeClassName="actived">
                                    <i className="material-icons">settings</i>
                                </NavLink>
                            </LightTooltip>
                        </div>
                    </div>
                    <div className="top-bar">
                        <div className="left">
                            <IconButton onClick={handleAside}><i className="material-icons">{visible ? 'close' : 'menu'}</i></IconButton>
                            <h1>{document.title.split(' ')[1]}</h1>
                        </div>
                        <div className="right">
                            {/* <IconButton className="has-notifications"><i className="material-icons">notifications_none</i></IconButton> */}
                            <IconButton onClick={handleSignOut.bind(null, props.history)}><i className="material-icons">exit_to_app</i></IconButton>
                        </div>
                    </div>
                    <WrappedComponent {...this.props} />
                </div>
            );
        }
    }
};

export default layout;
