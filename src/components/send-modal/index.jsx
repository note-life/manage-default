import React from 'react';
import Modal from '../modal';
import TextInput from '../text-input';
import Toggle from '../toggle';
import message from '../message';
import { postJSON } from '../../lib/fetch';
import './index.pcss';

class SendModal extends React.Component {
    state = {
        title: '',
        coverImg: '',
        archive: '',
        tags: '',
        visible: this.props.visible,
        data: this.props.data
    }

    componentWillReceiveProps ({ visible, data }) {
        if (this.state.visible !== visible) {
            this.setState({ visible });
        }

        if (data) {
            this.setState({ data });
        }
    }

    closeModal = () => {
        if (this.props.onClose) {
            this.props.onClose();
        } else {
            this.setState({ visible: false });
        }
    }

    showModal = () => {
        this.setState({ visible: true });
    }

    /**
     * 提交
     */
    handleSubmit = () => {
        const data = Object.assign({}, this.state.data, {
            title: this.state.title,
            coverImg: this.state.coverImg,
            archive: this.state.archive,
            tags: this.state.tags,
            draft: this.state.draft,
            private: this.state.private
        });
        const opt = {
            _ut: localStorage.getItem('_ut')
        };

        postJSON('/notes', data, opt).then(res => {
            if (res.error) {
                message.error(res.error.message);
            } else {
                message.success('发布成功');
                this.closeModal();
            }
        });
    }

    handleChange = (field, value) => {
        this.setState({ [field]: value });
    }

    render () {
        const { id } = this.state.data;

        return (
            <Modal
                className="send-modal-wrapper"
                visible={this.state.visible}
                onCancel={this.closeModal}
                onOk={this.handleSubmit}
                title={id ? '更新' : '发布'}
            >
                <div className="note-title">
                    <TextInput
                        value={this.state.title}
                        onChange={this.handleChange.bind(null, 'title')}
                        placeholder="标题"
                        name="title"
                    />
                </div>

                <div className="note-cover-img">
                    <TextInput
                        value={this.state.coverImg}
                        onChange={this.handleChange.bind(null, 'coverImg')}
                        placeholder="封面图(URL)"
                        name="coverImg"
                    />
                </div>

                <div className="note-archive">
                    <TextInput
                        value={this.state.archive}
                        onChange={this.handleChange.bind(null, 'archive')}
                        placeholder="归档"
                        name="archive"
                    />
                </div>

                <div className="note-tags">
                    <TextInput
                        value={this.state.tags}
                        onChange={this.handleChange.bind(null, 'tags')}
                        placeholder="标签(多个以逗号分隔)"
                        name="tags"
                    />
                </div>

                <div className="note-type">
                    <Toggle label="草稿" checked={this.state.draft} onChange={this.handleChange.bind(null, 'draft')} />
                    <Toggle label="私密" checked={this.state.private} onChange={this.handleChange.bind(null, 'private')} />
                </div>
            </Modal>
        );
    }
}

SendModal.defaultProps = {
    visible: false,
    data: {}
};

export default SendModal;