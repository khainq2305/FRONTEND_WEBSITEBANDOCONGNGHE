import { useState, useRef, useEffect, useCallback } from 'react';
import { Search, ImageIcon, Mic, Loader2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { searchImageService } from '@/services/client/searchImageService';

const ImageSearchBox = () => {
  const [searching, setSearching] = useState(false);
  const navigate = useNavigate();

  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  const [searchTerm, setSearchTerm] = useState('');

  // --- States cho gợi ý tìm kiếm ---
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const debounceTimeoutRef = useRef(null);

  // --- States cho lịch sử tìm kiếm ---
  const [searchHistory, setSearchHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const searchBoxRef = useRef(null);

  // --- Hàm format tiền tệ ---
  const formatCurrencyVND = (num) => {
    if (typeof num !== 'number' || isNaN(num) || num === 0) return '';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  // --- Hàm tính số tiền tiết kiệm ---
  const calculateSavings = (price, originalPrice) => {
    if (typeof price === 'number' && !isNaN(price) && typeof originalPrice === 'number' && !isNaN(originalPrice) && originalPrice > price) {
      const diff = originalPrice - price;
      return formatCurrencyVND(diff);
    }
    return null;
  };

  // Effect để đóng gợi ý/lịch sử khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(event.target)) {
        setShowSuggestions(false);
        setShowHistory(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Hàm lấy lịch sử tìm kiếm từ API
  const fetchSearchHistory = useCallback(async () => {
    setLoadingHistory(true);
    try {
      const history = await searchImageService.getSearchHistory();
      setSearchHistory(history);
    } catch (error) {
      console.error('Lỗi khi tải lịch sử tìm kiếm:', error);
      setSearchHistory([]);
    } finally {
      setLoadingHistory(false);
    }
  }, []);

  const fetchSuggestions = async (query) => {
    if (query.length < 2) {
      setSuggestions([]);
      setLoadingSuggestions(false);
      setShowSuggestions(false);
      if (query.length === 0) {
        setShowHistory(true);
        fetchSearchHistory();
      }
      return;
    }
    setLoadingSuggestions(true);
    try {
      const data = await searchImageService.searchSuggestions(query);
      setSuggestions(data);
      if (data.length > 0) {
        setShowSuggestions(true);
        setShowHistory(false);
      } else {
        setShowSuggestions(false);
        setShowHistory(false);
      }
    } catch (error) {
      console.error('Lỗi khi lấy gợi ý:', error);
      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const handleTextSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    if (value.length === 0) {
      setShowSuggestions(false);
      setShowHistory(true);
      fetchSearchHistory();
    } else {
      setShowHistory(false);
      debounceTimeoutRef.current = setTimeout(() => {
        fetchSuggestions(value);
      }, 300);
    }
  };

  const handleSelectSuggestion = (suggestion) => {
    setSearchTerm(suggestion.name);
    setShowSuggestions(false);
    setShowHistory(false);

    const nameToSearch = suggestion.name?.trim();
    if (!nameToSearch) {
      console.warn('Tên gợi ý trống hoặc không hợp lệ, không thực hiện tìm kiếm.');
      return;
    }

    if (suggestion.type === 'product' || !suggestion.type) {
      handleTextSearchSubmit(null, nameToSearch);
    } else if (suggestion.type === 'category' && suggestion.slug) {
      navigate(`/category/${suggestion.slug}`);
    } else if (suggestion.type === 'brand' && suggestion.slug) {
      navigate(`/brand/${suggestion.slug}`);
    } else {
      handleTextSearchSubmit(null, nameToSearch);
    }
  };

  const handleImageFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setSearching(true);
      const response = await searchImageService.searchByImage(file);
      const similarProducts = response.similarProducts || [];
      navigate('/search-result', { state: { results: similarProducts } });
    } catch (err) {
      console.error('❌ Lỗi tìm ảnh:', err);
      alert('Đã xảy ra lỗi khi tìm kiếm bằng hình ảnh. Vui lòng thử lại.');
    } finally {
      setSearching(false);
    }
  };

  const handleTextSearchSubmit = async (e, queryToSearch = searchTerm) => {
    if (e) e.preventDefault();
    const query = queryToSearch.trim();
    if (!query) {
      console.log('Từ khóa tìm kiếm trống, không thực hiện tìm kiếm.');
      return;
    }

    setShowSuggestions(false);
    setShowHistory(false);

    try {
      setSearching(true);
      const response = await searchImageService.searchByName({ q: query });
      const similarProducts = response.similarProducts || [];
      navigate('/search-result', {
        state: { results: similarProducts, searchType: 'text', q: query },
      });
      searchImageService
        .addSearchHistory(query)
        .then(() => fetchSearchHistory())
        .catch((err) => console.error('Lỗi khi thêm lịch sử:', err));
    } catch (err) {
      console.error('❌ Lỗi khi tìm kiếm bằng văn bản:', err);
      alert('Đã xảy ra lỗi khi tìm kiếm bằng văn bản. Vui lòng thử lại.');
    } finally {
      setSearching(false);
    }
  };

  const handleVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Rất tiếc, trình duyệt của bạn không hỗ trợ tìm kiếm bằng giọng nói. Vui lòng sử dụng Google Chrome hoặc Microsoft Edge.');
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      console.log('Dừng lắng nghe giọng nói.');
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'vi-VN';

    recognitionRef.current = recognition;

    recognition.onstart = () => {
      setIsListening(true);
      setSearchTerm('');
      setSuggestions([]);
      setShowSuggestions(false);
      setShowHistory(false);
      console.log('Bắt đầu lắng nghe giọng nói...');
    };

    recognition.onresult = (event) => {
      let transcript = event.results[0][0].transcript;
      transcript = transcript.replace(/[.,\/?!;:“”‘’"']/g, '');
      transcript = transcript.trim();

      setSearchTerm(transcript);
      console.log('Bạn đã nói (đã làm sạch):', transcript);

      if (transcript.trim()) {
        setTimeout(() => {
          handleTextSearchSubmit(null, transcript);
        }, 50);
      } else {
        console.log('Không nhận dạng được từ khóa hợp lệ sau khi làm sạch từ giọng nói.');
      }
    };

    recognition.onerror = (event) => {
      setIsListening(false);
      console.error('Lỗi nhận dạng giọng nói:', event.error);
      if (event.error === 'no-speech') {
        console.warn('Không nhận dạng được giọng nói. Vui lòng thử lại.');
      } else if (event.error === 'not-allowed') {
        alert('Vui lòng cấp quyền truy cập microphone cho trình duyệt để sử dụng tìm kiếm bằng giọng nói.');
      } else if (event.error === 'aborted') {
        console.log('Nhận dạng giọng nói bị hủy bởi người dùng hoặc hệ thống.');
      } else {
        alert(`Lỗi nhận dạng giọng nói: ${event.error}. Vui lòng thử lại.`);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      console.log('Kết thúc phiên lắng nghe giọng nói.');
    };

    recognition.start();
  };

  // Hàm xử lý khi click vào một từ khóa trong lịch sử
  const handleHistoryClick = (keyword) => {
    setSearchTerm(keyword);
    setShowHistory(false);
    setShowSuggestions(false);
    handleTextSearchSubmit(null, keyword);
  };

  // Hàm xóa một mục khỏi lịch sử
  const handleDeleteHistoryItem = async (e, id) => {
    e.stopPropagation();
    try {
      await searchImageService.deleteSearchHistoryItem(id);
      fetchSearchHistory();
    } catch (error) {
      console.error('Lỗi khi xóa lịch sử:', error);
      alert('Đã xảy ra lỗi khi xóa lịch sử. Vui lòng thử lại.');
    }
  };

  return (
    <div className="flex-1 mx-4 relative" ref={searchBoxRef}>
      <div className="relative flex items-center bg-white text-gray-600 px-2 h-[36px] rounded-full w-full max-w-[600px] mx-auto shadow-sm">
        {/* Input tìm kiếm văn bản */}
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          className="flex-1 text-sm outline-none bg-transparent pr-[110px]"
          value={searchTerm}
          onChange={handleTextSearchChange}
          onFocus={() => {
            if (searchTerm.length === 0) {
              setShowHistory(true);
              setShowSuggestions(false);
              fetchSearchHistory();
            } else if (suggestions.length > 0) {
              setShowSuggestions(true);
              setShowHistory(false);
            }
          }}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleTextSearchSubmit(e);
              setShowSuggestions(false);
              setShowHistory(false);
            }
          }}
          disabled={searching || isListening}
        />

        <label
          className={`absolute right-[74px] top-1/2 -translate-y-1/2 cursor-pointer z-10
                    flex items-center justify-center w-[30px] h-[30px] rounded-full
                    bg-gray-100 text-gray-600 transition hover:bg-gray-200
                    ${isListening || searching ? 'opacity-50 cursor-not-allowed' : ''}`}
          title="Tìm kiếm bằng hình ảnh"
        >
          {searching ? (
            <Loader2 className="animate-spin w-4 h-4" />
          ) : (
            <ImageIcon className="w-4 h-4" />
          )}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageFileChange}
            disabled={isListening || searching}
          />
        </label>

        <button
          onClick={handleVoiceSearch}
          disabled={searching}
          className={`absolute right-[40px] top-1/2 -translate-y-1/2 flex items-center justify-center w-[30px] h-[30px] rounded-full ${
            isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-100 text-gray-600'
          } transition hover:bg-gray-200`}
          title={isListening ? 'Đang lắng nghe...' : 'Tìm kiếm bằng giọng nói'}
        >
          <Mic className={`w-4 h-4`} />
        </button>

        <button
          onClick={handleTextSearchSubmit}
          disabled={isListening || searching || !searchTerm.trim()}
          className="absolute right-[6px] top-1/2 -translate-y-1/2 flex items-center justify-center w-[30px] h-[30px] rounded-full bg-primary transition hover-secondary"
        >
          {searching ? (
            <Loader2 className="animate-spin w-4 h-4 text-white" />
          ) : (
            <Search style={{ color: 'var(--text-primary)' }} strokeWidth={2} className="w-4 h-4 transition-all" />
          )}
        </button>
      </div>

      {showSuggestions && searchTerm.length >= 2 && (suggestions.length > 0 || loadingSuggestions) && (
        <div className="absolute left-1/2 -translate-x-1/2 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-w-[600px] w-full z-30 overflow-hidden">
          {loadingSuggestions && (
            <div className="flex items-center justify-center p-2 text-gray-500 text-sm">
              <Loader2 className="animate-spin mr-2" size={14} /> Đang tải gợi ý...
            </div>
          )}
          {!loadingSuggestions && suggestions.length === 0 && searchTerm.length >= 2 && (
            <div className="p-2 text-gray-500 text-sm">
              Không có gợi ý nào cho "{searchTerm}".
            </div>
          )}
          {!loadingSuggestions && suggestions.length > 0 && (
            <ul className="py-1">
              {suggestions.map((suggestion) => (
                <li
                  key={suggestion.id}
                  className="px-3 py-1.5 cursor-pointer hover:bg-gray-100 transition-colors text-sm"
                  onClick={() => handleSelectSuggestion(suggestion)}
                >
                  {suggestion.type === 'product' || !suggestion.type ? (
                    <div className="flex items-center space-x-2">
                      <img
                        src={suggestion.image || suggestion.thumbnail || 'https://placehold.co/40x40/e2e8f0/94a3b8?text=No+Img'}
                        alt={suggestion.name}
                        className="w-8 h-8 object-contain rounded-md flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-800 line-clamp-1">
                          {suggestion.name}
                        </h4>
                        <div className="flex items-center text-xs">
                          <span className="text-red-600 font-bold mr-1">
                            {formatCurrencyVND(suggestion.price)}
                          </span>
                          {suggestion.oldPrice && suggestion.oldPrice > suggestion.price && (
                            <span className="text-gray-400 line-through mr-1">
                              {formatCurrencyVND(suggestion.oldPrice)}
                            </span>
                          )}
                          {suggestion.discount > 0 && (
                            <span className="bg-red-500 text-white px-0.5 py-0.25 rounded text-[9px] font-bold">
                              -{suggestion.discount}%
                            </span>
                          )}
                        </div>
                        {calculateSavings(suggestion.price, suggestion.oldPrice || suggestion.originalPrice) && (
                          <p className="text-green-600 text-[10px]">
                            Tiết kiệm {calculateSavings(suggestion.price, suggestion.oldPrice || suggestion.originalPrice)}
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center text-gray-800 text-sm">
                      <Search size={12} className="mr-2 text-gray-400" />
                      {suggestion.name}
                      {suggestion.type && (
                        <span className="ml-1 text-gray-500 text-[10px] opacity-80">
                          ({suggestion.type === 'category' ? 'Danh mục' : 'Thương hiệu'})
                        </span>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {showHistory && searchTerm.length === 0 && (searchHistory.length > 0 || loadingHistory) && (
        <div className="absolute left-1/2 -translate-x-1/2 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-w-[600px] w-full z-30 overflow-hidden">
          {loadingHistory && (
            <div className="flex items-center justify-center p-2 text-gray-500 text-sm">
              <Loader2 className="animate-spin mr-2" size={14} /> Đang tải lịch sử...
            </div>
          )}
          {!loadingHistory && searchHistory.length === 0 && (
            <div className="p-2 text-gray-500 text-sm">
              Chưa có lịch sử tìm kiếm nào.
            </div>
          )}
          {!loadingHistory && searchHistory.length > 0 && (
            <ul className="py-1">
              {searchHistory.map((item) => (
                <li
                  key={item.id}
                  className="px-3 py-1.5 cursor-pointer hover:bg-gray-100 transition-colors flex items-center justify-between text-sm"
                  onClick={() => handleHistoryClick(item.keyword)}
                >
                  <div className="flex items-center text-gray-800 text-sm">
                    <Search size={12} className="mr-2 text-gray-400" />
                    <span>{item.keyword}</span>
                  </div>
                  <button
                    onClick={(e) => handleDeleteHistoryItem(e, item.id)}
                    className="text-gray-400 hover:text-red-500 p-0.5 rounded-full transition-colors"
                    title="Xóa khỏi lịch sử"
                  >
                    <X size={12} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageSearchBox;