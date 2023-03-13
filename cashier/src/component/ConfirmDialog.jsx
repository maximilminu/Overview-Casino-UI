import React from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@mui/material';

const ConfirmDialog = React.memo(({ open, onClose, onConfirm, onCancel, title, content }) => {
    return (
        <Dialog
            open={open}
            keepMounted
            onClose={onClose}
            aria-labelledby='alert-dialog-confirmdelete-title'
            aria-describedby='alert-dialog-confirmdelete-description'
        >
            <DialogTitle id='alert-dialog-confirmdelete-title'>
                {title}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id='alert-dialog-confirmdelete-description'>
                    {content}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel} color='primary'>
                    No, cancelar.
                </Button>
                <Button onClick={onConfirm} color='warning'>
                    ¡Sí, proceder!
                </Button>
            </DialogActions>
        </Dialog>
    );
});

export default ConfirmDialog;