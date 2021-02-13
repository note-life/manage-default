import React from 'react';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import TagManage from './components/tag-manage';
import ArchiveManage from './components/archive-manage';
import SiteManage from './components/site-manage';
import EmailMange from './components/email-manage';
import OssManage from './components/oss-manage';
import FriendLinks from './components/friend-links';

import { getSiginedUserInfo } from '@helper/utils';


class Configuations extends React.Component {
    state = {
        activedTab: '0'
    }

    handleTab = (e, activedTab) => {
        this.setState({ activedTab })
    }

    render() {
        const { activedTab } = this.state;
        const { permissions = [] } = getSiginedUserInfo();

        return (
          <>
            <Paper square className="configuations-wrapper">
                <Tabs value={activedTab} variant="scrollable" indicatorColor="primary" textColor="primary" onChange={this.handleTab}>
                    <Tab value="0" label="站点管理" />
                    <Tab value="1" label="Tags 管理" />
                    <Tab value="2" label="Archive 管理" />
                    <Tab value="3" label="友链设置" />
                    {permissions.includes('admin') && <Tab value="4" label="邮箱设置" />}
                    {permissions.includes('admin') && <Tab value="5" label="对象存储" />}
                    <Tab value="6" label="其它" />
                </Tabs>
            </Paper>
            {activedTab === '0' && <SiteManage />}
            {activedTab === '1' && <TagManage />}
            {activedTab === '2' && <ArchiveManage />}
            {activedTab === '3' && <FriendLinks />}
            {activedTab === '4' && <EmailMange />}
            {activedTab === '5' && <OssManage />}
            {activedTab === '6' && <div style={{ padding: 20 }}>开发中构思中... <a href="https://github.com/note-life/manage-default" target="_blank">协助我一起?</a></div>}
          </>
        );
    }
}

export default Configuations;
