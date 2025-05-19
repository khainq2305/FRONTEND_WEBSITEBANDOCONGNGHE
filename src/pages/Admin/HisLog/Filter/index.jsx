import React from "react";
import SearchInput from "components/common/SearchInput";

const actionTabs = [
  { value: "", label: "Tất Cả" },
  { value: "create", label: "Tạo" },
  { value: "update", label: "Cập nhật" },
  { value: "delete", label: "Xóa" },
  { value: "login", label: "Đăng nhập" },
  { value: "logout", label: "Đăng xuất" },
  { value: "export", label: "Xuất dữ liệu" },
  { value: "restore", label: "Khôi phục" },
  { value: "permanently_delete", label: "Xóa vĩnh viễn" },
];

const Filter = ({ action, setAction, search, setSearch }) => {
  return (
    <>
      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 mb-4">
        {actionTabs.map((tab) => {
          const isActive = action === tab.value;
          return (
            <div
              key={tab.value}
              onClick={() => setAction(tab.value)}
              className={`cursor-pointer px-4 py-2 rounded-t-md text-sm font-medium transition-all duration-200
                ${isActive
                  ? "bg-blue-50 text-blue-600 border-b-2 border-blue-500"
                  : "text-gray-600 hover:text-blue-500"}
              `}
            >
              {tab.label}
            </div>
          );
        })}
      </div>

      {/* Search */}
      <div className="mb-4 max-w-xs">
        <SearchInput
          placeholder="Tìm theo người thao tác hoặc module..."
          value={search}
          onChange={setSearch}
        />
      </div>
    </>
  );
};

export default Filter;
