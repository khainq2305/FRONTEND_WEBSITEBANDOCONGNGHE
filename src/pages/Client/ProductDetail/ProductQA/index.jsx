import { useState, useEffect, useCallback } from 'react';
import { productQuestionService } from '@/services/client/productQuestionService';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import mascot from '@/assets/Client/images/Logo/snapedit_1749613755235.png';
import { MessageCircle, Send, Clock, Shield, ChevronDown, ChevronRight } from 'lucide-react';
import socket from "@/constants/socket";
// Format time relatively
const formatTime = (time) => {
  const t = new Date(time);
  const now = new Date();
  const diff = (now.getTime() - t.getTime()) / 1000;

  if (diff < 60) return 'Vừa xong';
  if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} ngày trước`;

  return t.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
};


// Facebook-style Avatar component
const Avatar = ({ name, isOfficial, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  return (
    <div className="relative flex-shrink-0">
      <div
        className={`${sizeClasses[size]} rounded-full flex items-center justify-center text-white font-semibold text-sm ${isOfficial ? 'bg-red-500' : 'bg-blue-500'
          }`}
      >
        {name?.[0]?.toUpperCase() || '?'}
      </div>
      {isOfficial && (
        <div className="absolute -bottom-0.5 -right-0.5 bg-white rounded-full p-0.5">
          <Shield className="w-3 h-3 text-red-500" />
        </div>
      )}
    </div>
  );
};

// Reply Input component
const ReplyInput = ({ input, setInput, onSend, onCancel, placeholder = 'Viết bình luận...', targetUser = null }) => (
  <div className="flex mt-2">
    <div className="flex-1">
      <div className="bg-gray-100 rounded-full px-3 py-2 flex items-center">
        <input
          type="text"
          className="flex-1 bg-transparent text-sm placeholder-gray-500 outline-none"
          placeholder={targetUser ? `Trả lời ${targetUser}...` : placeholder}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && onSend()}
        />
        <button onClick={onSend} disabled={!input.trim()} className="ml-2 text-blue-500 hover:text-blue-600 disabled:text-gray-400">
          <Send className="w-4 h-4" />
        </button>
      </div>
      {input && (
        <button onClick={onCancel} className="text-xs text-gray-500 hover:text-gray-700 mt-1">
          Hủy
        </button>
      )}
    </div>
  </div>
);

// Function to count total replies recursively
const countTotalReplies = (replies) => {
  if (!replies || replies.length === 0) return 0;

  let count = replies.length;
  replies.forEach((reply) => {
    if (reply.replies && reply.replies.length > 0) {
      count += countTotalReplies(reply.replies);
    }
  });
  return count;
};

// Recursive Comment component
const Comment = ({
  reply,
  questionId,
  level = 0,
  replyTo,
  setReplyTo,
  replyInput,
  setReplyInput,
  sendReply,
  isLast = false,
  collapsedReplies,
  toggleCollapseReplies
}) => {
  const hasReplies = reply.replies && reply.replies.length > 0;
  const isCollapsed = collapsedReplies[reply.id] !== false;
  const totalRepliesCount = hasReplies ? countTotalReplies(reply.replies) : 0;

  return (
    <div className="relative">
      {level > 0 && (
        <>
          <div className="absolute left-5 top-5 w-6 h-px bg-gray-300"></div>
          {isLast && <div className="absolute left-5 top-5 bottom-0 w-px bg-white"></div>}
        </>
      )}

      <div className={level > 0 ? 'ml-11' : ''}>
        <div className="flex space-x-2">
          <Avatar name={reply.user?.fullName} isOfficial={reply.isOfficial} />
          <div className="flex-1 min-w-0">
            <div className="bg-gray-100 rounded-2xl px-3 py-2 inline-block max-w-full">
              <div className="font-semibold text-sm text-gray-900">
                {reply.isOfficial ? 'Quản trị viên' : reply.user?.fullName || 'Ẩn danh'}
                {reply.isOfficial && <Shield className="inline w-3 h-3 ml-1 text-red-500" />}
              </div>
              <div className="text-sm text-gray-800 mt-0.5 break-words">{reply.content}</div>
            </div>

            <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
              <span>{formatTime(reply.createdAt)}</span>
              <button onClick={() => setReplyTo({ qId: questionId, parentId: reply.id })} className="hover:underline">
                Trả lời
              </button>
              {hasReplies && (
                <button
                  onClick={() => toggleCollapseReplies(reply.id)}
                  className="flex items-center space-x-1 hover:underline text-blue-600"
                >
                  {isCollapsed ? (
                    <>
                      <ChevronRight className="w-3 h-3" />
                      <span>{totalRepliesCount} phản hồi</span>
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-3 h-3" />
                      <span>Thu gọn</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {replyTo?.qId === questionId && replyTo.parentId === reply.id && (
              <ReplyInput
                input={replyInput}
                setInput={setReplyInput}
                onSend={() => sendReply(questionId, reply.id)}
                onCancel={() => {
                  setReplyTo(null);
                  setReplyInput('');
                }}
                targetUser={reply.isOfficial ? 'Quản trị viên' : reply.user?.fullName}
              />
            )}
          </div>
        </div>

        {hasReplies && !isCollapsed && (
          <div className="relative mt-3">
            <div className="absolute left-5 top-0 bottom-0 w-px bg-gray-300"></div>
            <div className="space-y-3">
              {reply.replies.map((nestedReply, index) => (
                <Comment
                  key={nestedReply.id}
                  reply={nestedReply}
                  questionId={questionId}
                  level={level + 1}
                  replyTo={replyTo}
                  setReplyTo={setReplyTo}
                  replyInput={replyInput}
                  setReplyInput={setReplyInput}
                  sendReply={sendReply}
                  isLast={index === reply.replies.length - 1}
                  collapsedReplies={collapsedReplies}
                  toggleCollapseReplies={toggleCollapseReplies}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Main ProductQA Component
export default function ProductQA({ questions: initialQuestions = [], showAll, setShowAll, productId, user: userFromProps, onQuestionsUpdate }) {
  const [questions, setQuestions] = useState(initialQuestions);
  const [replyTo, setReplyTo] = useState(null);
  const [input, setInput] = useState('');
  const [replyInput, setReplyInput] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const [collapsedReplies, setCollapsedReplies] = useState({});
  const [collapsedQuestions, setCollapsedQuestions] = useState({});

  // ✅ Lấy user từ localStorage nếu chưa có
  const localUser = localStorage.getItem('user');
  const parsedUser = localUser ? JSON.parse(localUser) : null;
  const currentUser = userFromProps || parsedUser;
  useEffect(() => {
    socket.on("new-question", (question) => {
      if (question.productId === productId) {
        addNewQuestion(question);
      }
    });

    socket.on("new-answer", (answer) => {
      const qId = answer.questionId;
      addReplyToQuestion(qId, {
        ...answer,
        replies: [],
      }, answer.parentId);
    });

    return () => {
      socket.off("new-question");
      socket.off("new-answer");
    };
  }, [productId]);

  useEffect(() => {
    const autoCollapse = {};
    const autoCollapseReplies = {};

    const collapseRepliesRecursively = (replies) => {
      replies.forEach((reply) => {
        if (reply.replies && reply.replies.length > 0) {
          autoCollapseReplies[reply.id] = true;
          collapseRepliesRecursively(reply.replies);
        }
      });
    };

    questions.forEach((question) => {
      if (question.answers && question.answers.length > 0) {
        autoCollapse[question.id] = true;
        collapseRepliesRecursively(question.answers);
      }
    });

    setCollapsedQuestions(autoCollapse);
    setCollapsedReplies(autoCollapseReplies);
  }, [questions]);

  useEffect(() => {
    setQuestions(initialQuestions);
  }, [initialQuestions]);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const toggleCollapseReplies = (replyId) => {
    setCollapsedReplies((prev) => ({
      ...prev,
      [replyId]: !prev[replyId]
    }));
  };

  const toggleCollapseQuestion = (questionId) => {
    setCollapsedQuestions((prev) => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  const addNewQuestion = (newQuestion) => {
    setQuestions((prev) => [newQuestion, ...prev]);
    onQuestionsUpdate?.([newQuestion, ...prev]); // Pass prev directly to ensure correct state for parent
  };

  const addReplyToQuestion = (questionId, newReply, parentId = null) => {
    const addReplyRecursively = (replies, targetParentId) => {
      return replies.map((reply) => {
        if (reply.id === targetParentId) {
          return {
            ...reply,
            replies: [...(reply.replies || []), newReply]
          };
        } else if (reply.replies && reply.replies.length > 0) {
          return {
            ...reply,
            replies: addReplyRecursively(reply.replies, targetParentId)
          };
        }
        return reply;
      });
    };

    setQuestions((prev) => {
      const updatedQuestions = prev.map((q) => {
        if (q.id === questionId) {
          if (parentId === null) {
            return {
              ...q,
              answers: [...(q.answers || []), newReply]
            };
          } else {
            return {
              ...q,
              answers: addReplyRecursively(q.answers || [], parentId)
            };
          }
        }
        return q;
      });
      onQuestionsUpdate?.(updatedQuestions); // Call update with the actual updated state
      return updatedQuestions;
    });
  };

  const sendQuestion = useCallback(async () => {
    if (!currentUser) {
      toast.warning('Bạn cần đăng nhập để gửi câu hỏi.');
      return;
    }
    if (!input.trim()) {
      toast.warning('Vui lòng nhập câu hỏi.');
      return;
    }
    if (cooldown) {
      toast.info(`Vui lòng chờ ${cooldown}s.`);
      return;
    }

    try {
      // Backend trả về { data: createdQuestion }
      const res = await productQuestionService.create({ productId, content: input.trim() });
      toast.success(res.data.message || 'Đã gửi câu hỏi!');

      const newQuestion = {
        id: res.data.data?.id, // ✅ Sửa: Lấy ID từ res.data.data.id
        content: input.trim(),
        user: currentUser,
        createdAt: new Date().toISOString(), // Use current date for immediate display
        answers: []
      };

      addNewQuestion(newQuestion);
      setInput('');
      setCooldown(5);
    } catch (error) {
      const message = error?.response?.data?.message || 'Gửi thất bại.';
      toast.error(message);
      console.error('Error sending question:', error);

      // 🔁 Trích xuất số giây còn lại từ message và đặt cooldown
      const match = message.match(/sau (\d+) giây/);
      if (match) {
        const seconds = parseInt(match[1]);
        setCooldown(seconds);
      }
    }
  }, [input, cooldown, productId, currentUser, addNewQuestion]);


  const sendReply = useCallback(
    async (qId, parentId) => {
      if (!currentUser) {
        toast.warning('Bạn cần đăng nhập để phản hồi.');
        return;
      }
      if (!replyInput.trim()) {
        toast.warning('Vui lòng nhập nội dung.');
        return;
      }

      try {
        // Backend trả về { data: createdReply }
        const res = await productQuestionService.reply({ questionId: qId, content: replyInput.trim(), parentId });
        toast.success(res.data.message || 'Đã phản hồi!');

        const newReply = {
          id: res.data.data?.id, // ✅ Sửa: Lấy ID từ res.data.data.id
          content: replyInput.trim(),
          user: currentUser,
          createdAt: new Date().toISOString(), // Use current date for immediate display
          isOfficial: false,
          replies: []
        };

        addReplyToQuestion(qId, newReply, parentId);
        setReplyInput('');
        setReplyTo(null);
        // Cooldown cho mỗi lần gửi trả lời, có thể không cần thiết nếu muốn người dùng trả lời liên tục
        // setCooldown(30); 
      } catch (error) {
        const message = error?.response?.data?.message || 'Phản hồi thất bại.';
        toast.error(message);
        console.error('Error sending reply:', error);

        // 🔁 Trích xuất số giây còn lại từ message và đặt cooldown
        const match = message.match(/sau (\d+) giây/);
        if (match) {
          const seconds = parseInt(match[1]);
          setCooldown(seconds);
        }
      }
    },
    [replyInput, currentUser, addReplyToQuestion]
  );


  const sorted = [...questions].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const visible = showAll ? sorted : sorted.slice(0, 3);


  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <MessageCircle className="w-5 h-5 mr-2 text-blue-600" />
          Hỏi và đáp
          {questions.length > 0 && (
            <span className="ml-2 bg-gray-100 text-gray-600 text-sm px-2 py-0.5 rounded-full">{questions.length}</span>
          )}
        </h3>
      </div>

      <div className="p-4">
        {/* Question Input Section */}
        {currentUser ? (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <img src={mascot || '/placeholder.svg'} alt="Mascot" className="w-16 h-16 object-contain" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-800 mb-2">Đặt câu hỏi cho chúng tôi</h4>
                <p className="text-sm text-gray-600 mb-3">
                  CellphoneS sẽ phản hồi trong vòng 1 giờ. Thông tin có thể thay đổi theo thời gian.
                </p>
                <div className="flex space-x-2">
                  <div className="flex-1">
                    <div className="bg-white rounded-full border border-gray-300 px-3 py-2 flex items-center">
                      <input
                        type="text"
                        className="flex-1 text-sm placeholder-gray-500 outline-none"
                        placeholder="Viết câu hỏi của bạn..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        disabled={cooldown > 0}
                        onKeyPress={(e) => e.key === 'Enter' && sendQuestion()}
                      />
                      <button
                        onClick={sendQuestion}
                        disabled={cooldown > 0 || !input.trim()}
                        className="ml-2 text-blue-500 hover:text-blue-600 disabled:text-gray-400"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                    {cooldown > 0 && (
                      <div className="flex items-center mt-1 text-xs text-gray-500">
                        <Clock className="w-3 h-3 mr-1" />
                        <span>Vui lòng chờ {cooldown}s</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center p-6 bg-gray-50 rounded-lg mb-6">
            <p className="text-gray-600 mb-3">Vui lòng đăng nhập để gửi câu hỏi.</p>
            <Link
              to="/dang-nhap"
              className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Đăng nhập
            </Link>
          </div>
        )}

        {/* Comments Section */}
        <div className="space-y-4">
          {visible.length > 0 ? (
            visible.map((q) => {
              const hasAnswers = q.answers && q.answers.length > 0;
              const isQuestionCollapsed = collapsedQuestions[q.id] !== false;
              const totalAnswersCount = hasAnswers ? countTotalReplies(q.answers) : 0;

              return (
                <div key={q.id} className="relative">
                  {/* Main Question */}
                  <div className="flex space-x-2">
                    <Avatar name={q.user?.fullName} isOfficial={false} />
                    <div className="flex-1 min-w-0">
                      <div className="bg-gray-100 rounded-2xl px-3 py-2 inline-block max-w-full">
                        <div className="font-semibold text-sm text-gray-900">{q.user?.fullName || 'Ẩn danh'}</div>
                        <div className="text-sm text-gray-800 mt-0.5 break-words">{q.content}</div>
                      </div>

                      <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                        <span>{formatTime(q.createdAt)}</span>
                        <button onClick={() => setReplyTo({ qId: q.id, parentId: null })} className="hover:underline">
                          Trả lời
                        </button>
                        {hasAnswers && (
                          <button
                            onClick={() => toggleCollapseQuestion(q.id)}
                            className="flex items-center space-x-1 hover:underline text-blue-600"
                          >
                            {isQuestionCollapsed ? (
                              <>
                                <ChevronRight className="w-3 h-3" />
                                <span>{totalAnswersCount} phản hồi</span>
                              </>
                            ) : (
                              <>
                                <ChevronDown className="w-3 h-3" />
                                <span>Thu gọn</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>

                      {/* Reply Input for main question */}
                      {replyTo?.qId === q.id && replyTo.parentId === null && (
                        <ReplyInput
                          input={replyInput}
                          setInput={setReplyInput}
                          onSend={() => sendReply(q.id, null)}
                          onCancel={() => {
                            setReplyTo(null);
                            setReplyInput('');
                          }}
                          targetUser={q.user?.fullName}
                        />
                      )}
                    </div>
                  </div>

                  {/* All Replies - Recursive rendering */}
                  {hasAnswers && !isQuestionCollapsed && (
                    <div className="relative mt-3">
                      {/* Vertical line from main comment avatar */}
                      <div className="absolute left-5 top-0 bottom-0 w-px bg-gray-300"></div>

                      <div className="space-y-3">
                        {q.answers.map((reply, index) => (
                          <Comment
                            key={reply.id}
                            reply={reply}
                            questionId={q.id}
                            level={1}
                            replyTo={replyTo}
                            setReplyTo={setReplyTo}
                            replyInput={replyInput}
                            setReplyInput={setReplyInput}
                            sendReply={sendReply}
                            isLast={index === q.answers.length - 1}
                            collapsedReplies={collapsedReplies}
                            toggleCollapseReplies={toggleCollapseReplies}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-gray-500">
              <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>Chưa có câu hỏi nào. Hãy là người đầu tiên đặt câu hỏi!</p>
            </div>
          )}
        </div>

        {/* Show More Button */}
        {questions.length > 3 && (
          <div className="text-center mt-6 pt-4 border-t border-gray-200">
            <button onClick={() => setShowAll((s) => !s)} className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              {showAll ? 'Thu gọn' : `Xem thêm ${questions.length - visible.length} câu hỏi`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}