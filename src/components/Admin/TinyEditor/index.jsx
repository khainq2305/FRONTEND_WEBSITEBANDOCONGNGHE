// src/components/common/TinyEditor.jsx
import { Editor } from '@tinymce/tinymce-react';
import { useRef } from 'react';

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

const TinyEditor = ({ value, onChange, height = 400 }) => {
  const editorRef = useRef(null);

  return (
    <Editor
      apiKey="no-api-key"
      value={value}
      onEditorChange={onChange}
      init={{
        height,
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
  );
};

export default TinyEditor;
// import { Editor } from '@tinymce/tinymce-react';
// import { useRef } from 'react';
// import { API_BASE_URL } from '../../../constants/environment';
// import API from '../../../services/common/api'; // dùng axios wrapper đã config

// import 'tinymce/tinymce';
// import 'tinymce/icons/default';
// import 'tinymce/themes/silver';
// import 'tinymce/models/dom';
// import 'tinymce/plugins/image';
// import 'tinymce/plugins/link';
// import 'tinymce/plugins/code';
// import 'tinymce/plugins/lists';
// import 'tinymce/plugins/media';
// import 'tinymce/plugins/preview';
// import 'tinymce/skins/ui/oxide/skin.min.css';

// const TinyEditor = ({ value, onChange, height = 400 }) => {
//   const editorRef = useRef(null);
//   const uploadImage = async (file) => {
//     const form = new FormData();
//     form.append('file', file);

//     const res = await API.post('/admin/upload/image', form, {
//       headers: { 'Content-Type': 'multipart/form-data' },
//     });

//     return res.data.url; 
//   };

//   return (
//     <Editor
//       apiKey="no-api-key"
//       value={value}
//       onEditorChange={onChange}
//       init={{
//         height,
//         menubar: false,
//         statusbar: false,
//         branding: false,
//         plugins: [
//           'image', 'code', 'link', 'lists', 'media', 'preview', 'paste', 'fontfamily'
//         ],
//         toolbar:
//           'undo redo | fontfamily | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist | image media link | code',

//         paste_data_images: false,
//         automatic_uploads: true,
//         file_picker_types: 'image',

        
//         images_upload_handler: async (blobInfo, progress) => {
//           progress(10);
//           const url = await uploadImage(blobInfo.blob());
//           progress(100);
//           return url;
//         },

       
//         file_picker_callback: (cb, value, meta) => {
//           if (meta.filetype !== 'image') return;
//           const input = document.createElement('input');
//           input.type = 'file';
//           input.accept = 'image/*';
//           input.onchange = async () => {
//             const file = input.files[0];
//             if (!file) return;
//             try {
//               const url = await uploadImage(file);
//               cb(url, { title: file.name });
//             } catch (err) {
//               console.error(err);
//               alert('Upload ảnh thất bại');
//             }
//           };
//           input.click();
//         },

//         language: 'vi',
//         language_url: 'https://cdn.jsdelivr.net/npm/tinymce-i18n/langs/vi.js',
//       }}
//     />
//   );
// };

// export default TinyEditor;
