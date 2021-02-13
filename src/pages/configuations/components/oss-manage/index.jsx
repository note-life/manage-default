import React from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import QiniuOSS from './qiniu-oss';
import AliOSS from './ali-oss';
import './index.pcss';

function TabPanel(props) {
    const { children, value, index } = props;
  
    return value === index && (
        <div
            className="tabpanel"
            role="tabpanel"
        >
            {children}
        </div>
    );
}

class OssManage extends React.PureComponent {
    state = {
        activeTab: 'ali'
    }

    handleTab = (e, activeTab) => {
        this.setState({ activeTab });
    }

    render() {
        const { activeTab } = this.state;

        return (
            <div className="oss-manage">
                <Tabs
                    value={activeTab}
                    indicatorColor="primary"
                    textColor="primary"
                    orientation="vertical"
                    variant="scrollable"
                    onChange={this.handleTab}
                >
                    <Tab value="ali" label="阿里云" />
                    <Tab value="qiniu" label="七牛云" />
                </Tabs>
                <TabPanel index="ali" value={activeTab}><AliOSS /></TabPanel>
                <TabPanel index="qiniu" value={activeTab}><QiniuOSS /></TabPanel>
            </div>
        );
    }
}

export default OssManage;
