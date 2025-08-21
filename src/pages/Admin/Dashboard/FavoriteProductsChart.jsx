"use client"

import { useState, useEffect } from "react"
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
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
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={300}>
        <CircularProgress sx={{ color: "#e91e63" }} />
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

  if (data.length === 0)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={300}>
        <Typography variant="body1" color="text.secondary">
          Không có dữ liệu để hiển thị.
        </Typography>
      </Box>
    )

  return (
    <Box sx={{ p: 2 }}>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} layout="horizontal" margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <defs>
            <linearGradient id="favoriteGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="5%" stopColor="#e91e63" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#f48fb1" stopOpacity={0.6} />
            </linearGradient>
          </defs>
          <XAxis type="number" stroke="#666" fontSize={12} />
          <YAxis dataKey="name" type="category" width={120} fontSize={12} stroke="#666" />
          <Tooltip
            formatter={(value) => [value, "Lượt yêu thích"]}
            contentStyle={{
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              border: "none",
              borderRadius: "12px",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
              backdropFilter: "blur(10px)",
            }}
          />
          <Bar dataKey="wishlist" fill="url(#favoriteGradient)" radius={[0, 8, 8, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  )
}
