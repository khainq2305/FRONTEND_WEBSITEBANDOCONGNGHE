"use client"

import React, { useState, useEffect, useRef } from 'react';
import {
  Typography,
  Card,
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
    gradient: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)"
  },
  {
    label: 'Số đơn hàng',
    key: 'totalOrders',
    icon: ShoppingCart,
    gradient: "linear-gradient(135deg, #2e7d32 0%, #66bb6a 100%)"
  },
  {
    label: 'Số đơn hủy',
    key: 'cancelledOrders',
    icon: Cancel,
    gradient: "linear-gradient(135deg, #d32f2f 0%, #ef5350 100%)"
  },
  {
    label: 'Người dùng mới',
    key: 'newUsers',
    icon: PersonAdd,
    gradient: "linear-gradient(135deg, #0288d1 0%, #29b6f6 100%)"
  },
  {
    label: 'Trung bình đánh giá',
    key: 'averageRating',
    icon: Star,
    gradient: "linear-gradient(135deg, #f57c00 0%, #ffb74d 100%)"
  }
];

const commonCardSx = {
  borderRadius: 4,
  background: "rgba(255, 255, 255, 0.95)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  display: "flex",
  flexDirection: "column",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-4px)",
  },
};

const StatsCards = ({ dateRange }) => {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

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

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseUp = () => setIsDragging(false);
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={350}>
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
      ref={scrollRef}
      onMouseDown={handleMouseDown}
      onMouseLeave={handleMouseLeave}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      sx={{
        display: 'flex',
        gap: 3,
        flexWrap: 'nowrap',
        justifyContent: 'flex-start',
        mb: 4,
        overflowX: 'auto',
        paddingBottom: 1,
        scrollBehavior: 'smooth',
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none',
        '&::-webkit-scrollbar': {
          display: 'none',
        },
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

        const isUserCard = info.key === 'newUsers';

        return (
          <Box
            key={info.key}
            sx={{
              minWidth: {
                xs: 'calc(100% / 1.2)',
                sm: 'calc(100% / 1.8)',
                md: 'calc(100% / 2.2)',
                lg: 'calc(100% / 4)',
                xl: 'calc(100% / 4)',
              },
              flexShrink: 0
            }}
          >
            <Card
              sx={{
                ...commonCardSx,
                p: 2.5,
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Box
                sx={{
                  background: isUserCard ? '#29b6f6' : info.gradient,
                  borderRadius: 2,
                  p: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: 48,
                  minHeight: 48,
                }}
              >
                <info.icon
                  sx={{
                    color: 'white',
                    fontSize: 24
                  }}
                />
              </Box>

              <Box sx={{ ml: 2, flex: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary', mb: 0.5 }}>
                  {info.label}
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    fontSize: '1.5rem',
                    color: isUserCard ? '#0288d1' : 'transparent',
                    background: isUserCard ? 'none' : info.gradient,
                    backgroundClip: isUserCard ? 'unset' : 'text',
                    WebkitBackgroundClip: isUserCard ? 'unset' : 'text',
                    WebkitTextFillColor: isUserCard ? 'unset' : 'transparent',
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
