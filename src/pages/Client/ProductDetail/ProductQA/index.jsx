import React, { useState } from "react";

// Icon Gửi (Send) - bạn có thể thay bằng SVG khác nếu muốn
const SendIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path d="M3.105 3.105a1.5 1.5 0 011.722-.439l12.643 5.057a1.5 1.5 0 010 2.554L4.827 15.333A1.5 1.5 0 013 13.915V4.5a1.5 1.5 0 01.105-1.395zM4.5 5.32v8.146l9.293-3.718L4.5 5.32zm.163-.333a.75.75 0 00-.668.993l.003.006v8.028a.75.75 0 00.993.668l.006-.003 10.667-4.267a.75.75 0 000-1.273L4.663 4.987z" />
  </svg>
);

// Icon Đồng hồ (Clock)
const ClockIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

// Icon Trả lời (Chat Bubble)
const ReplyIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
  </svg>
);


export default function ProductQA({ 
    questions = [], // Nên truyền questions từ props của ProductDetail
    totalQuestions = 0, // Nên truyền từ props
    showAll, // Nên truyền từ props
    setShowAll // Nên truyền từ props
}) {
  const [newQuestion, setNewQuestion] = useState("");
  // const [showAll, setShowAll] = useState(false); // Bỏ state này nếu được truyền từ props

  const visibleQuestions = showAll ? questions : questions.slice(0, 2);

  const handleSendQuestion = () => {
    if (newQuestion.trim() === "") {
      alert("Vui lòng nhập câu hỏi của bạn.");
      return;
    }
    // TODO: Xử lý logic gửi câu hỏi (ví dụ: gọi API)
    console.log("Câu hỏi đã gửi:", newQuestion);
    alert("Câu hỏi của bạn đã được gửi và sẽ được duyệt sớm!");
    setNewQuestion(""); // Xóa nội dung textarea sau khi gửi
  };

  // Placeholder cho avatar người dùng hiện tại, bạn có thể thay bằng avatar thật
  const currentUserAvatarPlaceholder = "U"; 

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg border border-gray-200 shadow-sm text-sm">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Hỏi và đáp</h2>

      {/* Khu vực nhập câu hỏi mới */}
      <div className="flex items-start gap-3 mb-4 p-3 border border-gray-200 rounded-lg bg-gray-50">
        <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-semibold text-sm flex-shrink-0">
          {currentUserAvatarPlaceholder}
        </div>
        <div className="flex-1">
          <textarea
            className="w-full border border-gray-300 rounded-md p-2.5 text-sm resize-none focus:ring-primary focus:border-primary"
            rows={3}
            placeholder="CellphoneS sẽ trả lời trong 1 giờ (sau 22h, phản hồi vào sáng hôm sau). Một số thông tin có thể thay đổi, Quý khách hãy đặt câu hỏi để được cập nhật mới nhất."
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
          />
          <button 
            onClick={handleSendQuestion}
            className="mt-2 bg-primary text-white px-4 py-2 rounded-md font-semibold hover:bg-opacity-80 transition-all text-xs flex items-center gap-1.5"
            // Nếu có class hover-primary:
            // className="mt-2 bg-primary text-white px-4 py-2 rounded-md font-semibold hover-primary transition-all text-xs flex items-center gap-1.5"
          >
            <SendIcon className="w-4 h-4" />
            Gửi
          </button>
        </div>
      </div>

      {/* Danh sách hỏi đáp */}
      {visibleQuestions.length > 0 ? (
        <div className="space-y-4">
          {visibleQuestions.map((qna, i) => (
            <div
              key={i}
              className="border-t border-gray-200 pt-4" // Thêm border-t cho mỗi câu hỏi trừ câu đầu
            >
              {/* Câu hỏi */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {qna.user ? qna.user[0].toUpperCase() : "A"}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-0.5">
                    <p className="font-semibold text-gray-800">{qna.user || "Ẩn danh"}</p>
                    <div className="flex items-center text-xs text-gray-400">
                      <ClockIcon className="w-3.5 h-3.5 mr-1" />
                      <span>{qna.time}</span>
                    </div>
                  </div>
                  <p className="mb-2 text-gray-700 leading-relaxed">{qna.question}</p>
                  <button className="text-xs text-primary hover:underline flex items-center gap-1">
                    <ReplyIcon className="w-3.5 h-3.5" />
                    Trả lời
                  </button>
                </div>
              </div>

              {/* Trả lời của Admin */}
              {qna.adminReply && (
                <div className="mt-3 ml-11 pl-3 border-l-2 border-gray-200"> {/* Căn lề và thêm border trái */}
                  <div className="flex items-start gap-3">
                     <div className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center font-semibold text-xs flex-shrink-0">
                        QTV
                     </div>
                     <div className="flex-1">
                        <div className="flex justify-between items-center mb-0.5">
                           <p className="font-semibold text-red-600">Quản Trị Viên</p>
                           {/* <p className="text-xs text-gray-400">{qna.adminReplyTime || qna.time}</p> */}
                        </div>
                        <p className="text-gray-700 leading-relaxed">{qna.adminReply}</p>
                        <button className="text-xs text-primary hover:underline flex items-center gap-1 mt-1">
                           <ReplyIcon className="w-3.5 h-3.5" />
                           Trả lời
                        </button>
                     </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Nút Xem thêm / Thu gọn */}
          {questions.length > (visibleQuestions.length > 0 ? visibleQuestions.length : 2) && ( // Điều chỉnh điều kiện hiển thị
            <div className="flex justify-center mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={() => setShowAll(!showAll)}
                className="flex items-center justify-center gap-1.5 text-xs text-gray-700 bg-gray-100 
                           border border-gray-200 rounded-full px-5 py-2.5 shadow-sm 
                           transition-colors duration-200 ease-in-out 
                           hover:text-primary hover:border-primary hover:bg-blue-50"
              >
                <span>
                  {showAll
                    ? "Thu gọn câu hỏi"
                    : `Xem thêm ${questions.length - visibleQuestions.length} câu hỏi`}
                </span>
                <svg
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
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
      ) : (
        <p className="text-gray-500 text-center py-4">Chưa có câu hỏi nào cho sản phẩm này.</p>
      )}
    </div>
  );
}
