import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import './content.pcss';

function AlertDialog({ title = 'confirm', content = 'confirm content', onOk, onCancel }) {
    const [open, setOpen] = React.useState(true);

    function handleClose() {
        setOpen(false);
    }

    function handleOk() {
        onOk && onOk();
        handleClose();
    }

    function handleCancel() {
        onCancel && onCancel();
        handleClose();
    }

    return (
        <Dialog
            className="confirm-modal"
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
            <DialogContent>
                {content}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCancel} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleOk} color="primary" autoFocus>
                    OK
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default AlertDialog;