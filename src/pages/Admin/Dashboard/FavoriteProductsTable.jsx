// FavoriteProductsTable.jsx
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
import { Favorite } from "@mui/icons-material"
import { dashboardService } from "@/services/admin/dashboardService"

export default function FavoriteProductsTable({ dateRange }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        // Đã bỏ dateRange để lấy toàn bộ dữ liệu
        const apiData = await dashboardService.getAllFavoriteProducts()
        setProducts(apiData.data)
      } catch (e) {
        console.error("Lỗi khi lấy bảng sản phẩm yêu thích:", e)
        setError("Không thể tải bảng sản phẩm yêu thích. Vui lòng thử lại sau.")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, []) // Dependency array rỗng để chỉ chạy một lần

  if (loading)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={250}>
        <CircularProgress sx={{ color: "#e91e63" }} />
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
        borderRadius: 3,
        overflow: "hidden",
        boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
        height: "100%",
        "& .MuiTable-root": { minWidth: "100%" },
      }}
    >
      <Table stickyHeader>
        <TableHead sx={{ "& .MuiTableCell-root": { borderBottom: "none" } }}>
          {/* Column header */}
          <TableRow>
            <TableCell
              sx={{
                fontWeight: 700,
                fontSize: "0.875rem",
                backgroundColor: "#fff5f8",
                borderTop: "1px solid rgba(0,0,0,0.06)",
              }}
            >
              SẢN PHẨM
            </TableCell>
            <TableCell
              align="right"
              sx={{
                fontWeight: 700,
                fontSize: "0.875rem",
                backgroundColor: "#fff5f8",
                borderTop: "1px solid rgba(0,0,0,0.06)",
              }}
            >
              LƯỢT YÊU THÍCH
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {products.map((product, index) => (
            <TableRow
              key={product.id ?? `${product.name}-${index}`}
              sx={{
                "&:hover": {
                  backgroundColor: "rgba(233, 30, 99, 0.08)",
                  transform: "translateY(-1px)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                },
                "&:nth-of-type(even)": { backgroundColor: "rgba(0, 0, 0, 0.02)" },
                transition: "all 0.2s ease",
              }}
            >
              <TableCell sx={{ py: 1.5 }}>
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar
                    src={product.image}
                    alt={product.name}
                    variant="rounded"
                    sx={{
                      width: 48,
                      height: 48,
                      border: "2px solid #fff",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Box>
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      sx={{
                        maxWidth: 200,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                      title={product.name}
                    >
                      {product.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Thứ hạng: #{index + 1}
                    </Typography>
                  </Box>
                </Box>
              </TableCell>

              <TableCell align="right">
                <Box
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 0.75,
                    px: 1.25,
                    py: 0.5,
                    borderRadius: 2,
                    backgroundColor: "rgba(233, 30, 99, 0.1)",
                  }}
                >
                  <Favorite sx={{ fontSize: 16, color: "#e91e63" }} />
                  <Typography variant="body2" fontWeight={700} color="#e91e63">
                    {product.wishlistCount}
                  </Typography>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}