import React from 'react'

const Page403 = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-[90%] sm:max-w-[70%] md:max-w-md p-4 sm:p-8">

        <h1 className="text-gray-900 font-extrabold mb-2 text-center text-5xl sm:text-6xl md:text-7xl" tabIndex={0}>
          403
        </h1>
        <p className="text-gray-700 font-bold mb-6 text-center text-xl sm:text-2xl md:text-3xl">
          Truy cập bị từ chối
        </p>

        {/* Nội dung chi tiết */}
        <div className="space-y-4 mb-8 text-center">
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            Rất tiếc, bạn không có quyền truy cập vào tài nguyên này.
          </p>
          <p className="text-gray-500 text-xs sm:text-sm italic">
            Nếu bạn cho rằng đây là một lỗi, vui lòng liên hệ với quản trị viên hoặc thử đăng nhập với tài khoản có quyền phù hợp.
          </p>
        </div>

        {/* Các nút hành động */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/"
            className="py-3 px-6 bg-red-500 text-white rounded-lg text-center hover:bg-red-600 transition-colors duration-200 flex items-center justify-center gap-2 font-medium shadow-md"
          >
            Quay lại trang chủ
          </a>
          <button
            onClick={() => window.history.back()}
            className="py-3 px-6 border border-gray-300 text-gray-700 rounded-lg text-center hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center gap-2 font-medium"
          >
            Quay lại trang trước
          </button>
        </div>
      </div>
    </div>
  )
}

export default Page403