"use client";

import { useState } from "react";
import { Box, Button, Popover, Typography } from "@mui/material";
import { CalendarToday } from "@mui/icons-material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers-pro";
import { StaticDateRangePicker } from "@mui/x-date-pickers-pro/StaticDateRangePicker";
import { toast } from "react-toastify";

export default function DatePickerRange({ dateRange, setDateRange, isCustomFilter }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString("vi-VN") : "";

  const open = Boolean(anchorEl);
  const id = open ? "date-range-popover" : undefined;

  const handleDateRangeChange = (newDateRange) => {
    // Chỉ cập nhật state và đóng popover khi có cả ngày bắt đầu và ngày kết thúc hợp lệ
    if (newDateRange[0] && newDateRange[1]) {
      // Đặt giờ, phút, giây, mili giây về cuối ngày để bao gồm trọn vẹn ngày kết thúc
      const adjustedEndDate = new Date(newDateRange[1]);
      adjustedEndDate.setHours(23, 59, 59, 999);
      setDateRange({ from: newDateRange[0], to: adjustedEndDate });
      handleClose();
    } else {
      // Cho phép người dùng chọn một ngày, nhưng không đóng popover
      setDateRange({ from: newDateRange[0], to: null });
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box>
        <Button
          variant="outlined"
          startIcon={<CalendarToday />}
          onClick={handleClick}
          aria-describedby={id}
          sx={{
            minWidth: 280,
            borderRadius: 3,
            textTransform: "none",
            fontWeight: 500,
            borderColor: "primary.main",
            color: "primary.main",
            background: "white",
            px: 2,
            py: 1.2,
            justifyContent: "flex-start",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            "&:hover": {
              borderColor: "primary.dark",
              backgroundColor: "rgba(25, 118, 210, 0.04)",
              transform: "translateY(-1px)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            },
            transition: "all 0.25s ease",
          }}
        >
          <Typography
            variant="body2"
            sx={{ fontWeight: 500, color: "primary.main" }}
          >
            {dateRange?.from
              ? dateRange.to
                ? `${formatDate(dateRange.from)} - ${formatDate(dateRange.to)}`
                : `${formatDate(dateRange.from)} - Đang chọn...`
              : "Chọn khoảng ngày"}
          </Typography>
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
              boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
              border: "1px solid rgba(0,0,0,0.08)",
            },
          }}
        >
          <Box p={2}>
            <StaticDateRangePicker
              value={[dateRange.from, dateRange.to]}
              onChange={handleDateRangeChange}
              displayStaticWrapperAs="desktop"
              calendars={2}
              disableFuture
            />
          </Box>
        </Popover>
      </Box>
    </LocalizationProvider>
  );
}