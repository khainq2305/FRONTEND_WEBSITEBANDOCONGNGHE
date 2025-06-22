import React from 'react'

const Page403 = () => {
  return (
    <div><div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
  <div className="fixed top-4 right-4 bg-white rounded-full shadow-md p-2 flex items-center gap-2 text-gray-600 text-xs font-medium">
    <span className="hidden sm:inline">Current view:</span>
    {/* Icon + text sẽ tự thay đổi ẩn/hiện dựa trên breakpoint */}
    <span className="text-blue-500 sm:hidden" aria-label="Mobile">📱</span>
    <span className="hidden sm:inline md:hidden text-purple-500" aria-label="Tablet">📱🖥️</span>
    <span className="hidden md:inline text-green-500" aria-label="Desktop">🖥️</span>
    
    {/* Text device */}
    <span className="sm:hidden">mobile</span>
    <span className="hidden sm:inline md:hidden">tablet</span>
    <span className="hidden md:inline">desktop</span>
  </div>

  <div className="bg-white rounded-lg shadow-lg w-full max-w-[90%] sm:max-w-[70%] md:max-w-md p-4 sm:p-6">
    {/* Icon, title, description, etc */}
    <div className="flex justify-center mb-4">
      <div className="bg-red-100 rounded-full flex items-center justify-center h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24">
        {/* SVG icon */}
        <svg
          className="text-red-600 h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 2L3 5v6c0 5.25 3.438 9.75 9 11 5.562-1.25 9-5.75 9-11V5l-9-3z"
          />
        </svg>
      </div>
    </div>

    <h1 className="text-gray-900 font-bold mb-2 text-center text-4xl sm:text-5xl md:text-6xl" tabIndex={0}>
      403
    </h1>
    <p className="text-gray-700 font-semibold mb-6 text-center text-lg sm:text-xl md:text-2xl">
      Access Forbidden
    </p>

    {/* Content text */}
    <div className="space-y-2 mb-6 text-center">
      <p className="text-gray-600 text-sm sm:text-base">
        You don't have permission to access this resource.
      </p>
      <p className="text-gray-500 text-xs sm:text-sm">
        If you believe this is an error, please contact your administrator or try logging in with appropriate credentials.
      </p>
    </div>

    {/* Buttons */}
    <div className="flex flex-col sm:flex-row gap-3 justify-center">
      <a
        href="/"
        className="py-5 px-6 bg-gray-200 rounded text-center hover:bg-gray-300 flex items-center justify-center gap-2"
      >
        <span className="text-lg">🏠</span> Go Home
      </a>
      <button
        onClick={() => window.history.back()}
        className="py-5 px-6 border border-gray-400 rounded text-center hover:bg-gray-100 flex items-center justify-center gap-2"
      >
        <span className="text-lg">⬅️</span> Go Back
      </button>
    </div>

    <div className="pt-4 border-t text-gray-400 text-xs text-center mt-6">
      Error Code: 403 | Forbidden Access | Viewed on device
    </div>
  </div>
</div>
</div>
  )
}

export default Page403