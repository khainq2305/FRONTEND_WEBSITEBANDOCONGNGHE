import React from 'react';
import {
  Grid,
  Typography,
  Box,
  IconButton,
  MenuItem,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import TextField from '@mui/material/TextField';
import MediaUpload from '../../MediaUpload';
import FormattedNumberInput from '../../../../../utils/FormattedNumberInput';   // ⬅️ thêm
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
    <Box
      sx={{
        mb: 3,
        p: 2.5,
        border: `1px solid ${
          Object.keys(errors || {}).length > 0 ? '#d32f2f' : '#e0e0e0'
        }`,
        borderRadius: 2,
        background: '#fff',
      }}
    >
      {/* -------------------------------------------------- Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Typography variant="h6">
          {isMultiVariant
            ? `Phiên bản ${index + 1}`
            : 'Thông tin Giá & Kho hàng'}
        </Typography>
        {isMultiVariant && (
          <IconButton size="small" color="error" onClick={removeSku}>
            <DeleteIcon />
          </IconButton>
        )}
      </Box>

      <Grid container spacing={2}>
        {/* ------------------------ Select giá trị biến thể */}
        {isMultiVariant &&
          productConfiguredVariants.map((pvc) => (
            <Grid item xs={12} key={pvc.id}>
              <TextField
                select
                fullWidth
                label={pvc.name}
                value={sku.variantSelections?.[pvc.id] || ''}
                onChange={(e) =>
                  handleSkuChange(index, 'variantSelections', {
                    ...sku.variantSelections,
                    [pvc.id]: e.target.value,
                  })
                }
                error={!!errors?.variantSelections?.[pvc.id]}
                helperText={errors?.variantSelections?.[pvc.id]}
              >
                <MenuItem value="">{`-- Chọn ${pvc.name} --`}</MenuItem>
                {pvc.values.map((val) => (
                  <MenuItem
                    key={val.id}
                    value={val.id}
                    disabled={disabledValueIds.has(val.id)}
                  >
                    {val.value}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          ))}

        {isMultiVariant && productConfiguredVariants.length > 0 && (
          <Grid item xs={12}>
            <hr
              style={{
                border: 'none',
                borderTop: '1px solid #eee',
                margin: '8px 0',
              }}
            />
          </Grid>
        )}

        {/* ------------------------ Mã SKU + Pricing */}
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            label="Mã SKU"
            value={sku.skuCode || ''}
            onChange={(e) => handleSkuChange(index, 'skuCode', e.target.value)}
            error={!!errors?.skuCode}
            helperText={errors?.skuCode || ''}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <FormattedNumberInput
            label="Giá bán"
            value={sku.price ?? ''}
            onChange={(v) => handleSkuChange(index, 'price', v)}
            error={!!errors?.price}
            helperText={errors?.price || ''}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <FormattedNumberInput
            label="Giá gốc"
            value={sku.originalPrice ?? ''}
            onChange={(v) => handleSkuChange(index, 'originalPrice', v)}
            error={!!errors?.originalPrice}
            helperText={errors?.originalPrice || ''}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <FormattedNumberInput
            label="Tồn kho"
            value={sku.stock ?? ''}
            onChange={(v) => handleSkuChange(index, 'stock', v)}
            error={!!errors?.stock}
            helperText={errors?.stock || ''}
          />
        </Grid>

        {/* ------------------------ Kích thước & Cân nặng */}
        <Grid item xs={12}>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 500, mb: -1, mt: 2 }}
          >
            Kích thước &amp; Cân nặng
          </Typography>
        </Grid>

        <Grid item xs={6} sm={3}>
          <FormattedNumberInput
            label="Rộng (cm)"
            value={sku.width ?? ''}
            onChange={(v) => handleSkuChange(index, 'width', v)}
            error={!!errors?.width}
            helperText={errors?.width || ''}
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <FormattedNumberInput
            label="Dài (cm)"
            value={sku.length ?? ''}
            onChange={(v) => handleSkuChange(index, 'length', v)}
            error={!!errors?.length}
            helperText={errors?.length || ''}
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <FormattedNumberInput
            label="Cao (cm)"
            value={sku.height ?? ''}
            onChange={(v) => handleSkuChange(index, 'height', v)}
            error={!!errors?.height}
            helperText={errors?.height || ''}
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <FormattedNumberInput
            label="Nặng (gram)"
            value={sku.weight ?? ''}
            onChange={(v) => handleSkuChange(index, 'weight', v)}
            error={!!errors?.weight}
            helperText={errors?.weight || ''}
          />
        </Grid>

        {/* ------------------------ Media */}
        <Grid item xs={12}>
          <Typography variant="subtitle1" sx={{ fontWeight: 500, mt: 2 }}>
            Ảnh/Video cho phiên bản này
          </Typography>
          <MediaUpload
            files={skuMediaFiles[index] || []}
            onChange={(files) => handleMediaChangeForSku(index, files)}
          />
          {errors?.mediaUrls && (
            <Typography color="error" variant="caption">
              {errors.mediaUrls}
            </Typography>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default SkuItem;
