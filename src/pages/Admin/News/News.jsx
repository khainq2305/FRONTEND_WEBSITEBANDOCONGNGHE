import { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Grid, Alert, LinearProgress } from '@mui/material';
import Top from '@/pages/Admin/News/components/sidebar/Top';
import ArticleFilters from '@/pages/Admin/News/components/filter/ArticleFilters';
import ArticleTable from '@/pages/Admin/News/components/table/ArticleTable';
import BasicModal from '@/pages/Admin/News/components/modal/Modal';
import { SEOEditDialog, SEOAnalysisDialog } from '@/components/Admin/SEO/SEODialogs';
import SEOQuickTips from '@/components/Admin/SEO/SEOQuickTips';
import { newsService } from '@/services/admin/postService';
import { postSEOAPI } from '@/services/postSeoAPI';
import { toast } from 'react-toastify';
import MUIPagination from '@/components/common/Pagination';
import { confirmDelete } from '@/components/common/ConfirmDeleteDialog'; 
import { useParams } from 'react-router';
const News = () => {
  const { slug } = useParams()
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    category: '',
    action: '',
    seoScore: ''
  });
  const [articles, setArticles] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [modalItem, setModalItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('all');
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(10); //
  const [counts, setCounts] = useState({
    all: 0,
    published: 0,
    draft: 0,
    trash: 0
  });
  
  // SEO States
  const [selectedPost, setSelectedPost] = useState(null);
  const [seoDialogOpen, setSeoDialogOpen] = useState(false);
  const [analysisDialogOpen, setAnalysisDialogOpen] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [seoMessage, setSeoMessage] = useState('');
  const [seoLoading, setSeoLoading] = useState(false);
  const [bulkProgress, setBulkProgress] = useState({ current: 0, total: 0, message: '' });

  const loadArticles = async () => {
    const { search, category, status } = filters;

    const params = {
      search: search || undefined,
      categoryId: category || undefined,
      status: status || undefined,
      page: currentPage,
      limit: pageSize
    };

    try {
      const res = await newsService.getAll(params);
      
      // Lấy thông tin SEO cho từng bài viết
      const articlesWithSEO = await Promise.all(
        res.data.data.map(async (article) => {
          try {
            const seoRes = await postSEOAPI.getPostSEOByPostId(article.id);
            return {
              ...article,
              seoData: seoRes.success ? seoRes.data : null
            };
          } catch (error) {
            console.log(`SEO data not found for post ${article.id}`);
            return {
              ...article,
              seoData: null
            };
          }
        })
      );
      
      // Apply SEO filter on frontend if needed
      const finalArticles = filters.seoScore ? applyClientSideFilters(articlesWithSEO) : articlesWithSEO;
      
      setArticles(finalArticles);
      setTotal(res.data.total);
      setCounts(res.data.counts);
    } catch (error) {
      console.error('Error loading articles:', error);
      toast.error('Lỗi khi tải danh sách bài viết');
    }
  };

  // Apply client-side filters for SEO
  const applyClientSideFilters = (articles) => {
    let filtered = articles;
    
    if (filters.seoScore) {
      filtered = articles.filter(article => {
        const seoScore = article.seoData?.seoScore || 0;
        
        switch (filters.seoScore) {
          case 'good':
            return seoScore >= 70;
          case 'average':
            return seoScore >= 50 && seoScore < 70;
          case 'poor':
            return seoScore < 50 && seoScore > 0;
          case 'no-seo':
            return !article.seoData || seoScore === 0;
          default:
            return true;
        }
      });
    }
    
    return filtered;
  };

  useEffect(() => {
    loadArticles().catch(console.error);
  }, [filters, currentPage]);

  const handleTabClick = (statusValue) => {
    setFilters(prev => ({
      ...prev,
      status: statusValue === 'all' ? '' : statusValue.toString()
    }));
    setActiveTab(statusValue);
    setCurrentPage(1);
  };

  const handleSelectRow = (slug) => {
    setSelectedRows(prev =>
      prev.includes(slug) ? prev.filter(x => x !== slug) : [...prev, slug]
    );
  };

  const handleSelectAll = () => {
    setSelectedRows(
      selectedRows.length === articles.length ? [] : articles.map(item => item.slug)
    );
  };

  const handleAction = async () => {
    try {
      let res;
      switch (filters.action) {
        case 'restore':
          res = await newsService.restorePost(selectedRows);
          break;
        case 'trash':
          res = await newsService.trashPost(selectedRows);
          break;
        case 'forceDelete':
          res = await newsService.forceDelete(selectedRows);
          break;
        case 'bulkAnalyzeSEO':
          await handleBulkAnalyzeSEO();
          return;
        case 'createSEO':
          await handleCreateSEOForAll();
          return;
        default:
          return;
      }
      toast.success(res.data.message || 'Thao tác thành công');
      await loadArticles();
      setSelectedRows([]);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Đã xảy ra lỗi');
    }
  };

  // Bulk SEO Analysis - Improved version with fallback
  const handleBulkAnalyzeSEO = async () => {
    try {
      setSeoLoading(true);
      const selectedArticles = articles.filter(a => selectedRows.includes(a.slug));
      
      if (selectedArticles.length === 0) {
        toast.warning('Vui lòng chọn ít nhất một bài viết');
        return;
      }
      
      const postIds = selectedArticles.map(a => a.id);
      
      const focusKeyword = window.prompt('Nhập focus keyword cho tất cả bài viết (để trống nếu giữ nguyên từ khóa hiện tại):');
      if (focusKeyword === null) return; // User cancelled
      
      setBulkProgress({ current: 0, total: postIds.length, message: 'Bắt đầu phân tích SEO...' });
      toast.info(`Đang phân tích SEO cho ${postIds.length} bài viết...`);
      
      let successCount = 0;
      let errorCount = 0;
      
      try {
        // Thử sử dụng bulk API trước
        setBulkProgress({ current: 1, total: postIds.length, message: 'Đang phân tích hàng loạt...' });
        
        const response = await postSEOAPI.bulkAnalyzePosts(postIds, focusKeyword);
        
        if (response.success && response.data?.summary) {
          successCount = response.data.summary.success;
          errorCount = response.data.summary.error;
          
          setBulkProgress({ current: postIds.length, total: postIds.length, message: 'Hoàn thành phân tích hàng loạt!' });
        } else {
          throw new Error('Bulk API response không đúng format');
        }
      } catch (bulkError) {
        console.log('Bulk API failed, falling back to individual calls:', bulkError);
        toast.info('Đang chuyển sang phân tích từng bài viết...');
        
        // Fallback: Phân tích từng bài viết
        successCount = 0;
        errorCount = 0;
        
        for (let i = 0; i < postIds.length; i++) {
          try {
            const postId = postIds[i];
            const articleTitle = selectedArticles[i].title;
            
            setBulkProgress({ 
              current: i + 1, 
              total: postIds.length, 
              message: `Đang phân tích: ${articleTitle}` 
            });
            
            const response = await postSEOAPI.analyzePostSEO(postId, focusKeyword);
            
            if (response.success) {
              successCount++;
            } else {
              errorCount++;
            }
            
            // Thêm delay nhỏ giữa các request để tránh quá tải
            if (i < postIds.length - 1) {
              await new Promise(resolve => setTimeout(resolve, 500));
            }
          } catch (error) {
            errorCount++;
            console.error(`Error analyzing post ${postIds[i]}:`, error);
          }
        }
      }
      
      setBulkProgress({ current: 0, total: 0, message: '' });
      
      if (successCount > 0) {
        toast.success(`Đã phân tích SEO cho ${successCount}/${postIds.length} bài viết!`);
        await loadArticles();
        setSelectedRows([]);
      }
      
      if (errorCount > 0) {
        toast.warning(`${errorCount} bài viết không thể phân tích SEO`);
      }
      
      if (successCount === 0 && errorCount === 0) {
        toast.error('Không thể phân tích SEO cho bất kỳ bài viết nào');
      }
      
    } catch (error) {
      console.error('Bulk analyze SEO error:', error);
      toast.error(`Lỗi phân tích SEO: ${error.message}`);
      setBulkProgress({ current: 0, total: 0, message: '' });
    } finally {
      setSeoLoading(false);
    }
  };

  // Create SEO for all posts - Improved version
  const handleCreateSEOForAll = async () => {
    try {
      setSeoLoading(true);
      const selectedArticles = articles.filter(a => selectedRows.includes(a.slug));
      
      if (selectedArticles.length === 0) {
        toast.warning('Vui lòng chọn ít nhất một bài viết');
        return;
      }
      
      // Lọc chỉ những bài viết chưa có SEO data
      const articlesWithoutSEO = selectedArticles.filter(article => !article.seoData);
      
      if (articlesWithoutSEO.length === 0) {
        toast.info('Tất cả bài viết đã chọn đều có SEO data');
        return;
      }
      
      toast.info(`Đang tạo SEO data cho ${articlesWithoutSEO.length} bài viết...`);
      
      // Tạo SEO data cho các bài viết chưa có
      let createdCount = 0;
      let errorCount = 0;
      
      for (let i = 0; i < articlesWithoutSEO.length; i++) {
        try {
          const article = articlesWithoutSEO[i];
          
          console.log(`Creating SEO for post ${i + 1}/${articlesWithoutSEO.length}: ${article.title}`);
          
          const createRes = await postSEOAPI.createPostSEO({
            postId: article.id,
            title: article.title,
            metaDescription: '',
            focusKeyword: ''
          });
          
          if (createRes.success) {
            createdCount++;
            console.log(`✓ Created SEO for: ${article.title}`);
          } else {
            errorCount++;
            console.log(`✗ Failed to create SEO for: ${article.title} - ${createRes.message}`);
          }
          
          // Thêm delay nhỏ giữa các request
          if (i < articlesWithoutSEO.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 300));
          }
        } catch (error) {
          errorCount++;
          console.error(`Failed to create SEO for post ${articlesWithoutSEO[i].id}:`, error);
        }
      }
      
      if (createdCount > 0) {
        toast.success(`Đã tạo SEO data cho ${createdCount}/${articlesWithoutSEO.length} bài viết!`);
        await loadArticles();
        setSelectedRows([]);
      }
      
      if (errorCount > 0) {
        toast.warning(`${errorCount} bài viết không thể tạo SEO data`);
      }
      
    } catch (error) {
      console.error('Create SEO for all error:', error);
      toast.error(`Lỗi tạo SEO: ${error.message}`);
    } finally {
      setSeoLoading(false);
    }
  };

  const handleSoftDelete = async (article) => {
    try {
      const res = await newsService.trashPost([article.slug]);
      toast.success(res.data.message || 'Đã đưa vào thùng rác');
      await loadArticles();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Xoá mềm thất bại');
    }
  };

  const handleRestore = async (slug) => {
    try {
      const res = await newsService.restorePost([slug]);
      toast.success(res.data.message || 'Đã khôi phục');
      await loadArticles();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Khôi phục thất bại');
    }
  };

  const handleForceDelete = async (slug) => {
  const confirmed = await confirmDelete('bài viết này');
  if (!confirmed) return;

  try {
    const res = await newsService.forceDelete([slug]);
    toast.success(res.data.message || 'Đã xoá vĩnh viễn');
    await loadArticles();
  } catch (err) {
    toast.error(err?.response?.data?.message || 'Xóa thất bại');
  }
};

  const getActionOptions = () => {
    if (filters.status === 'trash') {
      return [
        { value: 'restore', label: 'Khôi phục đã chọn' },
        { value: 'forceDelete', label: 'Xoá vĩnh viễn' }
      ];
    } else {
      return [
        { value: 'trash', label: 'Xoá đã chọn' },
        { value: 'bulkAnalyzeSEO', label: 'Phân tích SEO hàng loạt' },
        { value: 'createSEO', label: 'Tạo SEO cho tất cả' }
      ];
    }
  };

  // Calculate SEO stats
  const seoStats = {
    total: articles.length,
    good: articles.filter(a => a.seoData?.seoScore >= 70).length,
    average: articles.filter(a => a.seoData?.seoScore >= 50 && a.seoData?.seoScore < 70).length,
    needsImprovement: articles.filter(a => !a.seoData?.seoScore || a.seoData?.seoScore < 50).length
  };

  // SEO Handlers
  const handleEditSEO = async (post) => {
    try {
      // Kiểm tra xem bài viết đã có SEO data chưa
      let seoData = post.seoData;
      
      if (!seoData) {
        // Tạo SEO data mới nếu chưa có
        const createRes = await postSEOAPI.createPostSEO({
          postId: post.id,
          title: post.title,
          metaDescription: '',
          focusKeyword: ''
        });
        
        if (createRes.success) {
          seoData = createRes.data;
          // Refresh articles để cập nhật SEO data mới
          await loadArticles();
        }
      }
      
      setSelectedPost({
        ...post,
        seoData: seoData
      });
      setSeoDialogOpen(true);
    } catch (error) {
      console.error('Error preparing SEO edit:', error);
      toast.error('Không thể mở trình chỉnh sửa SEO');
    }
  };

  const handleSEOChange = (field, value) => {
    setSelectedPost(prev => ({
      ...prev,
      seoData: {
        ...prev.seoData,
        [field]: value
      }
    }));
  };

  const handleSaveSEO = async () => {
    try {
      setSeoLoading(true);
      
      const postSeoId = selectedPost.seoData?.id;
      if (!postSeoId) {
        setSeoMessage('Không tìm thấy thông tin SEO để cập nhật');
        return;
      }
      
      const seoUpdateData = {
        title: selectedPost.seoData?.title || '',
        metaDescription: selectedPost.seoData?.metaDescription || '',
        focusKeyword: selectedPost.seoData?.focusKeyword || ''
      };
      
      const response = await postSEOAPI.updatePostSEO(postSeoId, seoUpdateData);
      
      if (response.success) {
        setSeoDialogOpen(false);
        setSeoMessage('Cập nhật SEO thành công!');
        toast.success('Cập nhật SEO thành công!');
        await loadArticles(); // Refresh để hiển thị thay đổi
      } else {
        setSeoMessage('Có lỗi xảy ra khi cập nhật SEO');
        toast.error('Có lỗi xảy ra khi cập nhật SEO');
      }
    } catch (error) {
      console.error('Error saving SEO:', error);
      setSeoMessage(`Có lỗi xảy ra khi cập nhật SEO: ${error.message}`);
      toast.error(`Có lỗi xảy ra: ${error.message}`);
    } finally {
      setSeoLoading(false);
      setTimeout(() => setSeoMessage(''), 3000);
    }
  };

  const handleAnalyzeSEO = async (postId) => {
    try {
      setSeoLoading(true);
      
      // Tìm post hiện tại để lấy focus keyword đã có (nếu có)
      const currentPost = articles.find(p => p.id === postId);
      const currentFocusKeyword = currentPost?.seoData?.focusKeyword || '';
      
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
      
      // Gọi API phân tích SEO
      const response = newFocusKeyword !== undefined 
        ? await postSEOAPI.analyzePostSEO(postId, newFocusKeyword)
        : await postSEOAPI.analyzePostSEO(postId);
      
      if (response.success) {
        setSeoMessage('Phân tích SEO hoàn thành!');
        toast.success('Phân tích SEO hoàn thành!');
        setAnalysisResult(response.data.analysis);
        setAnalysisDialogOpen(true);
        await loadArticles(); // Refresh the list
      } else {
        setSeoMessage('Có lỗi xảy ra khi phân tích SEO');
        toast.error('Có lỗi xảy ra khi phân tích SEO');
      }
    } catch (error) {
      console.error('Error analyzing SEO:', error);
      setSeoMessage(`Lỗi phân tích SEO: ${error.message}`);
      toast.error(`Lỗi phân tích SEO: ${error.message}`);
    } finally {
      setSeoLoading(false);
      setTimeout(() => setSeoMessage(''), 3000);
    }
  };

  const handleEditSlug = async (postId, newSlug) => {
    try {
      const result = await newsService.updatePostSlug(postId, newSlug);
      
      // Bây giờ result đã là response.data từ service
      if (result.success) {
        toast.success(result.message || 'Cập nhật slug thành công!');
        await loadArticles(); // Refresh the list
      } else {
        throw new Error(result.message || 'Có lỗi xảy ra khi cập nhật slug');
      }
    } catch (error) {
      console.error('Error updating slug:', error);
      
      // Xử lý lỗi từ server
      if (error.response && error.response.data) {
        const errorMessage = error.response.data.message || 'Có lỗi xảy ra khi cập nhật slug';
        toast.error(`Lỗi cập nhật slug: ${errorMessage}`);
        throw new Error(errorMessage);
      } else {
        toast.error(`Lỗi cập nhật slug: ${error.message}`);
        throw error; // Re-throw để dialog xử lý
      }
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div className="space-y-4">
        <Top
          title="Tất cả bài viết"
          tabs={[
            { label: 'Tất cả', value: 'all' },
            { label: 'Đã xuất bản', value: 'published' },
            { label: 'Bản nháp', value: 'draft' },
            { label: 'Thùng rác', value: 'trash' }
          ]}
          activeTab={activeTab}
          onTabChange={handleTabClick}
          counts={counts}
          to="/admin/them-bai-viet-moi" 
          label="Thêm bài viết"
        />

        {/* SEO Stats Cards */}
        <Box sx={{ px: 3, py: 2 }}>
          <Typography variant="h6" sx={{ color: 'white', mb: 2, fontWeight: 'bold' }}>
            Thống kê SEO
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ 
                background: 'linear-gradient(135deg, #4CAF50, #45a049)',
                color: 'white',
                boxShadow: '0 8px 32px rgba(76, 175, 80, 0.3)'
              }}>
                <CardContent sx={{ textAlign: 'center', py: 2 }}>
                  <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {seoStats.total}
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
                    {seoStats.good}
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
                    {seoStats.average}
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
                    {seoStats.needsImprovement}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Cần cải thiện
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        <div className="p-4">
          {seoMessage && (
            <Alert 
              severity={seoMessage.includes('thành công') ? 'success' : 'error'} 
              sx={{ 
                mb: 3,
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
              }}
            >
              {seoMessage}
            </Alert>
          )}
          
          {/* Bulk Progress Indicator */}
          {bulkProgress.total > 0 && (
            <Card sx={{ 
              mb: 3, 
              borderRadius: 2,
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))'
            }}>
              <CardContent sx={{ py: 2 }}>
                <Box sx={{ mb: 1 }}>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>
                    {bulkProgress.message}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {bulkProgress.current}/{bulkProgress.total} bài viết
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={(bulkProgress.current / bulkProgress.total) * 100}
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    '& .MuiLinearProgress-bar': {
                      background: 'linear-gradient(135deg, #667eea, #764ba2)'
                    }
                  }}
                />
              </CardContent>
            </Card>
          )}
          
          <SEOQuickTips articles={articles} />
          
          <ArticleFilters
            filters={filters}
            setFilters={setFilters}
            selectedRows={selectedRows}
            handleAction={handleAction}
            getActionOptions={getActionOptions}
          />

          <ArticleTable
            articles={articles}
            selectedRows={selectedRows}
            handleSelectRow={handleSelectRow}
            handleSelectAll={handleSelectAll}
            setModalItem={setModalItem}
            handleSoftDelete={handleSoftDelete}
            filters={filters}
            handleRestore={handleRestore}
            handleForceDelete={handleForceDelete}
            setArticles={setArticles}
            currentPage={currentPage}
            pageSize={pageSize}
            slug={slug}
            onEditSEO={handleEditSEO}
            onAnalyzeSEO={handleAnalyzeSEO}
            onEditSlug={handleEditSlug}
            seoLoading={seoLoading}
          />
          
          {total > pageSize && (
            <MUIPagination
              currentPage={currentPage}
              totalItems={total}
              itemsPerPage={pageSize}
              onPageChange={setCurrentPage}
              onPageSizeChange={setPageSize}
            />
          )}

          <BasicModal modalItem={modalItem} onClose={() => setModalItem(null)} />

          {/* SEO Dialogs */}
          <SEOEditDialog
            open={seoDialogOpen}
            onClose={() => setSeoDialogOpen(false)}
            selectedPost={selectedPost}
            onSave={handleSaveSEO}
            onChange={handleSEOChange}
            saving={seoLoading}
          />

          <SEOAnalysisDialog
            open={analysisDialogOpen}
            onClose={() => setAnalysisDialogOpen(false)}
            analysisResult={analysisResult}
          />
        </div>
      </div>
    </Box>
  );
};

export default News;
