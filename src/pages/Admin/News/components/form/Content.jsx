import { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { TextField, Box, Typography} from '@mui/material';

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
  title,
  setTitle,
  content,
  setContent,
  errors,
  setErrors
}) => {
  const editorRef = useRef(null);

  return (
    <>
      <TextField
  label="Tiêu đề"
  value={title}
  onChange={(e) => {
    setTitle(e.target.value);
    setErrors(prev => ({ ...prev, title: null }));
  }}
  error={!!errors.title}
  helperText={errors.title}
  fullWidth
  sx={{ mb: 2 }}
/>

      <Box sx={{ mb: 2 }}>
  <Editor
    apiKey="no-api-key"
    value={content}
    onEditorChange={(val) => {
      setContent(val);
      setErrors((prev) => ({ ...prev, content: null }));
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
  
  {/* 👇 Hiển thị lỗi thủ công */}
  {errors.content && (
    <Typography color="error" fontSize="0.75rem" sx={{ mt: 0.5 }}>
      {errors.content}
    </Typography>
  )}
</Box>
    </>
  );
};

export default Content;
