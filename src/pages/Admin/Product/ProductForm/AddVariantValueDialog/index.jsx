// src/components/ProductForm/AddVariantValueDialog.js

import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Button, CircularProgress } from '@mui/material';

const AddVariantValueDialog = ({
    open,
    onClose,
    newVariantValueInput,
    setNewVariantValueInput,
    onSave,
    isSaving,
    error,
    currentVariantType
}) => {
    if (!currentVariantType) return null;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle>Thêm Giá Trị Mới cho "{currentVariantType.name}"</DialogTitle>
            <DialogContent>
                <DialogContentText sx={{ mb: 2 }}>Nhập giá trị mới (ví dụ: Tím, XXL).</DialogContentText>
                <TextField autoFocus margin="dense" label="Tên giá trị mới" type="text" fullWidth variant="outlined" value={newVariantValueInput} onChange={(e) => setNewVariantValueInput(e.target.value)} error={!!error} helperText={error} />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={isSaving}>Hủy</Button>
                <Button onClick={onSave} variant="contained" disabled={isSaving}>{isSaving ? <CircularProgress size={24} /> : 'Lưu'}</Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddVariantValueDialog;