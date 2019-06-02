import React from 'react';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';

import './index.pcss';


const iconType = {
    error: 'error_outline',
    success: 'check_circle_outline',
    info: 'info',
    warning: 'warning',
}

const Icon = ({ type }) => type === 'default' ? null : (
    <i className="material-icons">{iconType[type]}</i>
);

class ConsecutiveSnackbars extends React.Component {
    queue = []

    state = {
        open: true,
        messageInfo: {
            message: this.props.text,
            type: this.props.type,
            undo: this.props.undo ? () => {
                this.props.undo();
                this.handleClose();
            } : null
        }
    }

    processQueue = () => {
        if (this.queue.length > 0) {
            this.setState({
                messageInfo: this.queue.shift(),
                open: true
            });
        }
    }

    handleClose = (event, reason) => {
        if (reason === 'clickaway') return;
        this.setState({ open: false });
    }

    handleExited = () => {
        this.processQueue();
    }

    showMessage = ({ text, type, undo }) => {
        this.queue.push({
            message: text,
            type,
            undo: undo ? () => {
                undo();
                this.handleClose();
            } : null,
            key: new Date().getTime(),
        });

        if (this.state.open) {
            this.setState({ open: false });
        } else {
            this.processQueue();
        }
    }

    render() {
        const { messageInfo = {}, open } = this.state;

        const undoButton = messageInfo.undo ? (
            <Button key="undo" color="secondary" size="small" onClick={messageInfo.undo}>
                UNDO
            </Button>
        ) : null;

        return (
            <Snackbar
                className={`global-message-wrapper message-${messageInfo.type}`}
                key={messageInfo.key}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                open={open}
                autoHideDuration={3000}
                onClose={this.handleClose}
                onExited={this.handleExited}
                ContentProps={{
                    'aria-describedby': 'message-id',
                }}
                message={<span id="message-id" className="message-text"><Icon type={messageInfo.type} />{messageInfo.message}</span>}
                action={[
                    undoButton,
                    <IconButton
                        key="close"
                        aria-label="Close"
                        color="inherit"
                        onClick={this.handleClose}
                    >
                        <i className="material-icons">close</i>
                    </IconButton>
                ]}
            />
        );
    }
}

export default ConsecutiveSnackbars;
