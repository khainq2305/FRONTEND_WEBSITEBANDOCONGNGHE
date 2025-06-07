// src/components/common/TinyEditor.jsx
import { Editor } from "@tinymce/tinymce-react";
import { useRef } from "react";

// TinyMCE core
import "tinymce/tinymce";
import "tinymce/icons/default";
import "tinymce/themes/silver";
import "tinymce/models/dom";

// Các plugin bạn đang dùng
import "tinymce/plugins/image";
import "tinymce/plugins/link";
import "tinymce/plugins/code";
import "tinymce/plugins/lists";
import "tinymce/plugins/media";
import "tinymce/plugins/preview";


// Style skin
import "tinymce/skins/ui/oxide/skin.min.css";

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
          "image",
          "code",
          "link",
          "lists",
          "media",
          "preview",
          "paste",
          "fontfamily"
        ],

        toolbar:
          "undo redo | fontfamily | bold italic underline | " +
          "alignleft aligncenter alignright alignjustify | " +
          "bullist numlist | image media link | code",

        // Thay vì images_upload_url, ta dùng custom handler
        automatic_uploads: false,

        images_upload_handler: (blobInfo, success, failure) => {
          // Tạo formData và gắn blob file từ blobInfo
          const formData = new FormData();
          formData.append("file", blobInfo.blob(), blobInfo.filename());

          // Lấy token từ localStorage
          const accessToken = localStorage.getItem("accessToken");
          if (!accessToken) {
            return failure("Không tìm thấy token. Vui lòng đăng nhập trước khi upload.");
          }

          fetch("http://localhost:5000/upload-image", {
            method: "POST",
            headers: {
              // Gửi token theo Bearer header
              Authorization: "Bearer " + accessToken,
            },
            credentials: "include", 
            body: formData,
          })
            .then((res) => {
              if (!res.ok) {
                throw new Error("HTTP Error: " + res.status);
              }
              return res.json();
            })
            .then((data) => {
              // data.location chứa URL ảnh do server trả
              success(data.location);
            })
            .catch((err) => {
              failure("Lỗi upload: " + err.message);
            });
        },

        file_picker_types: "image",
        file_picker_callback: (cb, value, meta) => {
          if (meta.filetype === "image") {
            const input = document.createElement("input");
            input.setAttribute("type", "file");
            input.setAttribute("accept", "image/*");
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

        // Nếu bạn vẫn muốn hỗ trợ drag & drop + paste ảnh
        paste_data_images: true,

        language: "vi",
        language_url: "https://cdn.jsdelivr.net/npm/tinymce-i18n/langs/vi.js",
      }}
    />
  );
};

export default TinyEditor;
