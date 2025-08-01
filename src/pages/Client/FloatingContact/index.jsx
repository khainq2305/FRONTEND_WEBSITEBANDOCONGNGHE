import React, { useState, useRef, useEffect } from 'react';
import './FloatingContact.css';
import resetIcon from '@/assets/Client/images/Logo/reset-reload.svg';
import { chatService } from '@/services/client/chatService';
import logo from '@/assets/Client/images/Logo/logo.svg';
import assistantDMXIcon from '@/assets/Client/images/Logo/assistant-dmx.png';

import ProductGridDisplay from './ProductGridDisplay/ProductGridDisplay';
import ProductTableDisplay from './ProductGridDisplay/ProductTableDisplay';

const quickSuggestions = [
  'Tôi muốn tìm quạt điều hoà cho phòng 30m²',
  'Có sản phẩm nào đang giảm giá không?',
  'Tủ lạnh nào phù hợp gia đình 4 người?',
  'Thương hiệu Sunhouse có gì nổi bật?',
  'Tôi có thể mua online không?',
  'Cho tôi biết cách liên hệ cửa hàng',
  'Web của bạn có uy tín không?',
  'Tôi muốn được tư vấn về máy lọc nước'
];

export default function FloatingContactBox() {
  const [open, setOpen] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(true);
  const [chatHistory, setChatHistory] = useState([]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  const initialTooltipMessage = 'Em rất sẵn lòng hỗ trợ Anh/Chị 😊';
  const secondaryTooltipMessage = 'Xin chào Anh/Chị! Em là trợ lý ảo của HomePower.';
  const [displayTooltipMessage, setDisplayTooltipMessage] = useState(initialTooltipMessage);
  const [messageKey, setMessageKey] = useState(0);

  const systemGreeting = {
    role: 'system',
    type: 'text',
    content: '👋 Xin chào Anh/Chị! Em là trợ lý ảo của Home Power.'
  };

  useEffect(() => {
    const changeTooltipContentTimer = setTimeout(() => {
      setDisplayTooltipMessage(secondaryTooltipMessage);
      setMessageKey((prevKey) => prevKey + 1);
    }, 2000);

    const savedChat = localStorage.getItem('hp_chat_history');
    if (savedChat) {
      setChatHistory(JSON.parse(savedChat));
    }

    return () => {
      clearTimeout(changeTooltipContentTimer);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('hp_chat_history', JSON.stringify(chatHistory));
  }, [chatHistory]);

  useEffect(() => {
    if (open && chatHistory.length === 0) {
      setChatHistory([systemGreeting]);
    }
    if (open) {
      inputRef.current?.focus();
    }
  }, [open, chatHistory.length]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isLoading]);

  const handleOpenChat = () => {
    setOpen(true);
    setTooltipVisible(false);
  };

  const handleCloseChat = () => {
    setOpen(false);
    setDisplayTooltipMessage(initialTooltipMessage);
    setMessageKey((prevKey) => prevKey + 1);
    setTooltipVisible(true);
  };

  const resetChat = () => {
    setChatHistory([systemGreeting]);
    setMessage('');
    setShowSuggestions(true);
    inputRef.current?.focus();
  };

  const sendMessage = async (msg = message) => {
    const trimmed = msg.trim();
    if (!trimmed) return;

    const isFromSuggestion = quickSuggestions.includes(msg);
    if (showSuggestions && !isFromSuggestion) {
      setShowSuggestions(false);
    }

    setChatHistory((prev) => [...prev, { role: 'user', type: 'text', content: trimmed }]);
    setMessage('');
    setIsLoading(true);
    try {
      const res = await chatService.sendMessage({ message: trimmed });
      const replyData = res?.data?.data;

      if (replyData) {
        if (replyData.replyMessage) {
          setChatHistory((prev) => [...prev, { role: 'ai', type: 'text', content: replyData.replyMessage }]);
        }
        if (replyData.type === 'product_grid' && replyData.content?.table) {
          setChatHistory((prev) => [
            ...prev,
            {
              role: 'ai',
              type: 'text',
              content: replyData.content.descriptionTop + '<br /><i>Nếu bạn cần thêm thông tin chi tiết về sản phẩm nào, hãy cho em biết nhé!</i>'
            },
            {
              role: 'ai',
              type: 'table_only',
              content: replyData.content.table
            },
            {
              role: 'ai',
              type: 'product_grid_only',
              content: {
                title: replyData.content.title,
                products: replyData.content.products,
                noteAfterGrid: replyData.content.noteAfterGrid
              }
            }
          ]);
        } else {
          setChatHistory((prev) => [...prev, { role: 'ai', type: replyData.type, content: replyData.content }]);
        }
      } else {
        setChatHistory((prev) => [...prev, { role: 'ai', type: 'text', content: '🤖 Xin lỗi, em chưa hiểu rõ câu hỏi. Anh/Chị vui lòng thử lại.' }]);
      }
    } catch (error) {
      console.error("Lỗi gửi tin nhắn:", error);
      setChatHistory((prev) => [...prev, { role: 'ai', type: 'text', content: '❌ Đã xảy ra lỗi. Vui lòng thử lại sau.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessageContent = (msg) => {
  switch (msg.type) {
    case 'text':
      return <div dangerouslySetInnerHTML={{ __html: msg.content || '' }} />;

    case 'table_only':
      if (!msg.content || !msg.content.headers || !msg.content.rows) return null;
      return (
        <div className="overflow-x-auto max-w-full">
          <ProductTableDisplay
            tableTitle={null}
            headers={msg.content.headers}
            rows={msg.content.rows}
          />
        </div>
      );

    case 'product_grid_only':
      if (!msg.content || !msg.content.products) return null;
      return (
        <>
          <ProductGridDisplay
            title={msg.content.title || 'Sản phẩm đề xuất'}
            products={msg.content.products || []}
          />
          {msg.content.noteAfterGrid && (
            <p className="text-[13px] mt-2 text-gray-600">{msg.content.noteAfterGrid}</p>
          )}
        </>
      );

    case 'product_grid':
      if (!msg.content || !msg.content.products) return null;
      return (
        <>
          {msg.content?.table && msg.content?.table.headers && msg.content?.table.rows && (
            <div className="overflow-x-auto max-w-full">
              <ProductTableDisplay
                tableTitle={msg.content.descriptionTop || ''}
                headers={msg.content.table.headers}
                rows={msg.content.table.rows}
              />
            </div>
          )}
          <ProductGridDisplay
            title={msg.content.title || 'Sản phẩm đề xuất'}
            products={msg.content.products || []}
          />
          {msg.content.noteAfterGrid && (
            <p className="text-[13px] mt-2 text-gray-600">{msg.content.noteAfterGrid}</p>
          )}
        </>
      );

    default:
      return <div dangerouslySetInnerHTML={{ __html: msg.content || '' }} />;
  }
};


  return (
    <>
      {!open && (
        <div className="floating-contact">
          <div className={`contact-tooltip ${!tooltipVisible ? 'hidden' : ''}`}>
            <div className="tooltip-header">
              <span className="tooltip-title">Home Power</span>
            </div>
            <div key={messageKey} className="tooltip-message-wrapper">
              <p className="tooltip-message-content">{displayTooltipMessage}</p>
            </div>
          </div>

          <button className="contact-item contact-item-dmx" onClick={handleOpenChat}>
            <img src={assistantDMXIcon} alt="Trợ lý AI" className="dmx-icon-image" />
          </button>
        </div>
      )}

      {open && (
        <div className="chatbox-container">
          <div className="chatbox-header">
            <div className="header-content w-40">
              <img src={logo} alt="Home Power" />
            </div>
            <div className="header-actions">
              <button onClick={resetChat} className="header-button" title="Đặt lại cuộc trò chuyện">
                <img src={resetIcon} alt="reset" className="action-icon" />
              </button>
              <button onClick={handleCloseChat} className="header-button" title="Đóng chat">
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
              >
                {renderMessageContent(msg)}
              </div>
            ))}
            {isLoading && (
              <div className="chat-message ai-message">
                <span className="loading-text">Trợ lý đang trả lời...</span>
                <div className="loading-dots">
                  <span>.</span>
                  <span>.</span>
                  <span>.</span>
                </div>
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
              <button onClick={() => sendMessage()} disabled={isLoading || !message.trim()} className="send-button">
                <svg className="send-icon" viewBox="0 0 24 24">
                  <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" fill="currentColor" />
                </svg>
              </button>
            </div>

            <p className="disclaimer-text">Trợ lý AI hỗ trợ 24/7 - Nội dung tham khảo</p>
          </div>
        </div>
      )}
    </>
  );
}
