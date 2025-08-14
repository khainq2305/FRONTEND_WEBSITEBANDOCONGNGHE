"use client"

import { useState, useEffect } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Typography, Box, CircularProgress } from "@mui/material"
import { dashboardService } from "@/services/admin/dashboardService"

function ChartStatus({ loading, error, data }) {
  if (loading)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={350}>
        <CircularProgress sx={{ color: "#2e7d32" }} />
        <Typography variant="body1" sx={{ ml: 2, color: "text.secondary" }}>Đang tải biểu đồ...</Typography>
      </Box>
    );

  if (error)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={350}>
        <Typography color="error" variant="body1">{error}</Typography>
      </Box>
    );

  if (!Array.isArray(data) || data.length === 0)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={350}>
        <Typography variant="body1" color="text.secondary">Không có dữ liệu để hiển thị.</Typography>
      </Box>
    );

  return null;
}

export default function OrdersChart({ dateRange }) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchOrdersData = async () => {
      setLoading(true)
      setError(null)

      try {
        const params = {
          from: dateRange?.from?.toISOString().split("T")[0],
          to: dateRange?.to?.toISOString().split("T")[0],
        }

        const response = await dashboardService.getOrdersByDate(params)
        console.log("✅ OrdersChart API data:", response)

        if (!Array.isArray(response)) {
          throw new Error("Dữ liệu đơn hàng không phải mảng!")
        }

        setData(response)
      } catch (err) {
        console.error("❌ Lỗi khi lấy dữ liệu OrdersChart:", err)
        setError("Không thể tải biểu đồ đơn hàng. Vui lòng thử lại sau.")
        setData([])
      } finally {
        setLoading(false)
      }
    }

    fetchOrdersData()
  }, [dateRange])

  const status = ChartStatus({ loading, error, data });
  if (status) return status;

  return (
    <Box sx={{ height: "100%", width: "100%", p: 1 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <defs>
            <linearGradient id="ordersGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2e7d32" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#66bb6a" stopOpacity={0.6} />
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
            formatter={(value) => [`${value} đơn`, "Số đơn hàng"]}
            contentStyle={{
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              border: "none",
              borderRadius: "12px",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
              backdropFilter: "blur(10px)",
            }}
          />
          <Bar dataKey="orders" fill="url(#ordersGradient)" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  )
}