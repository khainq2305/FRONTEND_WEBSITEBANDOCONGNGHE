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
  Divider
} from '@mui/material';
import {
  TrendingUp,
  CheckCircle,
  Warning,
  Error,
  ExpandMore,
  ExpandLess,
  Lightbulb,
  Search
} from '@mui/icons-material';

// Simple debounce function to avoid lodash dependency
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

const SEORealtimeAnalyzer = ({ 
  title = '', 
  content = '', 
  focusKeyword = '', 
  onFocusKeywordChange,
  expanded = true 
}) => {
  const [analysis, setAnalysis] = useState({
    score: 0,
    suggestions: [],
    stats: {}
  });
  const [isExpanded, setIsExpanded] = useState(expanded);
  const [localFocusKeyword, setLocalFocusKeyword] = useState(focusKeyword);

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
    const stats = {
      titleLength: title.length,
      contentLength: content.length,
      wordCount: content.split(/\s+/).filter(word => word.length > 0).length,
      paragraphCount: content.split(/\n\s*\n/).filter(p => p.trim().length > 0).length,
      keywordDensity: calculateKeywordDensity(content, keyword)
    };

    const suggestions = [];
    let score = 0;

    // Title analysis
    if (stats.titleLength === 0) {
      suggestions.push({
        type: 'error',
        text: 'Tiêu đề không được để trống',
        icon: Error
      });
    } else if (stats.titleLength < 30) {
      suggestions.push({
        type: 'warning', 
        text: 'Tiêu đề quá ngắn. Nên có 30-60 ký tự',
        icon: Warning
      });
      score += 10;
    } else if (stats.titleLength > 60) {
      suggestions.push({
        type: 'warning',
        text: 'Tiêu đề quá dài. Nên có 30-60 ký tự', 
        icon: Warning
      });
      score += 10;
    } else {
      suggestions.push({
        type: 'success',
        text: 'Độ dài tiêu đề tốt',
        icon: CheckCircle
      });
      score += 25;
    }

    // Content length analysis
    if (stats.contentLength === 0) {
      suggestions.push({
        type: 'error',
        text: 'Nội dung không được để trống',
        icon: Error
      });
    } else if (stats.wordCount < 300) {
      suggestions.push({
        type: 'warning',
        text: 'Nội dung quá ngắn. Nên có ít nhất 300 từ',
        icon: Warning
      });
      score += 10;
    } else if (stats.wordCount > 2000) {
      suggestions.push({
        type: 'info',
        text: 'Nội dung rất dài. Hãy đảm bảo dễ đọc',
        icon: Lightbulb
      });
      score += 20;
    } else {
      suggestions.push({
        type: 'success',
        text: 'Độ dài nội dung phù hợp',
        icon: CheckCircle
      });
      score += 25;
    }

    // Focus keyword analysis
    if (!keyword) {
      suggestions.push({
        type: 'warning',
        text: 'Chưa có từ khóa focus. Hãy thêm từ khóa chính',
        icon: Warning
      });
    } else {
      const titleContainsKeyword = title.toLowerCase().includes(keyword.toLowerCase());
      const contentContainsKeyword = content.toLowerCase().includes(keyword.toLowerCase());

      if (titleContainsKeyword) {
        suggestions.push({
          type: 'success', 
          text: 'Từ khóa xuất hiện trong tiêu đề',
          icon: CheckCircle
        });
        score += 15;
      } else {
        suggestions.push({
          type: 'warning',
          text: 'Từ khóa chưa xuất hiện trong tiêu đề',
          icon: Warning
        });
      }

      if (contentContainsKeyword) {
        if (stats.keywordDensity >= 0.5 && stats.keywordDensity <= 3) {
          suggestions.push({
            type: 'success',
            text: `Mật độ từ khóa tốt (${stats.keywordDensity.toFixed(1)}%)`,
            icon: CheckCircle
          });
          score += 15;
        } else if (stats.keywordDensity > 3) {
          suggestions.push({
            type: 'warning',
            text: `Mật độ từ khóa quá cao (${stats.keywordDensity.toFixed(1)}%)`,
            icon: Warning
          });
          score += 5;
        } else {
          suggestions.push({
            type: 'warning',
            text: `Mật độ từ khóa thấp (${stats.keywordDensity.toFixed(1)}%)`,
            icon: Warning
          });
          score += 5;
        }
      } else {
        suggestions.push({
          type: 'error',
          text: 'Từ khóa không xuất hiện trong nội dung',
          icon: Error
        });
      }
    }

    // Structure analysis
    if (stats.paragraphCount < 3) {
      suggestions.push({
        type: 'warning',
        text: 'Nên chia nội dung thành nhiều đoạn văn hơn',
        icon: Warning
      });
    } else {
      suggestions.push({
        type: 'success',
        text: 'Cấu trúc đoạn văn tốt',
        icon: CheckCircle
      });
      score += 20;
    }

    setAnalysis({
      score: Math.min(score, 100),
      suggestions,
      stats
    });
  };

  const calculateKeywordDensity = (content, keyword) => {
    if (!keyword || !content) return 0;
    
    const words = content.toLowerCase().split(/\s+/);
    const keywordCount = words.filter(word => 
      word.includes(keyword.toLowerCase())
    ).length;
    
    return words.length > 0 ? (keywordCount / words.length) * 100 : 0;
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
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Phân tích SEO Real-time
            </Typography>
            <Chip 
              label={getScoreLabel(analysis.score)}
              sx={{ 
                background: getScoreColor(analysis.score),
                color: 'white',
                fontWeight: 'bold'
              }}
              size="small"
            />
          </Box>
          <IconButton size="small">
            {isExpanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </Box>

        {/* SEO Score Progress */}
        <Box sx={{ mt: 2, mb: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="body2" color="textSecondary">
              Điểm SEO
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: getScoreColor(analysis.score) }}>
              {analysis.score}/100
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={analysis.score}
            sx={{ 
              height: 8, 
              borderRadius: 4,
              backgroundColor: '#f0f0f0',
              '& .MuiLinearProgress-bar': {
                backgroundColor: getScoreColor(analysis.score),
                borderRadius: 4
              }
            }}
          />
        </Box>

        <Collapse in={isExpanded}>
          {/* Focus Keyword Input */}
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              size="small"
              label="Từ khóa chính (Focus Keyword)"
              value={localFocusKeyword}
              onChange={handleFocusKeywordChange}
              placeholder="vd: laptop gaming"
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
              }}
              helperText="Từ khóa chính mà bài viết muốn tối ưu"
            />
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* SEO Statistics */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
              Thống kê nội dung:
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
              <Typography variant="caption" color="textSecondary">
                Tiêu đề: {analysis.stats.titleLength} ký tự
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Từ: {analysis.stats.wordCount} từ
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Đoạn văn: {analysis.stats.paragraphCount}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Mật độ: {analysis.stats.keywordDensity?.toFixed(1)}%
              </Typography>
            </Box>
          </Box>

          {/* SEO Suggestions */}
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
              Gợi ý cải thiện:
            </Typography>
            <List dense sx={{ py: 0 }}>
              {analysis.suggestions.map((suggestion, index) => (
                <ListItem key={index} sx={{ px: 0, py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <suggestion.icon 
                      sx={{ 
                        fontSize: 16,
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
                      sx: { lineHeight: 1.4 }
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>

          {/* Quick Tips */}
          <Alert 
            severity="info" 
            sx={{ mt: 2 }}
            icon={<Lightbulb />}
          >
            <Typography variant="caption">
              <strong>Mẹo:</strong> Phân tích tự động cập nhật khi bạn nhập. 
              Điểm SEO ≥70 là tốt, 50-69 là trung bình.
            </Typography>
          </Alert>
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default SEORealtimeAnalyzer;
