import React from 'react';
import ReactDOM from 'react-dom';

import Snackbar from '@components/snackbar';

class Message {
    ele = document.createElement('div');

    createNode() {
        this.ele && document.body.appendChild(this.ele);
    }

    handleClose() {
        this.open = false;
    }

    show = (text, type, undo) => {
        this.createNode();

        const props = { text, type, undo };

        if (this.ref) {
            this.ref.showMessage(props);
        } else {
            ReactDOM.render(<Snackbar {...props} ref={ref => this.ref = ref} />, this.ele);
        }
    }

    error = (text = '操作失败', undo) => {
        this.show(text, 'error', undo);
    }

    success = (text = '操作成功', undo) => {
        this.show(text, 'success', undo);
    }

    info = (text = 'info', undo) => {
        this.show(text, 'info', undo);
    }

    warning = (text = '警告', undo) => {
        this.show(text, 'warning', undo);
    }

    default = (text, undo) => {
        this.show(text, 'default', undo);
    }
}

export default new Message();
