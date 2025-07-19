// src/components/ProductForm/AddVariantTypeDialog.js

import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Button, CircularProgress } from '@mui/material';

const AddVariantTypeDialog = ({
    open,
    onClose,
    newVariantTypeNameInput,
    setNewVariantTypeNameInput,
    onSave,
    isSaving,
    error,
}) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle>Tạo Loại Thuộc Tính Mới</DialogTitle>
            <DialogContent>
                <DialogContentText sx={{ mb: 2 }}>Nhập tên loại thuộc tính (ví dụ: Màu sắc, Kích thước).</DialogContentText>
                <TextField autoFocus margin="dense" label="Tên loại thuộc tính" type="text" fullWidth variant="outlined" value={newVariantTypeNameInput} onChange={(e) => setNewVariantTypeNameInput(e.target.value)} error={!!error} helperText={error} />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={isSaving}>Hủy</Button>
                <Button onClick={onSave} variant="contained" disabled={isSaving}>{isSaving ? <CircularProgress size={24} /> : 'Lưu'}</Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddVariantTypeDialog;