import React, { useState } from 'react';
import { Box, Chip, Autocomplete, TextField } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const Tag = ({ tags, setTags, allTags = [], placeholder = "Add tag" }) => {
  const theme = useTheme();
  const [inputValue, setInputValue] = useState('');
  const [addedFromAutocomplete, setAddedFromAutocomplete] = useState(false);

  const handleAddTag = (tagName) => {
    const trimmed = tagName.trim();
    if (
      trimmed &&
      !tags.some(tag => tag.name.toLowerCase() === trimmed.toLowerCase()) // Case-insensitive check
    ) {
      const existing = allTags.find(t => t.name.toLowerCase() === trimmed.toLowerCase());
      if (existing) {
        setTags([...tags, existing]);
      } else {
        // For new tags, you might want a consistent way to generate an ID
        // or handle them differently if they need to be saved to a backend.
        // Here, we use `null` for id, but you could use `Date.now()` or a UUID.
        setTags([...tags, { id: `new-${Date.now()}-${trimmed}`, name: trimmed }]);
      }
    }
    setInputValue(''); // Clear input field after adding a tag
    setAddedFromAutocomplete(false); // Reset flag
  };

  const handleDelete = (tagToDelete) => {
    setTags(tags.filter(tag => tag.name !== tagToDelete.name));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      // Only add tag via Enter/Comma if it wasn't just added from Autocomplete selection
      // and if there's actual text in the input.
      if (!addedFromAutocomplete && inputValue.trim() !== '') {
        handleAddTag(inputValue);
      }
      // Always reset the flag after an Enter/Comma press, as the action is now complete.
      setAddedFromAutocomplete(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: theme.spacing(1), // Use theme spacing
        border: '1px solid',
        borderColor: theme.palette.divider,
        borderRadius: '10px', // Use theme border radius
        p: theme.spacing(1),
        minHeight: 48, // Adjusted for better vertical alignment with standard inputs
      }}
    >
      {tags.map((tag) => (
        <Chip
          key={tag.id || tag.name} // Prefer id if available, otherwise name
          label={tag.name}
          size="small"
          onDelete={() => handleDelete(tag)}
        />
      ))}

      <Autocomplete
        freeSolo
        disableClearable
        // Filter out already selected tags from suggestions
        options={allTags
          .map(t => t.name)
          .filter(tagName => !tags.some(selectedTag => selectedTag.name.toLowerCase() === tagName.toLowerCase()))
        }
        inputValue={inputValue}
        onInputChange={(event, newInputValue, reason) => {
          // Only update inputValue from direct user typing.
          // If a tag is selected (reason 'reset'), handleAddTag clears the input,
          // so we don't want to set it back to the selected value here.
          if (reason === 'input') {
            setInputValue(newInputValue);
            setAddedFromAutocomplete(false); // User is typing, not selecting from AC
          } else if (reason === 'clear') { // Handle case where Autocomplete might try to clear internally (though disableClearable is true)
            setInputValue('');
          }
        }}
        onChange={(event, value) => { // `value` is the string selected or typed
          if (typeof value === 'string' && value.trim() !== '') {
            setAddedFromAutocomplete(true); // Mark that selection/submission happened via Autocomplete
            handleAddTag(value);
          }
        }}
        sx={{
          flex: 1,
          maxHeight: 60,
          bgcolor: '#3333333',
          minWidth: 120,
          '& .MuiInputBase-root': { 
             paddingTop: '2px', // Adjust padding for better vertical alignment
             paddingBottom: '2px',
          },
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            placeholder={tags.length === 0 ? placeholder : ""}
            InputProps={{
              ...params.InputProps,
              disableUnderline: true,
              onKeyDown: handleKeyDown,
            }}

          />
        )}
      />
    </Box>
  );
};

export default Tag;