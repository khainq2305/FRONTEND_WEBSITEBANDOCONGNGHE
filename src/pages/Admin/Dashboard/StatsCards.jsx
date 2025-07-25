"use client"

import React, { useState, useEffect } from 'react';
import {
  Typography,
  Card,
  CardContent,
  Box,
  CircularProgress
} from '@mui/material';
import { TrendingUp, ShoppingCart, Cancel, PersonAdd, Star } from '@mui/icons-material';
import { dashboardService } from '@/services/admin/dashboardService';
import { formatNumber } from '@/utils/formatNumber';

const statsInfo = [
  {
    label: 'Tổng doanh thu',
    key: 'totalRevenue',
    icon: TrendingUp,
    color: '#1976d2',
    gradient: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)"
  },
  {
    label: 'Số đơn hàng',
    key: 'totalOrders',
    icon: ShoppingCart,
    color: '#2e7d32',
    gradient: "linear-gradient(135deg, #2e7d32 0%, #66bb6a 100%)"
  },
  {
    label: 'Số đơn hủy',
    key: 'cancelledOrders',
    icon: Cancel,
    color: '#d32f2f',
    gradient: "linear-gradient(135deg, #d32f2f 0%, #ef5350 100%)"
  },
  {
    label: 'Người dùng mới',
    key: 'newUsers',
    icon: PersonAdd,
    color: '#0288d1',
    gradient: "linear-gradient(135deg, #0288d1 0%, #29b6f6 100%)"
  },
  {
    label: 'Trung bình đánh giá',
    key: 'averageRating',
    icon: Star,
    color: '#f57c00',
    gradient: "linear-gradient(135deg, #f57c00 0%, #ffb74d 100%)"
  }
];

const StatsCards = ({ dateRange }) => {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = {
          from: dateRange.from ? dateRange.from.toISOString() : "",
          to: dateRange.to ? dateRange.to.toISOString() : "",
        };
        const data = await dashboardService.getStats(params);

        setStats({
          totalRevenue: Number.parseFloat(data.totalRevenue) || 0,
          totalOrders: Number.parseInt(data.totalOrders) || 0,
          cancelledOrders: Number.parseInt(data.cancelledOrders) || 0,
          newUsers: Number.parseInt(data.newUsers) || 0,
          averageRating: Number.parseFloat(data.averageRating) || 0,
          revenueChange: Number.parseFloat(data.revenueChange) || 0,
          ordersChange: Number.parseFloat(data.ordersChange) || 0,
          cancelledChange: Number.parseFloat(data.cancelledChange) || 0,
          usersChange: Number.parseFloat(data.usersChange) || 0,
          ratingChange: Number.parseFloat(data.ratingChange) || 0,
        });
      } catch (err) {
        console.error("Lỗi khi tải thống kê dashboard:", err);
        setError("Không thể tải thống kê.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, [dateRange]);

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" sx={{ textAlign: 'center', mt: 2 }}>
        {error}
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 3, // Keep the gap
        flexWrap: 'nowrap', // Force items into a single row
        justifyContent: 'space-between', // Distribute space between items
        mb: 4,
        overflowX: 'auto', // Enable horizontal scrolling if total width exceeds container
        paddingBottom: 1 // Add some padding for scrollbar visibility
      }}
    >
      {statsInfo.map((info) => {
        const changeKey = `${info.key.replace('total', '').replace('cancelled', '').replace('new', '').replace('averageRating', '').toLowerCase()}Change`;
        const changeValue = stats?.[changeKey];
        let rawValue = stats?.[info.key];

        if (info.key === 'averageRating' && typeof rawValue === 'string') {
          rawValue = parseFloat(rawValue);
        }

        const displayValue = info.key === 'averageRating'
          ? (typeof rawValue === 'number' && !isNaN(rawValue) ? rawValue.toFixed(1) : 'N/A') + '/5'
          : (rawValue !== undefined && rawValue !== null ? formatNumber(rawValue) : 'N/A');

        const displayChange =
          typeof changeValue === 'number' && !isNaN(changeValue)
            ? `${changeValue >= 0 ? '+' : ''}${changeValue.toFixed(1)}% so với trước`
            : '0% so với trước';

        return (
          <Box
            key={info.key}
            sx={{
              // Adjust minWidth based on desired responsiveness
              minWidth: {
                xs: '200px', // On extra small screens, ensure a minimum width. Will scroll horizontally.
                sm: '220px', // On small screens
                md: 'calc((100% / 3) - 16px)', // Example: 3 items per row on medium screens (adjust 16px based on actual gap)
                lg: 'calc((100% / 5) - 24px)', // Example: 5 items per row on large screens.
                // (4 gaps of 24px = 96px total gap across 5 items. 96px / 5 items = 19.2px per item.
                // So, each item should be 20% - 19.2px. Simpler to use `calc((100% / 5) - gap_value_in_px)`)
                xl: 'calc((100% / 5) - 24px)', // Consistent with large screens
              },
              flexShrink: 0, // Prevents cards from shrinking below their minWidth
              flexGrow: 1 // Allows cards to grow if there's extra space (up to their content's natural width or maxWidth if set)
            }}
          >
            <Card
              sx={{
                p: 2.5,
                borderRadius: 3,
                display: 'flex',
                alignItems: 'center',
                boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                transition: '0.3s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
                }
              }}
            >
              <Box
                sx={{
                  background: info.gradient,
                  borderRadius: 2,
                  p: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: 48,
                  minHeight: 48,
                  boxShadow: `0 4px 12px ${info.color}33`,
                }}
              >
                <info.icon sx={{ color: 'white', fontSize: 24 }} />
              </Box>

              <Box sx={{ ml: 2, flex: 1 }}>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 500, color: 'text.secondary', mb: 0.5 }}
                >
                  {info.label}
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    fontSize: '1.5rem',
                    background: info.gradient,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {displayValue}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: changeValue >= 0 ? 'success.main' : 'error.main'
                  }}
                >
                  {displayChange}
                </Typography>
              </Box>
            </Card>
          </Box>
        );
      })}
    </Box>
  );
};

export default StatsCards;