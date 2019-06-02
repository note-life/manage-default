import React from 'react';
import './index.pcss';

class TagSelector extends React.Component {
    state = {
        tags: this.props.tags,
        value: this.props.value,
        actived: false
    }

    static getDerivedStateFromProps ({ value, onChange }, state) {
        if (value !== state.value && onChange) {
            return { value };
        }

        return null;
    }

    bodyClickHandler = (e) => {
        this.setState({ actived: false });
    }

    componentDidMount() {
        document.body.addEventListener('click', this.bodyClickHandler, false);
    }

    componentWillUnmount() {
        this.setState({
            tags: [],
            value: [],
            actived: false
        });
        document.body.removeEventListener('click', this.bodyClickHandler, false);
    }

    updateValue = (() => {
        if (this.props.onChange) {
            return this.props.onChange;
        }

        return (value) => {
            this.setState({ value });
        }
    })()

    clickHandler = (e) => {
        if (e.target.className !== 'value-input') {
            e.stopPropagation();
        }
    }

    showOptions = (e) => {
        this.setState({ actived: true });
    }

    handleDel = (tag) => {
        const { value } = this.state;

        this.updateValue(value.filter(v => v !== tag));
    }

    handleAdd = (tag) => {
        const { value } = this.state;

        value.push(tag);
        this.updateValue(value)
    }

    render() {
        const { actived, value, tags } = this.state;

        return (
            <div className="tag-selector" onClick={this.clickHandler}>
                <div className="value-input" onClick={this.showOptions}>
                    {value.map((tag, i) => (<div key={i}>{tag} <i className="material-icons" onClick={this.handleDel.bind(null, tag)}>close</i></div>))}
                </div>
                <div className={`options ${actived ? 'actived' : ''}`}>
                    {tags.map(({ name, _id }) => (<div key={_id} className={value.includes(name) ? 'selected' : ''} onClick={this.handleAdd.bind(null, name)}>{name}</div>))}
                </div>
            </div>
        );
    }
}

TagSelector.defaultProps = {
    value: [],
    tags: []
};

export default TagSelector;
