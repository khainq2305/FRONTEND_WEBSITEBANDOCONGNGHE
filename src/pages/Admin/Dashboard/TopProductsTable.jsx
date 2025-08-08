"use client"

import { useState, useEffect } from "react"
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Typography,
  CircularProgress,
} from "@mui/material"
import { dashboardService } from "@/services/admin/dashboardService"

export default function TopProductsTable({ dateRange }) {
  const [products, setProducts] = useState([])
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
        setProducts(apiData)
      } catch (e) {
        console.error("Lỗi khi lấy bảng sản phẩm bán chạy:", e)
        setError("Không thể tải bảng sản phẩm bán chạy. Vui lòng thử lại sau.")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [dateRange])

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount)

  if (loading)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={250}>
        <CircularProgress sx={{ color: "#f57c00" }} />
        <Typography variant="body1" sx={{ ml: 2, color: "text.secondary" }}>
          Đang tải dữ liệu bảng...
        </Typography>
      </Box>
    )

  if (error)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={250}>
        <Typography color="error" variant="body1">
          {error}
        </Typography>
      </Box>
    )

  if (!Array.isArray(products) || products.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={250}>
        <Typography variant="body1" color="text.secondary">
          Không có dữ liệu để hiển thị.
        </Typography>
      </Box>
    )
  }

  return (
    <TableContainer
      component={Paper}
      sx={{
        borderRadius: 0,
        boxShadow: "none",
        height: "100%",
        "& .MuiTable-root": {
          minWidth: "auto",
        },
      }}
    >
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell
              sx={{
                fontWeight: 600,
                backgroundColor: "#f8f9fa",
                borderBottom: "2px solid #e0e0e0",
                fontSize: "0.875rem",
              }}
            >
              Sản phẩm
            </TableCell>
            <TableCell
              align="right"
              sx={{
                fontWeight: 600,
                backgroundColor: "#f8f9fa",
                borderBottom: "2px solid #e0e0e0",
                fontSize: "0.875rem",
              }}
            >
              Số lượng bán
            </TableCell>
            <TableCell
              align="right"
              sx={{
                fontWeight: 600,
                backgroundColor: "#f8f9fa",
                borderBottom: "2px solid #e0e0e0",
                fontSize: "0.875rem",
              }}
            >
              Doanh thu
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((product) => (
            <TableRow
              key={product.id}
              sx={{
                "&:hover": {
                  backgroundColor: "rgba(245, 124, 0, 0.04)",
                },
                "&:nth-of-type(even)": {
                  backgroundColor: "rgba(0, 0, 0, 0.02)",
                },
                transition: "background-color 0.2s ease",
              }}
            >
              <TableCell sx={{ py: 2 }}>
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar
                    src={product.image}
                    alt={product.name}
                    variant="rounded"
                    sx={{
                      width: 48,
                      height: 48,
                      border: "2px solid #f0f0f0",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Typography
                    variant="body2"
                    fontWeight="medium"
                    sx={{
                      maxWidth: 150,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {product.name}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell align="right">
                <Typography
                  variant="body2"
                  fontWeight="600"
                  sx={{
                    color: "#f57c00",
                    backgroundColor: "rgba(245, 124, 0, 0.1)",
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 2,
                    display: "inline-block",
                  }}
                >
                  {product.sold}
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="body2" fontWeight="600" color="success.main">
                  {formatCurrency(product.revenue)}
                </Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
