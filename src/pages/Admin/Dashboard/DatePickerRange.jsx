"use client"

import { useState } from "react"
import { Box, Button, Popover, TextField, Stack } from "@mui/material"
import { CalendarToday } from "@mui/icons-material"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker"

export default function DateTimeRangePicker({ dateRange, setDateRange }) {
  const [anchorEl, setAnchorEl] = useState(null)
  const [tempRange, setTempRange] = useState({ from: null, to: null })

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
    setTempRange(dateRange)
  }

  const handleClose = () => setAnchorEl(null)

  const formatDateTime = (date) =>
    date
      ? new Date(date).toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
      : ""

  const open = Boolean(anchorEl)
  const id = open ? "date-time-range-popover" : undefined

  const handleClear = () => {
    setTempRange({ from: null, to: null })
  }

  const handleCancel = () => handleClose()

  const handleOk = () => {
    if (tempRange.from && tempRange.to) {
      const adjustedEndDate = new Date(tempRange.to)
      adjustedEndDate.setSeconds(59, 999)
      setDateRange({ from: tempRange.from, to: adjustedEndDate })
    } else {
      setDateRange(tempRange)
    }
    handleClose()
  }

  const today = new Date()
  const minDate = new Date("2023-01-01")

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
              ? `${formatDateTime(dateRange.from)} - ${formatDateTime(dateRange.to)}`
              : `${formatDateTime(dateRange.from)} - Đang chọn...`
            : "Chọn ngày & giờ"}
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
              p: 2,
              width: 360,
            },
          }}
        >
          <Stack spacing={2}>
            <DateTimePicker
              label="Từ ngày"
              value={tempRange.from}
              onChange={(newValue) => setTempRange((prev) => ({ ...prev, from: newValue }))}
              disableFuture
              minDateTime={minDate}
              maxDateTime={today}
              renderInput={(params) => <TextField fullWidth {...params} />}
            />
            <DateTimePicker
              label="Đến ngày"
              value={tempRange.to}
              onChange={(newValue) => setTempRange((prev) => ({ ...prev, to: newValue }))}
              disableFuture
              minDateTime={minDate}
              maxDateTime={today}
              renderInput={(params) => <TextField fullWidth {...params} />}
            />
            <Box display="flex" justifyContent="flex-end" gap={1}>
              <Button onClick={handleClear} color="secondary">Clear</Button>
              <Button onClick={handleCancel} color="inherit">Cancel</Button>
              <Button onClick={handleOk} variant="contained" color="primary">OK</Button>
            </Box>
          </Stack>
        </Popover>
      </Box>
    </LocalizationProvider>
  )
}
