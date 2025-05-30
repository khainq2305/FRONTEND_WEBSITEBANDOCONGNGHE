import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardActions,
  CardHeader,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Switch,
  FormControlLabel,
  Button,
  Box
} from "@mui/material";
import { newsCategoryService } from "@/services/admin/newCategoryService";
import { normalizeCategoryList } from "@/utils";
import { Editor } from '@tinymce/tinymce-react';
import { validateCategoryForm } from '@/utils/News/validateCategoryForm'; // hoặc đúng path bạn đang để

// TinyMCE core
import 'tinymce/tinymce';
import 'tinymce/icons/default';
import 'tinymce/themes/silver';
import 'tinymce/models/dom';

// Plugins
import 'tinymce/plugins/image';
import 'tinymce/plugins/link';
import 'tinymce/plugins/code';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/media';
import 'tinymce/plugins/preview';
// import 'tinymce/plugins/fontfamily'; // nếu dùng custom
const CategoryMain = ({ initialData = null, onSubmit }) => {
  const [category, setCategory] = useState({
    name: "",
    parentId: "",
    isActive: true, // ✅ boolean
    description: ""
  });

  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  useEffect(() => {
    if (initialData) {
      console.log('🧾 initialData.description:', initialData.description);
      setCategory({
        name: initialData.name || "",
        parentId: initialData.parentId || "",
        isActive: initialData.isActive ?? true, // ✅ boolean
        description: initialData.description || ""
      });
    }
  }, [initialData]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await newsCategoryService.getAll();
        const levelCategory = normalizeCategoryList(res.data.data)
        setCategories(levelCategory);
      } catch (error) {
        console.error("Lỗi lấy danh mục:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (field, value) => {
    console.log(`🧪 Change field: ${field} →`, value); // 👈 LOG QUAN TRỌNG
    setCategory((prev) => ({
      ...prev,
      [field]: value
    }));
  };
  const handleSubmit = () => {
  const { valid, errors } = validateCategoryForm({ name: category.name });

  if (!valid) {
    setErrors(errors);
    return;
  }

  setErrors({}); // clear lỗi cũ

  onSubmit({
    name: category.name,
    description: category.description,
    parentId: category.parentId === "" ? null : parseInt(category.parentId),
    isActive: category.isActive
  });
};

  return (
    <Box maxWidth="full" py={4}>
      <Card>
        <CardHeader
          title={initialData ? "Cập nhật danh mục" : "Thêm danh mục"}
          subheader="Điền thông tin danh mục"
        />
        <CardContent sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <TextField
  label="Tên danh mục"
  value={category.name}
  onChange={(e) => handleChange("name", e.target.value)}
  required
  fullWidth
  error={Boolean(errors.name)}
  helperText={errors.name}
/>


          <FormControl fullWidth>
            <InputLabel>Danh mục cha</InputLabel>
            <Select
              value={category.parentId}
              label="Danh mục cha"
              onChange={(e) => handleChange("parentId", e.target.value)}
            >
              {Array.isArray(categories) && categories.length > 0 ? (
                categories.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id.toString()}>
                    {'— '.repeat(cat.level) + cat.name}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>Không có danh mục</MenuItem>
              )}
            </Select>
          </FormControl>

          <FormControlLabel
            control={
              <Switch
                checked={category.isActive}
                onChange={(e) => handleChange("isActive", e.target.checked)}
              />
            }
            label={category.isActive ? "Hoạt động" : "Không hoạt động"}
          />


          <Editor
            value={category.description}
            onEditorChange={(newValue) => handleChange("description", newValue)}
            init={{
              height: 400,
              menubar: false,
              statusbar: false,
              branding: false,
              plugins: [
                'image', 'code', 'link', 'lists', 'media', 'preview', 'fontfamily'
              ],
              toolbar:
                'undo redo | fontfamily | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist | image media link | code',
              font_family_formats: `
      Arial=arial,helvetica,sans-serif;
      Times New Roman=times new roman,times;
      Courier New=courier new,courier;
      Roboto=Roboto,sans-serif;
      Open Sans='Open Sans',sans-serif;
      Be Vietnam Pro='Be Vietnam Pro',sans-serif;
      Montserrat=Montserrat,sans-serif;
      Lato=Lato,sans-serif;
      Georgia=georgia,serif;
      Tahoma=tahoma,sans-serif;
      Verdana=verdana,sans-serif;
    `,
              automatic_uploads: true,
              file_picker_types: 'image',
              file_picker_callback: (cb, value, meta) => {
                if (meta.filetype === 'image') {
                  const input = document.createElement('input');
                  input.setAttribute('type', 'file');
                  input.setAttribute('accept', 'image/*');
                  input.onchange = function () {
                    const file = this.files[0];
                    const reader = new FileReader();
                    reader.onload = function () {
                      cb(reader.result, { title: file.name });
                    };
                    reader.readAsDataURL(file);
                  };
                  input.click();
                }
              },
              language: 'vi',
              language_url: 'https://cdn.jsdelivr.net/npm/tinymce-i18n/langs/vi.js'
            }}
          />


        </CardContent>

        <CardActions sx={{ justifyContent: "flex-end", px: 2, pb: 2 }}>
          <Button variant="outlined" type="button">
            Huỷ
          </Button>
           <Button variant="contained" onClick={handleSubmit}>{initialData ? "Cập nhật" : "Thêm mới"}</Button>

        </CardActions>
      </Card>
    </Box>
  );
};

export default CategoryMain;
