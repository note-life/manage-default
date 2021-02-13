import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import message from '@components/message';
import SiteInput from '@components/site-input';
import { getData, putJSON, postJSON } from '@helper/fetch';
import './index.pcss';

class SiteManage extends React.Component {
    state = {
        enabled: true,
        associatedLinks: [],
        title: '',
        subTitle: '',
        description: ''
    }

    componentDidMount() {
        this.fetchSiteInfo();
    }

    togglePassword = () => {
        this.setState({ visible: !this.state.visible });
    }

    handleInput = (field, e) => {
        let val;

        if (field === 'associatedLinks') {
            val = e;
        } else {
            val = e.target.value;
        }

        this.setState({ [field]: val });
    }

    fetchSiteInfo = async () => {
        const headers = { ut: localStorage.getItem('ut') };
        const res = await getData(`/configurations`, { key: 'SITE_INFO' }, headers);

        if (res.error) {
            message.error(res.error.message);
        } else {
            const { _id, options, enabled } = res || {};

            this.setState({ _id, ...options, enabled });
        }
    }

    handleSubmit = async (e) => {
        e.preventDefault();

        const { wrapper, title, subTitle, description, associatedLinks, _id } = this.state;
        const headers = { ut: localStorage.getItem('ut') };
        const data = {
            key: 'SITE_INFO',
            name: '站点信息',
            freeze: true,
            private: false,
            enabled: true,
            options: { wrapper, title, subTitle, description, associatedLinks }
        };
        const res = _id ? await putJSON(`/configurations/${_id}`, data, headers) : await postJSON('/configurations', data, headers);

        if (res.error) {
            message.error(res.error.message);
        } else {
            message.success('设置成功');
        }

    }

    render() {
        const { wrapper, title, subTitle, description, associatedLinks  } = this.state;

        return (
            <div className="site-manage">
                <form action="" onSubmit={this.handleSubmit}>
                    <div className="item">
                        <label htmlFor="">Wrapper:</label>
                        <TextField type="text" value={wrapper || ''} onChange={this.handleInput.bind(null, 'wrapper')} />
                    </div>
                    <div className="item">
                        <label htmlFor="">Title:</label>
                        <TextField type="text" value={title || ''} onChange={this.handleInput.bind(null, 'title')} />
                    </div>
                    <div className="item">
                        <label htmlFor="">Subtitle:</label>
                        <TextField type="text" value={subTitle || ''} onChange={this.handleInput.bind(null, 'subTitle')} />
                    </div>
                    <div className="item">
                        <label htmlFor="">Description:</label>
                        <TextField type="text" value={description || ''} onChange={this.handleInput.bind(null, 'description')} />
                    </div>
                    <div className="item">
                        <label htmlFor="">Associated Links:</label>
                        <SiteInput value={associatedLinks} onChange={this.handleInput.bind(null, 'associatedLinks')} />
                    </div>
                    <Button variant="contained" color="primary" type="submit">保存信息</Button>
                </form>
            </div>
        );
    }
}

export default SiteManage;
