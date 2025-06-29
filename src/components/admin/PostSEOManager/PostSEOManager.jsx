import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Tooltip,
  Alert,
  CircularProgress,
  TablePagination
} from '@mui/material';
import { Edit, Eye, TrendingUp, AlertCircle, CheckCircle, Search } from 'lucide-react';
import { postSEOAPI } from '../../../services/postSeoAPI';

const PostSEOManager = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);
  const [seoDialogOpen, setSeoDialogOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchPosts();
  }, [page, rowsPerPage, searchTerm]);

  const fetchPosts = async () => {
    setLoading(true);
    setMessage(''); // Clear previous messages
    try {
      console.log('=== DEBUG: Starting fetchPosts ===');
      console.log('Current token:', localStorage.getItem('token'));
      
      const params = {
        page: page + 1,
        limit: rowsPerPage,
        search: searchTerm
      };
      
      console.log('Fetching posts with params:', params);
      const response = await postSEOAPI.getPosts(params);
      console.log('API Response:', response);
      console.log('Response type:', typeof response);
      console.log('Response keys:', Object.keys(response || {}));
      
      if (response && response.data) {
        // Handle response structure from the API
        if (response.data.posts) {
          setPosts(response.data.posts);
          setTotalCount(response.data.pagination?.total || 0);
        } else if (Array.isArray(response.data)) {
          setPosts(response.data);
          setTotalCount(response.data.length);
        } else {
          setPosts([]);
          setTotalCount(0);
        }
        setMessage(''); // Clear error message on success
      } else if (response && response.posts) {
        // Direct response structure (no nested data)
        setPosts(response.posts);
        setTotalCount(response.pagination?.total || 0);
        setMessage(''); // Clear error message on success
      } else {
        console.warn('Unexpected response structure:', response);
        setPosts([]);
        setTotalCount(0);
        setMessage('Không có dữ liệu để hiển thị');
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      setPosts([]);
      setTotalCount(0);
      
      // More specific error messages
      if (error.response) {
        if (error.response.status === 401) {
          setMessage('Bạn cần đăng nhập để truy cập tính năng này');
        } else if (error.response.status === 403) {
          setMessage('Bạn không có quyền truy cập tính năng này');
        } else {
          setMessage(`Lỗi API: ${error.response.data?.message || error.response.statusText}`);
        }
      } else if (error.request) {
        setMessage('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.');
      } else {
        setMessage(`Có lỗi xảy ra: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const getSEOScoreColor = (score) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  const getSEOScoreIcon = (score) => {
    if (score >= 80) return <CheckCircle size={16} />;
    if (score >= 60) return <AlertCircle size={16} />;
    return <AlertCircle size={16} />;
  };

  const handleEditSEO = (post) => {
    setSelectedPost(post);
    setSeoDialogOpen(true);
  };

  const handleSaveSEO = async () => {
    try {
      setLoading(true);
      const response = await postSEOAPI.updatePostSEO(selectedPost.id, selectedPost);
      
      if (response.success) {
        setSeoDialogOpen(false);
        setMessage('Cập nhật SEO thành công!');
        fetchPosts(); // Refresh the list
      } else {
        setMessage('Có lỗi xảy ra khi cập nhật SEO');
      }
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error updating SEO:', error);
      setMessage('Có lỗi xảy ra khi cập nhật SEO');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeSEO = async (postId) => {
    try {
      setLoading(true);
      
      // Tìm post hiện tại để lấy focus keyword đã có (nếu có)
      const currentPost = posts.find(p => p.id === postId);
      const currentFocusKeyword = currentPost?.seoData?.focusKeyword || '';
      
      console.log('=== ANALYZE SEO DEBUG ===');
      console.log('Post ID:', postId);
      console.log('Current Focus Keyword:', currentFocusKeyword);
      
      // Hỏi người dùng có muốn thay đổi focus keyword không
      let newFocusKeyword = null;
      const userWantsToChangeFocus = window.confirm(
        `Focus keyword hiện tại: "${currentFocusKeyword || 'Chưa có'}"\n\nBạn có muốn thay đổi focus keyword trước khi phân tích không?\n\n• Nhấn OK để nhập focus keyword mới\n• Nhấn Cancel để giữ nguyên focus keyword hiện tại`
      );
      
      if (userWantsToChangeFocus) {
        newFocusKeyword = window.prompt(
          'Nhập focus keyword mới:', 
          currentFocusKeyword
        );
        
        // Nếu user nhấn Cancel trong prompt, giữ nguyên như ban đầu
        if (newFocusKeyword === null) {
          newFocusKeyword = undefined; // Không gửi focus keyword
        } else if (newFocusKeyword.trim() === '') {
          newFocusKeyword = ''; // Xóa focus keyword
        }
      }
      
      console.log('New Focus Keyword:', newFocusKeyword);
      
      // Gọi API phân tích SEO
      const response = newFocusKeyword !== undefined 
        ? await postSEOAPI.analyzePostSEO(postId, newFocusKeyword)
        : await postSEOAPI.analyzePostSEO(postId);
      
      if (response.success) {
        setMessage('Phân tích SEO hoàn thành!');
        fetchPosts(); // Refresh the list
      } else {
        setMessage('Có lỗi xảy ra khi phân tích SEO');
      }
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error analyzing SEO:', error);
      setMessage('Có lỗi xảy ra khi phân tích SEO');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Quản lý SEO bài viết
        </Typography>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      p: 0
    }}>
      {/* Header Section */}
      <Box sx={{ 
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
        p: 3,
        mb: 3
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Box sx={{ 
            p: 1.5, 
            borderRadius: 2, 
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            color: 'white'
          }}>
            <TrendingUp size={24} />
          </Box>
          <Box>
            <Typography variant="h4" sx={{ 
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 0.5
            }}>
              Quản lý SEO bài viết
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Tối ưu hóa SEO và theo dõi hiệu suất cho từng bài viết
            </Typography>
          </Box>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #4CAF50, #45a049)',
              color: 'white',
              boxShadow: '0 8px 32px rgba(76, 175, 80, 0.3)'
            }}>
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {posts.length}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Tổng bài viết
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #2196F3, #1976D2)',
              color: 'white',
              boxShadow: '0 8px 32px rgba(33, 150, 243, 0.3)'
            }}>
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {posts.filter(p => p.seoData?.seoScore >= 70).length}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  SEO tốt (≥70)
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #FF9800, #F57C00)',
              color: 'white',
              boxShadow: '0 8px 32px rgba(255, 152, 0, 0.3)'
            }}>
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {posts.filter(p => p.seoData?.seoScore >= 50 && p.seoData?.seoScore < 70).length}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  SEO trung bình
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #f44336, #d32f2f)',
              color: 'white',
              boxShadow: '0 8px 32px rgba(244, 67, 54, 0.3)'
            }}>
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {posts.filter(p => !p.seoData?.seoScore || p.seoData?.seoScore < 50).length}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Cần cải thiện
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ px: 3, pb: 3 }}>
        {message && (
          <Alert 
            severity={message.includes('thành công') ? 'success' : 'error'} 
            sx={{ 
              mb: 3,
              borderRadius: 2,
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }}
          >
            {message}
          </Alert>
        )}

        {/* Search and Actions */}
        <Card sx={{ 
          mb: 3, 
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)'
        }}>
          <CardContent sx={{ p: 3 }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  placeholder="Tìm kiếm bài viết..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      background: 'rgba(255, 255, 255, 0.8)',
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.9)',
                      },
                      '&.Mui-focused': {
                        background: 'white',
                      }
                    }
                  }}
                  InputProps={{
                    startAdornment: <Search size={20} style={{ marginRight: 8, color: '#666' }} />
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button 
                    variant="contained" 
                    startIcon={<TrendingUp />}
                    sx={{
                      background: 'linear-gradient(135deg, #667eea, #764ba2)',
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 'bold',
                      boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)',
                      '&:hover': {
                        boxShadow: '0 6px 25px rgba(102, 126, 234, 0.6)',
                      }
                    }}
                  >
                    Phân tích tất cả
                  </Button>
                  <Button 
                    variant="outlined"
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 'bold',
                      borderColor: '#667eea',
                      color: '#667eea',
                      '&:hover': {
                        borderColor: '#764ba2',
                        color: '#764ba2',
                        background: 'rgba(102, 126, 234, 0.05)'
                      }
                    }}
                  >
                    Xuất báo cáo
                </Button>
              </Box>
            </Grid>
          </CardContent>
        </Card>

        {/* Posts Table */}
        <Card sx={{ 
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          overflow: 'hidden'
        }}>
          <CardContent sx={{ p: 0 }}>
            <TableContainer component={Paper} sx={{ 
              boxShadow: 'none',
              background: 'transparent'
            }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    '& th': { 
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '0.9rem',
                      py: 2,
                      borderBottom: 'none'
                    }
                  }}>
                    <TableCell>TIÊU ĐỀ</TableCell>
                    <TableCell align="center">ĐIỂM SEO</TableCell>
                    <TableCell align="center">ĐIỂM ĐỌC</TableCell>
                    <TableCell align="center">TỪ KHÓA CHÍNH</TableCell>
                    <TableCell align="center">PHÂN TÍCH LẦN CUỐI</TableCell>
                    <TableCell align="center">TRẠNG THÁI</TableCell>
                    <TableCell align="center">HÀNH ĐỘNG</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {posts.map((post) => (
                    <TableRow 
                      key={post.id}
                      sx={{ 
                        '&:nth-of-type(odd)': { 
                          backgroundColor: 'rgba(102, 126, 234, 0.02)' 
                        },
                        '&:hover': { 
                          backgroundColor: 'rgba(102, 126, 234, 0.05)',
                          transform: 'translateY(-1px)',
                          transition: 'all 0.2s ease'
                        },
                        '& td': {
                          borderBottom: '1px solid rgba(102, 126, 234, 0.1)',
                          py: 2
                        }
                      }}
                    >
                      <TableCell>
                        <Box>
                          <Typography variant="subtitle2" sx={{ 
                            fontWeight: 'bold',
                            color: '#2c3e50',
                            mb: 0.5
                          }}>
                            {post.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ID: {post.id} • Slug: {post.slug}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                          <Box sx={{ 
                            width: 50, 
                            height: 50, 
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: post.seoData?.seoScore >= 70 
                              ? 'linear-gradient(135deg, #4CAF50, #45a049)'
                              : post.seoData?.seoScore >= 50 
                              ? 'linear-gradient(135deg, #FF9800, #F57C00)'
                              : 'linear-gradient(135deg, #f44336, #d32f2f)',
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '0.85rem',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                          }}>
                            {post.seoData?.seoScore || 0}
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                          <Box sx={{ 
                            width: 50, 
                            height: 50, 
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: post.seoData?.readabilityScore >= 70 
                              ? 'linear-gradient(135deg, #2196F3, #1976D2)'
                              : post.seoData?.readabilityScore >= 50 
                              ? 'linear-gradient(135deg, #FF9800, #F57C00)'
                              : 'linear-gradient(135deg, #9E9E9E, #757575)',
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '0.85rem',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                          }}>
                            {post.seoData?.readabilityScore || 0}
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={post.seoData?.focusKeyword || 'Chưa có'}
                          size="small"
                          sx={{
                            background: post.seoData?.focusKeyword 
                              ? 'linear-gradient(135deg, #667eea, #764ba2)'
                              : '#e0e0e0',
                            color: post.seoData?.focusKeyword ? 'white' : '#666',
                            fontWeight: 'bold',
                            borderRadius: 2
                          }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        {post.seoData?.updatedAt ? (
                          <Typography variant="caption" sx={{ 
                            color: '#666',
                            background: 'rgba(102, 126, 234, 0.1)',
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 1,
                            fontWeight: 'medium'
                          }}>
                            {new Date(post.seoData.updatedAt).toLocaleDateString('vi-VN')}
                          </Typography>
                        ) : (
                          <Typography variant="caption" color="text.secondary">
                            Chưa phân tích
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={post.status === 1 ? 'Đã xuất bản' : 'Nháp'}
                          color={post.status === 1 ? 'success' : 'default'}
                          size="small"
                          sx={{ 
                            fontWeight: 'bold',
                            borderRadius: 2
                          }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                          <Tooltip title="Chỉnh sửa SEO">
                            <IconButton
                              size="small"
                              onClick={() => handleEditSEO(post)}
                              sx={{ 
                                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                                color: 'white',
                                '&:hover': {
                                  background: 'linear-gradient(135deg, #764ba2, #667eea)',
                                  transform: 'scale(1.1)'
                                }
                              }}
                            >
                              <Edit size={16} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Xem bài viết">
                            <IconButton 
                              size="small"
                              sx={{ 
                                background: 'linear-gradient(135deg, #2196F3, #1976D2)',
                                color: 'white',
                                '&:hover': {
                                  background: 'linear-gradient(135deg, #1976D2, #2196F3)',
                                  transform: 'scale(1.1)'
                                }
                              }}
                            >
                              <Eye size={16} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Phân tích SEO">
                            <IconButton
                              size="small"
                              onClick={() => handleAnalyzeSEO(post.id)}
                              sx={{ 
                                background: 'linear-gradient(135deg, #4CAF50, #45a049)',
                                color: 'white',
                                '&:hover': {
                                  background: 'linear-gradient(135deg, #45a049, #4CAF50)',
                                  transform: 'scale(1.1)'
                                }
                              }}
                            >
                              <TrendingUp size={16} />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Tiêu đề</TableCell>
                  <TableCell>Điểm SEO</TableCell>
                  <TableCell>Điểm đọc</TableCell>
                  <TableCell>Từ khóa chính</TableCell>
                  <TableCell>Phân tích lần cuối</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell>Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredPosts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell>
                      <Box>
                        <Typography variant="subtitle2" noWrap sx={{ maxWidth: 200 }}>
                          {post.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          /{post.slug}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getSEOScoreIcon(post.seoData?.seoScore || 0)}
                        <Chip
                          label={`${post.seoData?.seoScore || 0}/100`}
                          color={getSEOScoreColor(post.seoData?.seoScore || 0)}
                          size="small"
                        />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={`${post.seoData?.readabilityScore || 0}/100`}
                        color={getSEOScoreColor(post.seoData?.readabilityScore || 0)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {post.seoData?.focusKeyword ? (
                        <Chip label={post.seoData.focusKeyword} size="small" variant="outlined" />
                      ) : (
                        <Typography variant="caption" color="text.secondary">
                          Chưa có
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {post.seoData?.lastAnalyzed ? (
                        <Typography variant="caption">
                          {new Date(post.seoData.lastAnalyzed).toLocaleDateString('vi-VN')}
                        </Typography>
                      ) : (
                        <Typography variant="caption" color="text.secondary">
                          Chưa phân tích
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={post.status === 'published' ? 'Đã xuất bản' : 'Nháp'}
                        color={post.status === 'published' ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Chỉnh sửa SEO">
                          <IconButton
                            size="small"
                            onClick={() => handleEditSEO(post)}
                          >
                            <Edit size={16} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Xem bài viết">
                          <IconButton size="small">
                            <Eye size={16} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Phân tích SEO">
                          <IconButton
                            size="small"
                            onClick={() => handleAnalyzeSEO(post.id)}
                          >
                            <TrendingUp size={16} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          <TablePagination
            component="div"
            count={totalCount}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50]}
            labelRowsPerPage="Số hàng mỗi trang:"
            labelDisplayedRows={({ from, to, count }) => 
              `${from}-${to} trong tổng số ${count !== -1 ? count : `hơn ${to}`}`
            }
          />
        </CardContent>
      </Card>

      {/* SEO Edit Dialog */}
      <Dialog open={seoDialogOpen} onClose={() => setSeoDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Chỉnh sửa SEO: {selectedPost?.title}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tiêu đề SEO"
                defaultValue={selectedPost?.title}
                helperText="Độ dài khuyến nghị: 50-60 ký tự"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Mô tả SEO"
                defaultValue={selectedPost?.metaDescription}
                helperText="Độ dài khuyến nghị: 150-160 ký tự"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Từ khóa chính"
                defaultValue={selectedPost?.focusKeyword}
                helperText="Từ khóa mà bạn muốn tối ưu hóa cho bài viết này"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSeoDialogOpen(false)}>
            Hủy
          </Button>
          <Button variant="contained" onClick={handleSaveSEO}>
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PostSEOManager;
