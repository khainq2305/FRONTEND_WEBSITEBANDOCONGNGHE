"use client"

import { useState } from "react"
import {
  Box,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Container,
  Paper,
} from "@mui/material"
import { CalendarToday, Download, PictureAsPdf, TrendingUp } from "@mui/icons-material"
import DatePickerRange from "./DatePickerRange"
import StatsCards from "./StatsCards"
import RevenueChart from "./RevenueChart"
import OrdersChart from "./OrdersChart"
import TopProductsChart from "./TopProductsChart"
import FavoriteProductsChart from "./FavoriteProductsChart"
import TopProductsTable from "./TopProductsTable"
import FavoriteProductsTable from "./FavoriteProductsTable"

export default function Dashboard() {
  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    to: new Date(),
  })
  const [timeFilter, setTimeFilter] = useState("7days")

  const handleTimeFilterChange = (event) => {
    const value = event.target.value
    setTimeFilter(value)
    const today = new Date()

    switch (value) {
      case "today":
        setDateRange({ from: today, to: today })
        break
      case "7days":
        setDateRange({
          from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          to: today,
        })
        break
      case "thisMonth":
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
        setDateRange({ from: startOfMonth, to: endOfMonth })
        break
      case "custom":
        break
    }
  }

  const handleExportPDF = () => {
    console.log("Exporting PDF with date range:", dateRange)
    alert("Xuất PDF thành công!")
  }

  const handleExportExcel = () => {
    console.log("Exporting Excel with date range:", dateRange)
    alert("Xuất Excel thành công!")
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f0f2f5", // Changed to a light grey for subtle background difference
        py: 4,
      }}
    >
      <Container maxWidth="xl">
        {/* Header */}
        <Paper
          elevation={2}
          sx={{
            p: 4,
            mb: 4,
            borderRadius: 4,
            bgcolor: "white", // Set to white
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Box display="flex" alignItems="center" gap={2}>
              <Box
                sx={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  borderRadius: 3,
                  p: 2,
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <TrendingUp />
              </Box>
              <Box>
                <Typography
                  variant="h4"
                  component="h1"
                  fontWeight="bold"
                  sx={{
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Thống kê tổng quan
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Theo dõi hiệu suất kinh doanh của bạn
                </Typography>
              </Box>
            </Box>
            <Box display="flex" gap={2}>
              <Button
                variant="outlined"
                startIcon={<PictureAsPdf />}
                onClick={handleExportPDF}
                sx={{
                  borderRadius: 3,
                  textTransform: "none",
                  fontWeight: 500,
                  borderColor: "#d32f2f",
                  color: "#d32f2f",
                  "&:hover": {
                    borderColor: "#b71c1c",
                    backgroundColor: "rgba(211, 47, 47, 0.04)",
                    transform: "translateY(-1px)",
                    boxShadow: "0 4px 12px rgba(211, 47, 47, 0.2)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                Xuất PDF
              </Button>
              <Button
                variant="outlined"
                startIcon={<Download />}
                onClick={handleExportExcel}
                sx={{
                  borderRadius: 3,
                  textTransform: "none",
                  fontWeight: 500,
                  borderColor: "#2e7d32",
                  color: "#2e7d32",
                  "&:hover": {
                    borderColor: "#1b5e20",
                    backgroundColor: "rgba(46, 125, 50, 0.04)",
                    transform: "translateY(-1px)",
                    boxShadow: "0 4px 12px rgba(46, 125, 50, 0.2)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                Xuất Excel
              </Button>
            </Box>
          </Box>

          {/* Time Filter Controls */}
          <Box display="flex" alignItems="center" gap={3} flexWrap="wrap">
            <Box display="flex" alignItems="center" gap={1}>
              <CalendarToday fontSize="small" sx={{ color: "primary.main" }} />
              <Typography variant="body1" fontWeight="600" color="text.primary">
                Bộ lọc thời gian:
              </Typography>
            </Box>
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel>Chọn khoảng thời gian</InputLabel>
              <Select
                value={timeFilter}
                onChange={handleTimeFilterChange}
                label="Chọn khoảng thời gian"
                sx={{
                  borderRadius: 3,
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "primary.main",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "primary.dark",
                  },
                }}
              >
                <MenuItem value="today">Hôm nay</MenuItem>
                <MenuItem value="7days">7 ngày gần nhất</MenuItem>
                <MenuItem value="thisMonth">Tháng này</MenuItem>
                <MenuItem value="custom">Tùy chọn</MenuItem>
              </Select>
            </FormControl>
            {timeFilter === "custom" && <DatePickerRange dateRange={dateRange} setDateRange={setDateRange} />}
          </Box>
        </Paper>

        {/* Stats Cards */}
        <Box mb={4}>
          <StatsCards dateRange={dateRange} />
        </Box>

        {/* Charts Section - EQUAL HEIGHT */}
        <Grid container spacing={4} mb={4}>
          <Grid item xs={12} lg={8}>
            <Card
              sx={{
                borderRadius: 4,
                bgcolor: "white", // Set to white
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
                height: 520,
                display: "flex",
                flexDirection: "column",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 30px rgba(0, 0, 0, 0.1)",
                },
              }}
            >
              <CardHeader
                title={
                  <Typography variant="h6" component="h2" fontWeight="600" color="text.primary">
                    📈 Biểu đồ doanh thu theo ngày
                  </Typography>
                }
                subheader={
                  <Typography variant="body2" color="text.secondary">
                    Theo dõi xu hướng doanh thu hàng ngày
                  </Typography>
                }
                sx={{ pb: 1, flexShrink: 0 }}
              />
              <CardContent sx={{ pt: 0, flex: 1, display: "flex", flexDirection: "column" }}>
                <Box sx={{ flex: 1, minHeight: 0 }}>
                  <RevenueChart dateRange={dateRange} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} lg={4}>
            <Card
              sx={{
                borderRadius: 4,
                bgcolor: "white", // Set to white
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
                height: 520, // SAME FIXED HEIGHT
                display: "flex",
                flexDirection: "column",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 30px rgba(0, 0, 0, 0.1)",
                },
              }}
            >
              <CardHeader
                title={
                  <Typography variant="h6" component="h2" fontWeight="600" color="text.primary">
                    📦 Số lượng đơn hàng theo ngày
                  </Typography>
                }
                subheader={
                  <Typography variant="body2" color="text.secondary">
                    Thống kê đơn hàng hàng ngày
                  </Typography>
                }
                sx={{ pb: 1, flexShrink: 0 }}
              />
              <CardContent sx={{ pt: 0, flex: 1, display: "flex", flexDirection: "column" }}>
                <Box sx={{ flex: 1, minHeight: 0 }}>
                  <OrdersChart dateRange={dateRange} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Top Products Charts */}
        <Grid container spacing={4} mb={4}>
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                borderRadius: 4,
                bgcolor: "white", // Set to white
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
                height: 450,
                display: "flex",
                flexDirection: "column",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 30px rgba(0, 0, 0, 0.1)",
                },
              }}
            >
              <CardHeader
                title={
                  <Typography variant="h6" component="h2" fontWeight="600" color="text.primary">
                    🔥 Top 5 sản phẩm bán chạy
                  </Typography>
                }
                subheader={
                  <Typography variant="body2" color="text.secondary">
                    Thống kê theo số lượng bán ra
                  </Typography>
                }
                sx={{ pb: 1 }}
              />
              <CardContent sx={{ height: "calc(100% - 80px)", overflow: "auto", pt: 0 }}>
                <TopProductsChart dateRange={dateRange} />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                borderRadius: 4,
                bgcolor: "white", // Set to white
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
                height: 450,
                display: "flex",
                flexDirection: "column",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 30px rgba(0, 0, 0, 0.1)",
                },
              }}
            >
              <CardHeader
                title={
                  <Typography variant="h6" component="h2" fontWeight="600" color="text.primary">
                    ❤️ Top 5 sản phẩm được yêu thích
                  </Typography>
                }
                subheader={
                  <Typography variant="body2" color="text.secondary">
                    Thống kê theo lượt wishlist
                  </Typography>
                }
                sx={{ pb: 1 }}
              />
              <CardContent sx={{ height: "calc(100% - 80px)", overflow: "auto", pt: 0 }}>
                <FavoriteProductsChart dateRange={dateRange} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Top Products Tables - EQUAL HEIGHT */}
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                borderRadius: 4,
                bgcolor: "white", // Set to white
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
                height: 500, // FIXED HEIGHT
                display: "flex",
                flexDirection: "column",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 30px rgba(0, 0, 0, 0.1)",
                },
              }}
            >
              <CardHeader
                title={
                  <Typography variant="h6" component="h2" fontWeight="600" color="text.primary">
                    📊 Bảng sản phẩm bán chạy
                  </Typography>
                }
                subheader={
                  <Typography variant="body2" color="text.secondary">
                    Chi tiết sản phẩm có doanh số cao nhất
                  </Typography>
                }
                sx={{ pb: 1, flexShrink: 0 }}
              />
              <CardContent
                sx={{
                  p: 0,
                  flex: 1,
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Box sx={{ flex: 1, overflow: "auto" }}>
                  <TopProductsTable dateRange={dateRange} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                borderRadius: 4,
                bgcolor: "white", // Set to white
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
                height: 500, // FIXED HEIGHT - SAME AS LEFT TABLE
                display: "flex",
                flexDirection: "column",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 30px rgba(0, 0, 0, 0.1)",
                },
              }}
            >
              <CardHeader
                title={
                  <Typography variant="h6" component="h2" fontWeight="600" color="text.primary">
                    💖 Bảng sản phẩm được yêu thích
                  </Typography>
                }
                subheader={
                  <Typography variant="body2" color="text.secondary">
                    Chi tiết sản phẩm có nhiều lượt wishlist nhất
                  </Typography>
                }
                sx={{ pb: 1, flexShrink: 0 }}
              />
              <CardContent
                sx={{
                  p: 0,
                  flex: 1,
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Box sx={{ flex: 1, overflow: "auto" }}>
                  <FavoriteProductsTable dateRange={dateRange} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}