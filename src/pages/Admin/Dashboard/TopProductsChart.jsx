"use client"

import { useState, useEffect } from "react"
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Box, Typography, CircularProgress } from "@mui/material"
import { dashboardService } from "@/services/admin/dashboardService"

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
        setData(apiData)
      } catch (e) {
        console.error("Lỗi khi lấy top sản phẩm bán chạy:", e)
        setError("Không thể tải biểu đồ sản phẩm bán chạy. Vui lòng thử lại sau.")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [dateRange])

  if (loading)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={300}>
        <CircularProgress sx={{ color: "#f57c00" }} />
        <Typography variant="body1" sx={{ ml: 2, color: "text.secondary" }}>
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

  return (
    <Box sx={{ p: 2 }}>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} layout="horizontal" margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <defs>
            <linearGradient id="topProductsGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="5%" stopColor="#f57c00" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#ffb74d" stopOpacity={0.6} />
            </linearGradient>
          </defs>
          <XAxis type="number" stroke="#666" fontSize={12} />
          <YAxis dataKey="name" type="category" width={120} fontSize={12} stroke="#666" />
          <Tooltip
            formatter={(value) => [value, "Đã bán"]}
            contentStyle={{
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              border: "none",
              borderRadius: "12px",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
              backdropFilter: "blur(10px)",
            }}
          />
          <Bar dataKey="sold" fill="url(#topProductsGradient)" radius={[0, 8, 8, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  )
}
