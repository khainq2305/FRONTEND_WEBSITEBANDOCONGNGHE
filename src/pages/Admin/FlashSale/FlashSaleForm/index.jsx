import React, { useEffect, useState } from 'react';
import {
  Box, Button, Grid, TextField, Typography, Paper, Checkbox, FormControlLabel, Autocomplete
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { flashSaleService } from '../../../../services/admin/flashSaleService';

const discountTypeOptions = [
  { label: 'Theo phần trăm', value: 'percent' },
  { label: 'Giảm cố định', value: 'amount' },
];

const FlashSaleForm = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();

  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      title: '',
      bannerUrl: '',
      slug: '',
      description: '',
      startTime: '',
      endTime: '',
      isActive: true,
      items: [],
      categories: []
    }
  });

  const [skuOptions, setSkuOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [skuRes, catRes] = await Promise.all([
          flashSaleService.getSkus(),
          flashSaleService.getCategories()
        ]);

        setSkuOptions(skuRes.data || []);
        setCategoryOptions(flattenCategoryTree(catRes.data || []));
      } catch (err) {
        toast.error('Lỗi tải dữ liệu SKU hoặc danh mục');
      }
    };

    loadData();
  }, []);

  const flattenCategoryTree = (tree, prefix = '') => {
    return tree.reduce((acc, node) => {
      const label = prefix ? `${prefix} > ${node.name}` : node.name;
      acc.push({ ...node, label, categoryId: node.id });
      if (node.children?.length) {
        acc = acc.concat(flattenCategoryTree(node.children, label));
      }
      return acc;
    }, []);
  };

  useEffect(() => {
    if (isEdit) {
      flashSaleService.getById(id).then((res) => {
        const data = res.data;
        data.startTime = data.startTime?.slice(0, 16);
        data.endTime = data.endTime?.slice(0, 16);

        data.items = (data.items || []).map(item => ({
          skuId: item.sku?.id,
          skuCode: item.sku?.skuCode,
          productName: item.sku?.product?.name || '',
          label: `${item.sku?.product?.name || ''} - ${item.sku?.skuCode}`,
          id: item.sku?.id
        }));

        data.categories = (data.categories || []).map(cat => ({
          categoryId: cat.category?.id,
          label: cat.category?.name,
          id: cat.category?.id
        }));

        reset(data);
      });
    }
  }, [id]);

  const onSubmit = async (formData) => {
    try {
      const payload = {
        ...formData,
        items: formData.items.map(item => ({
          skuId: item.skuId,
          salePrice: item.salePrice || 0,
          quantity: item.quantity || 0,
          maxPerUser: item.maxPerUser || null,
          note: item.note || '',
          labelColor: item.labelColor || ''
        })),
        categories: formData.categories.map(cat => ({
          categoryId: cat.categoryId,
          discountType: cat.discountType || 'percent',
          discountValue: cat.discountValue || 0,
          maxPerUser: cat.maxPerUser || null,
          priority: cat.priority || 0
        }))
      };

      if (isEdit) {
        await flashSaleService.update(id, payload);
        toast.success('Cập nhật thành công');
      } else {
        await flashSaleService.create(payload);
        toast.success('Tạo mới thành công');
      }

      navigate('/admin/flash-sale');
    } catch (err) {
      toast.error('Lỗi khi lưu Flash Sale');
    }
  };

  return (
    <Box p={2}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" mb={3}>
          {isEdit ? 'Cập nhật Flash Sale' : 'Thêm mới Flash Sale'}
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Controller
                name="title"
                control={control}
                rules={{ required: 'Tên là bắt buộc' }}
                render={({ field }) => (
                  <TextField {...field} fullWidth label="Tên Flash Sale" error={!!errors.title} helperText={errors.title?.message} />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="bannerUrl"
                control={control}
                render={({ field }) => (
                  <TextField {...field} fullWidth label="Link ảnh banner" />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="slug"
                control={control}
                render={({ field }) => (
                  <TextField {...field} fullWidth label="Slug (URL)" />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField {...field} fullWidth multiline minRows={3} label="Mô tả chi tiết" />
                )}
              />
            </Grid>

            <Grid item xs={6}>
              <Controller
                name="startTime"
                control={control}
                rules={{ required: 'Thời gian bắt đầu là bắt buộc' }}
                render={({ field }) => (
                  <TextField {...field} fullWidth type="datetime-local" label="Bắt đầu" InputLabelProps={{ shrink: true }} error={!!errors.startTime} helperText={errors.startTime?.message} />
                )}
              />
            </Grid>

            <Grid item xs={6}>
              <Controller
                name="endTime"
                control={control}
                rules={{ required: 'Thời gian kết thúc là bắt buộc' }}
                render={({ field }) => (
                  <TextField {...field} fullWidth type="datetime-local" label="Kết thúc" InputLabelProps={{ shrink: true }} error={!!errors.endTime} helperText={errors.endTime?.message} />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="isActive"
                control={control}
                render={({ field }) => (
                  <FormControlLabel control={<Checkbox {...field} checked={field.value} />} label="Kích hoạt Flash Sale" />
                )}
              />
            </Grid>

            {/* SKU chọn */}
            <Grid item xs={12}>
              <Controller
                name="items"
                control={control}
                render={({ field }) => (
                  <>
                    <Autocomplete
                      multiple
                      options={skuOptions.map(sku => ({
                        ...sku,
                        label: sku.label || `${sku.productName || ''} - ${sku.skuCode}`,
                        skuId: sku.id
                      }))}
                      getOptionLabel={(option) => option.label}
                      value={field.value}
                      onChange={(_, val) => field.onChange(val)}
                      renderTags={() => null}
                      isOptionEqualToValue={(option, value) => option.skuId === value.skuId}
                      renderInput={(params) => <TextField {...params} label="Chọn sản phẩm SKU" />}
                    />
                    <Box mt={1} sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {field.value.map((sku) => (
                        <Box
                          key={sku.skuId}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            border: '1px solid #ccc',
                            borderRadius: '16px',
                            px: 1.5,
                            py: 0.5,
                            bgcolor: '#f0f0f0',
                            fontSize: '13px'
                          }}
                        >
                          {sku.label}
                          <Button
                            size="small"
                            onClick={() => field.onChange(field.value.filter(item => item.skuId !== sku.skuId))}
                            sx={{ ml: 1, minWidth: 'unset', p: 0, lineHeight: 1, color: '#888' }}
                          >
                            ×
                          </Button>
                        </Box>
                      ))}
                    </Box>
                  </>
                )}
              />
            </Grid>

            {/* Danh mục chọn + chi tiết từng danh mục */}
            <Grid item xs={12}>
              <Controller
                name="categories"
                control={control}
                render={({ field }) => (
                  <>
                    <Autocomplete
                      multiple
                      options={categoryOptions}
                      getOptionLabel={(option) => option.label}
                      value={field.value}
                      onChange={(_, val) => field.onChange(val)}
                      renderTags={() => null}
                      isOptionEqualToValue={(option, value) => option.categoryId === value.categoryId}
                      renderInput={(params) => <TextField {...params} label="Chọn danh mục áp dụng" />}
                    />
                    <Box mt={1} sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {field.value.map((cat) => (
                        <Box
                          key={cat.categoryId}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            border: '1px solid #ccc',
                            borderRadius: '16px',
                            px: 1.5,
                            py: 0.5,
                            bgcolor: '#f0f0f0',
                            fontSize: '13px'
                          }}
                        >
                          {cat.label}
                          <Button
                            size="small"
                            onClick={() => field.onChange(field.value.filter(item => item.categoryId !== cat.categoryId))}
                            sx={{ ml: 1, minWidth: 'unset', p: 0, lineHeight: 1, color: '#888' }}
                          >
                            ×
                          </Button>
                        </Box>
                      ))}
                    </Box>

                    {/* Chi tiết cấu hình giảm giá theo danh mục */}
                    {field.value.map((cat, index) => (
                      <Box key={cat.categoryId} sx={{ border: '1px solid #ddd', borderRadius: 2, p: 2, mt: 1 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          {cat.label}
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={3}>
                            <TextField
                              select
                              label="Loại giảm"
                              fullWidth
                              value={cat.discountType || 'percent'}
                              onChange={(e) => {
                                const updated = [...field.value];
                                updated[index].discountType = e.target.value;
                                field.onChange(updated);
                              }}
                              SelectProps={{ native: true }}
                            >
                              {discountTypeOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.label}
                                </option>
                              ))}
                            </TextField>
                          </Grid>

                          <Grid item xs={3}>
                            <TextField
                              label="Giá trị giảm"
                              fullWidth
                              type="number"
                              value={cat.discountValue || 0}
                              onChange={(e) => {
                                const updated = [...field.value];
                                updated[index].discountValue = Number(e.target.value);
                                field.onChange(updated);
                              }}
                            />
                          </Grid>

                          <Grid item xs={3}>
                            <TextField
                              label="Mỗi người được mua"
                              fullWidth
                              type="number"
                              value={cat.maxPerUser || ''}
                              onChange={(e) => {
                                const updated = [...field.value];
                                updated[index].maxPerUser = Number(e.target.value);
                                field.onChange(updated);
                              }}
                            />
                          </Grid>

                          <Grid item xs={3}>
                            <TextField
                              label="Độ ưu tiên"
                              fullWidth
                              type="number"
                              value={cat.priority || 0}
                              onChange={(e) => {
                                const updated = [...field.value];
                                updated[index].priority = Number(e.target.value);
                                field.onChange(updated);
                              }}
                            />
                          </Grid>
                        </Grid>
                      </Box>
                    ))}
                  </>
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Button type="submit" variant="contained">
                {isEdit ? 'Cập nhật' : 'Tạo mới'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default FlashSaleForm;
