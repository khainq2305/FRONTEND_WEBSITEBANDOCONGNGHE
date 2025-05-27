// src/pages/Admin/News/components/form/FormPost.jsx

import { createContext, useContext, useState, useEffect } from "react";
import { Grid, FormControlLabel, Switch } from "@mui/material";
import { validatePostForm } from "@/utils/News/validatePostForm";
import Content from "@/pages/Admin/News/components/form/Content";
import Sidebar from "@/pages/Admin/News/components/sidebar/Sidebar";
import { newsCategoryService } from "@/services/admin/newCategoryService";

const AddContext = createContext();
export const useArticle = () => useContext(AddContext);

const FormPost = ({ onSubmit, initialData, mode = "add" }) => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [status, setStatus] = useState("active");
  const [content, setContent] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [tags, setTags] = useState([]);
  const [isScheduled, setIsScheduled] = useState(false);
  const [publishAt, setPublishAt] = useState("");
  const [isFeature, setIsFeature] = useState(false); // ✅ NEW
  const [errors, setErrors] = useState({});

  // 1️⃣ useEffect: khi có `initialData` → set form values
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setCategory(initialData.categoryId || "");
      setStatus(initialData.status || "active");
      setContent(initialData.content || "");
      setAvatar(initialData.avatar || null);
      setTags(initialData.tags || []);
      setIsFeature(initialData.isFeature || false); // ✅ NEW
      setIsScheduled(initialData.isScheduled || false);
      setPublishAt(initialData.publishAt || "");

      if (initialData.publishAt) {
        setIsScheduled(true);
        setPublishAt(initialData.publishAt);
      } else {
        setIsScheduled(false);
        setPublishAt("");
      }
    }
  }, [initialData]);

  // 2️⃣ useEffect: gọi API lấy danh sách danh mục
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await newsCategoryService.getAll();
        const allCategories = res.data.data;
        const activeCategories = allCategories.filter((c) => c.deletedAt === null);
        setCategories(activeCategories);
      } catch (error) {
        console.error("Lỗi lấy danh mục:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = () => {
    const formData = {
      title,
      content,
      category,
      status: isScheduled ? 2 : status,
      tags,
      avatar,
      publishAt: isScheduled ? publishAt : null,
      isFeature // ✅ NEW
    };

    const result = validatePostForm(formData);
    if (!result.valid) {
      setErrors(result.errors);
      return;
    }

    if (onSubmit) {
      onSubmit(formData);
    }
  };

  return (
    <AddContext.Provider
      value={{
        title,
        setTitle,
        category,
        setCategory,
        status,
        setStatus,
        content,
        setContent,
        avatar,
        setAvatar,
        tags,
        setTags,
        isScheduled,
        setIsScheduled,
        publishAt,
        setPublishAt,
        isFeature, // ✅ NEW
        setIsFeature, // ✅ NEW
        errors,
        setErrors,
        handleSubmit,
        categories,
        setCategories,
        mode
      }}
    >
      <div title="Thêm bài viết mới">
        <Grid container spacing={3}>
          <Grid item xs={12} md={9}>
            <Content />
          </Grid>
          <Grid item xs={12} md={3}>
            <Sidebar />
            {/* ✅ NÊU MUỐN THÊM NGAY Ở ĐÂY */}
            <FormControlLabel
              control={
                <Switch
                  checked={isFeature}
                  onChange={(e) => setIsFeature(e.target.checked)}
                />
              }
              label="Đánh dấu là bài viết nổi bật"
              sx={{ mt: 2 }}
            />
          </Grid>
        </Grid>
      </div>
    </AddContext.Provider>
  );
};

export default FormPost;
