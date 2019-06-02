import React, { PureComponent } from 'react';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import './index.pcss';

class SiteInput extends PureComponent {
    state = {
        value: this.props.value || []
    }

    static getDerivedStateFromProps({ value = [], onChange }, state) {
        if (value !== state.value && onChange) {
            return { value };
        }

        return null;
    }

    updateValue = (() => {
        if (this.props.onChange) {
            return this.props.onChange;
        }

        return (value) => {
            this.setState({ value });
        }
    })()

    handleName = (_id, e) => {
        const { value } = this.state;

        value.forEach((v) => {
            if (v._id === _id) {
                v.name = e.target.value;
            }
        });

        this.updateValue([...value]);
    }

    handleUrl = (_id, e) => {
        const { value } = this.state;

        value.forEach((v) => {
            if (v._id === _id) {
                v.url = e.target.value;
            }
        });

        this.updateValue([...value]);
    }

    handleDel = (_id) => {
        const { value } = this.state;

        this.updateValue(value.filter((v) => v._id !== _id));
    }

    handleAdd = () => {
        const { value } = this.state;

        value.push({ _id: Math.random() });

        if (value.length > 4) return;

        this.updateValue([...value]);
    }

    render() {
        const { value } = this.state;

        return (
            <div className="site-input-wrapper">
                {
                    value.map(({ name, url, _id }) => (
                        <div key={_id}>
                            <TextField value={name || ''} onChange={this.handleName.bind(null, _id)} className="site-name" placeholder="name" />
                            <TextField value={url || ''} onChange={this.handleUrl.bind(null, _id)} className="site-url" placeholder="url" />
                            <IconButton onClick={this.handleDel.bind(null, _id)}><i className="material-icons">delete</i></IconButton>
                        </div>
                    ))
                }
                {value.length < 4 && <Button onClick={this.handleAdd} className="add-button" variant="outlined"><i className="material-icons">add</i>添加站点</Button>}
            </div>
        );
    }
}

export default SiteInput;

