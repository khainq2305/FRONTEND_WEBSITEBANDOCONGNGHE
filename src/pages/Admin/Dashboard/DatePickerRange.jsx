"use client"

import { useState } from "react"
import { Box, Button, Popover } from "@mui/material"
import { CalendarToday } from "@mui/icons-material"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { LocalizationProvider } from "@mui/x-date-pickers-pro"
import { StaticDateRangePicker } from "@mui/x-date-pickers-pro/StaticDateRangePicker"

export default function DatePickerRange({ dateRange, setDateRange }) {
  const [anchorEl, setAnchorEl] = useState(null)

  const handleClick = (event) => setAnchorEl(event.currentTarget)
  const handleClose = () => setAnchorEl(null)

  const formatDate = (date) => (date ? new Date(date).toLocaleDateString("vi-VN") : "")

  const open = Boolean(anchorEl)
  const id = open ? "date-range-popover" : undefined

  const handleDateRangeChange = (newDateRange) => {
    if (newDateRange[0] && newDateRange[1]) {
      const adjustedEndDate = new Date(newDateRange[1])
      adjustedEndDate.setHours(23, 59, 59, 999)
      setDateRange({ from: newDateRange[0], to: adjustedEndDate })
      handleClose()
    } else {
      setDateRange({ from: newDateRange[0], to: null })
    }
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box>
        <Button
          variant="outlined"
          startIcon={<CalendarToday />}
          onClick={handleClick}
          aria-describedby={id}
          sx={{
            minWidth: 300,
            borderRadius: 3,
            textTransform: "none",
            fontWeight: 500,
            borderColor: "primary.main",
            color: "primary.main",
            background: "linear-gradient(135deg, rgba(25, 118, 210, 0.05) 0%, rgba(25, 118, 210, 0.1) 100%)",
            "&:hover": {
              borderColor: "primary.dark",
              background: "linear-gradient(135deg, rgba(25, 118, 210, 0.1) 0%, rgba(25, 118, 210, 0.15) 100%)",
              transform: "translateY(-1px)",
              boxShadow: "0 4px 12px rgba(25, 118, 210, 0.2)",
            },
            transition: "all 0.3s ease",
          }}
        >
          {dateRange?.from
            ? dateRange.to
              ? `${formatDate(dateRange.from)} - ${formatDate(dateRange.to)}`
              : `${formatDate(dateRange.from)} - Đang chọn...`
            : "Chọn khoảng ngày"}
        </Button>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          transformOrigin={{ vertical: "top", horizontal: "left" }}
          sx={{
            "& .MuiPaper-root": {
              borderRadius: 3,
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
              border: "1px solid rgba(0, 0, 0, 0.08)",
            },
          }}
        >
          <Box p={2}>
            <StaticDateRangePicker
              value={[dateRange.from, dateRange.to]}
              onChange={handleDateRangeChange}
              slotProps={{
                actionBar: { actions: ["clear", "cancel", "accept"] },
              }}
            />
          </Box>
        </Popover>
      </Box>
    </LocalizationProvider>
  )
}
