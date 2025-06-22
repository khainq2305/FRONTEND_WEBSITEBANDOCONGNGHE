"use client"

import { useState, useEffect } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Typography, Box, CircularProgress } from "@mui/material"
import { dashboardService } from "@/services/admin/dashboardService"

export default function RevenueChart({ dateRange }) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const params = {
          from: dateRange?.from?.toISOString().split("T")[0],
          to: dateRange?.to?.toISOString().split("T")[0],
        }

        const response = await dashboardService.getRevenueByDate(params)
        console.log("✅ API trả về:", response)

        if (!Array.isArray(response)) {
          throw new Error("Dữ liệu không phải là mảng")
        }

        setData(response)
      } catch (err) {
        console.error("❌ Lỗi khi lấy dữ liệu:", err)
        setError("Không thể tải biểu đồ doanh thu. Vui lòng thử lại sau.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [dateRange])

  if (loading)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
        <CircularProgress sx={{ color: "#1976d2" }} />
        <Typography variant="body1" sx={{ ml: 2, color: "text.secondary" }}>
          Đang tải biểu đồ...
        </Typography>
      </Box>
    )
  if (error)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
        <Typography color="error" variant="body1">
          {error}
        </Typography>
      </Box>
    )
  if (!data || data.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
        <Typography variant="body1" color="text.secondary">
          Không có dữ liệu để hiển thị.
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ height: "100%", width: "100%", p: 1 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#1976d2" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#1976d2" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="date"
            tickFormatter={(date) => {
              const [y, m, d] = date.split("-")
              return `${d}/${m}`
            }}
            stroke="#666"
            fontSize={12}
          />
          <YAxis stroke="#666" fontSize={12} />
          <Tooltip
            formatter={(v) => [new Intl.NumberFormat("vi-VN").format(v) + "₫", "Doanh thu"]}
            contentStyle={{
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              border: "none",
              borderRadius: "12px",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
              backdropFilter: "blur(10px)",
            }}
          />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#1976d2"
            strokeWidth={3}
            name="Doanh thu"
            dot={{ fill: "#1976d2", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: "#1976d2", strokeWidth: 2, fill: "#fff" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  )
}
