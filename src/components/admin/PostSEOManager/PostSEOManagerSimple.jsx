import React, { useState, useEffect } from 'react';
import { Box, Typography, Alert, Card, CardContent } from '@mui/material';
import { postSEOAPI } from '../../../services/postSeoAPI';

const PostSEOManagerSimple = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('=== Simple Test: Fetching posts ===');
        console.log('Token exists:', !!localStorage.getItem('token'));
        
        const response = await postSEOAPI.getPosts();
        console.log('Raw API Response:', response);
        console.log('Response type:', typeof response);
        console.log('Response keys:', Object.keys(response || {}));
        
        if (response && response.posts) {
          setPosts(response.posts);
          console.log('Successfully set posts:', response.posts.length);
        } else if (response && response.data && response.data.posts) {
          setPosts(response.data.posts);
          console.log('Successfully set posts from data:', response.data.posts.length);
        } else {
          console.log('No posts found in response');
          setError('No posts data found');
        }
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError(err.message || 'Failed to fetch posts');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Simple SEO Test
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6">Debug Info</Typography>
          <Typography>Posts count: {posts.length}</Typography>
          <Typography>Token exists: {!!localStorage.getItem('token')}</Typography>
          <Typography>Error: {error || 'None'}</Typography>
        </CardContent>
      </Card>
      
      {posts.length > 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6">Posts Found:</Typography>
            {posts.map((post, index) => (
              <Typography key={index}>
                {post.id}: {post.title} (SEO Score: {post.seoData?.seoScore || 'N/A'})
              </Typography>
            ))}
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default PostSEOManagerSimple;
