import { Box, Typography, IconButton, Paper } from '@mui/material';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import ClearIcon from '@mui/icons-material/Clear';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

const MediaUpload = ({ files = [], onChange }) => {

    const onDrop = useCallback((acceptedFiles) => {
        const newFiles = acceptedFiles.map(file => {
            // Thêm một ID duy nhất cho mỗi file để Draggable hoạt động ổn định
            const uniqueId = `local-${file.name}-${Date.now()}`;
            return {
                id: uniqueId,
                file, // Giữ lại file gốc để upload
                url: URL.createObjectURL(file),
                type: file.type.startsWith('video') ? 'video' : 'image'
            }
        });
        onChange([...files, ...newFiles]);
    }, [files, onChange]);

    const handleRemove = (idToRemove) => {
        // Tìm và giải phóng URL object để tránh rò rỉ bộ nhớ
        const fileToRemove = files.find(f => f.id === idToRemove);
        if (fileToRemove && fileToRemove.url.startsWith('blob:')) {
            URL.revokeObjectURL(fileToRemove.url);
        }
        
        const updated = files.filter(f => f.id !== idToRemove);
        onChange(updated);
    };

    // Hàm xử lý sau khi kéo-thả xong
    const handleOnDragEnd = (result) => {
        if (!result.destination) return;

        const items = Array.from(files);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        // Cập nhật lại state ở component cha với mảng đã được sắp xếp
        onChange(items);
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

            <DragDropContext onDragEnd={handleOnDragEnd}>
                <Droppable droppableId="media-list" direction="horizontal">
                    {(provided) => (
                        <Box
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            mt={2}
                            display="flex"
                            flexWrap="wrap"
                            gap={2}
                        >
                            {files.map((media, index) => (
                                <Draggable key={media.id} draggableId={media.id} index={index}>
                                    {(providedDraggable, snapshot) => (
                                        <Paper
                                            ref={providedDraggable.innerRef}
                                            {...providedDraggable.draggableProps}
                                            variant="outlined"
                                            sx={{
                                                position: 'relative',
                                                width: 120,
                                                height: 120,
                                                overflow: 'hidden',
                                                boxShadow: snapshot.isDragging ? '0 4px 8px rgba(0,0,0,0.2)' : 'none',
                                            }}
                                        >
                                            <Box
                                                {...providedDraggable.dragHandleProps}
                                                sx={{
                                                    position: 'absolute',
                                                    top: 4,
                                                    left: 4,
                                                    cursor: 'grab',
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
                                                <video src={media.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                <img src={media.url} alt={`preview ${index}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            )}
                                        </Paper>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </Box>
                    )}
                </Droppable>
            </DragDropContext>
        </Box>
    );
};

export default MediaUpload;