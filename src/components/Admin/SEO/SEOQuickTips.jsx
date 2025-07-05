import React from 'react';
import { Card, CardContent, Typography, Box, Chip, Grid, Alert } from '@mui/material';
import { TrendingUp, Target, Eye, CheckCircle } from 'lucide-react';

const SEOQuickTips = ({ articles }) => {
  const seoStats = {
    total: articles.length,
    withSEO: articles.filter(a => a.seoData).length,
    goodSEO: articles.filter(a => a.seoData?.seoScore >= 70).length,
    withKeywords: articles.filter(a => a.seoData?.focusKeyword).length
  };

  const tips = [
    {
      icon: <Target size={20} />,
      title: 'Focus Keywords',
      description: 'Thiết lập từ khóa chính cho mỗi bài viết',
      status: seoStats.withKeywords / seoStats.total * 100,
      color: '#667eea'
    },
    {
      icon: <TrendingUp size={20} />,
      title: 'SEO Score',
      description: 'Cải thiện điểm SEO tổng thể',
      status: seoStats.goodSEO / seoStats.total * 100,
      color: '#4CAF50'
    },
    {
      icon: <Eye size={20} />,
      title: 'Meta Description',
      description: 'Viết mô tả hấp dẫn và tối ưu',
      status: articles.filter(a => a.seoData?.metaDescription).length / seoStats.total * 100,
      color: '#2196F3'
    },
    {
      icon: <CheckCircle size={20} />,
      title: 'SEO Coverage',
      description: 'Phần trăm bài viết có SEO data',
      status: seoStats.withSEO / seoStats.total * 100,
      color: '#FF9800'
    }
  ];

  return (
    <Card sx={{ 
      mb: 3, 
      borderRadius: 3,
      boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)'
    }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, color: '#667eea', fontWeight: 'bold' }}>
          SEO Quick Tips
        </Typography>
        
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {tips.map((tip, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Box sx={{
                p: 2,
                border: `2px solid ${tip.color}20`,
                borderRadius: 2,
                textAlign: 'center',
                background: `${tip.color}05`,
                '&:hover': {
                  background: `${tip.color}10`,
                  transform: 'translateY(-2px)',
                  transition: 'all 0.3s ease'
                }
              }}>
                <Box sx={{ color: tip.color, mb: 1 }}>
                  {tip.icon}
                </Box>
                <Typography variant="h4" sx={{ color: tip.color, fontWeight: 'bold', mb: 1 }}>
                  {Math.round(tip.status)}%
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                  {tip.title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {tip.description}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        <Alert 
          severity="info" 
          sx={{ 
            borderRadius: 2,
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))',
            border: '1px solid rgba(102, 126, 234, 0.2)'
          }}
        >
          <Typography variant="body2">
            <strong>Gợi ý:</strong> Sử dụng tính năng "Phân tích SEO hàng loạt" để cải thiện nhiều bài viết cùng lúc. 
            Đặt focus keyword cho mỗi bài viết và duy trì SEO Score trên 70 điểm.
          </Typography>
        </Alert>
      </CardContent>
    </Card>
  );
};

export default SEOQuickTips;
