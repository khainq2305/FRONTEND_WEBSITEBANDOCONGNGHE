"use client"

import { useState, useEffect } from "react"
import { Box, Card, CardContent, Typography, Grid, CircularProgress } from "@mui/material"
import { TrendingUp, ShoppingCart, People, Star, Cancel } from "@mui/icons-material"
import { dashboardService } from "@/services/admin/dashboardService"

export default function StatsCards({ dateRange }) {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    cancelledOrders: 0,
    newUsers: 0,
    averageRating: 0,
    revenueChange: 0,
    ordersChange: 0,
    cancelledChange: 0,
    usersChange: 0,
    ratingChange: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true)
      setError(null)
      try {
        const params = {
          from: dateRange.from ? dateRange.from.toISOString() : "",
          to: dateRange.to ? dateRange.to.toISOString() : "",
        }
        const data = await dashboardService.getStats(params)

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
        })
      } catch (e) {
        console.error("Lỗi khi lấy dữ liệu thống kê:", e)
        setError("Không thể tải dữ liệu thống kê. Vui lòng thử lại sau.")
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [dateRange])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount)
  }

  const getChangeDisplay = (value) => {
    const numValue = Number.parseFloat(value)
    if (isNaN(numValue)) return value
    if (numValue > 0) return `+${numValue}%`
    if (numValue < 0) return `${numValue}%`
    return `0%`
  }

  const getRatingChangeDisplay = (value) => {
    const numValue = Number.parseFloat(value)
    if (isNaN(numValue)) return value
    if (numValue > 0) return `+${numValue}`
    if (numValue < 0) return `${numValue}`
    return "0"
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={150}>
        <CircularProgress />
        <Typography variant="body1" sx={{ ml: 2 }}>
          Đang tải dữ liệu thống kê...
        </Typography>
      </Box>
    )
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={150}>
        <Typography color="error" variant="body1">
          {error}
        </Typography>
      </Box>
    )
  }

  const statsData = [
    {
      title: "Tổng doanh thu",
      value: formatCurrency(stats.totalRevenue),
      change: getChangeDisplay(stats.revenueChange),
      icon: <TrendingUp />,
      color: "#1976d2",
      gradient: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
    },
    {
      title: "Số đơn hàng",
      value: stats.totalOrders,
      change: getChangeDisplay(stats.ordersChange),
      icon: <ShoppingCart />,
      color: "#2e7d32",
      gradient: "linear-gradient(135deg, #2e7d32 0%, #66bb6a 100%)",
    },
    {
      title: "Số đơn hủy",
      value: stats.cancelledOrders,
      change: getChangeDisplay(stats.cancelledChange),
      icon: <Cancel />,
      color: "#d32f2f",
      gradient: "linear-gradient(135deg, #d32f2f 0%, #ef5350 100%)",
    },
    {
      title: "Người dùng mới",
      value: stats.newUsers,
      change: getChangeDisplay(stats.usersChange),
      icon: <People />,
      color: "#0288d1",
      gradient: "linear-gradient(135deg, #0288d1 0%, #29b6f6 100%)",
    },
    {
      title: "Trung bình đánh giá",
      value: `${stats.averageRating}/5`,
      change: getRatingChangeDisplay(stats.ratingChange),
      icon: <Star />,
      color: "#f57c00",
      gradient: "linear-gradient(135deg, #f57c00 0%, #ffb74d 100%)",
    },
  ]

  return (
    <Grid container spacing={3}>
      {statsData.map((stat, index) => (
        <Grid item xs={12} sm={6} md={2.4} key={index}>
          <Card
            sx={{
              borderRadius: 4,
              background: "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.95) 100%)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
              transition: "all 0.3s ease",
              height: 160, // FIXED HEIGHT FOR ALL CARDS
              display: "flex",
              flexDirection: "column",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 12px 40px rgba(0, 0, 0, 0.12)",
              },
            }}
          >
            <CardContent sx={{ p: 3, flex: 1, display: "flex", alignItems: "center" }}>
              <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
                <Box flex={1}>
                  <Typography
                    color="textSecondary"
                    gutterBottom
                    variant="body2"
                    sx={{
                      fontWeight: 500,
                      mb: 1,
                      fontSize: "0.75rem",
                      lineHeight: 1.2,
                    }}
                  >
                    {stat.title}
                  </Typography>
                  <Typography
                    variant="h5"
                    component="h2"
                    sx={{
                      fontWeight: 700,
                      mb: 1,
                      background: stat.gradient,
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      fontSize: "1.5rem",
                      lineHeight: 1.2,
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: stat.change.startsWith("-") ? "#d32f2f" : "#2e7d32",
                      fontWeight: 600,
                      fontSize: "0.75rem",
                      lineHeight: 1.2,
                    }}
                  >
                    {stat.change} so với kỳ trước
                  </Typography>
                </Box>
                <Box
                  sx={{
                    background: stat.gradient,
                    borderRadius: 3,
                    p: 1.5,
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minWidth: 48,
                    minHeight: 48,
                    boxShadow: `0 4px 20px ${stat.color}40`,
                    flexShrink: 0,
                    ml: 2,
                  }}
                >
                  {stat.icon}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}
