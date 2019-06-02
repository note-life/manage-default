import React from 'react';
import './index.pcss';

class ArchiveSelector extends React.Component {
    state = {
        allTags: ['aaa', 'bbb', 'ccc', 'ddd', 'eee', 'ffff'],
        value: ['aaa', 'bbb', 'cc'],
        actived: false
    }

    static getDerivedStateFromProps ({ value }, state) {
        if (value) {
            return { value };
        }

        return null;
    }

    componentDidMount() {
        document.body.addEventListener('click', (e) => {
            this.setState({ actived: false });
        }, false);
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
        const { actived, value, allTags } = this.state;

        return (
            <div className="archive-selector" onClick={this.clickHandler}>
                <div className="value-input" onClick={this.showOptions}>
                    {value.map((tag, i) => (<div key={i}>{tag} <i className="material-icons" onClick={this.handleDel.bind(null, tag)}>close</i></div>))}
                </div>
                <div className={`options ${actived ? 'actived' : ''}`}>
                    {allTags.map((tag, i) => (<div key={i} className={value.includes(tag) ? 'selected' : ''} onClick={this.handleAdd.bind(null, tag)}>{tag}</div>))}
                </div>
            </div>
        );
    }
}

export default ArchiveSelector;
