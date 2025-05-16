import { useState } from "react";

export default function ProductQA({ questions }) {
  const [showAll, setShowAll] = useState(false);
  const visibleQuestions = showAll ? questions : questions.slice(0, 2);

  return (
    <div className="bg-white p-6 rounded border border-gray-200 shadow-sm text-sm col-span-full md:col-span-1">
      <h2 className="text-base font-bold mb-4">Hỏi và đáp</h2>

      {/* Câu hỏi nhập */}
      <textarea
        className="w-full border border-gray-200 rounded p-2 text-sm mb-2 resize-none"
        rows={3}
        placeholder="Mời bạn nhập câu hỏi..."
      />

      <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
        Gửi
      </button>

      {/* Danh sách hỏi đáp */}
      <div className="space-y-4 mt-6">
        {visibleQuestions.map((qna, i) => (
          <div
            key={i}
            className="bg-white border border-gray-200 rounded p-4 shadow-sm"
          >
            <p className="font-semibold text-gray-800">{qna.user}</p>
            <p className="text-xs text-gray-500 mb-2">{qna.time}</p>
            <p className="mb-2 text-gray-700">{qna.question}</p>

            {qna.adminReply && (
              <div className="bg-gray-100 border-l-4 border-gray-300 shadow-md p-4 rounded-lg text-gray-800 text-sm mt-2">
                <p className="font-semibold mb-1 text-red-600">
                  Quản Trị Viên trả lời:
                </p>
                <p>{qna.adminReply}</p>
              </div>
            )}
          </div>
        ))}

        {/* Nút Xem thêm / Thu gọn */}
        {questions.length > 2 && (
          <div className="flex justify-center mt-4">
            <button
              onClick={() => setShowAll(!showAll)}
              className="flex items-center justify-center gap-1 text-xs text-gray-800 bg-white 
              border border-gray-200 rounded-full px-5 py-3 shadow-sm 
              transition-colors duration-200 ease-in-out 
              hover:text-red-600 hover:border-gray-300 hover:bg-red-50"
            >
              <span>
                {showAll
                  ? "Thu gọn bình luận"
                  : `Xem thêm ${questions.length - 2} bình luận`}
              </span>
              <svg
                className={`w-3 h-3 transition-transform ${
                  showAll ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
