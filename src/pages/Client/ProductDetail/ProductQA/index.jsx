"use client"

import { useState, useEffect, useCallback, useRef } from 'react';
import { productQuestionService } from '@/services/client/productQuestionService';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import mascot from '@/assets/Client/images/Logo/snapedit_1749613755235.png';
import { MessageCircle, Send, Clock, Shield, ChevronDown, ChevronRight, Lock } from 'lucide-react';

// Import PopupModal
import PopupModal from '@/layout/Client/Header/PopupModal';

const AVATAR_SIZE_LG = 48;
const SPACE_X_COMMENT = 8;
const INDENT_WIDTH_PX = AVATAR_SIZE_LG + SPACE_X_COMMENT;
const LINE_POS_X_PX = AVATAR_SIZE_LG / 2;

const formatTime = (time) => {
  const t = new Date(time);
  const now = new Date();
  const diff = (now.getTime() - t.getTime()) / 1000;

  if (diff < 60) return 'Vừa xong';
  if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} ngày trước`;
  if (diff < 2592000) return `${Math.floor(diff / 604800)} tuần trước`;
  if (diff < 31536000) return `${Math.floor(diff / 2592000)} tháng trước`;
  if (diff < 31536000 * 100) return `${Math.floor(diff / 31536000)} năm trước`;

  return t.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
};

const Avatar = ({ name, isOfficial, size = 'md', imageUrl }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-10 h-10'
  };

  return (
    <div className="relative flex-shrink-0">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={name || 'Avatar'}
          className={`${sizeClasses[size]} rounded-full object-cover`}
        />
      ) : (
        <div
          className={`${sizeClasses[size]} rounded-full flex items-center justify-center text-white font-semibold text-sm ${isOfficial ? 'bg-red-500' : 'bg-[#1E4D40]'
            }`}
        >
          {isOfficial ? 'QTV' : name?.[0]?.toUpperCase() || '?'}
        </div>
      )}
      {isOfficial && (
        <div className="absolute -bottom-0.5 -right-0.5 bg-white rounded-full p-0.5">
          <Shield className="w-3 h-3 text-red-500" />
        </div>
      )}
    </div>
  );
};

const ReplyInput = ({ input, setInput, onSend, onCancel, placeholder = 'Viết bình luận...', targetUser = null, isLoggedIn, setIsPopupModalOpen }) => {
  const handleInteraction = () => {
    if (!isLoggedIn) {
      setIsPopupModalOpen(true);
    }
  };

  return (
    <div className="flex mt-2">
      <div className="flex-1">
        <div className="bg-gray-100 rounded-full px-3 py-2 flex items-center">
          <input
            type="text"
            className="flex-1 bg-transparent text-base placeholder-gray-500 outline-none"
            placeholder={placeholder} // Giữ nguyên placeholder từ prop
            value={input}
            onChange={(e) => {
              if (!isLoggedIn) {
                // Nếu chưa đăng nhập, vẫn mở modal nhưng không cho thay đổi giá trị input
                setIsPopupModalOpen(true);
                return;
              }
              e.target.value.length <= 200 && setInput(e.target.value);
            }}
            onFocus={handleInteraction} // Mở modal khi focus vào input
            onClick={handleInteraction} // Mở modal khi click vào input (để xử lý trên mobile/touch devices)
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !isLoggedIn) {
                setIsPopupModalOpen(true);
                return;
              }
              e.key === 'Enter' && onSend();
            }}
          // Đã loại bỏ thuộc tính disabled ở đây để input luôn có thể nhấn được
          // Logic kiểm tra đăng nhập sẽ nằm trong handleInteraction và onSend
          />
          <button
            onClick={onSend}
            // Nút gửi sẽ chỉ bị disabled nếu input trống hoặc đang trong cooldown (logic sendQuestion/sendReply sẽ xử lý popup)
            disabled={!input.trim() || !isLoggedIn && input.trim() === ''} // Vẫn disabled nếu chưa đăng nhập và input trống
            className="ml-2 text-blue-500 hover:text-blue-600 disabled:text-gray-400"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        {input && isLoggedIn && (
          <button onClick={onCancel} className="text-sm text-gray-500 hover:text-gray-700 mt-1">
            Hủy
          </button>
        )}
      </div>
    </div>
  );
};

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
  toggleCollapseReplies,
  isLoggedIn,
  setIsPopupModalOpen
}) => {
  const actualReplies = reply.replies || [];
  const hasReplies = actualReplies.length > 0;
  const isCollapsed = collapsedReplies[reply.id] !== false;
  const totalRepliesCount = hasReplies ? countTotalReplies(actualReplies) : 0;

  return (
    <div className="relative">
      <div className="flex items-start space-x-2 relative z-10" style={{ paddingLeft: `${INDENT_WIDTH_PX}px` }}>
        <Avatar
          name={reply.user?.fullName}
          isOfficial={reply.isOfficial}
          size="lg"
          imageUrl={reply.user?.avatarUrl}
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-1">
            <div className="font-semibold text-lg text-gray-900">
              {reply.isOfficial ? 'Quản trị viên' : reply.user?.fullName || 'Ẩn danh'}
            </div>
            {reply.isOfficial && (
              <Shield className="w-4 h-4 ml-1 text-red-500" />
            )}
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-lg text-gray-500 font-normal">
              {formatTime(reply.createdAt)}
            </span>
          </div>

          <div className="text-base text-gray-800 break-words mt-1">
            {reply.content}
          </div>


          <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
            <button
              onClick={() => {
                if (!isLoggedIn) {
                  setIsPopupModalOpen(true);
                  return;
                }
                setReplyTo({ qId: questionId, parentId: reply.id });
              }}
              className="text-red-500 hover:text-red-700 font-medium flex items-center"
            >
              <MessageCircle className="w-3 h-3 mr-1" />
              Phản hồi
            </button>
            {hasReplies && (
              <button
                onClick={() => toggleCollapseReplies(reply.id)}
                className="flex items-center space-x-1 hover:underline text-blue-600"
              >
                {isCollapsed ? (
                  <>
                    <ChevronRight className="w-3 h-3" />
                    <span>{`Xem thêm ${totalRepliesCount} phản hồi`}</span>
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-3 h-3" />
                    <span>Thu gọn phản hồi</span>
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
              placeholder={`Trả lời ${reply.isOfficial ? 'Quản trị viên' : reply.user?.fullName}...`}
              isLoggedIn={isLoggedIn}
              setIsPopupModalOpen={setIsPopupModalOpen}
            />
          )}
        </div>
      </div>

      {hasReplies && !isCollapsed && (
        <div className="relative pt-3">
          <div className="space-y-3 relative z-10">
            {actualReplies.map((reply, index) => (
              <Comment
                key={reply.id}
                reply={reply}
                questionId={questionId}
                level={1}
                replyTo={replyTo}
                setReplyTo={setReplyTo}
                replyInput={replyInput}
                setReplyInput={setReplyInput}
                sendReply={sendReply}
                isLast={index === actualReplies.length - 1}
                collapsedReplies={collapsedReplies}
                toggleCollapseReplies={toggleCollapseReplies}
                isLoggedIn={isLoggedIn}
                setIsPopupModalOpen={setIsPopupModalOpen}
              />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default function ProductQA({ questions: initialQuestions = [], showAll, setShowAll, productId, user: userFromProps, onQuestionsUpdate }) {
  const [questions, setQuestions] = useState(initialQuestions);
  const [replyTo, setReplyTo] = useState(null);
  const [input, setInput] = useState('');
  const [replyInput, setReplyInput] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const [collapsedReplies, setCollapsedReplies] = useState({});
  const [collapsedQuestions, setCollapsedQuestions] = useState({});

  const [isPopupModalOpen, setIsPopupModalOpen] = useState(false);

  const getUserFromLocalStorage = () => {
    const userString = localStorage.getItem('user');
    try {
      return userString ? JSON.parse(userString) : null;
    } catch (e) {
      console.error("Failed to parse user from localStorage", e);
      return null;
    }
  };

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUserData, setCurrentUserData] = useState(null);

  const latestUserRef = useRef(getUserFromLocalStorage());

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = getUserFromLocalStorage();
    setIsLoggedIn(!!token && !!user);
    setCurrentUserData(user);
    latestUserRef.current = user;

    const handleStorageChange = () => {
      const updatedToken = localStorage.getItem('token');
      const updatedUser = getUserFromLocalStorage();
      setIsLoggedIn(!!updatedToken && !!updatedUser);
      setCurrentUserData(updatedUser);
      latestUserRef.current = updatedUser;
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);


  useEffect(() => {
    const autoCollapse = {};
    const autoCollapseReplies = {};

    const collapseRepliesRecursively = (replies) => {
      if (replies && replies.length > 0) {
        replies.forEach((reply) => {
          if (reply.replies && reply.replies.length > 0) {
            autoCollapseReplies[reply.id] = true;
            collapseRepliesRecursively(reply.replies);
          }
        });
      }
    };

    questions.forEach((question) => {
      const actualAnswers = question.answers || [];
      if (actualAnswers.length > 0) {
        autoCollapse[question.id] = true;
        collapseRepliesRecursively(actualAnswers);
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
    onQuestionsUpdate?.([newQuestion, ...prev]);
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
      onQuestionsUpdate?.(updatedQuestions);
      return updatedQuestions;
    });
  };

  const sendQuestion = useCallback(async () => {
    const token = localStorage.getItem('token');
    const user = latestUserRef.current;

    if (!token || !user) {
      setIsPopupModalOpen(true);
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
    if (input.trim().length > 200) {
      toast.warning('Câu hỏi không được vượt quá 200 ký tự.');
      return;
    }

    try {
      const res = await productQuestionService.create({ productId, content: input.trim() });
      toast.success(res.data.message || 'Đã gửi câu hỏi!');

      const newQuestion = {
        id: res.data.data?.id,
        content: input.trim(),
        user: {
          id: user.id,
          fullName: user.fullName,
          avatarUrl: user.avatarUrl || null
        },
        createdAt: new Date().toISOString(),
        answers: []
      };

      addNewQuestion(newQuestion);
      setInput('');
      setCooldown(30);
    } catch (error) {
      const message = error?.response?.data?.message || 'Gửi thất bại.';
      toast.error(message);
      console.error('Lỗi gửi câu hỏi:', error);
      const match = message.match(/sau (\d+) giây/);
      if (match) {
        const seconds = parseInt(match[1]);
        setCooldown(seconds);
      }
    }
  }, [input, cooldown, productId, addNewQuestion]);


  const sendReply = useCallback(
    async (qId, parentId) => {
      const token = localStorage.getItem('token');
      const user = latestUserRef.current;

      if (!token || !user) {
        setIsPopupModalOpen(true);
        return;
      }

      if (!replyInput.trim()) {
        toast.warning('Vui lòng nhập nội dung.');
        return;
      }
      if (replyInput.trim().length > 200) {
        toast.warning('Nội dung phản hồi không được vượt quá 200 ký tự.');
        return;
      }

      try {
        const res = await productQuestionService.reply({ questionId: qId, content: replyInput.trim(), parentId });
        toast.success(res.data.message || 'Đã phản hồi!');

        const newReply = {
          id: res.data.data?.id,
          content: replyInput.trim(),
          user: {
            id: user.id,
            fullName: user.fullName,
            avatarUrl: user.avatarUrl || null
          },
          createdAt: new Date().toISOString(),
          isOfficial: false,
          replies: []
        };

        addReplyToQuestion(qId, newReply, parentId);
        setReplyInput('');
        setReplyTo(null);
      } catch (error) {
        const message = error?.response?.data?.message || 'Phản hồi thất bại.';
        toast.error(message);
        console.error('Lỗi gửi phản hồi:', error);
        const match = message.match(/sau (\d+) giây/);
        if (match) {
          const seconds = parseInt(match[1]);
          setCooldown(seconds);
        }
      }
    },
    [replyInput, addReplyToQuestion]
  );


  const sorted = [...questions].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const visible = showAll ? sorted : sorted.slice(0, 3);


  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 flex items-center">
          <MessageCircle className="w-5 h-5 mr-2 text-blue-600" />
          Hỏi và đáp
          {questions.length > 0 && (
            <span className="ml-2 bg-gray-100 text-base px-2 py-0.5 rounded-full">{questions.length}</span>
          )}
        </h3>
      </div>

      <div className="px-8 pb-6 pt-4">
        {/* Luôn hiển thị form gửi câu hỏi */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <img src={mascot || '/placeholder.svg'} alt="Mascot" className="w-16 h-16 object-contain" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-lg text-gray-800 mb-2">Đặt câu hỏi cho chúng tôi</h4>
              <p className="text-base text-gray-600 mb-3">
                CellphoneS sẽ phản hồi trong vòng 1 giờ. Thông tin có thể thay đổi theo thời gian.
              </p>
              <div className="flex space-x-2">
                <div className="flex-1">
                  <div className="bg-white rounded-full border border-gray-300 px-3 py-2 flex items-center">
                    <input
                      type="text"
                      className="flex-1 text-base placeholder-gray-500 outline-none"
                      placeholder="Viết câu hỏi của bạn (tối đa 200 ký tự)..."
                      value={input}
                      onChange={(e) => {
                        // Nếu chưa đăng nhập, mở modal và ngăn không cho nhập
                        if (!isLoggedIn) {
                          setIsPopupModalOpen(true);
                          return;
                        }
                        e.target.value.length <= 200 && setInput(e.target.value);
                      }}
                      onFocus={() => {
                        // Nếu chưa đăng nhập, mở modal khi focus
                        if (!isLoggedIn) setIsPopupModalOpen(true);
                      }}
                      onClick={() => {
                        // Nếu chưa đăng nhập, mở modal khi click (cho thiết bị cảm ứng)
                        if (!isLoggedIn) setIsPopupModalOpen(true);
                      }}
                      onKeyPress={(e) => {
                        // Nếu chưa đăng nhập và nhấn Enter, mở modal và ngăn gửi
                        if (!isLoggedIn && e.key === 'Enter') {
                          setIsPopupModalOpen(true);
                          return;
                        }
                        e.key === 'Enter' && sendQuestion();
                      }}
                      // Loại bỏ disabled khi chưa đăng nhập. Logic PopupModal sẽ xử lý tương tác.
                      // Giữ disabled nếu đang cooldown.
                      disabled={cooldown > 0}
                    />
                    <button
                      onClick={sendQuestion} // Gọi sendQuestion để xử lý logic đăng nhập/gửi
                      disabled={!input.trim() || cooldown > 0} // Disabled nếu input trống hoặc đang cooldown
                      className="ml-2 text-blue-500 hover:text-blue-600 disabled:text-gray-400"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                  {input && ( // Chỉ hiển thị số ký tự khi có input
                    <div className="text-right text-sm text-gray-500 mt-1">
                      {input.length}/200
                    </div>
                  )}
                  {cooldown > 0 && ( // Hiển thị cooldown khi đang cooldown
                    <div className="flex items-center mt-1 text-sm text-gray-500">
                      <Clock className="w-3 h-3 mr-1" />
                      <span>Vui lòng chờ {cooldown}s</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {visible.length > 0 ? (
            visible.map((q, index) => {
              const actualQAnswers = q.answers || [];
              const hasAnswers = actualQAnswers.length > 0;
              const isQuestionCollapsed = collapsedQuestions[q.id] !== false;
              const totalAnswersCount = hasAnswers ? countTotalReplies(actualQAnswers) : 0;
              const isLastQuestion = index === visible.length - 1;

              return (
                <div key={q.id}>
                  <div className={`mb-6 ${!isLastQuestion ? 'pb-4 border-b border-gray-200' : ''}`}>
                    <div className="flex space-x-2 items-start">
                      <Avatar
                        name={q.user?.fullName}
                        isOfficial={false}
                        size="lg"
                        imageUrl={q.user?.avatarUrl}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-1">
                          <div className="font-semibold text-lg text-gray-900">
                            {q.user?.fullName || 'Ẩn danh'}
                          </div>
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span className="text-lg text-gray-500 font-normal">
                            {formatTime(q.createdAt)}
                          </span>
                        </div>
                        <div className="text-base text-gray-800 break-words mt-1">
                          {q.content}
                        </div>

                        <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                          <button
                            onClick={() => {
                              if (!isLoggedIn) {
                                setIsPopupModalOpen(true);
                                return;
                              }
                              setReplyTo({ qId: q.id, parentId: null });
                            }}
                            className="text-red-500 hover:text-red-700 font-medium flex items-center"
                          >
                            <MessageCircle className="w-3 h-3 mr-1" />
                            Phản hồi
                          </button>
                          {hasAnswers && (
                            <button
                              onClick={() => toggleCollapseQuestion(q.id)}
                              className="flex items-center space-x-1 hover:underline text-blue-600"
                            >
                              {isQuestionCollapsed ? (
                                <>
                                  <ChevronRight className="w-3 h-3" />
                                  <span>{`Xem thêm ${totalAnswersCount} phản hồi`}</span>
                                </>
                              ) : (
                                <>
                                  <ChevronDown className="w-3 h-3" />
                                  <span>Thu gọn phản hồi</span>
                                </>
                              )}
                            </button>
                          )}
                        </div>

                        {replyTo?.qId === q.id && replyTo.parentId === null && (
                          <ReplyInput
                            input={replyInput}
                            setInput={setReplyInput}
                            onSend={() => sendReply(q.id, null)}
                            onCancel={() => {
                              setReplyTo(null);
                              setReplyInput('');
                            }}
                            placeholder={`Trả lời ${q.user?.fullName}...`}
                            isLoggedIn={isLoggedIn}
                            setIsPopupModalOpen={setIsPopupModalOpen}
                          />
                        )}
                      </div>
                    </div>

                    {hasAnswers && !isQuestionCollapsed && (
                      <div className="pt-3">
                        <div className="space-y-3 pt-3 relative z-10">
                          {actualQAnswers.map((reply, nestedIndex) => (
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
                              isLast={nestedIndex === actualQAnswers.length - 1}
                              collapsedReplies={collapsedReplies}
                              toggleCollapseReplies={toggleCollapseReplies}
                              isLoggedIn={isLoggedIn}
                              setIsPopupModalOpen={setIsPopupModalOpen}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-gray-500">
              <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-base">Chưa có câu hỏi nào. Hãy là người đầu tiên đặt câu hỏi!</p>
            </div>
          )}
        </div>

        {questions.length > 3 && (
          <div className="text-center mt-6 pt-4 border-t border-gray-200">
            <button onClick={() => setShowAll((s) => !s)} className="text-base text-blue-600 hover:text-blue-700 font-medium">
              {showAll ? 'Thu gọn' : `Xem thêm ${questions.length - visible.length} câu hỏi`}
            </button>
          </div>
        )}
      </div>

      <PopupModal
        isOpen={isPopupModalOpen}
        onClose={() => setIsPopupModalOpen(false)}
      />
    </div>
  );
}