import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Grid } from "@mui/material";
import Content from "@/pages/Admin/News/components/form/Content";
import Sidebar from "@/pages/Admin/News/components/sidebar/Sidebar";
import SEORealtimeAnalyzerEnhanced from "@/components/Admin/SEO/SEORealtimeAnalyzerEnhanced";
import SchemaEditor from "@/components/Admin/SEO/SchemaEditor";
import { newsCategoryService } from "@/services/admin/newCategoryService";
import { normalizeCategoryList } from "@/utils";
import { tagService } from "@/services/admin/tagService";
import useAuthStore from "@/stores/AuthStore";

const FormPost = ({ onSubmit, initialData, mode = "add" }) => {
  const { user } = useAuthStore();
  
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
    reset,
    resetField
  } = useForm({
    defaultValues: {
      title: "",
      categoryId: "",
      status: 1,
      content: "",
      thumbnail: null,
      tags: [],
      isScheduled: false,
      publishAt: null,
      isFeature: false,
      categories: [],
      allTags: [],
      newCategory: ""
    },
    mode: "onChange" // Validate on change for better UX
  });

  // Watch values for dependent logic
  const watchedValues = watch();
  const { isScheduled, categories, allTags, newCategory, title, content } = watchedValues;

  // Load initial data
  const [focusKeyword, setFocusKeyword] = useState("");
  const [schema, setSchema] = useState(null);

  useEffect(() => {
    const loadFormData = async () => {
      try {
        const [catRes, tagRes] = await Promise.all([
          newsCategoryService.getAll(),
          tagService.getAll()
        ]);
  
        const activeCategories = catRes.data.data.filter(c => c.deletedAt === null);
        const normalizedCategories = normalizeCategoryList(activeCategories);
        setValue("categories", normalizedCategories);
  
        setValue("allTags", tagRes.data.data);
  
        // Chỉ reset khi edit mode
        if (mode === "edit" && initialData) {
          reset({
            title: initialData.title || "",
            categoryId: initialData.categoryId || initialData?.category?.id || "",
            status: initialData.status || 1,
            content: initialData.content || "",
            thumbnail: initialData.thumbnail || null,
            tags: initialData.tags || [],
            isFeature: initialData.isFeature || false,
            isScheduled: Boolean(initialData.publishAt),
            publishAt: initialData.publishAt || "",
            categories: normalizedCategories,
            allTags: tagRes.data.data,
            newCategory: ""
          });
      
      // Tự động load focus keyword từ database khi chỉnh sửa
      const existingFocusKeyword = 
        initialData.seoData?.focusKeyword || 
        initialData.focusKeyword || 
        initialData.seo?.focusKeyword || 
        "";
      
      setFocusKeyword(existingFocusKeyword);
      console.log('🔑 Loaded focus keyword from database:', existingFocusKeyword);
        }
  
      } catch (err) {
        console.error("Lỗi load categories hoặc tags", err);
        setError("categories", { type: "manual", message: "Không thể tải danh mục" });
        setError("allTags", { type: "manual", message: "Không thể tải tags" });
      }
    };
  
    loadFormData();
  }, [mode, initialData, setValue, reset, setError]);
  

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await newsCategoryService.getAll();
        const activeCategories = res.data.data.filter((c) => c.deletedAt === null);
        const normalizedCategories = normalizeCategoryList(activeCategories);
        setValue("categories", normalizedCategories);
        console.log(normalizedCategories);
      } catch (error) {
        console.error("Lỗi lấy danh mục:", error);
        setError("categories", {
          type: "manual",
          message: "Không thể tải danh mục. Vui lòng thử lại."
        });
      }
    };
    fetchCategories();
  }, [setValue, setError]);

  // Fetch tags
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await tagService.getAll();
        console.log('Dữ liệu tag là', res.data.data);
        setValue("allTags", res.data.data);
      } catch (error) {
        console.error('Lỗi lấy tag', error);
        setError("allTags", {
          type: "manual",
          message: "Không thể tải tags. Vui lòng thử lại."
        });
      }
    };
    fetchTags();
  }, [setValue, setError]);

  // Form submission handler
  const onFormSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("authorId", user.id);
      formData.append("content", data.content);
      formData.append("categoryId", data.categoryId);
      formData.append("status", data.isScheduled ? 2 : data.status);
      formData.append("publishAt", data.isScheduled ? data.publishAt : null);
      formData.append("isFeature", data.isFeature);
      formData.append('focusKeyword', focusKeyword);
      formData.append('schema', JSON.stringify(schema));
      // Thumbnail: nếu là file mới thì append file, nếu là string thì append thumbnailUrl
      if (data.thumbnail instanceof File) {
        formData.append("thumbnail", data.thumbnail); 
      } else if (typeof data.thumbnail === "string") {
        formData.append("thumbnailUrl", data.thumbnail); 
      }
  
      formData.append("tags", JSON.stringify(data.tags || []));
  
      // Log dữ liệu trong FormData để chắc chắn
      for (let [key, value] of formData.entries()) {
        console.log("📦", key, value);
      }
  
      await onSubmit?.(formData);
      console.table("Form data submitted successfully", formData);
      if (mode === "add") {
        reset({
          ...defaultValues,
          publishAt: null
        });
      }
    } catch (err) {
      const res = err.response;
      if (res?.status === 400 && typeof res.data?.errors === "object") {
        Object.keys(res.data.errors).forEach((key) => {
          setError(key, { type: "server", message: res.data.errors[key] });
        });
      } else {
        console.error("Lỗi không xác định:", err);
        setError("root", {
          type: "server",
          message: "Có lỗi xảy ra. Vui lòng thử lại.",
        });
      }
    }
  };

  
  const onAddCategory = async () => {
    if (!newCategory.trim()) {
      setError("newCategory", { type: "manual", message: "Tên danh mục không được để trống" });
      return;
    }
  
    try {
      const res = await newsCategoryService.create({
        name: newCategory,
        thumbnail: watchedValues.thumbnail || null  // nếu không có ảnh thì null
      });
      const newCat = res.data.data;
  
      setValue("categories", [...(categories ?? []), newCat]);
      resetField("newCategory");
      resetField("thumbnail");
  
      console.log("Danh mục mới đã được thêm:", newCat);
    } catch (error) {
      console.error("Lỗi tạo danh mục mới", error.response ?? error);
      setError("newCategory", {
        type: "server",
        message: error.response?.data?.message ?? "Không thể tạo danh mục mới"
      });
    }
  };
  
  


  return (
    <div title="Thêm bài viết mới">
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={9}>
            <Controller
              name="title"
              control={control}
              rules={{
                required: "Tiêu đề không được để trống",
                minLength: {
                  value: 5,
                  message: "Tiêu đề phải có ít nhất 5 ký tự"
                },
                maxLength: {
                  value: 200,
                  message: "Tiêu đề không được vượt quá 200 ký tự"
                }
              }}
              render={({ field }) => (
                <Content
                  {...field}
                  contentValue={watch("content")}
                  onContentChange={(value) => setValue("content", value)}
                  errors={errors}
                  clearErrors={clearErrors}
                  control={control}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            {/* SEO Real-time Analyzer */}
          <SEORealtimeAnalyzerEnhanced
            title={title}
            content={content}
            focusKeyword={focusKeyword}
            onFocusKeywordChange={setFocusKeyword}
            mode={mode}
            slug={initialData?.slug || ''}
          />
          
          {/* Schema Editor */}
          <SchemaEditor
            postId={initialData?.id}
            postTitle={title}
            postContent={content}
            postSlug={initialData?.slug || ''}
            mode={mode}
            onSchemaChange={setSchema}
          />
          
          <Sidebar
              control={control}
              errors={errors}
              setError={setError}
              clearErrors={clearErrors}
              setValue={setValue}
              watch={watch}
              isSubmitting={isSubmitting}
              mode={mode}
              onAddCategory={onAddCategory}
            />
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default FormPost;