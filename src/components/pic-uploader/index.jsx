import React from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import LazyImg from '@components/lazy-img';
import message from '@components/message';

import { post } from '@helper/fetch';
import './index.pcss'


class PicUploader extends React.Component {
    state = { value: this.props.value }

    static getDerivedStateFromProps({ value }, state) {
        if (value !== state.value) {
            return { value };
        }

        return null;
    }

    componentDidMount() {
        // this.fileInput && this.fileInput.on
    }

    updateValue = (() => {
        if (this.props.onChange) {
            return this.props.onChange;
        }

        return (value) => {
            this.setState({ value });
        }
    })()

    handleDel = () => {
        this.updateValue('');
        this.setState({ base64: '' });
    }

    fileChange = async (e) => {
        const formData = new FormData();
        const file = this.fileInput.files[0];

        formData.append('image', file);

        const reader = new FileReader();

        reader.readAsDataURL(file);
        reader.onload = (e) => {
            this.setState({ base64: e.target.result });
        }

        this.setState({ uploading: true });
        const res = await post('/upload', formData, { ut: localStorage.getItem('ut') });

        if (res.error) {
            this.updateValue('');
            this.setState({ base64: '' });
            message.error(res.error.message);
        } else {
            const { host, paths } = res;

            this.updateValue(`//${host}/${paths[0]}.webp`);
        }
        this.setState({ uploading: false })
    }

    render() {
        const { disabled } = this.props;
        const { value, base64, uploading } = this.state;
        const imgSrc = base64 || value;

        return (
            <div className={`pic-uploader-wrapper ${disabled ? 'disabled' : ''}`} ref={(ref) => this.form = ref}>
                {
                    imgSrc ?
                        <div className={`img ${uploading ? 'uploading' : ''}`}>
                            <div className="menu">
                                {uploading ? <p>上传中...</p> : <i className="material-icons" onClick={this.handleDel}>delete</i>}
                            </div>
                            <img src={base64 || value} />
                        </div>
                        : <div className="empty"><input type="file" accept="image/jpeg, image/jpg, image/png, image/gif, image/webp" ref={(ref) => this.fileInput = ref} onChange={this.fileChange} /><i className="material-icons" onClick={this.handleDel}>cloud_upload</i></div>
                }
                {uploading && <div className="uploading"><LinearProgress /></div>}
            </div>
        );
    }
}

export default PicUploader;
