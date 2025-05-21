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

// Demo data danh mục cha
const parentCategories = [
  { id: 1, name: "Electronics" },
  { id: 2, name: "Clothing" },
  { id: 3, name: "Home & Kitchen" },
  { id: 4, name: "Books" },
  { id: 5, name: "Sports" },
];

const CategoryMain = ({ initialData = null, onSubmit }) => {
  const [category, setCategory] = useState({
    name: "",
    parentId: "",
    status: true,
    description: ""
  });

  // Nếu có initialData (mode edit) thì load vào state
  useEffect(() => {
    if (initialData) {
      setCategory({
        name: initialData.name || "",
        parentId: initialData.parentId || "",
        status: initialData.status ?? true,
        description: initialData.description || ""
      });
    }
  }, [initialData]);

  const handleChange = (field, value) => {
    setCategory((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Box maxWidth="full" py={4}>
      <Card>
        <CardHeader
          title={initialData ? "Cập nhật danh mục" : "Thêm danh mục"}
          subheader="Điền thông tin danh mục"
        />
        <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
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
              <MenuItem value="">Không có</MenuItem>
              {parentCategories.map((parent) => (
                <MenuItem key={parent.id} value={parent.id.toString()}>
                  {parent.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControlLabel
            control={
              <Switch
                checked={category.status}
                onChange={(e) => handleChange("status", e.target.checked)}
              />
            }
            label={category.status ? "Hoạt động" : "Không hoạt động"}
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
          <Button variant="outlined" type="button">Huỷ</Button>
          <Button variant="contained" onClick={() => onSubmit(category)}>
            {initialData ? "Cập nhật" : "Thêm mới"}
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
};

export default CategoryMain;
