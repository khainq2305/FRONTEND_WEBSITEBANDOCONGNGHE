import { Box, Typography, IconButton, Paper } from '@mui/material';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import ClearIcon from '@mui/icons-material/Clear';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

const MediaUpload = ({ files = [], onChange, children }) => {
    const onDrop = useCallback((acceptedFiles) => {
        const newFiles = acceptedFiles.map(file => {
            const uniqueId = `local-${file.name}-${Date.now()}`;
            return {
                id: uniqueId,
                file,
                url: URL.createObjectURL(file),
                type: file.type.startsWith('video') ? 'video' : 'image'
            }
        });
        onChange([...files, ...newFiles]);
    }, [files, onChange]);

    const handleRemove = (idToRemove) => {
        const fileToRemove = files.find(f => f.id === idToRemove);
        if (fileToRemove && fileToRemove.url && fileToRemove.url.startsWith('blob:')) {
            URL.revokeObjectURL(fileToRemove.url);
        }
        
        const updated = files.filter(f => f.id !== idToRemove);
        onChange(updated);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
            'video/*': ['.mp4', '.mov', '.webm']
        }
    });

    return (
        <Box>
            <Box
                {...getRootProps()}
                sx={{
                    border: '2px dashed #90caf9',
                    borderRadius: 2,
                    p: 2,
                    textAlign: 'center',
                    cursor: 'pointer',
                    bgcolor: isDragActive ? '#e3f2fd' : 'transparent',
                    height: 150,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                     '&:hover': {
                        borderColor: 'primary.main',
                    },
                }}
            >
                <input {...getInputProps()} />
                <Typography color="text.secondary">
                    Kéo & thả hoặc click để chọn ảnh/video
                </Typography>
            </Box>

            {children}
        </Box>
    );
};

export const MediaItem = ({ media, index, handleRemove, providedDraggable, snapshotDraggable }) => {
    return (
        <Paper
            ref={providedDraggable.innerRef}
            {...providedDraggable.draggableProps}
            {...providedDraggable.dragHandleProps}
            variant="outlined"
            sx={{
                position: 'relative',
                width: 120,
                height: 120,
                overflow: 'hidden',
                boxShadow: snapshotDraggable.isDragging ? '0 8px 16px rgba(0,0,0,0.3)' : 'none',
                cursor: 'grab',
            }}
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: 4,
                    left: 4,
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    borderRadius: '50%',
                    display: 'flex',
                    padding: '2px',
                    zIndex: 10,
                }}
            >
                <DragIndicatorIcon fontSize="small" />
            </Box>

            <IconButton
                onClick={() => handleRemove(media.id)}
                size="small"
                sx={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    bgcolor: 'rgba(0,0,0,0.6)',
                    color: 'white',
                    zIndex: 10,
                    '&:hover': { bgcolor: 'rgba(255,0,0,0.8)' }
                }}
            >
                <ClearIcon fontSize="inherit" />
            </IconButton>

            {media.type === 'video' ? (
                <video src={media.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted loop playsInline />
            ) : (
                <img src={media.url} alt={`preview ${index}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            )}
        </Paper>
    );
};

export default MediaUpload;