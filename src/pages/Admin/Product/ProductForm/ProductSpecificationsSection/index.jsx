import React, { useMemo } from 'react';
import { Grid, TextField, Typography, Button, Box, IconButton, Tooltip } from '@mui/material';
import { Autocomplete } from '@mui/material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import DeleteIcon from '@mui/icons-material/Delete';


const ProductSpecificationsSection = ({
    productSpecs,
    handleProductSpecChange,
    addProductSpec,
    removeProductSpec,
    handleOnDragEndProductSpecs,
    availableSpecGroups,
}) => {
    
    const specKeysByGroup = useMemo(() => {
        const map = new Map();
        (productSpecs || []).forEach(spec => {
            if (spec.specGroup && spec.key) {
                if (!map.has(spec.specGroup)) {
                    map.set(spec.specGroup, new Set());
                }
                map.get(spec.specGroup).add(spec.key);
            }
        });
        const result = {};
        for (let [key, value] of map) {
            result[key] = Array.from(value);
        }
        return result;
    }, [productSpecs]);

    return (
        <Grid item xs={12} sx={{ mt: 3, pt: 2, borderTop: '1px solid #eee' }}>
            <Typography variant="h6" gutterBottom>
                Thông số kỹ thuật
            </Typography>
            <DragDropContext onDragEnd={handleOnDragEndProductSpecs}>
                <Droppable droppableId="productSpecsDroppable">
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef}>
                            {(productSpecs || []).map((spec, specIndex) => {
                                const keySuggestions = spec.specGroup ? specKeysByGroup[spec.specGroup] || [] : [];
                                
                                return (
                                    <Draggable key={`spec-${specIndex}`} draggableId={`spec-draggable-${specIndex}`} index={specIndex}>
                                        {(providedDraggable) => (
                                            <Box ref={providedDraggable.innerRef} {...providedDraggable.draggableProps} sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                                                <Tooltip title="Kéo thả để sắp xếp">
                                                    <Box {...providedDraggable.dragHandleProps} sx={{ cursor: 'grab', display: 'flex', color: '#757575' }}>
                                                        <DragIndicatorIcon />
                                                    </Box>
                                                </Tooltip>
                                                <Grid container spacing={1} sx={{ flexGrow: 1, ml: 1 }}>
                                                    <Grid item xs={12} sm={3}>
                                                         <Autocomplete
                                                            freeSolo
                                                            options={availableSpecGroups}
                                                            value={spec.specGroup || ''}
                                                            onChange={(e, newValue) => handleProductSpecChange(specIndex, 'specGroup', newValue || '')}
                                                            onInputChange={(e, newInputValue) => {
                                                                if(e) handleProductSpecChange(specIndex, 'specGroup', newInputValue);
                                                            }}
                                                            renderInput={(params) => <TextField {...params} label="Nhóm" size="small" />}
                                                        />
                                                    </Grid>
                                                    
                                                    <Grid item xs={12} sm={3.5}>
                                                        <Autocomplete
                                                            freeSolo
                                                            options={keySuggestions}
                                                            getOptionLabel={(option) => option}
                                                            value={spec.key || ''}
                                                            onChange={(e, newValue) => handleProductSpecChange(specIndex, 'key', newValue || '')}
                                                            onInputChange={(e, newInputValue) => {
                                                                 if(e) handleProductSpecChange(specIndex, 'key', newInputValue);
                                                            }}
                                                            renderInput={(params) => <TextField {...params} label="Tên thông số" size="small" />}
                                                            disabled={!spec.specGroup}
                                                        />
                                                    </Grid>

                                                    <Grid item xs={12} sm={3.5}>
                                                        <TextField fullWidth label="Giá trị" size="small" value={spec.value || ''} onChange={(e) => handleProductSpecChange(specIndex, 'value', e.target.value)} />
                                                    </Grid>
                                                    
                                                    {/* THÊM LẠI Ô THỨ TỰ */}
                                                    <Grid item xs={12} sm={1}>
                                                        <TextField
                                                            fullWidth
                                                            type="number"
                                                            label="Thứ tự"
                                                            size="small"
                                                            value={spec.sortOrder}
                                                            InputProps={{ readOnly: true }}
                                                            sx={{ '& .MuiInputBase-input': { backgroundColor: '#f5f5f5' } }}
                                                        />
                                                    </Grid>

                                                    <Grid item xs={12} sm={1} sx={{ textAlign: 'right' }}>
                                                        <IconButton color="error" onClick={() => removeProductSpec(specIndex)}>
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </Grid>
                                                </Grid>
                                            </Box>
                                        )}
                                    </Draggable>
                                );
                            })}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
            <Button variant="outlined" onClick={addProductSpec} startIcon={<AddCircleOutlineIcon />} size="small">
                Thêm thông số
            </Button>
        </Grid>
    );
};

export default ProductSpecificationsSection;