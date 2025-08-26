import React, { useState, useRef, useEffect, useCallback } from 'react';
import DOMPurify from 'dompurify';
import './FloatingContact.css';
import resetIcon from '@/assets/Client/images/Logo/reset-reload.svg';
import { chatService } from '@/services/client/chatService';
import logo from '@/assets/Client/images/Logo/logo2.png';
import assistantDMXIcon from '@/assets/Client/images/Logo/assistant-dmx.png';

import ProductGridDisplay from './ProductGridDisplay/ProductGridDisplay';
import ProductTableDisplay from './ProductGridDisplay/ProductTableDisplay';

const quickSuggestions = [
  'Danh mục',
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
  const secondaryTooltipMessage = 'Xin chào Anh/Chị! Em là trợ lý ảo của CYBERZONE.';
  const [displayTooltipMessage, setDisplayTooltipMessage] = useState(initialTooltipMessage);
  const [messageKey, setMessageKey] = useState(0);

  const getProductSlugFromUrl = () => {
    try {
      const path = window.location.pathname || '';
      const m = path.match(/^\/product\/([^/?#]+)/i);
      return m ? decodeURIComponent(m[1]) : null;
    } catch {
      return null;
    }
  };

  const systemGreeting = {
    role: 'system',
    type: 'text',
    content: 'Xin chào Anh/Chị! Em là trợ lý ảo của CYBERZONE.'
  };

  /* ============ Effects ============ */
  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayTooltipMessage(secondaryTooltipMessage);
      setMessageKey((k) => k + 1);
    }, 2000);

    const savedChat = localStorage.getItem('hp_chat_history');
    if (savedChat) setChatHistory(JSON.parse(savedChat));

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('hp_chat_history', JSON.stringify(chatHistory));
  }, [chatHistory]);

  useEffect(() => {
    if (open && chatHistory.length === 0) setChatHistory([systemGreeting]);
    if (open) inputRef.current?.focus();
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
    setMessageKey((k) => k + 1);
    setTooltipVisible(true);
  };

  const resetChat = () => {
    setChatHistory([systemGreeting]);
    setMessage('');
    setShowSuggestions(true);
    inputRef.current?.focus();
  };

  const sendMessage = useCallback(
    async (msg = message) => {
      const trimmed = msg.trim();
      if (!trimmed) return;

      const context = {};
      const slug = getProductSlugFromUrl();
      if (slug) context.productSlug = slug;

      setChatHistory((prev) => [...prev, { role: 'user', type: 'text', content: trimmed }]);
      setMessage('');
      setIsLoading(true);

      try {
        const res = await chatService.sendMessage({ message: trimmed, context });
        const replyData = res?.data?.data;

        if (!replyData) {
          setChatHistory((prev) => [
            ...prev,
            { role: 'ai', type: 'text', content: 'Xin lỗi, em chưa hiểu rõ câu hỏi. Anh/Chị vui lòng thử lại.' }
          ]);
          return;
        }

        if (replyData.replyMessage) {
          setChatHistory((prev) => [...prev, { role: 'ai', type: 'text', content: replyData.replyMessage }]);
        }

        // Nếu có bảng + grid
        if (replyData.type === 'product_grid' && replyData.content?.table) {
          setChatHistory((prev) => [
            ...prev,
            {
              role: 'ai',
              type: 'text',
              content:
                `${replyData.content.descriptionTop || ''}<br /><i>Nếu bạn cần thêm thông tin chi tiết về sản phẩm nào, hãy cho em biết nhé!</i>`
            },
            { role: 'ai', type: 'table_only', content: replyData.content.table },
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
      } catch (e) {
        console.error('Lỗi gửi tin nhắn:', e);
        setChatHistory((prev) => [
          ...prev,
          { role: 'ai', type: 'text', content: 'Đã xảy ra lỗi. Vui lòng thử lại sau.' }
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [message]
  );

  const handleTriggerClick = useCallback(
    (trigger) => {
      if (!trigger) return;
      sendMessage(trigger);
    },
    [sendMessage]
  );

  /* ============ Render content ============ */
  const renderMessageContent = (msg) => {
    const safeHtml = (html) => ({ __html: DOMPurify.sanitize(html || '') });

    switch (msg.type) {
      case 'text':
        return <div dangerouslySetInnerHTML={safeHtml(msg.content)} />;

      case 'product_detail': {
        const p = msg.content;
        if (!p) return null;
        const price = p?.defaultSku?.price ?? p?.skus?.[0]?.price;
        return (
          <div className="ai-product-card">
            <a className="title" href={`/product/${p.slug}`} target="_blank" rel="noreferrer">
              {p.name}
            </a>
            {p.thumbnail && <img src={p.thumbnail} alt={p.name} className="thumb" />}
            {price != null && (
              <div className="price">{new Intl.NumberFormat('vi-VN').format(price)}₫</div>
            )}
            <a className="btn" href={`/product/${p.slug}`} target="_blank" rel="noreferrer">
              Xem chi tiết
            </a>
          </div>
        );
      }

      case 'table_only':
        return msg.content?.headers && msg.content?.rows ? (
          <div className="overflow-x-auto max-w-full">
            <ProductTableDisplay headers={msg.content.headers} rows={msg.content.rows} />
          </div>
        ) : null;

      case 'product_grid_only':
        return msg.content?.products ? (
          <>
            <ProductGridDisplay
              title={msg.content.title || 'Sản phẩm đề xuất'}
              products={msg.content.products}
            />
            {msg.content.noteAfterGrid && (
              <p className="text-[13px] mt-2 text-gray-600">{msg.content.noteAfterGrid}</p>
            )}
          </>
        ) : null;

      case 'product_grid':
        return msg.content?.products ? (
          <>
            {msg.content.table?.headers && msg.content.table?.rows && (
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
              products={msg.content.products}
            />
            {msg.content.noteAfterGrid && (
              <p className="text-[13px] mt-2 text-gray-600">{msg.content.noteAfterGrid}</p>
            )}
          </>
        ) : null;

      // >>> NEW: danh sách danh mục có thể bấm
      case 'category_list': {
        const content = msg.content || msg;
        const items = content?.items || [];

        if (items.length) {
          return (
            <div className="ai-category-list">
              <p className="mb-2 font-medium">{content?.title || 'Danh mục sản phẩm hiện có'}</p>
              <div className="flex flex-wrap gap-2">
                {items.map((it) => (
                  <button
                    key={it.id || it.name}
                    className="zz-chip-btn"
                    onClick={() => handleTriggerClick(it.triggerMessage || it.name)}
                    title={`Tìm "${it.name}"`}
                  >
                    {it.name}
                  </button>
                ))}
              </div>
            </div>
          );
        }a

        return (
          <div
            className="ai-category-list"
            onClick={(e) => {
              const a = e.target.closest('a.zz-chip[data-trigger]');
              if (a) {
                e.preventDefault();
                handleTriggerClick(a.getAttribute('data-trigger'));
              }
            }}
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(content?.htmlFallback || '')
            }}
          />
        );
      }

      default:
        return <div dangerouslySetInnerHTML={safeHtml(msg.content)} />;
    }
  };

  /* ============ UI ============ */
  return (
    <>
      {!open && (
        <div className="floating-contact">
          <div className={`contact-tooltip ${!tooltipVisible ? 'hidden' : ''}`}>
            <div className="tooltip-header">
              <span className="tooltip-title">CYBERZONE</span>
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
            <div className="header-content w-45">
              <img src={logo} alt="CYBERZONE" />
            </div>
            <div className="header-actions">
              <button onClick={resetChat} className="header-button" title="Đặt lại cuộc trò chuyện">
                <img src={resetIcon} alt="reset" className="action-icon" />
              </button>
              <button onClick={handleCloseChat} className="header-button" title="Đóng chat">
                <svg viewBox="0 0 24 24" className="action-icon">
                  <path
                    d="M6 18L18 6M6 6l12 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
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

            <p className="disclaimer-text">Trợ lý AI hỗ trợ 24/7 - Nội dung tham khảo</p>
          </div>
        </div>
      )}
    </>
  );
}
