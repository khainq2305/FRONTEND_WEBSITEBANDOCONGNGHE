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

const CategoryMain = ({ initialData = null, onSubmit }) => {
  const [category, setCategory] = useState({
    name: "",
    parentId: "",
    isActive: true, // ✅ boolean
    description: ""
  });

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (initialData) {
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
        setCategories(res.data.data);
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
                    {cat.name}
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

          <TextField
            label="Mô tả"
            multiline
            rows={4}
            value={category.description}
            onChange={(e) => handleChange("description", e.target.value)}
            fullWidth
          />
        </CardContent>

        <CardActions sx={{ justifyContent: "flex-end", px: 2, pb: 2 }}>
          <Button variant="outlined" type="button">
            Huỷ
          </Button>
          <Button
            variant="contained"
            onClick={() =>
              onSubmit({
                name: category.name,
                description: category.description,
                parentId: category.parentId === "" ? null : parseInt(category.parentId),
                isActive: category.isActive // ✅ RÕ RÀNG
              })
            }
          >
            {initialData ? "Cập nhật" : "Thêm mới"}
          </Button>

        </CardActions>
      </Card>
    </Box>
  );
};

export default CategoryMain;
