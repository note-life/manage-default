import React, {  PureComponent} from 'react';
import './index.pcss';

class PermissionPicker extends PureComponent {
    state = {
        value: this.props.value || [],
        permissions: ['admin', 'invite', 'remove']
    }

    static getDerivedStateFromProps({ value, onChange }, state) {
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

    handleSelect = (item) => {
        let { value } = this.state;

        if (value.includes(item)) {
            value = value.filter(v => v !== item);

        } else {
            value.push(item);
            value = [...value];
        }

        this.updateValue(value);
    }

    render() {
        const { value, permissions } = this.state;

        return (
            <div className="permission-picker">
                {permissions.map((v) => (<div key={v} className={value.includes(v) ? 'actived' : ''} onClick={this.handleSelect.bind(null, v)}>{v}</div>))}
            </div>
        );
    }
}

PermissionPicker.defaultProps = {
    value: []
};

export default PermissionPicker;

