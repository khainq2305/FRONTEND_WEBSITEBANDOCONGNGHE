import React, { useState } from 'react';
import { Box, Chip, InputBase } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useArticle } from '../form/FormPost';

const Tag = () => {
  const theme = useTheme();
  const { tags, setTags } = useArticle();
  const [inputValue, setInputValue] = useState('');

  const handleAddTag = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
    }
    setInputValue('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleDelete = (tagToDelete) => {
    setTags(tags.filter(tag => tag !== tagToDelete));
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 1,
        listStyle: 'none',
        border: '1px solid',
        borderColor: theme.palette.grey[300],
        borderRadius: 1,
        p: 1,
        minHeight: 40
      }}
    >
      {tags.map((tag, index) => (
        <Chip
          key={index}
          label={tag}
          size="small"
          onDelete={() => handleDelete(tag)}
        />
      ))}

      <InputBase
        placeholder="Tag"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        sx={{
          minWidth: 80,
          flex: 1
        }}
      />
    </Box>
  );
};

export default Tag;
