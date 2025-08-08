// index.jsx
"use client"

import { useState, useRef } from "react"
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
import FavoriteProductsChart from "././FavoriteProductsChart"
import TopProductsTable from "./TopProductsTable"
import FavoriteProductsTable from "./FavoriteProductsTable"

import domtoimage from 'dom-to-image';
import jsPDF from "jspdf"
import * as XLSX from "xlsx"
import { saveAs } from "file-saver"
import { dashboardService } from "@/services/admin/dashboardService"
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Hàm formatNumber tương tự như trong StatsCards.jsx
const formatNumber = (num) => {
  if (num === null || num === undefined) {
    return 'N/A';
  }
  if (typeof num !== 'number') {
    num = parseFloat(num);
    if (isNaN(num)) {
      return 'N/A';
    }
  }
  // Định dạng số tiền hoặc số lượng lớn
  // Giữ nguyên logic ban đầu cho định dạng số
  if (Math.abs(num) >= 1000000000) {
    return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
  }
  if (Math.abs(num) >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (Math.abs(num) >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return num.toLocaleString('vi-VN'); // Định dạng số thập phân, ví dụ: 19.383.000
};

export default function Dashboard() {
  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    to: new Date(),
  })
  const [timeFilter, setTimeFilter] = useState("7days")
  const dashboardContentRef = useRef(null)

  // Centralized Card Styling
  const commonCardSx = {
    borderRadius: 4,
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
    display: "flex",
    flexDirection: "column",
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 12px 40px rgba(0, 0, 0, 0.15)",
    },
  };

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

  const handleExportPDF = async () => {
    if (!dashboardContentRef.current) {
      toast.error("Không tìm thấy nội dung để xuất PDF.", { position: "top-right" });
      return;
    }

    const content = dashboardContentRef.current;
    const originalBodyOverflow = document.body.style.overflow;

    try {
      window.scrollTo(0, 0);
      document.body.style.overflow = "hidden";

      await new Promise((resolve) => setTimeout(resolve, 50));

      const imgData = await domtoimage.toPng(content, {
        quality: 0.98,
        bgcolor: "#ffffff",
      });

      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (content.offsetHeight * imgWidth) / content.offsetWidth;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      position += pageHeight;

      while (heightLeft > 0) {
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, -position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        position += pageHeight;
      }

      pdf.save("dashboard_report.pdf");
      toast.success("Xuất PDF thành công!", { position: "top-right" });
    } catch (error) {
      console.error("❌ Lỗi khi xuất PDF (dom-to-image):", error);
      toast.error("Đã xảy ra lỗi khi xuất PDF. Vui lòng thử lại.", { position: "top-right" });
    } finally {
      document.body.style.overflow = originalBodyOverflow;
    }
  };

  const handleExportExcel = async () => {
    try {
      const params = {
        from: dateRange.from ? dateRange.from.toISOString() : "",
        to: dateRange.to ? dateRange.to.toISOString() : "",
      }

      const statsData = await dashboardService.getStats(params)
      const ordersData = await dashboardService.getOrdersByDate({
        from: dateRange?.from?.toISOString().split("T")[0],
        to: dateRange?.to?.toISOString().split("T")[0],
      })
      const revenueData = await dashboardService.getRevenueByDate({
        from: dateRange?.from?.toISOString().split("T")[0],
        to: dateRange?.to?.toISOString().split("T")[0],
      })
      const topSellingProductsData = await dashboardService.getTopSellingProducts(params)
      const favoriteProductsData = await dashboardService.getFavoriteProducts(params)

      const workbook = XLSX.utils.book_new()

      // Helper function to format change values for Excel
      const formatChangeForExcel = (changeValue) => {
        if (typeof changeValue === 'number' && !isNaN(changeValue)) {
          // Áp dụng định dạng tương tự như trên web UI
          // Ví dụ: +38.6% so với kỳ trước
          return `${changeValue >= 0 ? '+' : ''}${changeValue.toFixed(1)}% so với kỳ trước`;
        } else {
          // Mặc định khi không phải số hoặc không có thay đổi
          return '0% so với kỳ trước';
        }
      };

      const statsSheetData = [
        ["Thống kê", "Giá trị", "Thay đổi so với kỳ trước (%)"],
        ["Tổng doanh thu", formatNumber(statsData.totalRevenue), formatChangeForExcel(statsData.revenueChange)],
        ["Tổng đơn hàng", formatNumber(statsData.totalOrders), formatChangeForExcel(statsData.ordersChange)],
        ["Đơn hàng bị hủy", formatNumber(statsData.cancelledOrders), formatChangeForExcel(statsData.cancelledChange)],
        ["Người dùng mới", formatNumber(statsData.newUsers), formatChangeForExcel(statsData.usersChange)],
        // averageRating được gửi từ backend đã được định dạng toFixed(1)
        ["Trung bình đánh giá", (typeof statsData.averageRating === 'number' || typeof statsData.averageRating === 'string' ? parseFloat(statsData.averageRating).toFixed(1) : 'N/A') + '/5', formatChangeForExcel(statsData.ratingChange)], // Cập nhật để phù hợp với output từ backend
      ]
      const statsWorksheet = XLSX.utils.aoa_to_sheet(statsSheetData)
      XLSX.utils.book_append_sheet(workbook, statsWorksheet, "Tổng quan")

      const revenueSheetData = [
        ["Ngày", "Doanh thu"],
        ...revenueData.map((item) => [item.date, formatNumber(item.revenue)]),
      ]
      const revenueWorksheet = XLSX.utils.aoa_to_sheet(revenueSheetData)
      XLSX.utils.book_append_sheet(workbook, revenueWorksheet, "Doanh thu theo ngày")

      const ordersSheetData = [
        ["Ngày", "Số đơn hàng"],
        ...ordersData.map((item) => [item.date, formatNumber(item.orders)]),
      ]
      const ordersWorksheet = XLSX.utils.aoa_to_sheet(ordersSheetData)
      XLSX.utils.book_append_sheet(workbook, ordersWorksheet, "Đơn hàng theo ngày")

      const topSellingProductsSheetData = [
        ["Tên sản phẩm", "Biến thể", "Số lượng bán", "Doanh thu"],
        ...topSellingProductsData.map((item) => [item.name, item.variant, formatNumber(item.sold), formatNumber(item.revenue)]),
      ]
      const topSellingWorksheet = XLSX.utils.aoa_to_sheet(topSellingProductsSheetData)
      XLSX.utils.book_append_sheet(workbook, topSellingWorksheet, "Sản phẩm bán chạy")

      const favoriteProductsSheetData = [
        ["Tên sản phẩm", "Lượt yêu thích"],
        ...favoriteProductsData.map((item) => [item.name, formatNumber(item.wishlistCount)]),
      ]
      const favoriteWorksheet = XLSX.utils.aoa_to_sheet(favoriteProductsSheetData)
      XLSX.utils.book_append_sheet(workbook, favoriteWorksheet, "Sản phẩm yêu thích")

      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" })
      const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" })
      saveAs(dataBlob, "dashboard_report.xlsx")

      toast.success("Xuất Excel thành công!", { position: "top-right" });
    } catch (error) {
      console.error("Lỗi khi xuất Excel:", error)
      toast.error("Đã xảy ra lỗi khi xuất Excel. Vui lòng thử lại.", { position: "top-right" });
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#ffffff",
        py: 4,
      }}
    >
      <Container maxWidth="xl">
        <Paper
          elevation={0}
          sx={{
            p: 4,
            mb: 4,
            borderRadius: 4,
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
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

        <Box ref={dashboardContentRef}>
          <Box mb={4}>
            <StatsCards dateRange={dateRange} />
          </Box>

          <Grid container spacing={4} mb={4}>
            <Grid item xs={12} lg={8}>
              <Card sx={{ ...commonCardSx, height: 520 }}>
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
              <Card sx={{ ...commonCardSx, height: 520 }}>
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

          <Grid container spacing={4} mb={4}>
            <Grid item xs={12} md={6}>
              <Card sx={{ ...commonCardSx, height: 500 }}>
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
                  sx={{ pb: 1, flexShrink: 0 }}
                />
                <CardContent sx={{ pt: 0, flex: 1, display: "flex", flexDirection: "column" }}>
                  <Box sx={{ flex: 1, minHeight: 0 }}>
                    <TopProductsChart dateRange={dateRange} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ ...commonCardSx, height: 500 }}>
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
                  sx={{ pb: 1, flexShrink: 0 }}
                />
                <CardContent sx={{ pt: 0, flex: 1, display: "flex", flexDirection: "column" }}>
                  <Box sx={{ flex: 1, minHeight: 0 }}>
                    <FavoriteProductsChart dateRange={dateRange} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Card sx={{ ...commonCardSx, height: 500 }}>
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
              <Card sx={{ ...commonCardSx, height: 500 }}>
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
        </Box>
      </Container>
      <ToastContainer />
    </Box>
  )
}