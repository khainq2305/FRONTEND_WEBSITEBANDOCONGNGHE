import React from 'react';
import { Grid, Typography, Button, Alert, Box } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SkuItem from '../SkuItem';

const ProductSkuSection = ({
    formData,
    canManageVariantSkus,
    addSku,
    removeSku,
    handleSkuChange,
    handleMediaChangeForSku,
    productConfiguredVariants,
    availableVariants,
    skuMediaFiles,
    formErrors,
}) => {
    
    const variantsForSkus = productConfiguredVariants.map(pvc => {
        const fullVariantData = availableVariants.find(av => av.id === pvc.variantTypeId);
        const applicableValues = fullVariantData?.values?.filter(val => 
            (pvc.applicableValueIds || []).includes(val.id)
        ) || [];
        return {
            id: pvc.variantTypeId,
            name: pvc.variantTypeName,
            values: applicableValues,
        };
    }).filter(pvc => pvc.id);

    return (
        <Grid item xs={12}>
            <Box sx={{ mt: 2, pt: 4, borderTop: '1px solid #eee' }}>
                
                {formData.hasVariants && (
                    <>
                        {canManageVariantSkus ? (
                            <>
                                <Typography variant="h5" gutterBottom>Các phiên bản sản phẩm (SKU)</Typography>
                                {formData.skus.map((sku, i) => {
                                    // Tìm tất cả các giá trị đã được chọn bởi các SKU KHÁC
                                    const otherSelectedValueIds = new Set(
                                        formData.skus
                                            .filter((_, otherIndex) => i !== otherIndex)
                                            .flatMap(s => Object.values(s.variantSelections || {}))
                                            .filter(Boolean) // Lọc bỏ các giá trị null hoặc undefined
                                    );

                                    return (
                                        <SkuItem
                                            key={`sku-item-variant-${i}`}
                                            sku={sku}
                                            index={i}
                                            isMultiVariant={true}
                                            removeSku={() => removeSku(i)}
                                            handleSkuChange={handleSkuChange}
                                            handleMediaChangeForSku={handleMediaChangeForSku}
                                            productConfiguredVariants={variantsForSkus}
                                            skuMediaFiles={skuMediaFiles}
                                            errors={formErrors.skus?.[i] || {}}
                                            // Truyền danh sách các ID đã bị chọn xuống
                                            disabledValueIds={otherSelectedValueIds}
                                        />
                                    );
                                })}
                                <Button onClick={addSku} variant="outlined" sx={{ mt: 1 }} startIcon={<AddCircleOutlineIcon />}>
                                    Thêm Phiên bản (SKU)
                                </Button>
                            </>
                        ) : (
                            <Alert severity="info">
                                Vui lòng chọn loại thuộc tính và ít nhất một giá trị để bắt đầu thêm các phiên bản sản phẩm.
                            </Alert>
                        )}
                    </>
                )}

                {!formData.hasVariants && (
                     <>
                        <Typography variant="h5" gutterBottom>Thông tin Sản phẩm</Typography>
                        {formData.skus.length > 0 && (
                            <SkuItem
                                sku={formData.skus[0]}
                                index={0}
                                isMultiVariant={false}
                                handleSkuChange={handleSkuChange}
                                handleMediaChangeForSku={handleMediaChangeForSku}
                                errors={formErrors.skus?.[0] || {}}
                                skuMediaFiles={skuMediaFiles}
                                productConfiguredVariants={[]}
                            />
                        )}
                    </>
                )}
            </Box>
        </Grid>
    );
};

export default ProductSkuSection;