import { useRef } from 'react';
import { Controller } from 'react-hook-form';
import { Editor } from '@tinymce/tinymce-react';
import { TextField, Box, Typography } from '@mui/material';

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

// Style
import 'tinymce/skins/ui/oxide/skin.min.css';

const Content = ({ 
  value: titleValue,
  onChange: onTitleChange,
  contentValue,
  onContentChange,
  errors,
  clearErrors,
  control
}) => {
  const editorRef = useRef(null);

  return (
    <>
      {/* Title Field with React Hook Form */}
      <TextField
        label="Tiêu đề"
        value={titleValue || ''}
        onChange={(e) => {
          onTitleChange(e.target.value);
          if (errors.title) {
            clearErrors("title");
          }
        }}
        error={!!errors.title}
        helperText={errors.title?.message}
        fullWidth
        sx={{ mb: 2 }}
        placeholder="Nhập tiêu đề bài viết..."
      />

      <Box sx={{ mb: 2 }}>
        
        <Controller
          name="content"
          control={control}
          rules={{
            required: "Nội dung không được để trống",
            minLength: {
              value: 50,
              message: "Nội dung phải có ít nhất 50 ký tự"
            },
            validate: (value) => {
              // Remove HTML tags for length validation
              const textContent = value.replace(/<[^>]*>/g, '').trim();
              if (textContent.length === 0) {
                return "Nội dung không được để trống";
              }
              if (textContent.length < 50) {
                return "Nội dung phải có ít nhất 50 ký tự";
              }
              return true;
            }
          }}
          render={({ field: { onChange, value } }) => (
            <Editor
              apiKey="no-api-key"
              value={value || ''}
              onInit={(evt, editor) => editorRef.current = editor}
              onEditorChange={(val) => {
                onChange(val);
                if (errors.content) {
                  clearErrors("content");
                }
              }}
              init={{
                height: 400,
                menubar: false,
                statusbar: false,
                branding: false,
                plugins: [
                  'image', 'code', 'link', 'lists', 'media', 'preview', 'fontfamily'
                ],
                toolbar:
                  'undo redo | fontfamily | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist | image media link | code preview',
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
                      if (file) {
                        // Validate file size (max 5MB)
                        if (file.size > 5 * 1024 * 1024) {
                          alert('Kích thước file không được vượt quá 5MB');
                          return;
                        }
                        
                        // Validate file type
                        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
                        if (!validTypes.includes(file.type)) {
                          alert('Chỉ chấp nhận file ảnh (JPEG, PNG, GIF, WebP)');
                          return;
                        }

                        const reader = new FileReader();
                        reader.onload = function () {
                          cb(reader.result, { 
                            title: file.name,
                            alt: file.name 
                          });
                        };
                        reader.onerror = function () {
                          alert('Có lỗi khi đọc file ảnh');
                        };
                        reader.readAsDataURL(file);
                      }
                    };
                    input.click();
                  }
                },
                setup: (editor) => {
                  editor.on('focus', () => {
                    if (errors.content) {
                      clearErrors("content");
                    }
                  });
                },
                content_style: `
                  body { 
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; 
                    font-size: 14px;
                    line-height: 1.6;
                  }
                `,
                language: 'vi',
                language_url: 'https://cdn.jsdelivr.net/npm/tinymce-i18n/langs/vi.js',
                paste_data_images: true,
                paste_as_text: false,
                paste_webkit_styles: 'none',
                paste_retain_style_properties: 'color font-size',
                convert_urls: false,
                relative_urls: false
              }}
            />
          )}
        />

        {/* Error message for content */}
        {errors.content && (
          <Typography 
            color="error" 
            fontSize="0.75rem" 
            sx={{ mt: 0.5, ml: 1.75 }}
          >
            {errors.content.message}
          </Typography>
        )}

        {/* Character count helper */}
        <Typography 
          variant="caption" 
          sx={{ 
            mt: 0.5, 
            ml: 1.75, 
            color: 'text.secondary',
            display: 'block'
          }}
        >
          {contentValue ? `${contentValue.replace(/<[^>]*>/g, '').length} ký tự` : '0 ký tự'}
        </Typography>
      </Box>
    </>
  );
};

export default Content;