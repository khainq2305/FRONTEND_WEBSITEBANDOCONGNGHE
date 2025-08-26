import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  ExpandMore,
  Code,
  Save,
  Preview,
  Refresh,
  Add,
  Delete,
  InfoOutlined
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { schemaService } from '../../../services/admin/schemaService';

const SchemaEditor = ({ 
  postId, 
  postTitle = '', 
  postContent = '', 
  postSlug = '',
  mode = 'add',
  onSchemaChange 
}) => {
  const [schema, setSchema] = useState(null);
  const [schemaType, setSchemaType] = useState('Article');
  const [isLoading, setIsLoading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [autoGenerate, setAutoGenerate] = useState(true);
  const [customFields, setCustomFields] = useState({});

  // Schema types với template
  const schemaTypes = {
    'Article': {
      label: 'Article (Bài viết)',
      template: {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: '',
        description: '',
        image: '',
        author: {
          '@type': 'Person',
          name: 'Admin'
        },
        publisher: {
          '@type': 'Organization',
          name: 'Website Ban Do Cong Nghe',
          logo: {
            '@type': 'ImageObject',
            url: ''
          }
        },
        datePublished: '',
        dateModified: ''
      }
    },
    'NewsArticle': {
      label: 'News Article (Tin tức)',
      template: {
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        headline: '',
        description: '',
        image: '',
        author: {
          '@type': 'Person',
          name: 'Admin'
        },
        publisher: {
          '@type': 'Organization',
          name: 'Website Ban Do Cong Nghe',
          logo: {
            '@type': 'ImageObject',
            url: ''
          }
        },
        datePublished: '',
        dateModified: '',
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': ''
        }
      }
    },
    'BlogPosting': {
      label: 'Blog Posting (Blog)',
      template: {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: '',
        description: '',
        image: '',
        author: {
          '@type': 'Person',
          name: 'Admin'
        },
        publisher: {
          '@type': 'Organization',
          name: 'Website Ban Do Cong Nghe'
        },
        datePublished: '',
        dateModified: '',
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': ''
        }
      }
    },
    'Product': {
      label: 'Product (Sản phẩm)',
      template: {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: '',
        description: '',
        image: '',
        brand: {
          '@type': 'Brand',
          name: ''
        },
        offers: {
          '@type': 'Offer',
          price: '',
          priceCurrency: 'VND',
          availability: 'https://schema.org/InStock'
        }
      }
    },
    'Event': {
      label: 'Event (Sự kiện)',
      template: {
        '@context': 'https://schema.org',
        '@type': 'Event',
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        location: {
          '@type': 'Place',
          name: '',
          address: ''
        },
        organizer: {
          '@type': 'Organization',
          name: 'Website Ban Do Cong Nghe'
        }
      }
    }
  };

  // Load schema khi component mount (chỉ khi edit)
  useEffect(() => {
    if (mode === 'edit' && postId) {
      loadPostSchema();
    }
  }, [postId, mode]);

  // Auto-generate schema khi thông tin post thay đổi
  useEffect(() => {
    if (autoGenerate && postTitle) {
      generateSchema();
    }
  }, [postTitle, postContent, postSlug, schemaType, autoGenerate]);

  const loadPostSchema = async () => {
    try {
      setIsLoading(true);
      const response = await schemaService.getPostSchema(postId);
      if (response.success && response.data.schema) {
        setSchema(response.data.schema);
        setSchemaType(response.data.schema['@type'] || 'Article');
        setAutoGenerate(false);
      }
    } catch (error) {
      console.error('Error loading schema:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateSchema = () => {
    const template = { ...schemaTypes[schemaType].template };
    
    // Auto-fill với thông tin bài viết
    template.headline = postTitle;
    template.name = postTitle;
    template.description = extractDescription(postContent);
    
    if (postSlug) {
      const baseUrl = window.location.origin;
      const fullUrl = `${baseUrl}/tin-tuc/${postSlug}`;
      template['@id'] = fullUrl;
      if (template.mainEntityOfPage) {
        template.mainEntityOfPage['@id'] = fullUrl;
      }
    }
    
    // Set dates
    const now = new Date().toISOString();
    template.datePublished = now;
    template.dateModified = now;
    
    setSchema(template);
  };

  const extractDescription = (content) => {
    const div = document.createElement('div');
    div.innerHTML = content;
    const text = div.textContent || div.innerText || '';
    return text.substring(0, 160).trim();
  };

  const handleSchemaTypeChange = (newType) => {
    setSchemaType(newType);
    if (autoGenerate) {
      const template = { ...schemaTypes[newType].template };
      template.headline = postTitle;
      template.name = postTitle;
      template.description = extractDescription(postContent);
      setSchema(template);
    }
  };

  const updateSchemaField = (path, value) => {
    const newSchema = { ...schema };
    const pathArray = path.split('.');
    let current = newSchema;
    
    for (let i = 0; i < pathArray.length - 1; i++) {
      if (!current[pathArray[i]]) {
        current[pathArray[i]] = {};
      }
      current = current[pathArray[i]];
    }
    
    current[pathArray[pathArray.length - 1]] = value;
    setSchema(newSchema);
    
    // Notify parent component
    if (onSchemaChange) {
      onSchemaChange(newSchema);
    }
  };

  const saveSchema = async () => {
    if (!postId || mode === 'add') {
      toast.info('Schema sẽ được lưu khi tạo bài viết');
      return;
    }

    try {
      setIsLoading(true);
      const response = await schemaService.updatePostSchema(postId, schema);
      if (response.success) {
        toast.success('Cập nhật schema thành công');
      }
    } catch (error) {
      toast.error('Lỗi khi cập nhật schema');
      console.error('Save schema error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetSchema = () => {
    setSchema(null);
    setAutoGenerate(true);
    generateSchema();
  };

  const renderSchemaField = (key, value, path = '') => {
    const fullPath = path ? `${path}.${key}` : key;
    
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      return (
        <Accordion key={fullPath} sx={{ mt: 1 }}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="subtitle2">{key}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {Object.entries(value).map(([subKey, subValue]) => 
              renderSchemaField(subKey, subValue, fullPath)
            )}
          </AccordionDetails>
        </Accordion>
      );
    }
    
    return (
      <TextField
        key={fullPath}
        fullWidth
        size="small"
        label={key}
        value={value || ''}
        onChange={(e) => updateSchemaField(fullPath, e.target.value)}
        sx={{ mt: 1 }}
        multiline={key.includes('description') || key.includes('content')}
        rows={key.includes('description') ? 3 : 1}
      />
    );
  };

  return (
    <Card sx={{ mt: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Code color="primary" />
          <Typography variant="h6">Schema Markup</Typography>
          <Chip 
            label={schemaType} 
            size="small" 
            color="primary" 
            variant="outlined" 
          />
        </Box>

        {/* Controls */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Loại Schema</InputLabel>
              <Select
                value={schemaType}
                onChange={(e) => handleSchemaTypeChange(e.target.value)}
                label="Loại Schema"
              >
                {Object.entries(schemaTypes).map(([type, config]) => (
                  <MenuItem key={type} value={type}>
                    {config.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControlLabel
              control={
                <Switch
                  checked={autoGenerate}
                  onChange={(e) => setAutoGenerate(e.target.checked)}
                />
              }
              label="Tự động tạo"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                size="small"
                variant="outlined"
                startIcon={<Refresh />}
                onClick={resetSchema}
                disabled={isLoading}
              >
                Reset
              </Button>
              <Button
                size="small"
                variant="outlined"
                startIcon={<Preview />}
                onClick={() => setPreviewOpen(true)}
                disabled={!schema}
              >
                Xem trước
              </Button>
            </Box>
          </Grid>
        </Grid>

        {/* Schema Fields */}
        {schema && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
              <InfoOutlined fontSize="small" />
              Chỉnh sửa Schema
            </Typography>
            {Object.entries(schema).map(([key, value]) => {
              if (key === '@context' || key === '@type') return null;
              return renderSchemaField(key, value);
            })}
            
            {/* Nút Lưu */}
            {mode === 'edit' && (
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  startIcon={<Save />}
                  onClick={saveSchema}
                  disabled={isLoading || !schema}
                  size="large"
                >
                  Lưu Schema
                </Button>
              </Box>
            )}
          </Box>
        )}

        {!schema && !isLoading && (
          <Alert severity="info" sx={{ mt: 2 }}>
            Chưa có schema. Bật "Tự động tạo" hoặc chọn loại schema để bắt đầu.
          </Alert>
        )}

        {/* Preview Dialog */}
        <Dialog
          open={previewOpen}
          onClose={() => setPreviewOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Code />
              Schema JSON Preview
            </Box>
          </DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              multiline
              rows={20}
              value={schema ? JSON.stringify(schema, null, 2) : ''}
              variant="outlined"
              sx={{ 
                fontFamily: 'monospace',
                '& .MuiInputBase-input': {
                  fontFamily: 'monospace',
                  fontSize: '0.875rem'
                }
              }}
              InputProps={{
                readOnly: true
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setPreviewOpen(false)}>
              Đóng
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                navigator.clipboard.writeText(JSON.stringify(schema, null, 2));
                toast.success('Đã sao chép schema vào clipboard');
              }}
            >
              Sao chép
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default SchemaEditor;
