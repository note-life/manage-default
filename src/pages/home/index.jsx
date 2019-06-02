import React from 'react';
import message from '@components/message';
import { getData } from '@helper/fetch';
import { filterUserAgentInfo } from '@helper/utils';
import './index.pcss';

const browserColors = {
    chrome: '#00bcd4',
    firefox: '#ff9800',
    ie: '#3f51b5',
    edge: '#9e9e9e',
    safari: '#4caf50',
    opera: '#795548',
    others: '#9e9e9e'
};

const filterPv = (data) => {
    const devices = new Map();
    const browsers = new Map();
    const len = data.length;
    const deviceProportion = {};
    const browserProportion = {};

    data.forEach(({ userAgent }) => {
        const { device, browser } = filterUserAgentInfo(userAgent);   
        const deviceCount = devices.get(device);
        const browserCount = browsers.get(browser);
        
        if (deviceCount) {
            devices.set(device, deviceCount + 1);
        } else {
            devices.set(device, 1);
        }

        if (browserCount) {
            browsers.set(browser, browserCount + 1);
        } else {
            browsers.set(browser, 1);
        }
    });

    [...devices.keys()].forEach((key) => {
        deviceProportion[key] = (devices.get(key) / len / 0.01).toFixed(2) + '%';
    });

    [...browsers.keys()].forEach((key) => {
        browserProportion[key] = (browsers.get(key) / len / 0.01).toFixed(2) + '%';
    });

    return { deviceProportion, browserProportion };
}



class Homepage extends React.Component {
    state = {
        notes: {},
        users: {},
        pv: [],
        tags: {}
    }

    componentDidMount() {
        document.title = 'NOTE.LIFE.概览';
        this.fetchSummary();
    }

    fetchSummary = async () => {
        const headers = { ut: localStorage.getItem('ut') };
        const res = await getData(`/summary`, null, headers);

        if (res.error) {
            message.error(res.error.message);
        } else {
            this.setState({ ...res });
        }
    }

    render() {
        const { notes, users, pv, tags } = this.state;
        const { deviceProportion, browserProportion } = filterPv(pv);

        return (
            <div className="home-page">
                <div className="items">
                    <div className="item">
                        <h1>所有文章</h1>
                        <h2>{notes.total} <span>篇</span> </h2>
                        <ul>
                            <li><i className="material-icons public-icon">public</i>公开: {notes.public}</li>
                            <li><i className="material-icons draft-icon">schedule</i>草稿: {notes.draft}</li>
                            <li><i className="material-icons private-icon">lock</i>私密: {notes.private}</li>
                        </ul>
                        <i className="material-icons">insert_drive_file</i>
                    </div>
                    <div className="item">
                        <h1>所有用户</h1>
                        <h2>{users.total} <span>个</span>  </h2>
                        <ul>
                            <li><i className="material-icons done-icon">done</i>已激活 {users.actived}</li>
                            <li><i className="material-icons lock-icon">lock</i>未激活: {users.inactivated}</li>
                            <li><i className="material-icons block-icon">block</i>已删除: {users.removed}</li>
                        </ul>
                        <i className="material-icons users">group</i>
                    </div>
                    <div className="item">
                        <h1>所有标签</h1>
                        <h2 style={{ fontSize: 72, marginTop: 40 }}>{tags.total} <span>个</span>  </h2>
                        <i className="material-icons tags">loyalty</i>
                    </div>
                </div>
                <div className="pv">
                    <h1>PV</h1>
                    <div>
                        <p>{pv.length} 人次</p>
                    </div>
                    <h1>设备</h1>
                    <div className="percentage">
                        {Object.keys(deviceProportion).map((key) => (
                            key === 'mobile' ? (
                                <div className="mobile" style={{ width: deviceProportion[key] }}><i className="material-icons">smartphone</i></div>
                            ) : (
                                <div className="desktop" style={{ width: deviceProportion[key] }}><i className="material-icons">laptop</i></div>
                            )
                        ))}
                    </div>
                    <div className="info">
                        {Object.keys(deviceProportion).map((key) => (
                            key === 'mobile' ? (
                                <div key={key} className="device mobile"> <p>Mobile</p> <h1>{deviceProportion[key]}</h1> </div>
                            ) : (
                                <div key={key} className="device desktop"> <p>Desktop</p> <h1>{deviceProportion[key]}</h1> </div>
                            )
                        ))}
                    </div>

                    <hr/>
                    <h1>浏览器</h1>
                    <div className="percentage">
                        {Object.keys(browserProportion).map((key) => (
                            <div key={key} className={key} style={{ width: browserProportion[key], background: browserColors[key] }}></div>
                        ))}
                    </div>
                    <div className="info">
                        {Object.keys(browserProportion).map((key) => (
                            <div className="device" key={key}>
                                <p>{key}</p>
                                <h1 style={{ color: browserColors[key] }}>{browserProportion[key]}</h1>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
}

export default Homepage;