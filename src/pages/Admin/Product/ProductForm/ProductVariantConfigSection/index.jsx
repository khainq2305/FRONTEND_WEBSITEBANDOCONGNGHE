// src/components/ProductForm/ProductVariantConfigSection.js

import React from 'react';
import {
  Grid,
  TextField,
  Typography,
  Button,
  Box,
  IconButton,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Checkbox,
  ListItemText
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const DeleteIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor">
    <path d="M0 0h24v24H0V0z" fill="none" />
    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zm2.46-7.12l1.41-1.41L12 12.59l2.12-2.12 1.41 1.41L13.41 14l2.12 2.12-1.41 1.41L12 15.41l-2.12 2.12-1.41-1.41L10.59 14l-2.13-2.12zM15.5 4l-1-1h-5l-1 1H5v2h14V4z" />
  </svg>
);

const ProductVariantConfigSection = ({
  productConfiguredVariants,
  setProductConfiguredVariants,
  availableVariants,
  handleOpenAddVariantTypeDialog,
  handleOpenAddVariantValueDialog,
  ADD_NEW_VARIANT_TYPE_VALUE,
  ADD_NEW_VARIANT_VALUE
}) => {
  const handleRemovePvc = (pvcIndex) => {
    setProductConfiguredVariants((p) => p.filter((_, i) => i !== pvcIndex));
  };

  const handlePvcTypeChange = (pvcIndex, event) => {
    if (event.target.value === ADD_NEW_VARIANT_TYPE_VALUE) {
      return handleOpenAddVariantTypeDialog(pvcIndex);
    }
    const selectedAV = availableVariants.find((av) => av.id === event.target.value);
    setProductConfiguredVariants((prev) => {
      const updated = [...prev];
      updated[pvcIndex] = { ...updated[pvcIndex], variantTypeId: selectedAV.id, variantTypeName: selectedAV.name, applicableValueIds: [] };
      return updated;
    });
  };

  const handlePvcValuesChange = (pvcIndex, event) => {
    const value = event.target.value;
    if (value.includes(ADD_NEW_VARIANT_VALUE)) {
      const currentType = availableVariants.find((av) => av.id === productConfiguredVariants[pvcIndex].variantTypeId);
      return handleOpenAddVariantValueDialog(currentType, pvcIndex);
    }
    setProductConfiguredVariants((prev) => {
      const updated = [...prev];
      updated[pvcIndex].applicableValueIds = typeof value === 'string' ? value.split(',') : value;
      return updated;
    });
  };

  return (
    <Grid item xs={12}>
      <Typography variant="h6" gutterBottom>
        Cấu hình Thuộc tính & Giá trị
      </Typography>
      {productConfiguredVariants.map((pvc, pvcIndex) => (
        <Box key={`pvc-${pvcIndex}`} sx={{ mb: 2, p: 2, border: '1px dashed #ccc', borderRadius: 1 }}>
          <Grid container spacing={1} alignItems="center">
            <Grid item xs={12} sm={5}>
              <TextField
                select
                fullWidth
                label={`Loại thuộc tính ${pvcIndex + 1}`}
                value={pvc.variantTypeId || ''}
                onChange={(e) => handlePvcTypeChange(pvcIndex, e)}
                size="small"
              >
                <MenuItem value="">-- Chọn loại --</MenuItem>
                {availableVariants.map((av) => (
                  <MenuItem
                    key={av.id}
                    value={av.id}
                    disabled={productConfiguredVariants.some((item, i) => i !== pvcIndex && item.variantTypeId === av.id)}
                  >
                    {av.name}
                  </MenuItem>
                ))}
                <MenuItem value={ADD_NEW_VARIANT_TYPE_VALUE} dense sx={{ color: 'primary.main', fontStyle: 'italic' }}>
                  <AddCircleOutlineIcon fontSize="small" sx={{ mr: 0.5 }} /> Tạo loại mới...
                </MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              {pvc.variantTypeId && (
                <FormControl fullWidth size="small">
                  <InputLabel>Chọn các giá trị sẽ dùng</InputLabel>
                  <Select
                    multiple
                    value={pvc.applicableValueIds}
                    onChange={(e) => handlePvcValuesChange(pvcIndex, e)}
                    renderValue={(selected) =>
                      (availableVariants.find((av) => av.id === pvc.variantTypeId)?.values || [])
                        .filter((v) => selected.includes(v.id))
                        .map((v) => v.value)
                        .join(', ')
                    }
                  >
                    {(availableVariants.find((av) => av.id === pvc.variantTypeId)?.values || []).map((val) => (
                      <MenuItem key={val.id} value={val.id}>
                        <Checkbox checked={pvc.applicableValueIds.includes(val.id)} />
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box
                            sx={{
                              width: 14,
                              height: 14,
                              borderRadius: '50%',
                              bgcolor: val.colorCode || '#ffffff',
                              border: '1px solid #ccc'
                            }}
                          />
                          <ListItemText primary={val.value} />
                        </Box>
                      </MenuItem>
                    ))}
                    <MenuItem value={ADD_NEW_VARIANT_VALUE} dense sx={{ color: 'primary.main', fontStyle: 'italic' }}>
                      <AddCircleOutlineIcon fontSize="small" sx={{ mr: 0.5 }} /> Thêm giá trị mới...
                    </MenuItem>
                  </Select>
                </FormControl>
              )}
            </Grid>
            <Grid item xs={12} sm={1}>
              <IconButton color="error" onClick={() => handleRemovePvc(pvcIndex)}>
                <DeleteIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Box>
      ))}
      <Button
        variant="outlined"
        onClick={() => setProductConfiguredVariants((p) => [...p, { variantTypeId: '', variantTypeName: '', applicableValueIds: [] }])}
        disabled={availableVariants.length > 0 && productConfiguredVariants.length >= availableVariants.length}
      >
        + Thêm dòng thuộc tính
      </Button>
    </Grid>
  );
};

export default ProductVariantConfigSection;
