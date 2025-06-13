"use client"

import { useState, useEffect, useCallback } from "react"
import { productQuestionService } from "@/services/client/productQuestionService"
import { toast } from "react-toastify"
import { Link } from "react-router-dom"
import mascot from "@/assets/Client/images/Logo/snapedit_1749613755235.png"
import { MessageCircle, Send, ChevronDown, ChevronUp, Clock, CornerDownRight } from "lucide-react"

const formatTime = (time) => {
  const t = new Date(time)
  const diff = (Date.now() - t.getTime()) / 1000
  if (diff < 60) return "Vừa xong"
  if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`
  if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`
  if (diff < 604800) return `${Math.floor(diff / 86400)} ngày trước`
  return t.toLocaleDateString("vi-VN")
}
const Avatar = ({ name, isOfficial }) => (
  <div
    className={`w-9 h-9 flex-shrink-0 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-sm ${
      isOfficial ? "bg-gradient-to-br from-red-500 to-red-600" : "bg-gradient-to-br from-blue-500 to-blue-600"
    }`}
  >
    {name?.[0]?.toUpperCase() || "?"}
  </div>
)
const CommentBubble = ({ profile, content, isOfficial }) => (
  <div className="flex flex-col min-w-0 max-w-[calc(100%-48px)]">
    <div className={`rounded-lg p-2.5 text-sm max-w-full mb-0.5 ${isOfficial ? "bg-red-50" : "bg-gray-50"}`}>
      <span className={`font-medium ${isOfficial ? "text-red-600" : "text-gray-800"}`}>
        {isOfficial && <span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-1.5"></span>}
        {profile}
      </span>
      <p className="mt-1.5 text-gray-700 whitespace-pre-wrap break-words leading-relaxed">{content}</p>
    </div>
  </div>
)
const CommentActions = ({
  commentId,
  time,
  onReply,
  hasChildren,
  areChildrenExpanded,
  toggleChildrenExpansion,
  childrenCount,
  indent,
}) => (
  <>
    <div className="flex items-center space-x-3 text-xs text-gray-500 mt-1" style={{ marginLeft: `${indent}px` }}>
      <span className="flex items-center">
        <Clock className="w-3 h-3 mr-1" />
        {time}
      </span>
      <button onClick={onReply} className="hover:text-blue-600 hover:underline transition-colors flex items-center">
        <MessageCircle className="w-3 h-3 mr-1" />
        Trả lời
      </button>
    </div>

    {hasChildren && (
      <div className="flex items-center mt-1.5" style={{ marginLeft: `${indent}px` }}>
        <button
          onClick={() => toggleChildrenExpansion(commentId)}
          className="text-red-600 hover:text-red-700 text-sm flex items-center space-x-1.5 transition-colors"
        >
          {areChildrenExpanded ? (
            <>
              <ChevronUp className="w-4 h-4" />
              <span>Thu gọn phản hồi</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" />
              <span>Xem tất cả {childrenCount} phản hồi</span>
            </>
          )}
        </button>
      </div>
    )}
  </>
)
const ReplyInput = ({ input, setInput, onSend, onCancel }) => (
  <div className="mt-2 mb-3">
    <div className="relative">
      <textarea
        className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm pr-10"
        rows={1}
        placeholder="Nhập phản hồi..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button
        onClick={onSend}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-600 hover:text-blue-700"
        title="Gửi"
      >
        <Send className="w-5 h-5" />
      </button>
    </div>
    <div className="flex justify-end mt-1.5">
      <button onClick={onCancel} className="text-xs text-gray-500 hover:text-gray-700">
        Hủy
      </button>
    </div>
  </div>
)
const ReplyList = ({
  replies = [],
  questionId,
  level = 0,
  replyTo,
  setReplyTo,
  input,
  setInput,
  sendReply,
  expandedComments,
  toggleCommentExpansion,
}) => {
  if (!replies.length) return null

  return (
    <div className="mt-3">
      {replies.map((r, index) => {
        const hasNestedReplies = r.replies && r.replies.length > 0
        const areNestedRepliesExpanded = expandedComments.includes(r.id)

        return (
          <div key={r.id} className="mb-4 last:mb-0">
            <div className="flex items-start space-x-2 ml-4">
              <div className="flex items-center mt-2">
                <CornerDownRight className="w-4 h-4 text-gray-400" />
              </div>
              <div className="flex items-start space-x-3 flex-1">
                <Avatar name={r.user?.fullName} isOfficial={r.isOfficial} />
                <CommentBubble
                  profile={r.isOfficial ? "Quản trị viên" : r.user?.fullName || "Khách"}
                  content={r.content}
                  isOfficial={r.isOfficial}
                />
              </div>
            </div>

            <CommentActions
              commentId={r.id}
              time={formatTime(r.createdAt)}
              onReply={() => setReplyTo({ qId: questionId, parentId: r.id })}
              hasChildren={hasNestedReplies}
              areChildrenExpanded={areNestedRepliesExpanded}
              toggleChildrenExpansion={toggleCommentExpansion}
              childrenCount={r.replies?.length || 0}
              indent={56} 
            />

            {replyTo?.qId === questionId && replyTo.parentId === r.id && (
              <div className="ml-14 mt-2">
                <ReplyInput
                  input={input}
                  setInput={setInput}
                  onSend={() => sendReply(questionId, r.id)}
                  onCancel={() => setReplyTo(null)}
                />
              </div>
            )}

            {hasNestedReplies && areNestedRepliesExpanded && (
              <div className="ml-6">
                <ReplyList
                  replies={r.replies}
                  questionId={questionId}
                  level={level + 1}
                  replyTo={replyTo}
                  setReplyTo={setReplyTo}
                  input={input}
                  setInput={setInput}
                  sendReply={sendReply}
                  expandedComments={expandedComments}
                  toggleCommentExpansion={toggleCommentExpansion}
                />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
export default function ProductQA({
  questions: initialQuestions = [],
  showAll,
  setShowAll,
  productId,
  user,
  onQuestionsUpdate,
}) {
  const [questions, setQuestions] = useState(initialQuestions)
  const [replyTo, setReplyTo] = useState(null)
  const [input, setInput] = useState("")
  const [cooldown, setCooldown] = useState(0)
  const [expandedComments, setExpandedComments] = useState([])
  useEffect(() => {
    setQuestions(initialQuestions)
  }, [initialQuestions])

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown((c) => c - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [cooldown])
  const addNewQuestion = (newQuestion) => {
    setQuestions((prev) => [newQuestion, ...prev])
    if (onQuestionsUpdate) {
      onQuestionsUpdate([newQuestion, ...questions])
    }
  }
  const addReplyToQuestion = (questionId, newReply, parentId = null) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === questionId) {
          if (parentId === null) {
        
            return {
              ...q,
              answers: [...(q.answers || []), newReply],
            }
          } else {
           
            const updateNestedReplies = (replies) => {
              return replies.map((reply) => {
                if (reply.id === parentId) {
                  return {
                    ...reply,
                    replies: [...(reply.replies || []), newReply],
                  }
                } else if (reply.replies && reply.replies.length > 0) {
                  return {
                    ...reply,
                    replies: updateNestedReplies(reply.replies),
                  }
                }
                return reply
              })
            }

            return {
              ...q,
              answers: updateNestedReplies(q.answers || []),
            }
          }
        }
        return q
      }),
    )
    if (onQuestionsUpdate) {
      onQuestionsUpdate(questions)
    }
  }

  const sendQuestion = useCallback(async () => {
    if (!user) {
      toast.warning("Bạn cần đăng nhập để gửi câu hỏi.")
      return
    }
    if (!input.trim()) {
      toast.warning("Vui lòng nhập câu hỏi.")
      return
    }
    if (cooldown) {
      toast.info(`Vui lòng chờ ${cooldown}s.`)
      return
    }

    try {
      const res = await productQuestionService.create({ productId, content: input.trim() })
      toast.success(res.data.message || "Đã gửi câu hỏi!")
      const newQuestion = {
        id: res.data.question?.id || Date.now(), 
        content: input.trim(),
        user: user,
        createdAt: new Date().toISOString(),
        answers: [],
      }

      addNewQuestion(newQuestion)
      setInput("")
      setCooldown(30)


    } catch (error) {
      toast.error("Gửi thất bại.")
      console.error("Error sending question:", error)
    }
  }, [input, cooldown, productId, user, questions, onQuestionsUpdate])

  const sendReply = useCallback(
    async (qId, parentId) => {
      if (!user) {
        toast.warning("Bạn cần đăng nhập để phản hồi.")
        return
      }
      if (!input.trim()) {
        toast.warning("Vui lòng nhập nội dung.")
        return
      }

      try {
        const res = await productQuestionService.reply({ questionId: qId, content: input.trim(), parentId })
        toast.success(res.data.message || "Đã phản hồi!")

    
        const newReply = {
          id: res.data.reply?.id || Date.now(), 
          content: input.trim(),
          user: user,
          createdAt: new Date().toISOString(),
          isOfficial: false,
          replies: [],
        }

        addReplyToQuestion(qId, newReply, parentId)
        setInput("")
        setReplyTo(null)
        setCooldown(30)

        
        if (!expandedComments.includes(qId)) {
          setExpandedComments((prev) => [...prev, qId])
        }

        
      } catch (error) {
        toast.error("Phản hồi thất bại.")
        console.error("Error sending reply:", error)
      }
    },
    [input, user, expandedComments, onQuestionsUpdate],
  )

  const toggleCommentExpansion = useCallback((commentId) => {
    setExpandedComments((prev) =>
      prev.includes(commentId) ? prev.filter((id) => id !== commentId) : [...prev, commentId],
    )
  }, [])

  const sorted = [...questions].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  const visible = showAll ? sorted : sorted.slice(0, 2)

  return (
    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
      <h3 className="text-xl font-bold mb-5 text-gray-800 flex items-center">
        <MessageCircle className="w-5 h-5 mr-2 text-red-500" />
        Hỏi và đáp
      </h3>
      {user ? (
        <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-4 mb-8 p-5 bg-gradient-to-r from-blue-50 to-gray-50 rounded-xl border border-gray-200">
          <div className="flex-shrink-0">
            <img
              src={mascot || "/placeholder.svg"}
              alt="Mascot"
              className="w-28 h-28 object-contain mx-auto md:mx-0 drop-shadow-md"
            />
          </div>
          <div className="flex-1 w-full">
            <h4 className="text-lg font-semibold text-gray-800 mb-2 text-center md:text-left">
              Hãy đặt câu hỏi cho chúng tôi
            </h4>
            <p className="text-sm text-gray-600 mb-4 text-center md:text-left leading-relaxed">
              CellphoneS sẽ phản hồi trong vòng 1 giờ. Nếu Quý khách gửi câu hỏi sau 22h, chúng tôi sẽ trả lời vào sáng
              hôm sau. Thông tin có thể thay đổi theo thời gian, vui lòng đặt câu hỏi để nhận được cập nhật mới nhất!
            </p>
            <div className="relative">
              <textarea
                className="w-full border border-gray-300 rounded-lg py-3 px-4 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                rows={2}
                placeholder="Viết câu hỏi của bạn tại đây..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={cooldown > 0}
              />
              <div className="flex justify-end mt-3">
                <button
                  onClick={sendQuestion}
                  disabled={cooldown > 0}
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-2.5 rounded-lg disabled:opacity-50 text-base font-medium flex items-center justify-center space-x-2 transition-all duration-200 shadow-sm hover:shadow"
                >
                  <span>Gửi câu hỏi</span>
                  <Send className="h-4 w-4 ml-1" />
                </button>
              </div>
              {cooldown > 0 && (
                <div className="flex items-center justify-end mt-2 text-xs text-gray-500">
                  <Clock className="w-3 h-3 mr-1" />
                  <span>Vui lòng chờ {cooldown}s</span>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center p-6 bg-gray-50 border border-gray-200 rounded-xl mb-8">
          <p className="text-gray-600 mb-3">Vui lòng đăng nhập để gửi câu hỏi.</p>
          <Link
            to="/login"
            className="inline-block bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow"
          >
            Đăng nhập
          </Link>
        </div>
      )}

      <div className="space-y-4">
        {visible.length > 0 ? (
          visible.map((q) => {
            const hasAnswers = q.answers && q.answers.length > 0
            const areAnswersExpanded = expandedComments.includes(q.id)

            return (
              <div key={q.id} className="border-b border-gray-100 pb-3 last:border-0">
                <div className="flex items-start space-x-3">
                  <Avatar name={q.user?.fullName} isOfficial={false} />
                  <CommentBubble profile={q.user?.fullName || "Ẩn danh"} content={q.content} isOfficial={false} />
                </div>

                <CommentActions
                  commentId={q.id}
                  time={formatTime(q.createdAt)}
                  onReply={() => setReplyTo({ qId: q.id, parentId: null })}
                  hasChildren={hasAnswers}
                  areChildrenExpanded={areAnswersExpanded}
                  toggleChildrenExpansion={toggleCommentExpansion}
                  childrenCount={q.answers?.length || 0}
                  indent={48}
                />

                {replyTo?.qId === q.id && replyTo.parentId === null && (
                  <div className="ml-12">
                    <ReplyInput
                      input={input}
                      setInput={setInput}
                      onSend={() => sendReply(q.id, null)}
                      onCancel={() => setReplyTo(null)}
                    />
                  </div>
                )}

                {hasAnswers && areAnswersExpanded && (
                  <ReplyList
                    replies={q.answers}
                    questionId={q.id}
                    level={1}
                    replyTo={replyTo}
                    setReplyTo={setReplyTo}
                    input={input}
                    setInput={setInput}
                    sendReply={sendReply}
                    expandedComments={expandedComments}
                    toggleCommentExpansion={toggleCommentExpansion}
                  />
                )}
              </div>
            )
          })
        ) : (
          <div className="text-center py-8 text-gray-500">
            <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>Chưa có câu hỏi nào. Hãy là người đầu tiên đặt câu hỏi!</p>
          </div>
        )}
      </div>
      {questions.length > 2 && (
        <div className="text-center mt-6">
          <button
            onClick={() => setShowAll((s) => !s)}
            className="inline-flex items-center px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors duration-200"
          >
            {showAll ? (
              <>
                <ChevronUp className="w-4 h-4 mr-1.5" />
                Thu gọn
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4 mr-1.5" />
                Xem thêm {questions.length - visible.length} câu hỏi
              </>
            )}
          </button>
        </div>
      )}
    </div>
  )
}
