import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  TextField,
  Switch,
  FormControlLabel,
  Alert,
  Chip,
  Divider,
  CircularProgress,
  IconButton,
  Tooltip
} from '@mui/material';
import { Settings, TrendingUp, FileText, Globe, RefreshCw } from 'lucide-react';
import { seoService, postSEOService } from '../../../services/admin/seoService';

const SEOManager = () => {
  const [seoConfig, setSeoConfig] = useState({
    siteName: '',
    siteUrl: '',
    metaDescription: '',
    keywords: '',
    titleSeparator: '-',
    maxTitleLength: 60,
    maxMetaDescLength: 160,
    enableOpenGraph: true,
    enableTwitterCard: true,
    enableJsonLd: true,
    enableSitemap: true,
    robotsTxt: ''
  });

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [seoStats, setSeoStats] = useState([
    { label: 'Tổng số trang', value: '0', icon: FileText, color: '#1976d2' },
    { label: 'Điểm SEO trung bình', value: '0/100', icon: TrendingUp, color: '#2e7d32' },
    { label: 'Trang được index', value: '0', icon: Globe, color: '#ed6c02' },
    { label: 'Cấu hình hoạt động', value: '0/0', icon: Settings, color: '#9c27b0' }
  ]);

  useEffect(() => {
    fetchSEOConfig();
    fetchSEOStats();
  }, []);

  const fetchSEOConfig = async () => {
    try {
      setInitialLoading(true);
      console.log('🔄 Fetching SEO config...');
      const response = await seoService.getSEOConfig();
      console.log('📥 SEO config response:', response);
      
      // Fix: Check response.data.success and response.data.data
      if (response && response.data && response.data.success && response.data.data) {
        setSeoConfig(response.data.data);
        console.log('✅ SEO config loaded successfully');
      } else {
        console.warn('⚠️ SEO config fetch failed or no data:', response);
      }
    } catch (error) {
      console.error('❌ Error fetching SEO config:', error);
      setMessage('Có lỗi xảy ra khi tải cấu hình SEO');
    } finally {
      setInitialLoading(false);
    }
  };

  const fetchSEOStats = async () => {
    try {
      setStatsLoading(true);
      console.log('🔄 Fetching SEO stats...');
      const response = await postSEOService.getSEOStats();
      console.log('📥 SEO stats response:', response);
      
      // Fix: Check response.data.success and response.data.data
      if (response && response.data && response.data.success && response.data.data) {
        const statsData = response.data.data;
        
        // Cập nhật dữ liệu stats thật từ API
        setSeoStats([
          { 
            label: 'Tổng số trang', 
            value: statsData.totalPosts?.toString() || '0', 
            icon: FileText, 
            color: '#1976d2' 
          },
          { 
            label: 'Điểm SEO trung bình', 
            value: `${statsData.avgSEOScore || 0}/100`, 
            icon: TrendingUp, 
            color: '#2e7d32' 
          },
          { 
            label: 'Trang được index', 
            value: statsData.postsWithSEO?.toString() || '0', 
            icon: Globe, 
            color: '#ed6c02' 
          },
          { 
            label: 'Tỷ lệ tối ưu SEO', 
            value: `${statsData.seoOptimizationRate || 0}%`, 
            icon: Settings, 
            color: '#9c27b0' 
          }
        ]);
        
        console.log('✅ SEO stats loaded successfully');
      } else {
        console.warn('⚠️ SEO stats fetch failed or no data:', response);
      }
    } catch (error) {
      console.error('❌ Error fetching SEO stats:', error);
      // Giữ nguyên dữ liệu mặc định nếu có lỗi
    } finally {
      setStatsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setSeoConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      console.log('🔄 Saving SEO config...', seoConfig);
      const response = await seoService.updateSEOConfig(seoConfig);
      console.log('📤 SEO config save response:', response);
      
      // Fix: Check response.data.success instead of response.success
      if (response && response.data && response.data.success) {
        setMessage('Cấu hình SEO đã được lưu thành công!');
        console.log('✅ SEO config saved successfully');
        // Refresh stats after saving config
        fetchSEOStats();
      } else {
        console.warn('⚠️ SEO config save failed:', response);
        setMessage('Có lỗi xảy ra khi lưu cấu hình SEO');
      }
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('❌ Error saving SEO config:', error);
      setMessage('Có lỗi xảy ra khi lưu cấu hình SEO');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Quản lý SEO
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Quản lý cấu hình SEO tổng thể cho website
      </Typography>

      {message && (
        <Alert severity={message.includes('thành công') ? 'success' : 'error'} sx={{ mb: 3 }}>
          {message}
        </Alert>
      )}

      {/* SEO Stats */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          Thống kê SEO
        </Typography>
        <Tooltip title="Làm mới thống kê">
          <IconButton 
            onClick={fetchSEOStats} 
            disabled={statsLoading}
            size="small"
            sx={{
              '& svg': {
                transition: 'transform 0.3s ease',
                transform: statsLoading ? 'rotate(360deg)' : 'rotate(0deg)'
              }
            }}
          >
            <RefreshCw size={16} />
          </IconButton>
        </Tooltip>
      </Box>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {seoStats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ position: 'relative', opacity: statsLoading ? 0.7 : 1, transition: 'opacity 0.3s ease' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box
                    sx={{
                      p: 1,
                      borderRadius: 1,
                      backgroundColor: `${stat.color}20`,
                      mr: 2
                    }}
                  >
                    <stat.icon size={24} color={stat.color} />
                  </Box>
                  <Typography variant="h6" color={stat.color}>
                    {statsLoading ? '...' : stat.value}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {stat.label}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* SEO Configuration */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Cấu hình SEO chung
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Tên website"
                value={seoConfig.siteName}
                onChange={(e) => handleInputChange('siteName', e.target.value)}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="URL website"
                value={seoConfig.siteUrl}
                onChange={(e) => handleInputChange('siteUrl', e.target.value)}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Mô tả mặc định"
                value={seoConfig.metaDescription}
                onChange={(e) => handleInputChange('metaDescription', e.target.value)}
                margin="normal"
                helperText={`${seoConfig.metaDescription.length}/${seoConfig.maxMetaDescLength} ký tự`}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Từ khóa mặc định"
                value={seoConfig.keywords}
                onChange={(e) => handleInputChange('keywords', e.target.value)}
                margin="normal"
                helperText="Phân cách bằng dấu phẩy"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Ký tự phân cách tiêu đề"
                value={seoConfig.titleSeparator}
                onChange={(e) => handleInputChange('titleSeparator', e.target.value)}
                margin="normal"
              />
            </Grid>
           
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" gutterBottom>
            Tính năng SEO
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={seoConfig.enableOpenGraph}
                    onChange={(e) => handleInputChange('enableOpenGraph', e.target.checked)}
                  />
                }
                label="Bật Open Graph"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={seoConfig.enableTwitterCard}
                    onChange={(e) => handleInputChange('enableTwitterCard', e.target.checked)}
                  />
                }
                label="Bật Twitter Card"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={seoConfig.enableJsonLd}
                    onChange={(e) => handleInputChange('enableJsonLd', e.target.checked)}
                  />
                }
                label="Bật Schema"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={seoConfig.enableSitemap}
                    onChange={(e) => handleInputChange('enableSitemap', e.target.checked)}
                  />
                }
                label="Tự động tạo Sitemap"
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" gutterBottom>
            Robots.txt
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={6}
            label="Nội dung robots.txt"
            value={seoConfig.robotsTxt}
            onChange={(e) => handleInputChange('robotsTxt', e.target.value)}
            margin="normal"
            placeholder="User-agent: *&#10;Disallow:"
          />

          <Box sx={{ mt: 3, textAlign: 'right' }}>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={loading}
              size="large"
            >
              {loading ? 'Đang lưu...' : 'Lưu cấu hình'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default SEOManager;
