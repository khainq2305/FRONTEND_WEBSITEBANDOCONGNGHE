// FavoriteProductsChart.jsx
"use client"

import { useState, useEffect } from "react"
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts"
import { Box, Typography, CircularProgress } from "@mui/material"
import { dashboardService } from "@/services/admin/dashboardService"

export default function FavoriteProductsChart({ dateRange }) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchFavoriteProducts = async () => {
      setLoading(true)
      setError(null)
      try {
        const apiData = await dashboardService.getFavoriteProducts({
          from: dateRange.from?.toISOString(),
          to: dateRange.to?.toISOString(),
        })

        const formattedData = apiData.map((item) => ({
          name: item.name,
          wishlist: item.wishlistCount,
        }))
        setData(formattedData)
      } catch (e) {
        console.error("Lỗi khi lấy dữ liệu top sản phẩm yêu thích:", e)
        setError("Không thể tải biểu đồ sản phẩm yêu thích. Vui lòng thử lại sau.")
      } finally {
        setLoading(false)
      }
    }

    fetchFavoriteProducts()
  }, [dateRange])

  if (loading)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={350}>
        <CircularProgress sx={{ color: "#FF8A65" }} />
        <Typography variant="body1" sx={{ ml: 2, color: "text.secondary" }}>
          Đang tải biểu đồ...
        </Typography>
      </Box>
    )

  if (error)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={350}>
        <Typography color="error" variant="body1">
          {error}
        </Typography>
      </Box>
    )

  if (data.length === 0)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={350}>
        <Typography variant="body1" color="text.secondary">
          Không có dữ liệu để hiển thị.
        </Typography>
      </Box>
    )

  return (
    <Box sx={{ height: "100%", width: "100%", p: 1 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="horizontal" margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <defs>
            <linearGradient id="favoriteGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="5%" stopColor="#FFAB91" stopOpacity={0.9} /> {/* Light coral/orange */}
              <stop offset="95%" stopColor="#FF8A65" stopOpacity={0.7} /> {/* Medium coral/orange */}
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false} opacity={0.5} />
          <XAxis
            dataKey="name"
            type="category"
            stroke="#555"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            interval={0}
            tickFormatter={(value) => (value.length > 15 ? value.substring(0, 12) + '...' : value)}
          />
          <YAxis
            type="number"
            dataKey="wishlist"
            width={80}
            fontSize={12}
            stroke="#555"
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            formatter={(value, name, props) => [`${props.payload.name}: ${value} lượt yêu thích`]}
            contentStyle={{
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              border: "none",
              borderRadius: "8px",
              boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
            }}
          />
          <Bar dataKey="wishlist" fill="url(#favoriteGradient)" radius={[0, 5, 5, 0]} barSize={18} />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  )
}