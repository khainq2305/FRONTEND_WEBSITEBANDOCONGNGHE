<Box display="flex" gap={2} flexWrap="wrap" mb={2}>
  <FormControl size="small">
    <InputLabel>Trạng thái</InputLabel>
    <Select
      value={activeStatus}
      label="Trạng thái"
      onChange={(e) => onChange('status', e.target.value)}
    >
      <MenuItem value="all">Tất cả</MenuItem>
      <MenuItem value="replied">Đã phản hồi</MenuItem>
      <MenuItem value="not_replied">Chưa phản hồi</MenuItem>
    </Select>
  </FormControl>

  <FormControl size="small">
    <InputLabel>Đánh giá</InputLabel>
    <Select
      value={activeRating}
      label="Đánh giá"
      onChange={(e) => onChange('rating', e.target.value)}
    >
      <MenuItem value="all">Tất cả</MenuItem>
      {[5, 4, 3, 2, 1].map((val) => (
        <MenuItem key={val} value={val}>
          {val} sao
        </MenuItem>
      ))}
    </Select>
  </FormControl>

  <TextField
    size="small"
    label="Từ ngày"
    type="date"
    value={fromDate}
    onChange={(e) => onChange('fromDate', e.target.value)}
    InputLabelProps={{ shrink: true }}
  />
  <TextField
    size="small"
    label="Đến ngày"
    type="date"
    value={toDate}
    onChange={(e) => onChange('toDate', e.target.value)}
    InputLabelProps={{ shrink: true }}
  />


</Box>

{getActiveFilterChips().length > 0 && (
  <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
    <Typography variant="body2" sx={{ fontWeight: 500, mt: '4px' }}>Đang lọc:</Typography>
    {getActiveFilterChips().map((chip, index) => (
      <Chip key={index} label={chip.label} color="info" variant="outlined" size="small" />
    ))}
  </Box>
)}

