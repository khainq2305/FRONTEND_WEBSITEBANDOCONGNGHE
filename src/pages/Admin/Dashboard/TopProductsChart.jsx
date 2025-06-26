"use client"

import { useState, useEffect } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { Box, Typography, CircularProgress, Avatar } from "@mui/material"
import { TrendingUp } from "@mui/icons-material"
import { dashboardService } from "@/services/admin/dashboardService"

const COLORS = ["#1e3a8a", "#3b82f6", "#60a5fa", "#93c5fd", "#dbeafe"]

export default function TopProductsChart({ dateRange }) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const apiData = await dashboardService.getTopSellingProducts({
          from: dateRange.from?.toISOString(),
          to: dateRange.to?.toISOString(),
        })

        if (Array.isArray(apiData)) {
          setData(apiData)
        } else {
          console.warn("API không trả về mảng:", apiData)
          setData([])
        }
      } catch (e) {
        console.error("Lỗi khi lấy top sản phẩm bán chạy:", e)
        setError("Không thể tải biểu đồ sản phẩm bán chạy.")
        setData([])
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [dateRange])

  if (loading)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={300}>
        <CircularProgress sx={{ color: "#1e3a8a" }} />
        <Typography variant="body1" sx={{ ml: 2 }}>
          Đang tải biểu đồ...
        </Typography>
      </Box>
    )

  if (error)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={300}>
        <Typography color="error" variant="body1">
          {error}
        </Typography>
      </Box>
    )

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={300}>
        <Typography variant="body1" color="text.secondary">
          Không có dữ liệu để hiển thị.
        </Typography>
      </Box>
    )
  }
  const totalSold = data.reduce((sum, item) => sum + (item?.sold || 0), 0)
  const chartData = data.map((item, index) => ({
    name: item?.name || "Không có tên",
    value: item?.sold || 0,
    percentage: totalSold > 0 ? Math.round(((item?.sold || 0) / totalSold) * 100) : 0,
    fullName: item?.name || "Không có tên",
    revenue: item?.revenue || 0,
    image: item?.image || "",
    variant: item?.variant || "Không có biến thể",
    color: COLORS[index % COLORS.length],
  }))
  const formatCurrency = (amount) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount || 0)
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <Box
          sx={{
            backgroundColor: "white",
            p: 2.5,
            borderRadius: 3,
            boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
            border: "1px solid rgba(30, 58, 138, 0.2)",
            minWidth: 220,
          }}
        >
          <Box display="flex" alignItems="center" gap={2} mb={1.5}>
            <Avatar src={data.image} alt={data.fullName} variant="rounded" sx={{ width: 48, height: 48 }} />
            <Box>
              <Typography variant="body1" fontWeight="700" color="#333">
                {data.fullName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {data.variant}
              </Typography>
            </Box>
          </Box>
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <TrendingUp sx={{ color: "#1e3a8a", fontSize: 18 }} />
            <Typography variant="body2" fontWeight="600" color="#1e3a8a">
              {data.value} sản phẩm đã bán
            </Typography>
          </Box>
          <Typography variant="body2" fontWeight="600" color="#666">
            {data.percentage}% tổng số lượng bán
          </Typography>
          <Typography variant="body2" fontWeight="600" color="#2e7d32">
            Doanh thu: {formatCurrency(data.revenue)}
          </Typography>
        </Box>
      )
    }
    return null
  }
  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", p: 3 }}>
      <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Box sx={{ width: "60%", height: "100%" }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                outerRadius={120}
                paddingAngle={0}
                dataKey="value"
                stroke="#fff"
                strokeWidth={2}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </Box>
        <Box sx={{ width: "40%", pl: 3 }}>
          {chartData.map((entry, index) => (
            <Box key={index} display="flex" alignItems="center" gap={1.5} mb={1.5}>
              <Box
                sx={{
                  width: 16,
                  height: 16,
                  backgroundColor: entry.color,
                  borderRadius: 1,
                  flexShrink: 0,
                }}
              />
              <Box flex={1}>
                <Typography variant="body2" fontWeight="500" color="#333" sx={{ lineHeight: 1.2 }}>
                  {entry.name.length > 25 ? entry.name.substring(0, 25) + "..." : entry.name}
                </Typography>
              </Box>
              <Typography variant="body2" fontWeight="700" color={entry.color}>
                {entry.percentage}%
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  )
}
