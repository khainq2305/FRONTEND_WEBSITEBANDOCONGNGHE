// src/components/ProductQA.jsx

import React, { useState, useEffect, useRef } from "react";
import { productQuestionService } from "@/services/client/productQuestionService";
import { FaPaperPlane, FaCommentAlt } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/**
 * ProductQA component – To, rõ, dễ dùng, có toast thông báo, chống spam và duplicate,
 * và cho phép client phản hồi bên dưới cả admin replies.
 */

const PromptImage = () => (
  <img
    src="https://storage.googleapis.com/a1aa/image/8ab650f5-37c6-4346-ccaa-8059cf5943c9.jpg"
    alt="Ant mascot"
    className="w-24 h-24 object-contain"
  />
);

const AdminAvatar = () => (
  <img
    src="https://storage.googleapis.com/a1aa/image/edc8189b-6597-4563-2add-a6582083d864.jpg"
    alt="Quản Trị Viên Avatar"
    className="w-8 h-8 rounded-full object-contain"
  />
);

export default function ProductQA({ productId }) {
  // Cố định userId = 12, fullName = "Người Dùng 12"
  const FIXED_USER_ID = 12;
  const FIXED_USER_NAME = "Người Dùng 12";

  const [questions, setQuestions] = useState([]); // danh sách câu hỏi + replies
  const [loading, setLoading] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");

  // Key mở textarea reply: "q_<questionId>" hoặc "r_<replyId>"
  const [replyingTo, setReplyingTo] = useState(null);
  // Nội dung reply theo key
  const [replyContent, setReplyContent] = useState({});
  // Key nào expand replies
  const [expandedReplies, setExpandedReplies] = useState({});

  // Timestamp lần cuối user gửi question (chống spam 5s)
  const lastQuestionTimestampRef = useRef(0);
  // Timestamp lần cuối user gửi reply cho mỗi questionId (chống spam 5s)
  const lastReplyTimestampsRef = useRef({});

  useEffect(() => {
    if (!productId) return;
    setLoading(true);
    productQuestionService
      .getByProduct(productId)
      .then((res) => {
        if (res.data && res.data.success && Array.isArray(res.data.data)) {
          setQuestions(res.data.data);
        } else {
          setQuestions([]);
        }
      })
      .catch(() => setQuestions([]))
      .finally(() => setLoading(false));
  }, [productId]);

  // Gửi câu hỏi mới
  const handleSendQuestion = () => {
    const content = newQuestion.trim();
    if (!content) {
      toast.error("Vui lòng nhập câu hỏi.");
      return;
    }

    // Chống duplicate question
    const isDuplicateQ = questions.some(
      (q) => q.content.trim().toLowerCase() === content.toLowerCase()
    );
    if (isDuplicateQ) {
      toast.error("Bạn đã gửi câu hỏi này rồi.");
      return;
    }

    // Chống spam: phải cách 5 giây
    const now = Date.now();
    if (now - lastQuestionTimestampRef.current < 5000) {
      toast.error("Vui lòng đợi 5 giây trước khi gửi câu hỏi tiếp.");
      return;
    }

    productQuestionService
      .createQuestion({ userId: FIXED_USER_ID, productId, content })
      .then((res) => {
        if (res.data && res.data.success && res.data.data) {
          setQuestions((prev) => [...prev, res.data.data]);
          setNewQuestion("");
          toast.success("Gửi câu hỏi thành công!");
          lastQuestionTimestampRef.current = now;
        } else {
          toast.error(res.data?.message || "Gửi câu hỏi thất bại.");
        }
      })
      .catch(() => toast.error("Lỗi mạng khi gửi câu hỏi."));
  };

  // Khi nhấn "Phản hồi" ở câu hỏi gốc hoặc admin/user reply
  const handleReplyClick = (key, questionId) => {
    // Toggle open/close textarea cho key đó
    setReplyingTo((prev) => (prev === key ? null : key));
    // Nếu mở textarea cho câu hỏi (key bắt đầu bằng "q_"), thì ẩn phần replies
    if (key.startsWith("q_")) {
      setExpandedReplies((prev) => ({ ...prev, [questionId]: false }));
    }
  };

  // Mở/đóng phần hiển thị replies cho 1 câu hỏi
  const toggleExpandedReplies = (questionId) => {
    setExpandedReplies((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
    // Ẩn textarea nếu có
    setReplyingTo(null);
  };

  // Gửi reply (có thể là reply vào question hoặc reply vào admin/user reply)
  const handleReplySubmit = (questionId, replyToId, key) => {
    const content = (replyContent[key] || "").trim();
    if (!content) {
      toast.error("Vui lòng nhập nội dung phản hồi.");
      return;
    }

    // Chống duplicate reply trong cùng question
    const targetQ = questions.find((q) => q.id === questionId);
    const isDuplicateR =
      targetQ?.replies?.some(
        (r) => r.content.trim().toLowerCase() === content.toLowerCase()
      ) || false;
    if (isDuplicateR) {
      toast.error("Bạn đã gửi phản hồi này rồi.");
      return;
    }

    // Chống spam reply: cách 5 giây cho cùng question
    const now = Date.now();
    const lastRTime = lastReplyTimestampsRef.current[questionId] || 0;
    if (now - lastRTime < 5000) {
      toast.error("Vui lòng đợi 5 giây trước khi gửi phản hồi tiếp.");
      return;
    }

    productQuestionService
      .reply({
        userId: FIXED_USER_ID,
        questionId,
        content,
        replyToId,
      })
      .then((res) => {
        if (res.data && res.data.success && res.data.data) {
          const newReplyRaw = res.data.data;
          const normalizedReply = {
            id: newReplyRaw.id,
            questionId: newReplyRaw.questionId,
            content: newReplyRaw.content,
            createdAt: newReplyRaw.createdAt,
            isAdminReply: false,
            fullName: FIXED_USER_NAME,
            replyToId: newReplyRaw.replyToId,
          };
          setQuestions((prev) =>
            prev.map((q) => {
              if (q.id === normalizedReply.questionId) {
                const oldReplies = Array.isArray(q.replies) ? q.replies : [];
                return {
                  ...q,
                  replies: [...oldReplies, normalizedReply],
                };
              }
              return q;
            })
          );
          setReplyContent((prev) => ({ ...prev, [key]: "" }));
          setReplyingTo(null);
          setExpandedReplies((prev) => ({ ...prev, [questionId]: true }));
          toast.success("Gửi phản hồi thành công!");
          lastReplyTimestampsRef.current[questionId] = now;
        } else {
          toast.error(res.data?.message || "Gửi phản hồi thất bại.");
        }
      })
      .catch(() => toast.error("Lỗi mạng khi gửi phản hồi."));
  };

  // Format thời gian hiển thị
  const formatTime = (isoString) => {
    const now = new Date();
    const d = new Date(isoString);
    const diffDays = Math.floor((now - d) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Hôm nay";
    if (diffDays === 1) return "1 ngày trước";
    if (diffDays < 7) return `${diffDays} ngày trước`;
    if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} tuần trước`;
    }
    if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} tháng trước`;
    }
    const years = Math.floor(diffDays / 365);
    return `${years} năm trước`;
  };

  // Chọn màu background avatar ngẫu nhiên dựa trên ký tự đầu của tên
  const getRandomColor = (name) => {
    const colors = [
      "bg-green-700",
      "bg-purple-700",
      "bg-blue-700",
      "bg-yellow-600",
      "bg-pink-600",
      "bg-indigo-600",
    ];
    const idx = name?.charCodeAt(0) % colors.length || 0;
    return colors[idx];
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* ToastContainer cho React-Toastify */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        newestOnTop
        closeOnClick
        pauseOnHover
      />

      {/* === Phần “Hãy đặt câu hỏi” === */}
      <div className="bg-gray-50 rounded-xl p-6 mb-8 shadow-sm">
        <h2 className="text-lg font-bold text-gray-800">Hỏi và đáp</h2>
        <div className="flex space-x-6 mt-4">
          <PromptImage />
          <div className="flex-1">
            <h3 className="text-base font-semibold text-gray-900 mb-2">
              Hãy đặt câu hỏi cho chúng tôi
            </h3>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              CellphoneS sẽ phản hồi trong vòng 1 giờ. Nếu Quý khách gửi câu hỏi
              sau 22h, chúng tôi sẽ trả lời vào sáng hôm sau. Thông tin có thể
              thay đổi theo thời gian, vui lòng đặt câu hỏi để nhận được cập
              nhật mới nhất!
            </p>
            <div className="flex space-x-4">
              <input
                type="text"
                className="flex-1 border border-gray-300 rounded-md text-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Viết câu hỏi của bạn tại đây"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
              />
              <button
                className="bg-red-600 text-white text-sm font-semibold px-6 py-3 rounded-md flex items-center space-x-2 hover:bg-red-700 transition"
                onClick={handleSendQuestion}
              >
                <span>Gửi câu hỏi</span>
                <FaPaperPlane className="text-base" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* === Loading state === */}
      {loading && (
        <p className="text-center text-gray-500 py-8">Đang tải câu hỏi...</p>
      )}

      {/* === Danh sách câu hỏi & trả lời === */}
      {!loading && questions.length > 0 && (
        <div className="space-y-8">
          {questions.map((qna) => (
            <div
              key={qna.id}
              className="bg-gray-50 rounded-xl p-6 shadow-sm space-y-4"
            >
              {/* --- Hiển thị câu hỏi gốc --- */}
              <div className="flex items-start space-x-6">
                <div
                  className={`w-12 h-12 rounded-full ${getRandomColor(
                    qna.user?.fullName
                  )} text-white font-semibold text-lg flex items-center justify-center`}
                >
                  {qna.user?.fullName?.[0]?.toUpperCase() || "U"}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center space-x-4">
                      <p className="text-lg font-semibold text-gray-800">
                        {qna.user?.fullName || "Ẩn danh"}
                      </p>
                      <p className="text-sm text-gray-400">
                        {formatTime(qna.createdAt)}
                      </p>
                    </div>
                  </div>
                  <p className="text-base text-gray-700 mb-4 leading-relaxed">
                    {qna.content}
                  </p>
                  <button
                    onClick={() => handleReplyClick(`q_${qna.id}`, qna.id)}
                    className="text-sm text-red-600 font-semibold flex items-center space-x-2 hover:underline"
                    type="button"
                  >
                    <FaCommentAlt className="text-sm" />
                    <span>Phản hồi</span>
                  </button>
                </div>
              </div>

              {/* --- Textarea để reply vào câu hỏi gốc --- */}
              {replyingTo === `q_${qna.id}` && (
                <div className="ml-20 mb-4">
                  <textarea
                    className="w-full border border-gray-300 rounded-md p-4 text-sm resize-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    rows={4}
                    placeholder="Viết phản hồi của bạn..."
                    value={replyContent[`q_${qna.id}`] || ""}
                    onChange={(e) =>
                      setReplyContent((prev) => ({
                        ...prev,
                        [`q_${qna.id}`]: e.target.value,
                      }))
                    }
                  />
                  <button
                    onClick={() =>
                      handleReplySubmit(qna.id, null, `q_${qna.id}`)
                    }
                    className="mt-3 bg-red-600 text-white text-sm font-semibold px-6 py-3 rounded-md flex items-center space-x-2 hover:bg-red-700 transition"
                  >
                    <span>Gửi phản hồi</span>
                    <FaPaperPlane className="text-base" />
                  </button>
                </div>
              )}

              {/* --- Nút Xem/Thu gọn replies --- */}
              <button
                onClick={() => toggleExpandedReplies(qna.id)}
                className="ml-20 text-sm text-gray-500 hover:text-gray-700"
                type="button"
              >
                {expandedReplies[qna.id]
                  ? "Thu gọn phản hồi ^"
                  : `Xem phản hồi (${qna.replies?.length || 0}) ↓`}
              </button>

              {/* --- Danh sách replies (nếu expandedReplies[qna.id] = true) --- */}
              {expandedReplies[qna.id] &&
                Array.isArray(qna.replies) &&
                qna.replies.length > 0 && (
                  <div className="ml-20 space-y-6">
                    {qna.replies.map((r) => (
                      <div
                        key={r.id}
                        className="bg-white rounded-lg p-4 shadow space-y-3"
                      >
                        <div className="flex items-start space-x-4">
                          {r.isAdminReply ? (
                            // Nếu là admin reply
                            <AdminAvatar />
                          ) : (
                            // Nếu là user reply
                            <div
                              className={`w-10 h-10 rounded-full ${getRandomColor(
                                r.fullName
                              )} text-white font-semibold text-lg flex items-center justify-center`}
                            >
                              {r.fullName?.[0]?.toUpperCase() || "U"}
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="flex justify-between items-center mb-2">
                              <div className="flex items-center space-x-4">
                                <p
                                  className={`text-lg font-semibold ${
                                    r.isAdminReply
                                      ? "text-red-700"
                                      : "text-gray-800"
                                  }`}
                                >
                                  {r.isAdminReply
                                    ? "Quản Trị Viên"
                                    : r.fullName}
                                </p>
                                {r.isAdminReply && (
                                  <span className="bg-red-700 text-white text-xs rounded px-2 py-1 font-bold">
                                    QTV
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-400">
                                {formatTime(r.createdAt)}
                              </p>
                            </div>
                            <p className="text-base text-gray-700 leading-relaxed">
                              {r.content.split("\n").map((line, i) => (
                                <React.Fragment key={i}>
                                  {line}
                                  <br />
                                </React.Fragment>
                              ))}
                            </p>

                            {/* LUÔN HIỂN THỊ nút "Phản hồi" cho cả admin và user replies */}
                            <button
                              onClick={() =>
                                handleReplyClick(`r_${r.id}`, qna.id)
                              }
                              className="mt-3 text-sm text-red-600 font-semibold flex items-center space-x-2 hover:underline"
                              type="button"
                            >
                              <FaCommentAlt className="text-sm" />
                              <span>Phản hồi</span>
                            </button>
                          </div>
                        </div>

                        {/* Textarea để reply vào admin/user reply */}
                        {replyingTo === `r_${r.id}` && (
                          <div className="ml-14 mt-2">
                            <textarea
                              className="w-full border border-gray-300 rounded-md p-4 text-sm resize-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                              rows={4}
                              placeholder="Viết phản hồi của bạn..."
                              value={replyContent[`r_${r.id}`] || ""}
                              onChange={(e) =>
                                setReplyContent((prev) => ({
                                  ...prev,
                                  [`r_${r.id}`]: e.target.value,
                                }))
                              }
                            />
                            <button
                              onClick={() =>
                                handleReplySubmit(
                                  qna.id,    // questionId
                                  r.id,      // replyToId
                                  `r_${r.id}` // key
                                )
                              }
                              className="mt-3 bg-red-600 text-white text-sm font-semibold px-6 py-3 rounded-md flex items-center space-x-2 hover:bg-red-700 transition"
                            >
                              <span>Gửi phản hồi</span>
                              <FaPaperPlane className="text-base" />
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
