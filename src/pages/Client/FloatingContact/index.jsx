// Giống bản chuẩn đã dùng trước
import React, { useState, useRef, useEffect } from 'react';
import './FloatingContact.css';
import logo from '@/assets/Client/images/Logo/logo.svg';
import resetIcon from '@/assets/Client/images/Logo/reset-reload.svg';
import { chatService } from '@/services/client/chatService';

const quickSuggestions = [
  'Tôi muốn tìm quạt điều hoà cho phòng 30m²',
  'Có sản phẩm nào đang giảm giá không?',
  'Tủ lạnh nào phù hợp gia đình 4 người?',
  'Thương hiệu Sunhouse có gì nổi bật?',
  'Tôi có thể mua online không?',
  'Cho tôi biết cách liên hệ cửa hàng',
  'Web của bạn có uy tín không?',
  'Tôi muốn được tư vấn về máy lọc nước',
];

export default function FloatingContactBox() {
  const [open, setOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  const systemGreeting = {
    role: 'system',
    text: '👋 Xin chào! Em là trợ lý ảo của Home Power. Anh/Chị cần em hỗ trợ gì ạ?',
  };

  useEffect(() => {
    if (open && chatHistory.length === 0) {
      setChatHistory([systemGreeting]);
    }
  }, [open]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isLoading]);

  const resetChat = () => {
    setChatHistory([systemGreeting]);
    setMessage('');
    setShowSuggestions(true);
    inputRef.current?.focus();
  };

  const sendMessage = async (msg = message) => {
    const trimmed = msg.trim();
    if (!trimmed) return;
    if (showSuggestions) setShowSuggestions(false);
    setChatHistory((prev) => [...prev, { role: 'user', text: trimmed }]);
    setMessage('');
    setIsLoading(true);
    try {
      const res = await chatService.sendMessage({ message: trimmed });
      const reply =
        res?.data?.data?.reply ||
        '🤖 Xin lỗi, em chưa hiểu rõ câu hỏi. Anh/Chị vui lòng thử lại.';
      setChatHistory((prev) => [...prev, { role: 'ai', text: reply }]);
    } catch (err) {
      console.error('[ChatBox Error]', err);
      setChatHistory((prev) => [
        ...prev,
        {
          role: 'ai',
          text: '❌ Đã xảy ra lỗi khi kết nối với hệ thống. Vui lòng thử lại sau.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // 👇 Bắt đầu JSX hiển thị
  return (
    <>
      <div className="floating-contact">
        {/* 3 nút + trợ lý ảo */}
        <a href="https://m.me/tenfanpagecuaban" className="contact-item">
          <img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" alt="Messenger" />
          <div className="contact-text">
            <span>Chat Messenger</span>
            <small>(8h - 24h)</small>
          </div>
        </a>
        <a href="tel:19008922" className="contact-item">
          <img src="/icons/btn-call.svg" alt="Gọi mua hàng" />
          <div className="contact-text">
            <span>Gọi mua hàng</span>
            <small>1900 8922</small>
          </div>
        </a>
        <a href="tel:19008174" className="contact-item">
          <img src="/icons/icon-repair.svg" alt="Bảo hành" />
          <div className="contact-text">
            <span>Gọi bảo hành</span>
            <small>1900 8174</small>
          </div>
        </a>
        <button onClick={() => setOpen(true)} className="contact-item">
          <img src={logo} alt="Trợ lý ảo" />
          <div className="contact-text">
            <span>Trợ lý ảo</span>
            <small>Hỏi đáp 24/7</small>
          </div>
        </button>
      </div>

      {open && (
        <div className="chatbox-container">
          <div className="chatbox-header">
            <div className="header-content">
              <img src={logo} alt="bot" className="header-logo" />
              <span className="header-title">Home Power</span>
            </div>
            <div className="header-actions">
              <button onClick={resetChat} className="header-button" title="Reset">
                <img src={resetIcon} alt="reset" className="action-icon" />
              </button>
              <button onClick={() => setOpen(false)} className="header-button" title="Đóng">
                <svg viewBox="0 0 24 24" className="action-icon">
                  <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>

          <div className="chat-content">
            {chatHistory.map((msg, i) => (
              <div
                key={i}
                className={`chat-message ${msg.role === 'user' ? 'user-message' : 'ai-message'}`}
                dangerouslySetInnerHTML={{ __html: msg.text }}
              />
            ))}
            {isLoading && (
              <div className="chat-message ai-message">
                <span className="loading-text">Trợ lý đang trả lời...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="chat-input-area">
            {chatHistory.length > 1 && (
              <div className="suggestions-toggle">
                <button onClick={() => setShowSuggestions(!showSuggestions)}>
                  {showSuggestions ? 'Ẩn gợi ý nhanh ▲' : 'Hiện gợi ý nhanh ▼'}
                </button>
              </div>
            )}
            {showSuggestions && (
              <div className="quick-suggestions">
                {quickSuggestions.map((sug, idx) => (
                  <button key={idx} onClick={() => sendMessage(sug)} className="suggestion-button">
                    {sug}
                  </button>
                ))}
              </div>
            )}
            <div className="message-input-container">
              <input
                ref={inputRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !isLoading && sendMessage()}
                disabled={isLoading}
                placeholder="Nhập tin nhắn..."
                className="message-input"
              />
              <button
                onClick={() => sendMessage()}
                disabled={isLoading || !message.trim()}
                className="send-button"
              >
                <svg className="send-icon" viewBox="0 0 24 24">
                  <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" fill="currentColor" />
                </svg>
              </button>
            </div>
            <p className="disclaimer-text">Trợ lý AI hỗ trợ 24/7 - Nội dung mang tính tham khảo</p>
          </div>
        </div>
      )}
    </>
  );
}
