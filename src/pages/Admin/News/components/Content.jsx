// src/pages/Admin/News/Content.jsx
import { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import 'tinymce/tinymce'; // core
import 'tinymce/icons/default';
import 'tinymce/themes/silver';
import 'tinymce/models/dom';

// plugins
import 'tinymce/plugins/image';
import 'tinymce/plugins/link';
import 'tinymce/plugins/code';
import 'tinymce/plugins/lists';

// optional: style
import 'tinymce/skins/ui/oxide/skin.min.css';

import { Typography, TextField } from '@mui/material';

const Content = ({ content, setContent, setTitle, title }) => {
    const editorRef = useRef(null);

    return (
        <>
            <TextField sx={{mb: 3}}
          label="Tiêu đề bài viết"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth // ✅ phải có
        />
            <Editor
                apiKey="no-api-key"
                value={content}
                onEditorChange={setContent}
                init={{
                    height: 400,
                    menubar: false,
                    statusbar: false,
                    branding: false,
                    plugins: [
                        'image', 'code', 'link', 'lists', 'media', 'preview, fontfamily'
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

                    // ✅ Ngôn ngữ tiếng Việt - dùng link chuẩn
                    language: 'vi',
                    language_url: 'https://cdn.jsdelivr.net/npm/tinymce-i18n/langs/vi.js'
                }}
            />



        </>
    );
};

export default Content;
