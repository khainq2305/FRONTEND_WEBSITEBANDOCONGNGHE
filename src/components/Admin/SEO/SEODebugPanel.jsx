import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Box, 
  Collapse,
  Chip
} from '@mui/material';
import { ExpandMore, ExpandLess, BugReport } from '@mui/icons-material';

const SEODebugPanel = ({ articles, onTestBulkAPI, onTestSingleAPI }) => {
  const [expanded, setExpanded] = useState(false);

  const seoStats = {
    totalArticles: articles.length,
    withSEO: articles.filter(a => a.seoData).length,
    withScores: articles.filter(a => a.seoData?.seoScore > 0).length,
    withKeywords: articles.filter(a => a.seoData?.focusKeyword).length,
  };

  const handleTestSingle = async () => {
    if (articles.length > 0) {
      const firstArticle = articles[0];
      console.log('Testing single API with article:', firstArticle);
      await onTestSingleAPI(firstArticle.id);
    }
  };

  const handleTestBulk = async () => {
    if (articles.length > 0) {
      const firstTwoArticles = articles.slice(0, 2);
      const postIds = firstTwoArticles.map(a => a.id);
      console.log('Testing bulk API with articles:', firstTwoArticles);
      await onTestBulkAPI(postIds);
    }
  };

  return (
    <Card sx={{ 
      mb: 2, 
      border: '2px solid #ff9800',
      borderRadius: 2,
      background: 'linear-gradient(135deg, rgba(255, 152, 0, 0.1), rgba(255, 193, 7, 0.1))'
    }}>
      <CardContent sx={{ py: 2 }}>
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            cursor: 'pointer'
          }}
          onClick={() => setExpanded(!expanded)}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <BugReport sx={{ color: '#ff9800' }} />
            <Typography variant="h6" sx={{ color: '#ff9800', fontWeight: 'bold' }}>
              SEO Debug Panel
            </Typography>
          </Box>
          {expanded ? <ExpandLess /> : <ExpandMore />}
        </Box>
        
        <Collapse in={expanded}>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Debug information và test functions cho SEO features
            </Typography>
            
            {/* Stats */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
                Current Stats:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                <Chip 
                  label={`Total: ${seoStats.totalArticles}`} 
                  color="primary" 
                  size="small" 
                />
                <Chip 
                  label={`With SEO: ${seoStats.withSEO}`} 
                  color="success" 
                  size="small" 
                />
                <Chip 
                  label={`With Scores: ${seoStats.withScores}`} 
                  color="warning" 
                  size="small" 
                />
                <Chip 
                  label={`With Keywords: ${seoStats.withKeywords}`} 
                  color="info" 
                  size="small" 
                />
              </Box>
            </Box>

            {/* Test Buttons */}
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="outlined"
                color="primary"
                size="small"
                onClick={handleTestSingle}
                disabled={articles.length === 0}
              >
                Test Single API
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                size="small"
                onClick={handleTestBulk}
                disabled={articles.length < 2}
              >
                Test Bulk API
              </Button>
              <Button
                variant="outlined"
                color="info"
                size="small"
                onClick={() => console.log('Articles:', articles)}
              >
                Log Articles
              </Button>
            </Box>

            {/* Sample Article Info */}
            {articles.length > 0 && (
              <Box sx={{ mt: 2, p: 2, background: 'rgba(0,0,0,0.05)', borderRadius: 1 }}>
                <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                  Sample Article:
                </Typography>
                <Typography variant="caption" sx={{ display: 'block' }}>
                  ID: {articles[0].id} | Title: {articles[0].title}
                </Typography>
                <Typography variant="caption" sx={{ display: 'block' }}>
                  SEO Data: {articles[0].seoData ? 'Yes' : 'No'} | 
                  Score: {articles[0].seoData?.seoScore || 'N/A'}
                </Typography>
              </Box>
            )}
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default SEODebugPanel;
