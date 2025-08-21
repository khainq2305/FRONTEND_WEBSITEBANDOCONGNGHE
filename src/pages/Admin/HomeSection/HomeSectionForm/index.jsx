import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import {
    Box,
    TextField,
    Button,
    Typography,
    IconButton,
    Paper,
    Stack,
    FormControlLabel,
    Switch,
    Avatar,
    Chip,
    MenuItem,
    Select as MUISelect,
    FormControl,
    InputLabel,
    FormHelperText,
    Grid
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'; 
import Autocomplete from '@mui/material/Autocomplete';
import { useNavigate, useParams } from 'react-router-dom';
import { sectionService } from '../../../../services/admin/sectionService';
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../../../../constants/environment';
import LoaderAdmin from '../../../../components/Admin/LoaderVip';
import ProductSelectionDialog from './ProductSelectionDialog';
import Breadcrumb from '../../../../components/common/Breadcrumb';

import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, rectSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export const SECTION_TYPES = [
    { value: 'productOnly', label: 'Chỉ sản phẩm' },
    { value: 'productWithBanner', label: 'Sản phẩm + Banner' },
    { value: 'productWithCategoryFilter', label: 'Sản phẩm + Filter Danh mục' },
    { value: 'full', label: 'Tất cả (Sản phẩm + Banner + Filter)' }
];

const LINK_TYPES = [
    { value: 'product', label: 'Sản phẩm' },
    { value: 'category', label: 'Danh mục' },
    { value: 'url', label: 'URL tùy chỉnh' }
];

const getImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('blob:') || path.startsWith('http')) return path;
    return `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
};

function SortableChip({ id, item, onDelete }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        cursor: 'grab'
    };

    const handleDelete = (e) => {
        e.preventDefault();
        e.stopPropagation();
        onDelete(item.id);
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <Chip
                avatar={item.thumbnail ? <Avatar alt={item.name} src={item.thumbnail} /> : null}
                label={item.name || 'N/A'}
                onDelete={handleDelete}
            />
        </div>
    );
}

function SortableBannerItem({ id, item, idx, removeBanner, control, watch, setValue, productOptions, categoryOptions, errors }) {
  
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
      
        cursor: 'default' 
    };

    const currentBanner = watch(`banners.${idx}`) || {};
    const imageSourceForPreview = currentBanner.previewUrl || getImageUrl(currentBanner.imageUrl);
    const inputId = `banner-upload-${idx}`;

    return (
        <Paper ref={setNodeRef} style={style} variant="outlined" sx={{ p: 2, position: 'relative' }}>
            <IconButton
                size="small"
                onClick={() => removeBanner(idx)}
                title="Xóa banner này"
                sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    zIndex: 1,
                    bgcolor: 'rgba(255, 255, 255, 0.85)',
                    '&:hover': { color: 'error.main' }
                }}
            >
                <DeleteIcon fontSize="small" />
            </IconButton>
          
            <IconButton
                size="small"
                title="Kéo để sắp xếp"
                sx={{
                    position: 'absolute',
                    top: 8,
                    left: 8,
                    zIndex: 1,
                    bgcolor: 'rgba(255, 255, 255, 0.85)',
                    cursor: 'grab',
                    '&:hover': { color: 'primary.main' }
                }}
                {...listeners} 
                {...attributes} 
            >
                <DragIndicatorIcon fontSize="small" />
            </IconButton>
            <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                    <Stack spacing={1.5}>
                        <Box
                            component="label"
                            htmlFor={inputId}
                            sx={{
                                border: '2px dashed',
                                borderColor: errors?.banners?.[idx]?.imageFile ? 'error.main' : '#ccc',
                                p: 2,
                                textAlign: 'center',
                                cursor: 'pointer',
                                minHeight: 150,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: '#f9f9f9',
                                '&:hover': { borderColor: 'primary.main' }
                            }}
                        >
                            <input
                                id={inputId}
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (!file) return;
                                    setValue(`banners.${idx}.imageFile`, file, { shouldValidate: true });
                                    setValue(`banners.${idx}.previewUrl`, URL.createObjectURL(file));
                                }}
                            />
                            <PhotoCamera sx={{ fontSize: 38, color: 'text.secondary', mb: 1 }} />
                            <Typography variant="caption" color="text.secondary">
                                {imageSourceForPreview ? 'Thay đổi ảnh' : 'Chọn ảnh Banner'}
                            </Typography>
                        </Box>
                        {errors?.banners?.[idx]?.imageFile && (
                            <FormHelperText error>{errors.banners[idx].imageFile.message}</FormHelperText>
                        )}
                        {imageSourceForPreview && (
                            <Avatar
                                src={imageSourceForPreview}
                                variant="rounded"
                                alt={`Banner ${idx + 1}`}
                                sx={{ height: 120, width: '100%', objectFit: 'contain' }}
                            />
                        )}
                    </Stack>
                </Grid>
                <Grid item xs={12} md={8}>
                    <BannerLinkConfiguration
                        bannerIndex={idx}
                        control={control}
                        watch={watch}
                        setValue={setValue}
                        productOptions={productOptions}
                        categoryOptions={categoryOptions}
                    />
                </Grid>
            </Grid>
        </Paper>
    );
}


const BannerLinkConfiguration = ({ bannerIndex, control, watch, setValue, productOptions, categoryOptions }) => {
    const linkType = watch(`banners.${bannerIndex}.linkType`);
    return (
        <Stack spacing={2}>
            <Controller
                name={`banners.${bannerIndex}.linkType`}
                control={control}
                defaultValue="url"
                render={({ field }) => (
                    <FormControl fullWidth>
                        <InputLabel>Loại liên kết</InputLabel>
                        <MUISelect
                            {...field}
                            label="Loại liên kết"
                            onChange={(e) => {
                                field.onChange(e);
                                setValue(`banners.${bannerIndex}.linkValue`, null, { shouldValidate: true });
                            }}
                        >
                            {LINK_TYPES.map((type) => (
                                <MenuItem key={type.value} value={type.value}>
                                    {type.label}
                                </MenuItem>
                            ))}
                        </MUISelect>
                    </FormControl>
                )}
            />
            {linkType === 'product' && (
                <Controller
                    name={`banners.${bannerIndex}.linkValue`}
                    control={control}
                    defaultValue={null}
                    render={({ field }) => (
                        <Autocomplete
                            key="product-autocomplete"
                            options={productOptions}
                            value={field.value || null}
                            getOptionLabel={(option) => option.name || ''}
                            isOptionEqualToValue={(option, value) => option && value && option.id === value.id}
                            onChange={(_, newValue) => field.onChange(newValue)}
                            renderInput={(params) => <TextField {...params} label="Chọn sản phẩm liên kết" />}
                        />
                    )}
                />
            )}
            {linkType === 'category' && (
                <Controller
                    name={`banners.${bannerIndex}.linkValue`}
                    control={control}
                    defaultValue={null}
                    render={({ field }) => (
                        <Autocomplete
                            options={categoryOptions}
                            value={field.value}
                            getOptionLabel={(o) => o.name}
                            isOptionEqualToValue={(opt, val) => opt.id === val.id}
                            renderOption={(props, option) => {
                                return (
                                    <li
                                        {...props}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            paddingLeft: `${option.level * 1.5}em`,
                                            gap: 6
                                        }}
                                    >
                                        {option.level > 0 ? <span style={{ color: '#888' }}>├</span> : <span style={{ color: 'transparent' }}>├</span>}
                                        {option.name}
                                    </li>
                                );
                            }}
                            onChange={(_, v) => field.onChange(v)}
                            renderInput={(params) => <TextField {...params} label="Chọn danh mục liên kết" fullWidth />}
                        />
                    )}
                />
            )}
            {linkType === 'url' && (
                <Controller
                    name={`banners.${bannerIndex}.linkValue`}
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                        <TextField
                            {...field}
                            value={typeof field.value === 'string' ? field.value : ''}
                            label="URL tùy chỉnh"
                            fullWidth
                            placeholder="https://..."
                        />
                    )}
                />
            )}
        </Stack>
    );
};

function buildCategoryTree(list) {
    const map = {},
        roots = [];
    list.forEach((c) => (map[c.id] = { ...c, children: [], level: 0 }));
    list.forEach((c) => {
        if (c.parentId && map[c.parentId]) {
            map[c.parentId].children.push(map[c.id]);
            map[c.id].level = map[c.parentId].level + 1;
        } else {
            roots.push(map[c.id]);
        }
    });
    const out = [];
    function dfs(node) {
        out.push(node);
        node.children.forEach(dfs);
    }
    roots.forEach(dfs);
    return out;
}

export default function HomeSectionFormPage() {
    const { slug } = useParams();
    const isEdit = Boolean(slug);
    const navigate = useNavigate();
    const [isLoadingPage, setIsLoadingPage] = useState(isEdit);
    const [isProductModalOpen, setProductModalOpen] = useState(false);

    const {
        register,
        handleSubmit,
        control,
        reset,
        watch,
        setValue,
        setError,
        formState: { errors, isSubmitting }
    } = useForm({
        defaultValues: {
            title: '',
            type: SECTION_TYPES[0].value,
            orderIndex: 0,
            isActive: true,
            banners: [],
            productIds: [],
            categoryIds: []
        }
    });

    const selectedType = watch('type');
    const { fields: bannerFields, append: addBanner, remove: removeBanner, move: moveBanner } = useFieldArray({ control, name: 'banners' });
    const watchedBanners = watch('banners');

    const [productOptions, setProductOptions] = useState([]);
    const [categoryOptions, setCategoryOptions] = useState([]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates
        })
    );

    useEffect(() => {
        const loadInitialData = async () => {
            if (isEdit) setIsLoadingPage(true);
            try {
                const [productRes, categoryRes] = await Promise.all([
                    sectionService.getAllProducts({ limit: 1000 }),
                    sectionService.getAllCategories({ limit: 1000 })
                ]);
                const productList = productRes.data?.data || [];
                setProductOptions(productList);

                const rawCategoryList = categoryRes.data?.data || [];
                const builtCategoryTree = buildCategoryTree(rawCategoryList);
                setCategoryOptions(builtCategoryTree);

                if (isEdit && slug) {
                    const sectionRes = await sectionService.getById(slug);
                    const sectionData = sectionRes.data?.data;
                    if (sectionData) {
                        const mergedProducts = [...productList];
                        if (sectionData.products) {
                            sectionData.products.forEach((p) => {
                                if (p && !mergedProducts.some((ep) => ep.id === p.id)) {
                                    mergedProducts.push(p);
                                }
                            });
                            setProductOptions(mergedProducts);
                        }

                        reset({
                            title: sectionData.title,
                            type: sectionData.type,
                            orderIndex: sectionData.orderIndex,
                            isActive: sectionData.isActive,
                            banners: (sectionData.banners || [])
                                .sort((a, b) => a.sortOrder - b.sortOrder)
                                .map((b) => ({
                                    ...b,
                                    imageFile: null,
                                    previewUrl: getImageUrl(b.imageUrl),
                                  linkValue:
  b.linkType === 'product'
    ? productList.find((p) => p.id === parseInt(b.linkValue) || p.slug === b.linkValue) || null
    : b.linkType === 'category'
    ? builtCategoryTree.find((c) => c.id === parseInt(b.linkValue) || c.slug === b.linkValue) || null
    : b.linkValue

                                })),
                            productIds: (sectionData.products || [])
                                .sort((a, b) => (a.ProductHomeSection?.sortOrder || 0) - (b.ProductHomeSection?.sortOrder || 0))
                                .map((p) => p.id),
                            categoryIds: (sectionData.linkedCategories || [])
                                .sort((a, b) => (a.HomeSectionCategory?.sortOrder || 0) - (b.HomeSectionCategory?.sortOrder || 0))
                                .map((c) => c.id)
                        });
                    }
                }
            } catch (err) {
                toast.error('Lỗi khi tải dữ liệu ban đầu.');
                if (isEdit) navigate('/admin/home-sections');
            } finally {
                if (isEdit) setIsLoadingPage(false);
            }
        };
        loadInitialData();
    }, [slug, isEdit, reset, navigate]);


    const handleBannerDragEnd = (event) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const oldIndex = bannerFields.findIndex(f => f.id === active.id);
            const newIndex = bannerFields.findIndex(f => f.id === over.id);
            moveBanner(oldIndex, newIndex);
        }
    };


    const onSubmit = async (data) => {
        setIsLoadingPage(true);
        try {
            const formData = new FormData();
            formData.append('title', data.title);
            formData.append('type', data.type);
            formData.append('orderIndex', data.orderIndex);
            formData.append('isActive', data.isActive);
            formData.append('productIds', JSON.stringify(data.productIds || []));
            formData.append('categoryIds', JSON.stringify(data.categoryIds || []));

            const bannersMeta = (data.banners || []).map((b, idx) => ({
                id: b.id,
                linkType: b.linkType || 'url',
                linkValue: b.linkValue && typeof b.linkValue === 'object' ? b.linkValue.slug || b.linkValue.id : b.linkValue || '',
                existingImageUrl: b.imageFile ? null : b.imageUrl,
                hasNewFile: !!b.imageFile,
                fileName: b.imageFile?.name || null,
                sortOrder: idx
            }));

            formData.append('bannersMetaJson', JSON.stringify(bannersMeta));
            data.banners?.forEach((b) => {
                if (b.imageFile) {
                    formData.append('bannerImages', b.imageFile);
                }
            });

            const apiCall = isEdit ? sectionService.update(slug, formData) : sectionService.create(formData);
            await apiCall;
            toast.success(isEdit ? 'Cập nhật Khối thành công!' : 'Tạo mới Khối thành công!');
            navigate('/admin/home-sections');
        } catch (err) {
            const srvErrs = err?.response?.data?.errors;
            const srvMsg = err?.response?.data?.message;
            if (Array.isArray(srvErrs)) {
                srvErrs.forEach((error) => {
                    setError(error.field, { type: 'server', message: error.message });
                    toast.error(error.message);
                });
            } else {
                toast.error(srvMsg || 'Đã có lỗi xảy ra!');
            }
        } finally {
            setIsLoadingPage(false);
        }
    };

    if (isLoadingPage) return <LoaderAdmin fullscreen />;

    const showProducts = ['productOnly', 'productWithBanner', 'productWithCategoryFilter', 'full'].includes(selectedType);
    const showCategoryFilter = ['productWithCategoryFilter', 'full'].includes(selectedType);
    const showBanners = ['productWithBanner', 'full'].includes(selectedType);

    return (
        <>
          <Breadcrumb
          items={[
            { label: 'Trang chủ', href: '/admin' },
            { label: 'Khối trang chủ', href: '/admin/home-sections' },
            { label: isEdit ? 'Chỉnh sửa' : 'Thêm mới' }
          ]}
        />
      
      <Box component="form" onSubmit={handleSubmit(onSubmit)} mt={2}>

  <Paper sx={{ p: 3, mb: 3 }} elevation={2}>
    <Typography variant="h5" gutterBottom>
      {isEdit ? 'Cập nhật Khối Trang chủ' : 'Tạo mới Khối Trang chủ'}
    </Typography>
    <Stack spacing={2}>
      <TextField
        label={
          <span>
            Tiêu đề Khối <span style={{ color: 'red' }}>*</span>
          </span>
        }
        fullWidth
        InputLabelProps={{ shrink: true }}
        {...register('title', { required: 'Tiêu đề là bắt buộc' })}
        error={!!errors.title}
        helperText={errors.title?.message}
      />
      <Controller
        name="type"
        control={control}
        rules={{ required: 'Loại khối là bắt buộc' }}
        render={({ field }) => (
          <FormControl fullWidth error={!!errors.type}>
            <InputLabel>
              Loại khối <span style={{ color: 'red' }}>*</span>
            </InputLabel>
            <MUISelect {...field} label={
              <span>
                Loại khối <span style={{ color: 'red' }}>*</span>
              </span>
            }>
              {SECTION_TYPES.map((o) => (
                <MenuItem key={o.value} value={o.value}>
                  {o.label}
                </MenuItem>
              ))}
            </MUISelect>
            {errors.type && <FormHelperText>{errors.type.message}</FormHelperText>}
          </FormControl>
        )}
      />
      <TextField
        label="Thứ tự hiển thị"
        type="number"
        fullWidth
        InputLabelProps={{ shrink: true }}
        {...register('orderIndex', { valueAsNumber: true, min: { value: 0, message: 'Thứ tự phải ≥ 0' } })}
        error={!!errors.orderIndex}
        helperText={errors.orderIndex?.message}
      />
      <FormControlLabel
        control={<Controller name="isActive" control={control} render={({ field }) => <Switch {...field} checked={field.value} />} />}
        label="Kích hoạt khối"
      />
    </Stack>
  </Paper>

  {showCategoryFilter && (
    <Paper sx={{ p: 3, mb: 3 }} elevation={2}>
      <Typography variant="h6" gutterBottom>
        Danh mục hiển thị (Filter) <span style={{ color: 'red' }}>*</span>
      </Typography>
      <FormControl fullWidth error={!!errors.categoryIds}>
        <Controller
          name="categoryIds"
          control={control}
          rules={{ required: 'Danh mục hiển thị là bắt buộc' }} 
          render={({ field }) => {
            const handleDragEnd = (event) => {
              const { active, over } = event;
              if (over && active.id !== over.id) {
                const oldIndex = (field.value || []).indexOf(active.id);
                const newIndex = (field.value || []).indexOf(over.id);
                field.onChange(arrayMove(field.value, oldIndex, newIndex));
              }
            };

            const handleDelete = (idToDelete) => {
              field.onChange((field.value || []).filter((id) => id !== idToDelete));
            };

            const selectedCategoryObjects = (field.value || [])
              .map((id) => categoryOptions.find((opt) => opt.id === id))
              .filter(Boolean);

            return (
              <>
                <Autocomplete
                  multiple
                  options={categoryOptions}
                  value={selectedCategoryObjects}
                  getOptionLabel={(o) => o.name || 'Danh mục không tên'}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  onChange={(_, newValueObjects) => {
                    const newIds = newValueObjects.map((x) => x.id);
                    const existingIds = field.value || [];
                    const keptIds = existingIds.filter((id) => newIds.includes(id));
                    const addedIds = newIds.filter((id) => !existingIds.includes(id));
                    field.onChange([...keptIds, ...addedIds]);
                  }}
                  renderOption={(props, option) => {
                    return (
                      <li
                        {...props}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          paddingLeft: `${option.level * 1.5}em`,
                          gap: 6
                        }}
                      >
                        {option.level > 0 ? <span style={{ color: '#888' }}>├</span> : <span style={{ color: 'transparent' }}>├</span>}
                        {option.name}
                      </li>
                    );
                  }}
                  renderTags={() => null}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Chọn danh mục..."
                      error={!!errors.categoryIds} 
                      helperText={errors.categoryIds?.message} 
                    />
                  )}
                />

                {selectedCategoryObjects.length > 0 && (
                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={field.value || []} strategy={rectSortingStrategy}>
                      <Stack direction="row" flexWrap="wrap" sx={{ gap: 1, alignItems: 'flex-start' }} mt={1.5}>
                        {(field.value || []).map((catId) => {
                          const cat = categoryOptions.find((c) => c.id === catId);
                          if (!cat) return null;
                          return <SortableChip key={cat.id} id={cat.id} item={{ ...cat, thumbnail: null }} onDelete={handleDelete} />;
                        })}
                      </Stack>
                    </SortableContext>
                  </DndContext>
                )}
              </>
            );
          }}
        />
   
      </FormControl>
    </Paper>
  )}

  {showProducts && (
    <Paper sx={{ p: 3, mb: 3 }} elevation={2}>
      <Typography variant="h6" gutterBottom>
        Sản phẩm trong khối <span style={{ color: 'red' }}>*</span>
      </Typography>
      <FormControl fullWidth error={!!errors.productIds}>
        <Controller
          name="productIds"
          control={control}
          rules={{ required: 'Sản phẩm trong khối là bắt buộc' }} 
          render={({ field }) => {
            const handleDragEnd = (event) => {
              const { active, over } = event;
              if (over && active.id !== over.id) {
                const oldIndex = (field.value || []).indexOf(active.id);
                const newIndex = (field.value || []).indexOf(over.id);
                field.onChange(arrayMove(field.value, oldIndex, newIndex));
              }
            };

            const handleDelete = (idToDelete) => {
              field.onChange((field.value || []).filter((id) => id !== idToDelete));
            };

            const selectedProductObjects = (field.value || []).map((id) => productOptions.find((opt) => opt.id === id)).filter(Boolean);

            return (
              <>
                <Button
                  variant="outlined"
                  onClick={() => setProductModalOpen(true)}
        
                  color={errors.productIds ? 'error' : 'primary'}
                  sx={{ border: errors.productIds ? '1px solid red' : undefined }}
                >
                  Chọn sản phẩm
                </Button>
                {errors.productIds && ( 
                  <FormHelperText error>{errors.productIds.message}</FormHelperText>
                )}
                <ProductSelectionDialog
                  open={isProductModalOpen}
                  onClose={() => setProductModalOpen(false)}
                  value={field.value}
                  onChange={(newIds) => {
                    const existingIds = field.value || [];
                    const trulyNewIds = newIds.filter((id) => !existingIds.includes(id));
                    field.onChange([...existingIds, ...trulyNewIds]);
                  }}
                  fetchProducts={sectionService.getAllProducts}
                />

                {selectedProductObjects.length > 0 && (
                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={field.value || []} strategy={rectSortingStrategy}>
                      <Stack
                        direction="row"
                        flexWrap="wrap"
                        sx={{
                          gap: 1,
                          alignItems: 'flex-start'
                        }}
                        mt={1.5}
                      >
                        {selectedProductObjects.map((product) => (
                          <SortableChip
                            key={product.id}
                            id={product.id}
                            item={{ ...product, thumbnail: getImageUrl(product.thumbnail) }}
                            onDelete={handleDelete}
                          />
                        ))}
                      </Stack>
                    </SortableContext>
                  </DndContext>
                )}
              </>
            );
          }}
        />
       
      </FormControl>
    </Paper>
  )}

  {showBanners && (
    <Paper sx={{ p: 3, mb: 3 }} elevation={2}>
      <Typography variant="h6" gutterBottom>
        Quản lý Banner <span style={{ color: 'red' }}>*</span>
      </Typography>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleBannerDragEnd}>
        <SortableContext items={bannerFields.map(f => f.id)} strategy={rectSortingStrategy}>
          <Stack spacing={3}>
            {bannerFields.map((fieldItem, idx) => (
              <SortableBannerItem
                key={fieldItem.id}
                id={fieldItem.id}
                item={fieldItem}
                idx={idx}
                removeBanner={removeBanner}
                control={control}
                watch={watch}
                setValue={setValue}
                productOptions={productOptions}
                categoryOptions={categoryOptions}
                errors={errors}
              />
            ))}
          </Stack>
        </SortableContext>
        <Button
          startIcon={<AddCircleOutlineIcon />}
          onClick={() =>
            addBanner({
              id: `new-banner-${Date.now()}`,
              imageFile: null,
              previewUrl: null,
              imageUrl: null,
              linkType: 'url',
              linkValue: '',
              sortOrder: bannerFields.length
            })
          }
          disabled={bannerFields.length >= 2}
          variant="outlined"
          sx={{ mt: 2 }}
        >
          Thêm Banner
        </Button>
      </DndContext>
      {errors.banners && ( 
        <FormHelperText error sx={{ mt: 1 }}>{errors.banners.message}</FormHelperText>
      )}
    </Paper>
  )}

  <Stack direction="row" justifyContent="flex-end" spacing={2} mt={3}>
    <Button variant="outlined" onClick={() => navigate('/admin/home-sections')} disabled={isSubmitting}>
      Hủy bỏ
    </Button>
    <Button type="submit" variant="contained" disabled={isSubmitting}>
      {isEdit ? 'Cập nhật Khối' : 'Tạo mới Khối'}
    </Button>
  </Stack>
</Box>
          </>
    );
}