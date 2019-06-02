import React, { useState } from 'react';
import PicUploader from '@components/pic-uploader';
import { getData } from '@helper/fetch';
import './index.pcss';

class CustomizeEmojiList extends React.Component {
    state = {
        emojis: []
    }

    componentDidMount() {
        this.fetchCustomerEmojis();
    }

    fetchCustomerEmojis = async () => {

    }

    render() {
        const { emojis } = this.state;

        return (
            <div className="customize-emoji-list">
                <PicUploader disabled />
                {emojis.map((v, i) => <img src={v} alt="emoji" key={i} />)}
                <p className="todo">开发中。。。<a href="https://github.com/note-life/manage-default" target="_blank">协助我一起?</a></p>
            </div>
        );
    }
}

export default CustomizeEmojiList;
