import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box, Typography, Paper, Chip, Avatar, Divider, Stack
} from '@mui/material';
import { sectionService } from '../../../../services/admin/sectionService';

const HomeSectionDetailPage = () => {
  const { id } = useParams();
  const [section, setSection] = useState(null);
useEffect(() => {
  const fetchDetail = async () => {
    try {
      const res = await sectionService.getDetail(id);
      console.log('[CLIENT DEBUG] Response:', res);

      const result = res.data; // 👈 thêm dòng này
      if (result?.success) {
        setSection(result.data);
      } else {
        console.error('Không tìm thấy dữ liệu từ API');
      }
    } catch (err) {
      console.error('Lỗi khi lấy chi tiết khối:', err);
    }
  };
  fetchDetail();
}, [id]);


  if (!section) {
    return <Typography>Đang tải dữ liệu...</Typography>;
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Chi tiết khối: {section.title}
      </Typography>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="subtitle1">Thông tin chung</Typography>
        <Divider sx={{ my: 1 }} />
        <Stack spacing={1}>
          <Typography>Loại khối: <strong>{section.type}</strong></Typography>
          <Typography>Thứ tự hiển thị: <strong>{section.orderIndex}</strong></Typography>
          <Typography>Trạng thái: <Chip label={section.isActive ? 'Hoạt động' : 'Tạm tắt'} color={section.isActive ? 'success' : 'default'} /></Typography>
        </Stack>
      </Paper>

      {section.banners?.length > 0 && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="subtitle1">Danh sách Banner</Typography>
          <Divider sx={{ my: 1 }} />
          <Stack spacing={2}>
            {section.banners.map((banner, idx) => (
              <Box key={banner.id} display="flex" gap={2} alignItems="center">
                <Avatar src={banner.imageUrl} variant="rounded" sx={{ width: 120, height: 67.5 }} />
                <Box>
                  <Typography>Link: {banner.linkValue || 'Không có'}</Typography>
                  <Typography>Loại liên kết: {banner.linkType}</Typography>
                </Box>
              </Box>
            ))}
          </Stack>
        </Paper>
      )}

      {section.productHomeSections?.length > 0 && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="subtitle1">Sản phẩm trong khối</Typography>
          <Divider sx={{ my: 1 }} />
          <Stack spacing={1}>
            {section.productHomeSections.map((p, idx) => (
              <Typography key={p.id}>SKU ID: {p.skuId}</Typography>
            ))}
          </Stack>
        </Paper>
      )}

      {section.filters?.length > 0 && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="subtitle1">Bộ lọc hiển thị</Typography>
          <Divider sx={{ my: 1 }} />
          <Stack spacing={1}>
            {section.filters.map((f, idx) => (
              <Box key={idx}>
                <Typography><strong>{f.label}</strong> ({f.type}): {f.value}</Typography>
              </Box>
            ))}
          </Stack>
        </Paper>
      )}
    </Box>
  );
};

export default HomeSectionDetailPage;
