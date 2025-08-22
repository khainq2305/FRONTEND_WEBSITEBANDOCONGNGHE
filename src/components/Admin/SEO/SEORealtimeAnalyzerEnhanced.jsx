import React, { useState, useEffect, useCallback } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  Alert,
  Collapse,
  IconButton,
  Divider,
  Button,
  Grid
} from '@mui/material';
import {
  TrendingUp,
  CheckCircle,
  Warning,
  Error,
  ExpandMore,
  ExpandLess,
  Lightbulb,
  Search,
  Save,
  Visibility
} from '@mui/icons-material';

const SEORealtimeAnalyzerEnhanced = ({ 
  title = '', 
  content = '', 
  focusKeyword = '', 
  onFocusKeywordChange,
  expanded = true,
  onSaveSEO,
  mode = 'add', // 'add' or 'edit'
  slug = '' // Add slug prop for URL analysis
}) => {
  const [analysis, setAnalysis] = useState({
    score: 0,
    suggestions: [],
    stats: {},
    readability: {}
  });
  const [isExpanded, setIsExpanded] = useState(expanded);
  const [localFocusKeyword, setLocalFocusKeyword] = useState(focusKeyword);
  const [showAllSuggestions, setShowAllSuggestions] = useState(false);

  // Helper function to process Vietnamese keywords (matching backend)
  const processVietnameseKeyword = (keyword) => {
    if (!keyword) return '';
    
    const vietnameseMap = {
      'à': 'a', 'á': 'a', 'ạ': 'a', 'ả': 'a', 'ã': 'a', 'â': 'a', 'ầ': 'a', 'ấ': 'a', 'ậ': 'a', 'ẩ': 'a', 'ẫ': 'a', 'ă': 'a', 'ằ': 'a', 'ắ': 'a', 'ặ': 'a', 'ẳ': 'a', 'ẵ': 'a',
      'è': 'e', 'é': 'e', 'ẹ': 'e', 'ẻ': 'e', 'ẽ': 'e', 'ê': 'e', 'ề': 'e', 'ế': 'e', 'ệ': 'e', 'ể': 'e', 'ễ': 'e',
      'ì': 'i', 'í': 'i', 'ị': 'i', 'ỉ': 'i', 'ĩ': 'i',
      'ò': 'o', 'ó': 'o', 'ọ': 'o', 'ỏ': 'o', 'õ': 'o', 'ô': 'o', 'ồ': 'o', 'ố': 'o', 'ộ': 'o', 'ổ': 'o', 'ỗ': 'o', 'ơ': 'o', 'ờ': 'o', 'ớ': 'o', 'ợ': 'o', 'ở': 'o', 'ỡ': 'o',
      'ù': 'u', 'ú': 'u', 'ụ': 'u', 'ủ': 'u', 'ũ': 'u', 'ư': 'u', 'ừ': 'u', 'ứ': 'u', 'ự': 'u', 'ử': 'u', 'ữ': 'u',
      'ỳ': 'y', 'ý': 'y', 'ỵ': 'y', 'ỷ': 'y', 'ỹ': 'y',
      'đ': 'd'
    };

    return keyword
      .toLowerCase()
      .split('')
      .map(char => vietnameseMap[char] || char)
      .join('')
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9\-]/g, '');
  };

  // Helper function to create slug from title (matching backend behavior)
  const createSlugFromTitle = (title) => {
    if (!title) return '';
    
    const generatedSlug = title
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, 'a')
      .replace(/[èéẹẻẽêềếệểễ]/g, 'e')
      .replace(/[ìíịỉĩ]/g, 'i')
      .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, 'o')
      .replace(/[ùúụủũưừứựửữ]/g, 'u')
      .replace(/[ỳýỵỷỹ]/g, 'y')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9\-]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    // Debug: Log frontend slug generation
    console.log(`🔍 [Frontend SEO Debug] Title: "${title}"`);
    console.log(`🏷️  Generated slug: "${generatedSlug}"`);
    console.log(`⚙️  Using seoSlugify (frontend version)`);
    
    return generatedSlug;
  };

  // Sync localFocusKeyword với focusKeyword prop khi thay đổi
  useEffect(() => {
    if (focusKeyword !== localFocusKeyword) {
      setLocalFocusKeyword(focusKeyword);
      if (focusKeyword && mode === 'edit') {
        console.log('🔑 Auto-loaded focus keyword from database:', focusKeyword);
      }
    }
  }, [focusKeyword, localFocusKeyword, mode]);

  // Simple debounce function
  const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  // URL Analysis function (matching backend logic)
  const analyzeUrlSEO = useCallback((slug, focusKeyword) => {
    let score = 0;
    const issues = [];
    const recommendations = [];

    if (!slug) {
      issues.push('Thiếu URL slug');
      recommendations.push('URL sẽ được tạo tự động từ tiêu đề');
      return { score: 0, issues, recommendations };
    }

    // Kiểm tra độ dài slug (matching backend)
    if (slug.length <= 75) {
      score += 40;
    } else {
      issues.push('URL quá dài');
      recommendations.push('URL nên ngắn hơn 75 ký tự');
    }

    // Kiểm tra focus keyword trong slug (matching backend logic)
    if (focusKeyword) {
      const keywordProcessed = processVietnameseKeyword(focusKeyword);
      const slugLower = slug.toLowerCase();
      
      // Kiểm tra từ khóa gốc (có thể đã được convert)
      if (slugLower.includes(focusKeyword.toLowerCase().replace(/\s+/g, '-'))) {
        score += 30;
      }
      // Kiểm tra từ khóa đã xử lý (không dấu)
      else if (slugLower.includes(keywordProcessed)) {
        score += 25;
      }
      // Kiểm tra các từ riêng lẻ trong keyword
      else {
        const keywordWords = keywordProcessed.split('-');
        const matchingWords = keywordWords.filter(word => 
          word.length > 2 && slugLower.includes(word)
        );
        
        if (matchingWords.length > 0) {
          const matchPercentage = matchingWords.length / keywordWords.length;
          if (matchPercentage >= 0.7) {
            score += 20;
            recommendations.push(`URL chứa ${matchingWords.length}/${keywordWords.length} từ của keyword "${focusKeyword}"`);
          } else if (matchPercentage >= 0.5) {
            score += 15;
            recommendations.push(`URL chứa một phần từ khóa "${focusKeyword}". Có thể cải thiện thêm.`);
          } else {
            score += 5;
            issues.push(`URL chỉ chứa ít từ của keyword "${focusKeyword}"`);
            recommendations.push(`Cố gắng thêm nhiều từ của keyword "${focusKeyword}" vào URL`);
          }
        } else {
          issues.push(`URL không chứa từ khóa "${focusKeyword}"`);
          recommendations.push(`Thêm từ khóa "${focusKeyword}" hoặc các từ liên quan vào URL`);
        }
      }
    }

    // Kiểm tra cấu trúc URL thân thiện (matching backend)
    if (!/[^a-z0-9\-]/.test(slug)) {
      score += 20;
    } else {
      issues.push('URL chứa ký tự không phù hợp');
      recommendations.push('URL chỉ nên chứa chữ thường, số và dấu gạch ngang');
    }

    // Kiểm tra cấu trúc có ý nghĩa (matching backend)
    const slugWords = slug.split('-').filter(word => word.length > 2);
    if (slugWords.length >= 3) {
      score += 10;
    } else if (slugWords.length >= 2) {
      score += 5;
    } else {
      recommendations.push('URL nên có ít nhất 2-3 từ có ý nghĩa');
    }

    return { score: Math.min(score, 100), issues, recommendations };
  }, []);

  // Debounced analysis function
  const debouncedAnalyze = useCallback(
    debounce((title, content, keyword) => {
      analyzeContent(title, content, keyword);
    }, 500),
    []
  );

  useEffect(() => {
    if (title || content) {
      debouncedAnalyze(title, content, localFocusKeyword);
    }
  }, [title, content, localFocusKeyword, debouncedAnalyze]);

  const analyzeContent = (title, content, keyword) => {
    const plainContent = stripHTML(content);
    
    const stats = {
      titleLength: title.length,
      contentLength: plainContent.length,
      wordCount: getWordCount(plainContent),
      paragraphCount: getParagraphCount(plainContent),
      keywordDensity: calculateKeywordDensity(content, keyword), // Đồng bộ với backend: dùng HTML content
      keywordCount: getKeywordCount(content, keyword), // Thêm keyword count
      headingCount: getHeadingCount(content),
      imageCount: getImageCount(content),
      linkCount: getLinkCount(content)
    };

    const readability = {
      avgWordsPerSentence: getAvgWordsPerSentence(plainContent),
      avgSentencesPerParagraph: getAvgSentencesPerParagraph(plainContent),
      complexWords: getComplexWordCount(plainContent)
    };

    // Use enhanced scoring compatible with backend
    const { score: seoScore, suggestions: seoSuggestions, breakdown } = calculateAdvancedSEOScore(title, content, keyword, stats);

    // Add auto-generated meta description
    const autoMetaDescription = generateMetaDescription(content);

    setAnalysis({
      score: Math.min(seoScore, 100),
      suggestions: seoSuggestions.sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return (priorityOrder[b.priority] || 1) - (priorityOrder[a.priority] || 1);
      }),
      stats,
      readability,
      autoMetaDescription,
      breakdown // Add breakdown for detailed scoring
    });
  };

  // Helper functions for SEO analysis
  const stripHTML = (html) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const getWordCount = (text) => {
    return text.split(/\s+/).filter(word => word.length > 0).length;
  };

  const getParagraphCount = (text) => {
    return text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;
  };

  const getHeadingCount = (html) => {
    const headings = html.match(/<h[1-6][^>]*>/gi);
    return headings ? headings.length : 0;
  };

  const getImageCount = (html) => {
    const images = html.match(/<img[^>]*>/gi);
    return images ? images.length : 0;
  };

  const getLinkCount = (html) => {
    const links = html.match(/<a[^>]*>/gi);
    return links ? links.length : 0;
  };

  const getAvgWordsPerSentence = (text) => {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const totalWords = getWordCount(text);
    return sentences.length > 0 ? totalWords / sentences.length : 0;
  };

  const getAvgSentencesPerParagraph = (text) => {
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
    const totalSentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    return paragraphs.length > 0 ? totalSentences / paragraphs.length : 0;
  };

  const getComplexWordCount = (text) => {
    const words = text.split(/\s+/);
    return words.filter(word => word.length > 6).length;
  };

  const calculateKeywordDensity = (content, keyword) => {
    if (!keyword || !content) return 0;
    
    // Đồng bộ với backend: Không strip HTML, đếm trực tiếp
    const words = content.split(/\s+/).filter(word => word.length > 0);
    const wordCount = words.length;
    
    if (wordCount === 0) return 0;
    
    // Đồng bộ với backend: Sử dụng regex đơn giản như backend
    const keywordCount = (content.toLowerCase().match(new RegExp(keyword.toLowerCase(), 'g')) || []).length;
    const density = (keywordCount / wordCount) * 100;
    
    return density;
  };

  const getKeywordCount = (content, keyword) => {
    if (!keyword || !content) return 0;
    
    // Đồng bộ với backend: Sử dụng regex đơn giản
    return (content.toLowerCase().match(new RegExp(keyword.toLowerCase(), 'g')) || []).length;
  };

  // SEO Analysis Functions - Using calculateAdvancedSEOScore instead

  const analyzeContentLength = (stats, suggestions) => {
    let score = 0;

    if (stats.contentLength === 0) {
      suggestions.push({
        type: 'error',
        text: 'Nội dung không được để trống',
        icon: Error
      });
      return 0;
    }

    if (stats.wordCount < 300) {
      suggestions.push({
        type: 'warning',
        text: `Nội dung quá ngắn (${stats.wordCount} từ). Nên có ít nhất 300 từ`,
        icon: Warning
      });
      score += 8;
    } else if (stats.wordCount > 2000) {
      suggestions.push({
        type: 'info',
        text: `Nội dung rất dài (${stats.wordCount} từ). Hãy đảm bảo dễ đọc`,
        icon: Lightbulb
      });
      score += 15;
    } else {
      suggestions.push({
        type: 'success',
        text: `Độ dài nội dung phù hợp (${stats.wordCount} từ)`,
        icon: CheckCircle
      });
      score += 20;
    }

    return score;
  };

  const analyzeKeywordSEO = (title, content, keyword, stats, suggestions) => {
    let score = 0;

    if (!keyword) {
      suggestions.push({
        type: 'warning',
        text: 'Chưa có từ khóa focus. Hãy thêm từ khóa chính',
        icon: Warning
      });
      return 0;
    }

    const keywordInContent = content.toLowerCase().includes(keyword.toLowerCase());

    if (keywordInContent) {
      if (stats.keywordDensity >= 0.5 && stats.keywordDensity <= 3) {
        suggestions.push({
          type: 'success',
          text: `Mật độ từ khóa tối ưu (${stats.keywordCount} lần, ${stats.keywordDensity.toFixed(1)}%)`,
          icon: CheckCircle
        });
        score += 20;
      } else if (stats.keywordDensity > 3) {
        suggestions.push({
          type: 'warning',
          text: `Mật độ từ khóa quá cao (${stats.keywordCount} lần, ${stats.keywordDensity.toFixed(1)}%). Nên giảm xuống 1-3%`,
          icon: Warning
        });
        score += 8;
      } else {
        suggestions.push({
          type: 'warning',
          text: `Mật độ từ khóa thấp (${stats.keywordCount} lần, ${stats.keywordDensity.toFixed(1)}%). Nên tăng lên 1-3%`,
          icon: Warning
        });
        score += 8;
      }
    } else {
      suggestions.push({
        type: 'error',
        text: 'Từ khóa không xuất hiện trong nội dung',
        icon: Error
      });
    }

    // Check keyword in first paragraph
    const firstParagraph = content.split(/\n/)[0] || '';
    if (firstParagraph.toLowerCase().includes(keyword.toLowerCase())) {
      suggestions.push({
        type: 'success',
        text: 'Từ khóa xuất hiện trong đoạn đầu tiên',
        icon: CheckCircle
      });
      score += 5;
    }

    return score;
  };

  const analyzeContentStructure = (html, stats, suggestions) => {
    let score = 0;

    // Paragraph structure
    if (stats.paragraphCount < 3) {
      suggestions.push({
        type: 'warning',
        text: `Quá ít đoạn văn (${stats.paragraphCount}). Nên chia thành nhiều đoạn hơn`,
        icon: Warning
      });
      score += 5;
    } else {
      suggestions.push({
        type: 'success',
        text: `Cấu trúc đoạn văn tốt (${stats.paragraphCount} đoạn)`,
        icon: CheckCircle
      });
      score += 10;
    }

    // Headings
    if (stats.headingCount === 0) {
      suggestions.push({
        type: 'warning',
        text: 'Nên thêm tiêu đề phụ (H2, H3) để cải thiện cấu trúc',
        icon: Warning
      });
    } else {
      suggestions.push({
        type: 'success',
        text: `Có ${stats.headingCount} tiêu đề phụ`,
        icon: CheckCircle
      });
      score += 5;
    }

    // Images
    if (stats.imageCount === 0) {
      suggestions.push({
        type: 'info',
        text: 'Nên thêm hình ảnh để làm phong phú nội dung',
        icon: Lightbulb
      });
    } else {
      suggestions.push({
        type: 'success',
        text: `Có ${stats.imageCount} hình ảnh`,
        icon: CheckCircle
      });
      score += 5;
    }

    return score;
  };

  const analyzeReadability = (readability, suggestions) => {
    let score = 0;

    if (readability.avgWordsPerSentence > 20) {
      suggestions.push({
        type: 'warning',
        text: 'Câu văn quá dài. Nên viết câu ngắn hơn để dễ đọc',
        icon: Warning
      });
      score += 3;
    } else {
      score += 10;
    }

    return score;
  };

  const getScoreColor = (score) => {
    if (score >= 70) return '#4CAF50';
    if (score >= 50) return '#FF9800';
    return '#f44336';
  };

  const getScoreLabel = (score) => {
    if (score >= 70) return 'Tốt';
    if (score >= 50) return 'Trung bình';
    return 'Cần cải thiện';
  };

  const handleFocusKeywordChange = (event) => {
    const value = event.target.value;
    setLocalFocusKeyword(value);
    onFocusKeywordChange?.(value);
  };

  const handleSaveSEOData = () => {
    const seoData = {
      focusKeyword: localFocusKeyword,
      score: analysis.score,
      analysis: analysis,
      metaTitle: title,
      metaDescription: generateMetaDescription(content), // Auto-generated meta description
    };
    onSaveSEO?.(seoData);
  };

  // Auto-generate meta description based on content
  const generateMetaDescription = (content, maxLength = 160) => {
    const plainText = stripHTML(content);
    if (!plainText) return '';
    
    // Remove extra spaces and newlines
    const cleanText = plainText.replace(/\s+/g, ' ').trim();
    
    // Try to cut at sentence boundary if possible
    if (cleanText.length <= maxLength) {
      return cleanText;
    }
    
    const truncated = cleanText.substring(0, maxLength);
    const lastSentence = truncated.lastIndexOf('.');
    const lastSpace = truncated.lastIndexOf(' ');
    
    if (lastSentence > maxLength * 0.7) {
      return cleanText.substring(0, lastSentence + 1);
    } else if (lastSpace > maxLength * 0.8) {
      return cleanText.substring(0, lastSpace) + '...';
    } else {
      return truncated + '...';
    }
  };

  // Enhanced SEO scoring with backend-compatible algorithm
  const calculateAdvancedSEOScore = (title, content, keyword, stats) => {
    let titleScore = 0;
    let contentScore = 0;
    let urlScore = 0; // Simulate URL analysis since we don't have slug in frontend
    const suggestions = [];
    
    // ==================== TITLE ANALYSIS (100 points) ====================
    if (!title) {
      suggestions.push({
        type: 'error',
        text: 'Thiếu tiêu đề bài viết',
        icon: Error,
        priority: 'high'
      });
      titleScore = 0;
    } else {
      // Debug log for title analysis
      console.log(`🔍 [Frontend Title Debug] Title: "${title}" (${title.length} chars)`);
      console.log(`📝 Focus keyword: "${keyword}"`);
      
      // Title length analysis (30 points) - CRITICAL: No points for bad length
      if (title.length < 30) {
        suggestions.push({
          type: 'warning',
          text: `Tiêu đề quá ngắn (${title.length} ký tự). Nên có 30-60 ký tự`,
          icon: Warning,
          priority: 'medium'
        });
        console.log(`❌ Title too short: 0 points`);
      } else if (title.length > 60) {
        suggestions.push({
          type: 'warning',
          text: `Tiêu đề quá dài (${title.length} ký tự). Nên có 30-60 ký tự`,
          icon: Warning,
          priority: 'medium'
        });
        console.log(`❌ Title too long: 0 points`);
      } else {
        titleScore += 30;
        suggestions.push({
          type: 'success',
          text: `Độ dài tiêu đề tối ưu (${title.length} ký tự)`,
          icon: CheckCircle,
          priority: 'low'
        });
        console.log(`✅ Title length good: +30 points`);
      }

      // Focus keyword in title (40 points)
      if (keyword) {
        if (title.toLowerCase().includes(keyword.toLowerCase())) {
          titleScore += 40;
          suggestions.push({
            type: 'success',
            text: 'Từ khóa focus có trong tiêu đề',
            icon: CheckCircle,
            priority: 'low'
          });
          console.log(`✅ Keyword in title: +40 points`);
        } else {
          suggestions.push({
            type: 'warning',
            text: 'Từ khóa focus không có trong tiêu đề',
            icon: Warning,
            priority: 'high'
          });
          console.log(`❌ No keyword in title: 0 points`);
        }
      }

      // Title has numbers (10 points)
      if (/\d/.test(title)) {
        titleScore += 10;
        console.log(`✅ Title has numbers: +10 points`);
      }

      // Emotional words (20 points)
      const emotionalWords = ['best', 'tốt nhất', 'amazing', 'tuyệt vời', 'ultimate', 'hoàn hảo', 'top', 'hàng đầu'];
      if (emotionalWords.some(word => title.toLowerCase().includes(word.toLowerCase()))) {
        titleScore += 20;
        console.log(`✅ Title has emotional words: +20 points`);
      }
      
      console.log(`🏷️  Total title score: ${titleScore}/100`);
      console.log(`---`);
    }

    // ==================== CONTENT ANALYSIS (100 points) ====================
    if (stats.wordCount === 0) {
      suggestions.push({
        type: 'error',
        text: 'Nội dung không được để trống',
        icon: Error,
        priority: 'high'
      });
      contentScore = 0;
    } else {
      // Content length analysis (30 points)
      if (stats.wordCount < 300) {
        suggestions.push({
          type: 'warning',
          text: `Nội dung quá ngắn (${stats.wordCount} từ). Nên có ít nhất 300 từ`,
          icon: Warning,
          priority: 'medium'
        });
      } else if (stats.wordCount >= 300 && stats.wordCount <= 2000) {
        contentScore += 30;
        suggestions.push({
          type: 'success',
          text: `Độ dài nội dung phù hợp (${stats.wordCount} từ)`,
          icon: CheckCircle,
          priority: 'low'
        });
      } else {
        contentScore += 20;
        suggestions.push({
          type: 'info',
          text: `Nội dung rất dài (${stats.wordCount} từ). Đảm bảo cấu trúc rõ ràng`,
          icon: Lightbulb,
          priority: 'low'
        });
      }

      // Keyword density analysis (25 points)
      if (keyword && stats.keywordDensity > 0) {
        if (stats.keywordDensity < 0.5) {
          suggestions.push({
            type: 'warning',
            text: `Mật độ từ khóa thấp (${stats.keywordCount} lần, ${stats.keywordDensity.toFixed(1)}%). Nên có 0.5-2.5%`,
            icon: Warning,
            priority: 'medium'
          });
        } else if (stats.keywordDensity > 2.5) {
          suggestions.push({
            type: 'warning',
            text: `Mật độ từ khóa cao (${stats.keywordCount} lần, ${stats.keywordDensity.toFixed(1)}%). Nên có 0.5-2.5%`,
            icon: Warning,
            priority: 'high'
          });
        } else {
          contentScore += 25;
          suggestions.push({
            type: 'success',
            text: `Mật độ từ khóa tốt (${stats.keywordCount} lần, ${stats.keywordDensity.toFixed(1)}%)`,
            icon: CheckCircle,
            priority: 'low'
          });
        }
      } else if (keyword) {
        suggestions.push({
          type: 'warning',
          text: 'Từ khóa focus không xuất hiện trong nội dung',
          icon: Warning,
          priority: 'high'
        });
      }

      // H1 headings analysis (20 points)
      const h1Count = (content.match(/<h1[^>]*>/gi) || []).length;
      if (h1Count === 0) {
        suggestions.push({
          type: 'warning',
          text: 'Thiếu thẻ H1',
          icon: Warning,
          priority: 'medium'
        });
      } else if (h1Count > 1) {
        suggestions.push({
          type: 'warning',
          text: 'Quá nhiều thẻ H1. Chỉ nên có một thẻ H1',
          icon: Warning,
          priority: 'medium'
        });
      } else {
        contentScore += 20;
        suggestions.push({
          type: 'success',
          text: 'Có đúng một thẻ H1',
          icon: CheckCircle,
          priority: 'low'
        });
      }

      // H2 headings analysis (15 points)
      const h2Count = (content.match(/<h2[^>]*>/gi) || []).length;
      if (h2Count >= 1) {
        contentScore += 15;
        suggestions.push({
          type: 'success',
          text: `Có ${h2Count} thẻ H2`,
          icon: CheckCircle,
          priority: 'low'
        });
      } else {
        suggestions.push({
          type: 'info',
          text: 'Nên thêm thẻ H2 để cải thiện cấu trúc',
          icon: Lightbulb,
          priority: 'low'
        });
      }

      // Image alt text analysis (10 points)
      const images = content.match(/<img[^>]*>/gi) || [];
      if (images.length > 0) {
        const imagesWithAlt = images.filter(img => img.includes('alt=')).length;
        if (imagesWithAlt === images.length) {
          contentScore += 10;
          suggestions.push({
            type: 'success',
            text: `Tất cả ${images.length} hình ảnh có alt text`,
            icon: CheckCircle,
            priority: 'low'
          });
        } else {
          suggestions.push({
            type: 'warning',
            text: 'Một số hình ảnh thiếu alt text',
            icon: Warning,
            priority: 'medium'
          });
        }
      }
    }

    // ==================== URL ANALYSIS (100 points) - Real Analysis ====================
    // Generate slug from title if no slug provided, or use provided slug
    const currentSlug = slug || createSlugFromTitle(title);
    const urlAnalysis = analyzeUrlSEO(currentSlug, keyword);
    urlScore = urlAnalysis.score;
    
    // Add URL-specific suggestions
    urlAnalysis.issues.forEach(issue => {
      suggestions.push({
        type: 'warning',
        text: issue,
        icon: Warning,
        priority: 'medium'
      });
    });
    
    urlAnalysis.recommendations.forEach(rec => {
      suggestions.push({
        type: 'info',
        text: rec,
        icon: Lightbulb,
        priority: 'low'
      });
    });

    // ==================== FINAL SCORE CALCULATION ====================
    // Backend formula: average of title, content, and URL scores
    const finalScore = Math.round((titleScore + contentScore + urlScore) / 3);

    return { 
      score: Math.min(finalScore, 100), 
      suggestions,
      breakdown: {
        title: titleScore,
        content: contentScore,
        url: urlScore
      }
    };
  };

  return (
    <Card sx={{ 
      mb: 2,
      border: `2px solid ${getScoreColor(analysis.score)}`,
      borderRadius: 2,
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
    }}>
      <CardContent sx={{ py: 2 }}>
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            cursor: 'pointer'
          }}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TrendingUp sx={{ color: getScoreColor(analysis.score) }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
              SEO Real-time
            </Typography>
            <Chip 
              label={`${analysis.score}/100`}
              sx={{ 
                background: getScoreColor(analysis.score),
                color: 'white',
                fontWeight: 'bold',
                fontSize: '0.75rem'
              }}
              size="small"
            />
          </Box>
          <IconButton size="small">
            {isExpanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </Box>

        {/* SEO Score Progress */}
        <Box sx={{ mt: 1.5, mb: 1 }}>
          <LinearProgress 
            variant="determinate" 
            value={analysis.score}
            sx={{ 
              height: 6, 
              borderRadius: 3,
              backgroundColor: '#f0f0f0',
              '& .MuiLinearProgress-bar': {
                backgroundColor: getScoreColor(analysis.score),
                borderRadius: 3
              }
            }}
          />
          <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5, display: 'block' }}>
            {getScoreLabel(analysis.score)} - Cập nhật real-time
          </Typography>
        </Box>

        <Collapse in={isExpanded}>
          {/* Focus Keyword Input */}
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              size="small"
              label="Từ khóa focus"
              value={localFocusKeyword}
              onChange={handleFocusKeywordChange}
              placeholder="vd: laptop gaming"
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary', fontSize: 18 }} />
              }}
              helperText={
                mode === 'edit' && localFocusKeyword && focusKeyword === localFocusKeyword
                  ? "✅ Đã tự động tải từ database"
                  : undefined
              }
            />
          </Box>

          {/* SEO Score Breakdown */}
          {analysis.breakdown && (
            <Box sx={{ mt: 2, p: 2, bgcolor: '#f8f9fa', borderRadius: 1 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold', fontSize: '0.875rem' }}>
                Chi Tiết Điểm SEO:
              </Typography>
              <Grid container spacing={1}>
                <Grid item xs={4}>
                  <Typography variant="caption" color="textSecondary">
                    Tiêu đề: {analysis.breakdown.title}/100
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="caption" color="textSecondary">
                    Nội dung: {analysis.breakdown.content}/100
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="caption" color="textSecondary">
                    URL: {analysis.breakdown.url}/100
                  </Typography>
                </Grid>
              </Grid>
              <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5, display: 'block', fontStyle: 'italic' }}>
                Điểm cuối = Trung bình 3 phần ({Math.round((analysis.breakdown.title + analysis.breakdown.content + analysis.breakdown.url) / 3)}/100)
              </Typography>
            </Box>
          )}

          {/* Quick Stats */}
          <Box sx={{ mt: 2, p: 1.5, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Typography variant="caption" color="textSecondary">
                  Từ: {analysis.stats.wordCount || 0}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="textSecondary">
                  Đoạn: {analysis.stats.paragraphCount || 0}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="textSecondary">
                  KW: {analysis.stats.keywordCount || 0} lần
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="textSecondary">
                  Mật độ: {(analysis.stats.keywordDensity || 0).toFixed(1)}%
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="textSecondary">
                  H tags: {analysis.stats.headingCount || 0}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="textSecondary">
                  Ảnh: {analysis.stats.imageCount || 0}
                </Typography>
              </Grid>
            </Grid>
          </Box>

          {/* Auto-generated Meta Description */}
          {analysis.autoMetaDescription && (
            <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold', fontSize: '0.875rem' }}>
                Meta Description Gợi Ý:
              </Typography>
              <Typography variant="body2" sx={{ 
                fontStyle: 'italic', 
                color: 'text.secondary',
                lineHeight: 1.4
              }}>
                "{analysis.autoMetaDescription}"
              </Typography>
              <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5, display: 'block' }}>
                Độ dài: {analysis.autoMetaDescription.length} ký tự
              </Typography>
            </Box>
          )}

          {/* Top Suggestions */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold', fontSize: '0.875rem' }}>
              Gợi ý hàng đầu:
            </Typography>
            <List dense sx={{ py: 0 }}>
              {(showAllSuggestions ? analysis.suggestions : analysis.suggestions.slice(0, 3)).map((suggestion, index) => (
                <ListItem key={index} sx={{ px: 0, py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 28 }}>
                    <suggestion.icon 
                      sx={{ 
                        fontSize: 14,
                        color: suggestion.type === 'success' ? '#4CAF50' :
                               suggestion.type === 'warning' ? '#FF9800' :
                               suggestion.type === 'error' ? '#f44336' : '#2196F3'
                      }} 
                    />
                  </ListItemIcon>
                  <ListItemText 
                    primary={suggestion.text}
                    primaryTypographyProps={{ 
                      variant: 'caption',
                      sx: { lineHeight: 1.3 }
                    }}
                  />
                </ListItem>
              ))}
            </List>
            
            {analysis.suggestions.length > 3 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                <Button
                  size="small"
                  variant="text"
                  onClick={() => setShowAllSuggestions(!showAllSuggestions)}
                  sx={{ 
                    fontSize: '0.75rem',
                    textTransform: 'none',
                    color: 'primary.main'
                  }}
                >
                  {showAllSuggestions 
                    ? 'Thu gọn' 
                    : `Xem thêm ${analysis.suggestions.length - 3} gợi ý`
                  }
                </Button>
              </Box>
            )}
          </Box>

          {/* Actions */}
          <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
            <Button
              size="small"
              variant="outlined"
              startIcon={<Visibility />}
              onClick={() => setIsExpanded(false)}
              sx={{ fontSize: '0.75rem' }}
            >
              Thu gọn
            </Button>
            {onSaveSEO && (
              <Button
                size="small"
                variant="contained"
                startIcon={<Save />}
                onClick={handleSaveSEOData}
                sx={{ fontSize: '0.75rem' }}
              >
                Lưu SEO
              </Button>
            )}
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default SEORealtimeAnalyzerEnhanced;
