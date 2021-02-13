import React, { PureComponent } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import message from '@components/message';
import { getData, putJSON, postJSON } from '@helper/fetch';
import './index.pcss';

class FriendLinks extends PureComponent {
    state = {
        links: []
    }

    componentDidMount() {
        this.fetchLinks();
    }

    handleInput = (field, id, e) => {
        const { links } = this.state;

        links.forEach((link) => {
            if (link.id === id) {
                link[field] = e.target.value;
            }
        });

        this.setState({ links: [...links] });
    }

    handleAdd = () => {
        const { links } = this.state;

        links.push({ id: Math.random() });
        this.setState({ links: [...links] });
    }

    handleDel = (id) => {
        const { links } = this.state;

        this.setState({ links: links.filter((link) => link.id !== id) });
    }

    fetchLinks = async () => {
        const headers = { ut: localStorage.getItem('ut') };
        const res = await getData(`/configurations`, { key: 'FRIEND_LINKS' }, headers);

        if (res.error) {
            message.error(res.error.message);
        } else {
            const { options = [], _id } = res || {};

            if (!_id) return;

            this.setState({ _id, links: options });
        }
    }

    handleSubmit = async (e) => {
        e.preventDefault();

        const { links, _id } = this.state;
        const headers = { ut: localStorage.getItem('ut') };
        const data = {
            key: 'FRIEND_LINKS',
            name: '友链',
            freeze: true,
            private: false,
            options: links
        }
        const res = _id ? await putJSON(`/configurations/${_id}`, data, headers) : await postJSON('/configurations', data, headers);

        if (res.error) {
            message.error(res.error.message);
        } else {
            message.success('设置成功');
        }

    }

    render() {
        const { links} = this.state;

        return (
            <div className="friend-links">
                <form action="" onSubmit={this.handleSubmit}>
                    <Button className="save-button" type="submit" variant="contained" color="primary">保存</Button>
                    <div className="links">
                        {
                            links.map(({ name, url, logo, id }, i) => (
                                <div className="link-item" key={id}>
                                    <h1>{i + 1}.</h1>
                                    <IconButton onClick={this.handleDel.bind(null, id)}><i className="material-icons">delete</i></IconButton>
                                    <div>
                                        <label htmlFor="">名称:</label>
                                        <TextField type="text" value={name || ''} onChange={this.handleInput.bind(null, 'name', id)} />
                                    </div>
                                    <div>
                                        <label htmlFor="">链接:</label>
                                        <TextField type="text" value={url || ''} onChange={this.handleInput.bind(null, 'url', id)} />
                                    </div>
                                    <div>
                                        <label htmlFor="">logo:</label>
                                        <TextField type="text" value={logo || ''} onChange={this.handleInput.bind(null, 'logo', id)} />
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                    <Button onClick={this.handleAdd} className="add-button" variant="outlined"><i className="material-icons">add</i>添加友链</Button>
                </form>
            </div>
        )
    }
}

export default FriendLinks;
