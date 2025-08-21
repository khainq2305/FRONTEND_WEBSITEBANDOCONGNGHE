import React, { useEffect, useState } from 'react';
import {
  Box, Paper, Typography, Table, TableHead, TableRow,
  TableCell, TableBody, Switch
} from '@mui/material';
import { toast } from 'react-toastify';
import { shippingProviderService } from '../../../services/admin/shippingProviderService';
import LoaderAdmin from '../../../components/common/Loader';
import Breadcrumb from '../../../components/common/Breadcrumb'; 

export default function ShippingProviderList() {
  const [providers, setProviders] = useState([]);
  const [isLoading, setLoading]   = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await shippingProviderService.list();
      setProviders(res.data);
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || 'Lỗi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleToggle = async (id) => {
    setLoading(true);
    try {
      await shippingProviderService.toggle(id);
      toast.success('Đã cập nhật trạng thái');
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || 'Lỗi cập nhật');
      setLoading(false);
    }
  };

  return (
    <Box p={2}>
      {isLoading && <LoaderAdmin fullscreen />}

     
      <Box sx={{ mb: 2 }}>
        <Breadcrumb
          items={[
            { label: 'Trang chủ', href: '/admin' },
            { label: 'Đơn vị vận chuyển', href: '/admin/shipping-providers' }
          ]}
        />
      </Box>

      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h5" fontWeight={600}>Danh sách đơn vị vận chuyển</Typography>
      </Box>

      <Paper>
        <Table>
          <TableHead sx={{ backgroundColor: 'grey.100' }}>
            <TableRow>
              <TableCell>STT</TableCell>
              <TableCell>Mã</TableCell>
              <TableCell>Tên hiển thị</TableCell>
              <TableCell align="center">Hoạt động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {providers.map((p, idx) => (
              <TableRow key={p.id} hover>
                <TableCell>{idx + 1}</TableCell>
                <TableCell>{p.code}</TableCell>
                <TableCell>{p.name}</TableCell>
                <TableCell align="center">
                  <Switch
                    checked={p.isActive}
                    onChange={() => handleToggle(p.id)}
                    color="primary"
                  />
                </TableCell>
              </TableRow>
            ))}
            {providers.length === 0 && (
              <TableRow><TableCell colSpan={4} align="center">Không có dữ liệu</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}
