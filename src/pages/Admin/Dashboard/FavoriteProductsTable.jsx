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
  }, [])

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
        borderRadius: 2, // Giảm bo tròn góc
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)", // Giảm độ đổ bóng
        "& .MuiTable-root": { minWidth: "100%" },
      }}
    >
      <Table stickyHeader size="small"> {/* Sử dụng size="small" */}
        <TableHead>
          <TableRow>
            <TableCell
              sx={{
                fontWeight: 600,
                fontSize: "0.8rem", // Giảm kích thước font
                backgroundColor: "#fff5f8",
                borderBottom: "none",
              }}
            >
              SẢN PHẨM
            </TableCell>
            <TableCell
              align="right"
              sx={{
                fontWeight: 600,
                fontSize: "0.8rem", // Giảm kích thước font
                backgroundColor: "#fff5f8",
                borderBottom: "none",
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
                  backgroundColor: "rgba(233, 30, 99, 0.05)",
                },
                "&:nth-of-type(even)": { backgroundColor: "rgba(0, 0, 0, 0.01)" },
                transition: "all 0.2s ease",
              }}
            >
              <TableCell sx={{ py: 0.5 }}> {/* Giảm padding */}
                <Box display="flex" alignItems="center" gap={1}> {/* Giảm khoảng cách */}
                  <Avatar
                    src={product.image}
                    alt={product.name}
                    variant="rounded"
                    sx={{
                      width: 40, // Giảm kích thước avatar
                      height: 40, // Giảm kích thước avatar
                    }}
                  />
                  <Box>
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      sx={{
                        maxWidth: 200, // Giảm max width
                        fontSize: "0.875rem",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                      title={product.name}
                    >
                      {product.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.75rem" }}>
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
                    gap: 0.5, // Giảm khoảng cách
                    px: 1, // Giảm padding
                    py: 0.25, // Giảm padding
                    borderRadius: 1.5,
                    backgroundColor: "rgba(233, 30, 99, 0.1)",
                  }}
                >
                  <Favorite sx={{ fontSize: 14, color: "#e91e63" }} /> {/* Giảm kích thước icon */}
                  <Typography variant="body2" fontWeight={700} color="#e91e63" sx={{ fontSize: "0.8rem" }}>
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