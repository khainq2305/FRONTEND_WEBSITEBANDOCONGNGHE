import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Alert,
  Divider
} from '@mui/material';
import { CheckCircle, AlertCircle, XCircle, TrendingUp } from 'lucide-react';

// SEO Edit Dialog
export const SEOEditDialog = ({ 
  open, 
  onClose, 
  selectedPost, 
  onSave, 
  onChange,
  saving = false 
}) => {
  if (!selectedPost) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 3,
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
        }
      }}
    >
      <DialogTitle sx={{ 
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        color: 'white',
        textAlign: 'center',
        py: 3
      }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
          Chỉnh sửa SEO
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9 }}>
          {selectedPost.title}
        </Typography>
      </DialogTitle>
      
      <DialogContent sx={{ p: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="SEO Title"
              value={selectedPost.seoData?.title || ''}
              onChange={(e) => onChange('title', e.target.value)}
              placeholder="Nhập tiêu đề SEO..."
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Độ dài tốt nhất: 50-60 ký tự (hiện tại: {(selectedPost.seoData?.title || '').length} ký tự)
            </Typography>
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Meta Description"
              value={selectedPost.seoData?.metaDescription || ''}
              onChange={(e) => onChange('metaDescription', e.target.value)}
              placeholder="Nhập mô tả meta..."
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Độ dài tốt nhất: 150-160 ký tự (hiện tại: {(selectedPost.seoData?.metaDescription || '').length} ký tự)
            </Typography>
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Focus Keyword"
              value={selectedPost.seoData?.focusKeyword || ''}
              onChange={(e) => onChange('focusKeyword', e.target.value)}
              placeholder="Nhập từ khóa chính..."
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Từ khóa chính mà bạn muốn tối ưu cho bài viết này
            </Typography>
          </Grid>

          {selectedPost.seoData && (
            <Grid item xs={12}>
              <Card sx={{ 
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))',
                border: '1px solid rgba(102, 126, 234, 0.2)'
              }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, color: '#667eea' }}>
                    Thông tin SEO hiện tại
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" sx={{ 
                          color: selectedPost.seoData.seoScore >= 70 ? '#4CAF50' : 
                                 selectedPost.seoData.seoScore >= 50 ? '#FF9800' : '#f44336',
                          fontWeight: 'bold'
                        }}>
                          {selectedPost.seoData.seoScore || 0}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          SEO Score
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" sx={{ 
                          color: selectedPost.seoData.readabilityScore >= 70 ? '#2196F3' : 
                                 selectedPost.seoData.readabilityScore >= 50 ? '#FF9800' : '#9E9E9E',
                          fontWeight: 'bold'
                        }}>
                          {selectedPost.seoData.readabilityScore || 0}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Readability Score
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      
      <DialogActions sx={{ p: 3, gap: 2 }}>
        <Button 
          onClick={onClose}
          sx={{ 
            borderRadius: 2,
            px: 3
          }}
        >
          Hủy
        </Button>
        <Button 
          onClick={onSave}
          variant="contained"
          disabled={saving}
          sx={{ 
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            borderRadius: 2,
            px: 3,
            '&:hover': {
              background: 'linear-gradient(135deg, #764ba2, #667eea)'
            }
          }}
        >
          {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// SEO Analysis Dialog
export const SEOAnalysisDialog = ({ 
  open, 
  onClose, 
  analysisResult 
}) => {
  if (!analysisResult) return null;

  const getStatusIcon = (status) => {
    switch (status) {
      case 'good':
        return <CheckCircle size={16} color="#4CAF50" />;
      case 'warning':
        return <AlertCircle size={16} color="#FF9800" />;
      case 'error':
        return <XCircle size={16} color="#f44336" />;
      default:
        return <AlertCircle size={16} color="#9E9E9E" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'good':
        return '#4CAF50';
      case 'warning':
        return '#FF9800';
      case 'error':
        return '#f44336';
      default:
        return '#9E9E9E';
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 3,
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle sx={{ 
        background: 'linear-gradient(135deg, #4CAF50, #45a049)',
        color: 'white',
        textAlign: 'center',
        py: 3
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
          <TrendingUp size={28} />
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            Kết quả phân tích SEO
          </Typography>
        </Box>
      </DialogTitle>
      
      <DialogContent sx={{ p: 0 }}>
        {/* Score Overview */}
        <Box sx={{ p: 4, background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.1), rgba(69, 160, 73, 0.1))' }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card sx={{ textAlign: 'center', p: 3 }}>
                <Typography variant="h3" sx={{ 
                  color: analysisResult.seoScore >= 70 ? '#4CAF50' : 
                         analysisResult.seoScore >= 50 ? '#FF9800' : '#f44336',
                  fontWeight: 'bold',
                  mb: 1
                }}>
                  {analysisResult.seoScore}
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  SEO Score
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={analysisResult.seoScore} 
                  sx={{ 
                    mt: 2, 
                    height: 8, 
                    borderRadius: 4,
                    backgroundColor: '#e0e0e0',
                    '& .MuiLinearProgress-bar': {
                      background: analysisResult.seoScore >= 70 ? 
                        'linear-gradient(135deg, #4CAF50, #45a049)' : 
                        analysisResult.seoScore >= 50 ? 
                        'linear-gradient(135deg, #FF9800, #F57C00)' : 
                        'linear-gradient(135deg, #f44336, #d32f2f)'
                    }
                  }} 
                />
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ textAlign: 'center', p: 3 }}>
                <Typography variant="h3" sx={{ 
                  color: analysisResult.readabilityScore >= 70 ? '#2196F3' : 
                         analysisResult.readabilityScore >= 50 ? '#FF9800' : '#9E9E9E',
                  fontWeight: 'bold',
                  mb: 1
                }}>
                  {analysisResult.readabilityScore}
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  Readability
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={analysisResult.readabilityScore} 
                  sx={{ 
                    mt: 2, 
                    height: 8, 
                    borderRadius: 4,
                    backgroundColor: '#e0e0e0',
                    '& .MuiLinearProgress-bar': {
                      background: 'linear-gradient(135deg, #2196F3, #1976D2)'
                    }
                  }} 
                />
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ textAlign: 'center', p: 3 }}>
                <Typography variant="h3" sx={{ 
                  color: getStatusColor(analysisResult.keywordsDensity?.status),
                  fontWeight: 'bold',
                  mb: 1
                }}>
                  {analysisResult.keywordsDensity?.density || 0}%
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  Keyword Density
                </Typography>
                <Chip 
                  label={analysisResult.keywordsDensity?.focusKeyword || 'Chưa có'}
                  size="small"
                  sx={{ 
                    mt: 1,
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    color: 'white'
                  }}
                />
              </Card>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ p: 4 }}>
          <Grid container spacing={3}>
            {/* Issues */}
            {analysisResult.details?.issues && analysisResult.details.issues.length > 0 && (
              <Grid item xs={12} md={6}>
                <Card sx={{ h: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2, color: '#f44336', display: 'flex', alignItems: 'center', gap: 1 }}>
                      <XCircle size={20} />
                      Vấn đề cần khắc phục ({analysisResult.details.issues.length})
                    </Typography>
                    <Box sx={{ maxHeight: 300, overflowY: 'auto' }}>
                      {analysisResult.details.issues.map((issue, index) => (
                        <Alert 
                          key={index} 
                          severity="error" 
                          sx={{ mb: 1, borderRadius: 2 }}
                        >
                          {issue}
                        </Alert>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            )}

            {/* Recommendations */}
            {analysisResult.details?.recommendations && analysisResult.details.recommendations.length > 0 && (
              <Grid item xs={12} md={6}>
                <Card sx={{ h: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2, color: '#4CAF50', display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CheckCircle size={20} />
                      Gợi ý cải thiện ({analysisResult.details.recommendations.length})
                    </Typography>
                    <Box sx={{ maxHeight: 300, overflowY: 'auto' }}>
                      {analysisResult.details.recommendations.map((rec, index) => (
                        <Alert 
                          key={index} 
                          severity="success" 
                          sx={{ mb: 1, borderRadius: 2 }}
                        >
                          {rec}
                        </Alert>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            )}

            {/* Keyword Analysis */}
            {analysisResult.keywordsDensity && (
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2, color: '#667eea' }}>
                      Phân tích từ khóa chi tiết
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={3}>
                        <Box sx={{ textAlign: 'center', p: 2, background: '#f5f5f5', borderRadius: 2 }}>
                          <Typography variant="h4" sx={{ color: getStatusColor(analysisResult.keywordsDensity.status) }}>
                            {analysisResult.keywordsDensity.count}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Số lần xuất hiện
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Box sx={{ textAlign: 'center', p: 2, background: '#f5f5f5', borderRadius: 2 }}>
                          <Typography variant="h4" sx={{ color: '#2196F3' }}>
                            {analysisResult.keywordsDensity.totalWords}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Tổng số từ
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Box sx={{ p: 2, background: '#f5f5f5', borderRadius: 2 }}>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            Gợi ý:
                          </Typography>
                          <Typography variant="body2">
                            {analysisResult.keywordsDensity.recommendation}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Grid>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ p: 3 }}>
        <Button 
          onClick={onClose}
          variant="contained"
          sx={{ 
            background: 'linear-gradient(135deg, #4CAF50, #45a049)',
            borderRadius: 2,
            px: 4,
            '&:hover': {
              background: 'linear-gradient(135deg, #45a049, #4CAF50)'
            }
          }}
        >
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};
