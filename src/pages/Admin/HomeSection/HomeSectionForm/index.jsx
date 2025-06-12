import React, { useEffect, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
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
  Alert,
  Grid,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import Autocomplete from "@mui/material/Autocomplete";
import { useNavigate, useParams } from "react-router-dom";
import { sectionService } from "../../../../services/admin/sectionService";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../../../constants/environment";
import LoaderAdmin from "../../../../components/Admin/LoaderVip";

const SECTION_TYPES = [
  { value: "productOnly", label: "Chỉ sản phẩm" },
  { value: "productWithBanner", label: "Sản phẩm + Banner" },
];

const LINK_TYPES = [
  { value: "url", label: "URL tùy chỉnh" },
  { value: "product", label: "Sản phẩm" },
  { value: "category", label: "Danh mục" },
];

const getImageUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("blob:") || path.startsWith("http")) return path;
  return `${API_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
};

// --- COMPONENT CON ĐÃ ĐƯỢC SỬA LỖI THEO PHƯƠNG PHÁP LƯU OBJECT ---
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
                // Khi đổi loại, reset giá trị về null để Autocomplete hoặc TextField nhận đúng
                setValue(`banners.${bannerIndex}.linkValue`, null, { shouldValidate: true }); 
              }}
            >
              {LINK_TYPES.map(type => (
                <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>
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
              // [SỬA ĐỔI QUAN TRỌNG]
              key="product-autocomplete" // Thêm key để React biết phải tạo lại component này khi đổi type
              options={productOptions}
              value={field.value || null} // Giá trị giờ là object, lấy trực tiếp từ form
              getOptionLabel={(option) => option.name || ""}
              isOptionEqualToValue={(option, value) => option && value && option.id === value.id}
              onChange={(_, newValue) => field.onChange(newValue)} // Lưu toàn bộ object vào form
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
        getOptionLabel={o => o.name}
        isOptionEqualToValue={(opt, val) => opt.id === val.id}
        renderOption={(props, option) => {
          // tìm tất cả anh em cùng parent để xác định có phải cuối list không
          const siblings = categoryOptions.filter(o => o.parentId === option.parentId);
          const isLast = siblings[siblings.length - 1].id === option.id;
          const prefix = option.level > 0
            ? (isLast ? '└─' : '├─')
            : '';
          return (
            <li {...props} style={{ display: 'flex', alignItems: 'center', paddingLeft: 8 }}>
              {option.level > 0 && (
                <span style={{ marginRight: 4, color: '#999' }}>
                  {prefix}
                </span>
              )}
              {option.name}
            </li>
          );
        }}
        onChange={(_, v) => field.onChange(v)}
        renderInput={params => (
          <TextField {...params} label="Chọn danh mục liên kết" fullWidth />
        )}
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
            // Đảm bảo value là string, phòng trường hợp trước đó nó là object
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

// … các import ở trên …

// Chuyển flat list thành dạng tree + tính level
function buildCategoryTree(list) {
  const map = {}, roots = []
  list.forEach(c => map[c.id] = { ...c, children: [], level: 0 })
  list.forEach(c => {
    if (c.parentId && map[c.parentId]) {
      map[c.parentId].children.push(map[c.id])
      map[c.id].level = map[c.parentId].level + 1
    } else {
      roots.push(map[c.id])
    }
  })
  const out = []
  function dfs(node) {
    out.push(node)
    node.children.forEach(dfs)
  }
  roots.forEach(dfs)
  return out
}


export default function HomeSectionFormPage() {
  const { slug } = useParams();
  const isEdit = Boolean(slug);
  const navigate = useNavigate();
  const [isLoadingPage, setIsLoadingPage] = useState(isEdit);

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    clearErrors,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      title: "",
      type: SECTION_TYPES[0].value,
      orderIndex: 0,
      isActive: true,
      banners: [],
      productIds: [],
    },
  });

  const selectedType = watch("type");
  const { fields: bannerFields, append: addBanner, remove: removeBanner } = useFieldArray({ control, name: "banners" });
  const watchedBanners = watch("banners");

  const [productOptions, setProductOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);

  useEffect(() => {
    const loadInitialData = async () => {
      if (isEdit) setIsLoadingPage(true);
      try {
        const [productRes, categoryRes] = await Promise.all([
          sectionService.getAllProducts({ limit: 1000 }),
          sectionService.getAllCategories({ limit: 1000 }),
        ]);
const categoryRaw = categoryRes.data?.data || [];   // ← thêm dòng này
        const productList = productRes.data?.data || [];
        setProductOptions(productList);
  const flatTree = buildCategoryTree(categoryRes.data?.data || []);
setCategoryOptions(flatTree);

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

            // [SỬA ĐỔI QUAN TRỌNG] Khi reset form, cần tìm object tương ứng để đưa vào form state
const bannersWithLinkObjects = (sectionData.banners || []).map(b => {
  let linkValueObject = b.linkValue;

  if (b.linkType === 'product') {
    linkValueObject = productList.find(
      p => String(p.id) === String(b.linkValue) || p.slug === b.linkValue
    ) || null;
  } 
  else if (b.linkType === 'category') {
    // trước kia bạn viết categoryList.find, bây giờ đổi thành categoryRaw.find
    linkValueObject = categoryRaw.find(
      c => String(c.id) === String(b.linkValue) || c.slug === b.linkValue
    ) || null;
  }

  return {
    id: b.id,
    imageFile: null,
    previewUrl: getImageUrl(b.imageUrl),
    existingImageUrl: b.imageUrl,
    linkType: b.linkType || "url",
    linkValue: linkValueObject,
    sortOrder: b.sortOrder,
  };
});


            
            reset({
              title: sectionData.title,
              type: sectionData.type,
              orderIndex: sectionData.orderIndex,
              isActive: sectionData.isActive,
              banners: bannersWithLinkObjects,
              productIds: (sectionData.products || []).map((p) => p.id),
            });
          }
        }
      } catch (err) {
        toast.error("Lỗi khi tải dữ liệu ban đầu.");
        console.error("Error loading initial data:", err);
        if (isEdit) navigate("/admin/home-sections");
      } finally {
        if (isEdit) setIsLoadingPage(false);
      }
    };
    loadInitialData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, isEdit, reset, navigate]);

  const handleBannerImageChange = (e, idx) => {
    const file = e.target.files[0];
    if (!file) return;
      clearErrors(`banners.${idx}.imageFile`); // <--- SỬA LẠI THÀNH DÒNG NÀ
    setValue(`banners.${idx}.imageFile`, file, { shouldValidate: true });
    setValue(`banners.${idx}.previewUrl`, URL.createObjectURL(file));
    setValue(`banners.${idx}.existingImageUrl`, null);
  };

 const onSubmit = async (data) => {
  setIsLoadingPage(true);

  try {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("type", data.type);
    formData.append("orderIndex", data.orderIndex);
    formData.append("isActive", data.isActive);
    formData.append("productIds", JSON.stringify(data.productIds || []));

    // Normalize linkValue và build bannersMeta
    const bannersMeta = (data.banners || []).map((b, idx) => ({
      id: b.id,
      linkType: b.linkType || "url",
      linkValue:
        b.linkValue && typeof b.linkValue === "object"
          ? b.linkValue.slug || b.linkValue.id
          : b.linkValue || "",
      existingImageUrl: b.imageFile ? null : b.existingImageUrl,
      hasNewFile: !!b.imageFile,
      fileName: b.imageFile?.name || null,
      sortOrder: b.sortOrder !== undefined ? b.sortOrder : idx,
    }));

    formData.append("bannersMetaJson", JSON.stringify(bannersMeta));

    // Append file nếu có
    data.banners?.forEach((b) => {
      if (b.imageFile) {
        formData.append("bannerImages", b.imageFile);
      }
    });

    // Gọi API
    const apiCall = isEdit
      ? sectionService.update(slug, formData)
      : sectionService.create(formData);
    await apiCall;

    toast.success(
      isEdit ? "Cập nhật Khối thành công!" : "Tạo mới Khối thành công!"
    );
    navigate("/admin/home-sections");
  } catch (err) {
    console.error("[Form Error]", err);
    const srvErrs = err?.response?.data?.errors;
    const srvMsg = err?.response?.data?.message;
    if (Array.isArray(srvErrs)) {
      srvErrs.forEach((error) => {
        if (error.field) {
          setError(error.field, { type: "server", message: error.message });
        }
        toast.error(error.message);
      });
    } else {
      toast.error(srvMsg || "Đã có lỗi xảy ra!");
    }
  } finally {
    setIsLoadingPage(false);
  }
};

  if (isLoadingPage) return <LoaderAdmin fullscreen />;
  
  const generalBannerErrorMessage =
    (errors.banners && errors.banners.message) ||
    (errors.bannerFiles && errors.bannerFiles.message) ||
    null;

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} mt={2}>
      {/* PHẦN FORM CHÍNH GIỮ NGUYÊN, KHÔNG CẦN THAY ĐỔI */}
      <Paper sx={{ p: 3, mb: 3 }} elevation={2}>
        <Typography variant="h5" gutterBottom>
          {isEdit ? "Cập nhật Khối Trang chủ" : "Tạo mới Khối Trang chủ"}
        </Typography>
        <Stack spacing={2}>
          <TextField
            label="Tiêu đề Khối"
            fullWidth
            InputLabelProps={{ shrink: true }}
            {...register("title", { required: "Tiêu đề là bắt buộc" })}
            error={!!errors.title}
            helperText={errors.title?.message}
          />
          <Controller
            name="type"
            control={control}
            rules={{ required: "Loại khối là bắt buộc" }}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.type}>
                <InputLabel>Loại khối</InputLabel>
                <MUISelect {...field} label="Loại khối">
                  {SECTION_TYPES.map((o) => (
                    <MenuItem key={o.value} value={o.value}>
                      {o.label}
                    </MenuItem>
                  ))}
                </MUISelect>
                {errors.type && (
                  <FormHelperText>{errors.type.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />
          <TextField
            label="Thứ tự hiển thị"
            type="number"
            fullWidth
            InputLabelProps={{ shrink: true }}
            {...register("orderIndex", {
              valueAsNumber: true,
              min: { value: 0, message: "Thứ tự phải ≥ 0" },
            })}
            error={!!errors.orderIndex}
            helperText={errors.orderIndex?.message}
          />
          <FormControlLabel
            control={
              <Controller
                name="isActive"
                control={control}
                render={({ field }) => (
                  <Switch {...field} checked={field.value} />
                )}
              />
            }
            label="Kích hoạt khối"
          />
        </Stack>
      </Paper>

      {(selectedType === "productOnly" ||
        selectedType === "productWithBanner") && (
        <Paper sx={{ p: 3, mb: 3 }} elevation={2}>
          <Typography variant="h6" gutterBottom>
            Sản phẩm trong khối
          </Typography>
          <FormControl fullWidth error={!!errors.productIds}>
            <Controller
              name="productIds"
              control={control}
              render={({ field }) => {
                const selectedProductObjects = productOptions.filter((o) =>
                  (field.value || []).includes(o.id)
                );
                return (
                  <>
                    <Autocomplete
                      multiple
                      options={productOptions}
                      value={selectedProductObjects}
                      getOptionLabel={(o) => o.name || "Sản phẩm không tên"}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      onChange={(_, newValueObjects) =>
                        field.onChange(newValueObjects.map((x) => x.id))
                      }
                      renderTags={() => null}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Chọn sản phẩm..."
                          placeholder="Tìm theo tên sản phẩm"
                          error={!!errors.productIds}
                        />
                      )}
                    />
                    {selectedProductObjects.length > 0 && (
                      <Stack direction="row" spacing={1} flexWrap="wrap" mt={1.5}>
                        {selectedProductObjects.map((product) => (
                          <Chip
                            key={product.id}
                            avatar={
                              <Avatar
                                alt={product.name}
                                src={getImageUrl(product.thumbnail)}
                                sx={{ width: 24, height: 24 }}
                              />
                            }
                            label={product.name || "N/A"}
                            onDelete={() =>
                              field.onChange(
                                (field.value || []).filter((id) => id !== product.id)
                              )
                            }
                          />
                        ))}
                      </Stack>
                    )}
                  </>
                );
              }}
            />
            {errors.productIds && (
              <FormHelperText>{errors.productIds.message}</FormHelperText>
            )}
          </FormControl>
        </Paper>
      )}

      {selectedType === "productWithBanner" && (
        <Paper sx={{ p: 3, mb: 3 }} elevation={2}>
          <Typography variant="h6" gutterBottom>
            Quản lý Banner
          </Typography>

          {generalBannerErrorMessage && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {generalBannerErrorMessage}
            </Alert>
          )}

          <Stack spacing={3}>
            {bannerFields.map((fieldItem, idx) => {
              const currentBanner = watchedBanners[idx] || {};
              const imageSourceForPreview =
                currentBanner.previewUrl || getImageUrl(currentBanner.existingImageUrl);
              const inputId = `banner-upload-${idx}`;
              const fieldError = errors?.banners?.[idx]?.imageFile;

              return (
                <Paper
                  key={fieldItem.id}
                  variant="outlined"
                  sx={{ p: 2, position: "relative" }}
                >
                  <IconButton
                    size="small"
                    onClick={() => removeBanner(idx)}
                    title="Xóa banner này"
                    sx={{
                      position: "absolute", top: 8, right: 8, zIndex: 1,
                      bgcolor: "rgba(255, 255, 255, 0.85)", color: "text.secondary",
                      "&:hover": { color: "error.main", bgcolor: "rgba(255, 255, 255, 1)", },
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>

                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <Stack spacing={1.5}>
                        <Box
                          component="label"
                          htmlFor={inputId}
                          sx={{
                            border: "2px dashed", borderColor: fieldError ? "error.main" : "#ccc",
                            p: 2, textAlign: "center", cursor: "pointer", minHeight: 150,
                            display: "flex", flexDirection: "column", alignItems: "center",
                            justifyContent: "center", backgroundColor: "#f9f9f9",
                            "&:hover": { borderColor: "primary.main", backgroundColor: "action.hover",},
                          }}
                        >
                          <input id={inputId} type="file" hidden accept="image/*" onChange={(e) => handleBannerImageChange(e, idx)} />
                          <PhotoCamera sx={{ fontSize: 38, color: "text.secondary", mb: 1, }} />
                          <Typography variant="caption" color="text.secondary">
                            {imageSourceForPreview ? "Thay đổi ảnh" : "Chọn ảnh Banner"}
                          </Typography>
                        </Box>
                        {fieldError && ( <FormHelperText error>{fieldError.message}</FormHelperText>)}
                        {imageSourceForPreview && (
                          <Avatar
                            src={imageSourceForPreview}
                            variant="rounded"
                            alt={`Banner ${idx + 1}`}
                            sx={{ height: 120, width: "100%", objectFit: "contain" }}
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
            })}
            <Button
              startIcon={<AddCircleOutlineIcon />}
              onClick={() =>
                addBanner({
                  id: undefined, imageFile: null, previewUrl: null, existingImageUrl: null,
                  linkType: "url", linkValue: "", sortOrder: bannerFields.length,
                })
              }
              disabled={bannerFields.length >= 2}
              variant="outlined"
            >
              Thêm Banner
            </Button>
          </Stack>
        </Paper>
      )}

      <Stack direction="row" justifyContent="flex-end" spacing={2} mt={3}>
        <Button
          variant="outlined"
          onClick={() => navigate("/admin/home-sections")}
          disabled={isSubmitting}
        >
          Hủy bỏ
        </Button>
        <Button type="submit" variant="contained" disabled={isSubmitting}>
          {isEdit ? "Cập nhật Khối" : "Tạo mới Khối"}
        </Button>
      </Stack>
    </Box>
  );
}