import React from 'react';
import { Grid, Typography, Box, IconButton, MenuItem, Paper } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import TextField from '@mui/material/TextField';
import MediaUpload, { MediaItem } from '../../MediaUpload';
import FormattedNumberInput from '../../../../../utils/FormattedNumberInput';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import ClearIcon from '@mui/icons-material/Clear';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

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
  disabledValueIds = new Set()
}) => {
  const handleOnDragEndMedia = (result) => {
    if (!result.destination) return;
    if (result.destination.droppableId === result.source.droppableId && result.destination.index === result.source.index) {
      return;
    }

    const items = Array.from(skuMediaFiles[index] || []).map((media) => ({
      ...media,
      id: String(media.id)
    }));

    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    handleMediaChangeForSku(index, items);
  };

  const handleRemoveMedia = (idToRemove) => {
    const currentFiles = (skuMediaFiles[index] || []).map((media) => ({
      ...media,
      id: String(media.id)
    }));

    const fileToRemove = currentFiles.find((f) => String(f.id) === String(idToRemove));
    if (fileToRemove && fileToRemove.url && fileToRemove.url.startsWith('blob:')) {
      URL.revokeObjectURL(fileToRemove.url);
    }
    const updatedFiles = currentFiles.filter((f) => String(f.id) !== String(idToRemove));
    handleMediaChangeForSku(index, updatedFiles);
  };

  return (
    <Box
      sx={{
        mb: 3,
        p: 2.5,
        border: `1px solid ${Object.keys(errors || {}).length > 0 ? '#d32f2f' : '#e0e0e0'}`,
        borderRadius: 2,
        background: '#fff'
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2
        }}
      >
        <Typography variant="h6">{isMultiVariant ? `Phiên bản ${index + 1}` : 'Thông tin Giá & Kho hàng'}</Typography>
        {isMultiVariant && (
          <IconButton size="small" color="error" onClick={removeSku}>
            <DeleteIcon />
          </IconButton>
        )}
      </Box>

      <Grid container spacing={2}>
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
                    [pvc.id]: e.target.value
                  })
                }
                error={!!errors?.variantSelections?.[pvc.id]}
                helperText={errors?.variantSelections?.[pvc.id]}
              >
                <MenuItem value="">{`-- Chọn ${pvc.name} --`}</MenuItem>
                {pvc.values.map((val) => (
                  <MenuItem key={val.id} value={val.id} disabled={disabledValueIds.has(val.id)}>
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
                margin: '8px 0'
              }}
            />
          </Grid>
        )}

        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            label={
              <>
                Mã SKU <Typography component="span" color="error">*</Typography>
              </>
            }
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
            label={
              <>
                Giá gốc <Typography component="span" color="error">*</Typography>
              </>
            }
            value={sku.originalPrice ?? ''}
            onChange={(v) => handleSkuChange(index, 'originalPrice', v)}
            error={!!errors?.originalPrice}
            helperText={errors?.originalPrice || ''}
          />

        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <FormattedNumberInput
            label={
              <>
                Tồn kho <Typography component="span" color="error">*</Typography>
              </>
            }
            value={sku.stock ?? ''}
            onChange={(v) => handleSkuChange(index, 'stock', v)}
            error={!!errors?.stock}
            helperText={errors?.stock || ''}
          />

        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: -1, mt: 2 }}>
            Kích thước &amp; Cân nặng
          </Typography>
        </Grid>

        <Grid item xs={6} sm={3}>
          <FormattedNumberInput
            label={
              <>
                Rộng (cm) <Typography component="span" color="error">*</Typography>
              </>
            }
            value={sku.width ?? ''}
            onChange={(v) => handleSkuChange(index, 'width', v)}
            error={!!errors?.width}
            helperText={errors?.width || ''}
          />

        </Grid>
        <Grid item xs={6} sm={3}>
          <FormattedNumberInput
            label={
              <>
                Dài (cm) <Typography component="span" color="error">*</Typography>
              </>
            }
            value={sku.length ?? ''}
            onChange={(v) => handleSkuChange(index, 'length', v)}
            error={!!errors?.length}
            helperText={errors?.length || ''}
          />

        </Grid>
        <Grid item xs={6} sm={3}>
          <FormattedNumberInput
            label={
              <>
                Cao (cm) <Typography component="span" color="error">*</Typography>
              </>
            }
            value={sku.height ?? ''}
            onChange={(v) => handleSkuChange(index, 'height', v)}
            error={!!errors?.height}
            helperText={errors?.height || ''}
          />

        </Grid>
        <Grid item xs={6} sm={3}>
          <FormattedNumberInput
            label={
              <>
                Nặng (gram) <Typography component="span" color="error">*</Typography>
              </>
            }
            value={sku.weight ?? ''}
            onChange={(v) => handleSkuChange(index, 'weight', v)}
            error={!!errors?.weight}
            helperText={errors?.weight || ''}
          />

        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle1" sx={{ fontWeight: 500, mt: 2 }}>
            Ảnh/Video cho phiên bản này
          </Typography>

          <DragDropContext onDragEnd={handleOnDragEndMedia}>
            <Droppable droppableId={`sku-media-list-${sku.id || index}`} direction="horizontal">
              {(providedDroppable, snapshotDroppable) => (
                <MediaUpload files={skuMediaFiles[index] || []} onChange={(files) => handleMediaChangeForSku(index, files)}>
                  <Box ref={providedDroppable.innerRef} {...providedDroppable.droppableProps} mt={2} display="flex" flexWrap="wrap" gap={2}>
                    {(skuMediaFiles[index] || []).map((media, mediaIndex) => (
                      <Draggable key={String(media.id)} draggableId={String(media.id)} index={mediaIndex}>
                        {(providedDraggable, snapshotDraggable) => (
                          <MediaItem
                            media={media}
                            index={mediaIndex}
                            handleRemove={handleRemoveMedia}
                            providedDraggable={providedDraggable}
                            snapshotDraggable={snapshotDraggable}
                          />
                        )}
                      </Draggable>
                    ))}
                    {providedDroppable.placeholder}
                  </Box>
                </MediaUpload>
              )}
            </Droppable>
          </DragDropContext>

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
