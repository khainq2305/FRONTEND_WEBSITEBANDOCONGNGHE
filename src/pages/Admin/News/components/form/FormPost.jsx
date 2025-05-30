import { useState, useEffect } from "react";
import { Grid, FormControlLabel, Switch } from "@mui/material";
import { validatePostForm } from "@/utils/News/validatePostForm";
import Content from "@/pages/Admin/News/components/form/Content";
import Sidebar from "@/pages/Admin/News/components/sidebar/Sidebar";
import { newsCategoryService } from "@/services/admin/newCategoryService";
import { normalizeCategoryList } from "@/utils";

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
  const [isFeature, setIsFeature] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setCategory(initialData.categoryId || "");
      setStatus(initialData.status || "active");
      setContent(initialData.content || "");
      setAvatar(initialData.avatar || null);
      setTags(initialData.tags || []);
      setIsFeature(initialData.isFeature || false);
      setIsScheduled(Boolean(initialData.publishAt));
      setPublishAt(initialData.publishAt || "");
    }
  }, [initialData]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await newsCategoryService.getAll();
        const activeCategories = res.data.data.filter((c) => c.deletedAt === null);
        setCategories(normalizeCategoryList(activeCategories));
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
      isFeature
    };

    const result = validatePostForm(formData);
    if (!result.valid) {
      setErrors(result.errors);
      return;
    }

    onSubmit?.(formData);
  };

  return (
    <div title="Thêm bài viết mới">
      <Grid container spacing={3}>
        <Grid item xs={12} md={9}>
          <Content
            title={title}
            setTitle={setTitle}
            content={content}
            setContent={setContent}
            avatar={avatar}
            setAvatar={setAvatar}
            
            errors={errors}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <Sidebar
            category={category}
            setCategory={setCategory}
            categories={categories}
            status={status}
            setStatus={setStatus}
            isScheduled={isScheduled}
            setIsScheduled={setIsScheduled}
            publishAt={publishAt}
            setPublishAt={setPublishAt}
            errors={errors}
            onSubmit={handleSubmit}
            avatar={avatar}
            setAvatar={setAvatar}
            tags={tags}
            setTags={setTags}
            isFeature={isFeature}
            setIsFeature={setIsFeature}
            mode={mode}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default FormPost;
