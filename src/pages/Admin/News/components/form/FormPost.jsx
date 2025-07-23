import { useState, useEffect } from "react";
import { Grid, FormControlLabel, Switch } from "@mui/material";
import Content from "@/pages/Admin/News/components/form/Content";
import Sidebar from "@/pages/Admin/News/components/sidebar/Sidebar";
import { newsCategoryService } from "@/services/admin/newCategoryService";
import { normalizeCategoryList } from "@/utils";
import { tagService } from "@/services/admin/tagService";

const FormPost = ({ onSubmit, initialData, mode = "add" }) => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [status, setStatus] = useState(1);
  const [content, setContent] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [tags, setTags] = useState([]);
  const [allTags, setAllTags] = useState([])
  const [isScheduled, setIsScheduled] = useState(false);
  const [publishAt, setPublishAt] = useState("");
  const [isFeature, setIsFeature] = useState(false);
  const [errors, setErrors] = useState({});
  const [newCategory, setNewCategory] = useState('');
  
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setCategory(initialData.categoryId || "");
      setStatus(initialData.status || 1);
      setContent(initialData.content || "");
      setThumbnail(initialData.thumbnail || null);
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
        console.log(normalizeCategoryList(activeCategories))
      } catch (error) {
        console.error("Lỗi lấy danh mục:", error);
      }
    };
    fetchCategories();
  }, []);
  const fetchTags = async () => {
  try {
    const res = await tagService.getAll();
    console.log('Dữ liệu tag là', res.data.data);
    setAllTags(res.data.data); // ✅ Gán vào danh sách gợi ý
  } catch (error) {
    console.error('lỗi lấy tag', error);
  }
};
  useEffect(() => {
    fetchTags()
  },[])
  const handleSubmit = async () => {
  const formData = new FormData();
  formData.append("title", title);
  formData.append("content", content);
  formData.append("category", category);
  formData.append("status", isScheduled ? 2 : status); // 2: hẹn giờ
  formData.append("publishAt", isScheduled ? publishAt : "");
  formData.append("isFeature", isFeature);
  formData.append("thumbnail", thumbnail);
  formData.append('tags', JSON.stringify(tags));

  try {
    await onSubmit?.(formData);
    console.log('form data',formData);
    setErrors({}); // Reset lỗi nếu thành công
} catch (err) {
  const res = err.response;
  if (res?.status === 400 && typeof res.data?.errors === "object") {
    setErrors(res.data.errors);
  } else {
    console.error("Lỗi không xác định:", err);
  }
}
};

const onAddCategory = async () => {
  try {
    const res = await newsCategoryService.create({ name: newCategory });
    const newCat = res.data.data;
    // Thêm danh mục mới vào state
    setCategories(prev => [...prev, newCat]);
    // Reset input nếu muốn
    setNewCategory('');
  } catch (error) {
    console.error('Lỗi tạo danh mục mới', error.response ? error.response.data : error);
  }
}





  return (
    <div title="Thêm bài viết mới">
      <Grid container spacing={3}>
        <Grid item xs={12} md={9}>
          <Content
            title={title}
            setTitle={setTitle}
            content={content}
            setContent={setContent}
            errors={errors}
            setErrors={setErrors}
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
            setErrors={setErrors}
            handleSubmit={handleSubmit}
            setThumbnail={setThumbnail}
            thumbnail={thumbnail}
            tags={tags}
            setTags={setTags}
            allTags={allTags} 
            isFeature={isFeature}
            setIsFeature={setIsFeature}
            mode={mode}
            newCategory={newCategory}
            setNewCategory={setNewCategory}
            onAddCategory={onAddCategory}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default FormPost;
