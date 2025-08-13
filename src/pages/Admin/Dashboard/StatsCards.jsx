"use client";

import React, { useState, useEffect, useRef } from "react";
import { Typography, Card, Box, CircularProgress } from "@mui/material";
import { TrendingUp, ShoppingCart, Cancel, PersonAdd, Star } from "@mui/icons-material";
import { dashboardService } from "@/services/admin/dashboardService";
import { formatNumber } from "@/utils/formatNumber";

const statsInfo = [
  {
    label: "Tổng doanh thu",
    key: "totalRevenue",
    icon: TrendingUp,
    gradient: "linear-gradient(135deg, #42a5f5 0%, #1976d2 100%)",
  },
  {
    label: "Số đơn hàng",
    key: "totalOrders",
    icon: ShoppingCart,
    gradient: "linear-gradient(135deg, #66bb6a 0%, #2e7d32 100%)",
  },
  {
    label: "Số đơn hủy",
    key: "cancelledOrders",
    icon: Cancel,
    gradient: "linear-gradient(135deg, #ef5350 0%, #d32f2f 100%)",
  },
  {
    label: "Người dùng mới",
    key: "newUsers",
    icon: PersonAdd,
    gradient: "linear-gradient(135deg, #29b6f6 0%, #0288d1 100%)",
  },
  {
    label: "Trung bình đánh giá",
    key: "averageRating",
    icon: Star,
    gradient: "linear-gradient(135deg, #ffb74d 0%, #f57c00 100%)",
  },
];

const StatsCards = ({ dateRange }) => {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Xóa các state và ref liên quan đến việc cuộn ngang
  // const scrollRef = useRef(null);
  // const [isDragging, setIsDragging] = useState(false);
  // const [startX, setStartX] = useState(0);
  // const [scrollLeft, setScrollLeft] = useState(0);

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
          totalRevenue: parseFloat(data.totalRevenue) || 0,
          totalOrders: parseInt(data.totalOrders) || 0,
          cancelledOrders: parseInt(data.cancelledOrders) || 0,
          newUsers: parseInt(data.newUsers) || 0,
          averageRating: parseFloat(data.averageRating) || 0,
          revenueChange: parseFloat(data.revenueChange) || 0,
          ordersChange: parseFloat(data.ordersChange) || 0,
          cancelledChange: parseFloat(data.cancelledChange) || 0,
          usersChange: parseFloat(data.usersChange) || 0,
          ratingChange: parseFloat(data.ratingChange) || 0,
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

  // Xóa các hàm xử lý sự kiện cuộn
  // const handleMouseDown = (e) => {
  //   setIsDragging(true);
  //   setStartX(e.pageX - scrollRef.current.offsetLeft);
  //   setScrollLeft(scrollRef.current.scrollLeft);
  // };

  // const handleMouseLeave = () => setIsDragging(false);
  // const handleMouseUp = () => setIsDragging(false);
  // const handleMouseMove = (e) => {
  //   if (!isDragging) return;
  //   e.preventDefault();
  //   const x = e.pageX - scrollRef.current.offsetLeft;
  //   const walk = (x - startX) * 1.5;
  //   scrollRef.current.scrollLeft = scrollLeft - walk;
  // };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={150}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" sx={{ textAlign: "center", mt: 2 }}>
        {error}
      </Typography>
    );
  }

  return (
    <Box
      // Xóa các props và sx liên quan đến cuộn ngang
      // ref={scrollRef}
      // onMouseDown={handleMouseDown}
      // onMouseLeave={handleMouseLeave}
      // onMouseUp={handleMouseUp}
      // onMouseMove={handleMouseMove}
      sx={{
        display: "flex",
        gap: 2.5,
        flexWrap: "wrap", // Thêm thuộc tính này để các thẻ tự xuống dòng nếu không đủ chỗ
        justifyContent: "space-between", // Căn đều 5 thẻ trên 1 hàng
        mb: 4,
        // overflowX: "auto",
        paddingBottom: 1,
        // scrollBehavior: "smooth",
        // cursor: isDragging ? "grabbing" : "grab",
        userSelect: "none",
        "&::-webkit-scrollbar": {
          display: "none",
        },
      }}
    >
      {statsInfo.map((info) => {
        const changeKey = `${info.key
          .replace("total", "")
          .replace("cancelled", "")
          .replace("new", "")
          .replace("averageRating", "")
          .toLowerCase()}Change`;
        const changeValue = stats?.[changeKey];
        let rawValue = stats?.[info.key];

        if (info.key === "averageRating" && typeof rawValue === "string") {
          rawValue = parseFloat(rawValue);
        }

        const displayValue =
          info.key === "averageRating"
            ? typeof rawValue === "number" && !isNaN(rawValue)
              ? rawValue.toFixed(1) + "/5"
              : "N/A"
            : rawValue !== undefined && rawValue !== null
            ? formatNumber(rawValue)
            : "N/A";

        const displayChange =
          typeof changeValue === "number" && !isNaN(changeValue)
            ? `${changeValue >= 0 ? "+" : ""}${changeValue.toFixed(1)}% so với trước`
            : "0% so với trước";

        return (
          <Card
            key={info.key}
            sx={{
              flexShrink: 0,
              flexGrow: 1,
              minWidth: {
                xs: "100%",
                md: "calc(20% - 20px)",
              },
              display: "flex",
              alignItems: "center",
              p: 2.5,
              borderRadius: 3,
              // Điều chỉnh box shadow để đồng bộ
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 12px 40px rgba(0, 0, 0, 0.15)",
              },
            }}
          >
            <Box
              sx={{
                background: info.gradient,
                borderRadius: 2,
                p: 1.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minWidth: 52,
                minHeight: 52,
              }}
            >
              <info.icon sx={{ color: "white", fontSize: 28 }} />
            </Box>

            <Box sx={{ ml: 2, flex: 1 }}>
              <Typography
                variant="body2"
                sx={{ fontWeight: 500, color: "text.secondary", mb: 0.5 }}
              >
                {info.label}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  fontSize: '1.25rem',
                  background: info.gradient,
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {displayValue}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: changeValue >= 0 ? "success.main" : "error.main",
                }}
              >
                {displayChange}
              </Typography>
            </Box>
          </Card>
        );
      })}
    </Box>
  );
};

export default StatsCards;