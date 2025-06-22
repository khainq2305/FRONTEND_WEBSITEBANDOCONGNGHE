import React from 'react';
import { Grid, TextField, Typography, Box, IconButton, MenuItem } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import MediaUpload from '../../MediaUpload';
import { formatCurrencyVND } from '../../../../../utils/formatCurrency';

const SkuItem = ({
    sku,
    index,
    isMultiVariant,
    removeSku,
    handleSkuChange,
    handleMediaChangeForSku,
    productConfiguredVariants, 
    skuMediaFiles,
    errors,
    disabledValueIds = new Set(),
}) => {
    
    return (
        <Box sx={{ mb: 3, p: 2.5, border: `1px solid ${Object.keys(errors || {}).length > 0 ? '#d32f2f' : '#e0e0e0'}`, borderRadius: 2, background: '#fff' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">{isMultiVariant ? `Phiên bản ${index + 1}` : 'Thông tin Giá & Kho hàng'}</Typography>
                {isMultiVariant && (
                    <IconButton size="small" color="error" onClick={removeSku}>
                        <DeleteIcon />
                    </IconButton>
                )}
            </Box>
            
            <Grid container spacing={2}>
                {isMultiVariant && productConfiguredVariants.map(pvc => (
                   
                    <Grid item xs={12} key={pvc.id}>
                        <TextField 
                            select 
                            fullWidth 
                            label={pvc.name}
                            value={sku.variantSelections?.[pvc.id] || ''}
                            onChange={e => {
                                const newSelections = { ...sku.variantSelections, [pvc.id]: e.target.value };
                                handleSkuChange(index, 'variantSelections', newSelections);
                            }}
                            error={!!errors?.variantSelections?.[pvc.id]}
                            helperText={errors?.variantSelections?.[pvc.id]}
                        >
                             <MenuItem value="">-- Chọn {pvc.name} --</MenuItem>
                             {pvc.values.map(val => {
                     
                                 const isDisabled = disabledValueIds.has(val.id);
                                 return (
                                     <MenuItem key={val.id} value={val.id} disabled={isDisabled}>
                                         {val.value}
                                     </MenuItem>
                                 );
                             })}
                        </TextField>
                    </Grid>
                ))}

                {isMultiVariant && productConfiguredVariants.length > 0 && 
                    <Grid item xs={12}><hr style={{border: 'none', borderTop: '1px solid #eee', margin: '8px 0'}} /></Grid>
                }
                
            
                <Grid item xs={12} sm={6} md={3}>
                    <TextField fullWidth label="Mã SKU" value={sku.skuCode || ''} onChange={e => handleSkuChange(index, 'skuCode', e.target.value)}
                        error={!!errors?.skuCode} helperText={errors?.skuCode || ''} />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                     <TextField fullWidth label="Giá bán" value={formatCurrencyVND(sku.price || '0')} onChange={e => handleSkuChange(index, 'price', e.target.value.replace(/\D/g, ''))}
                        error={!!errors?.price} helperText={errors?.price || ''} />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                     <TextField fullWidth label="Giá gốc" value={formatCurrencyVND(sku.originalPrice || '0')} onChange={e => handleSkuChange(index, 'originalPrice', e.target.value.replace(/\D/g, ''))}
                        error={!!errors?.originalPrice} helperText={errors?.originalPrice || ''} />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <TextField
  fullWidth
  type="number"
  label="Tồn kho"
  value={sku.stock ?? ''} // ❗ Dùng nullish coalescing để giữ lại số 0
  onChange={e => handleSkuChange(index, 'stock', e.target.value)}
  error={!!errors?.stock}
  helperText={errors?.stock || ''}
/>

                </Grid>

                 <Grid item xs={12}><Typography variant="subtitle1" sx={{ fontWeight: 500, mb: -1, mt: 2 }}>Kích thước & Cân nặng</Typography></Grid>
                <Grid item xs={6} sm={3}><TextField fullWidth type="number" label="Rộng (cm)" value={sku.width || ''} onChange={e => handleSkuChange(index, 'width', e.target.value)} error={!!errors?.width} helperText={errors?.width || ''} /></Grid>
                <Grid item xs={6} sm={3}><TextField fullWidth type="number" label="Dài (cm)" value={sku.length || ''} onChange={e => handleSkuChange(index, 'length', e.target.value)} error={!!errors?.length} helperText={errors?.length || ''} /></Grid>
                <Grid item xs={6} sm={3}><TextField fullWidth type="number" label="Cao (cm)" value={sku.height || ''} onChange={e => handleSkuChange(index, 'height', e.target.value)} error={!!errors?.height} helperText={errors?.height || ''} /></Grid>
                <Grid item xs={6} sm={3}><TextField fullWidth type="number" label="Nặng (gram)" value={sku.weight || ''} onChange={e => handleSkuChange(index, 'weight', e.target.value)} error={!!errors?.weight} helperText={errors?.weight || ''} /></Grid>

                <Grid item xs={12}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 500, mt: 2 }}>Ảnh/Video cho phiên bản này</Typography>
                    <MediaUpload files={skuMediaFiles[index] || []} onChange={(files) => handleMediaChangeForSku(index, files)} />
                    {errors?.mediaUrls && <Typography color="error" variant="caption">{errors.mediaUrls}</Typography>}
                </Grid>
            </Grid>
        </Box>
    );
};

export default SkuItem;