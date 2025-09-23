"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Popover,
  TextField,
  Select,
  MenuItem,
} from "@mui/material";
import { DateRange } from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { StaticDateRangePicker } from "@mui/x-date-pickers-pro/StaticDateRangePicker";
import { vi } from "date-fns/locale";

const DatePickerRange = ({ dateRange, setDateRange }) => {
  const today = new Date();
  const [anchorEl, setAnchorEl] = useState(null);
  const [tempValue, setTempValue] = useState([dateRange.from, dateRange.to]);
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1);

  useEffect(() => {
    const start = new Date(today.getFullYear(), today.getMonth(), 1);
    start.setHours(0, 0, 0, 0);
    const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    end.setHours(23, 59, 59, 999);
    setDateRange({ from: start, to: end });
  }, []);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const open = Boolean(anchorEl);

  return (
    <>
      <Button
        onClick={handleClick}
        variant="outlined"
        startIcon={<DateRange />}
      >
        {dateRange.from && dateRange.to
          ? `${dateRange.from.toLocaleDateString("vi-VN")} - ${dateRange.to.toLocaleDateString("vi-VN")}`
          : "Chọn khoảng thời gian"}
      </Button>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Box p={2}>
          <Box display="flex" gap={1} mb={2}>
            {/* Select năm */}
            <Select
              size="small"
              value={selectedYear}
              onChange={(e) => {
                setSelectedYear(e.target.value);
                setSelectedMonth("");
              }}
              sx={{ minWidth: 100 }}
            >
              {Array.from({ length: 101 }).map((_, yi) => {
                const year = 2000 + yi;
                return (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                );
              })}
            </Select>

            {/* Select tháng */}
            <Select
              size="small"
              value={selectedMonth}
              onChange={(e) => {
                const month = e.target.value;
                setSelectedMonth(month);

                const start = new Date(selectedYear, month - 1, 1);
                start.setHours(0, 0, 0, 0);
                const end = new Date(selectedYear, month, 0);
                end.setHours(23, 59, 59, 999);

                setDateRange({ from: start, to: end });
                handleClose();
              }}
              sx={{ minWidth: 120 }}
              disabled={!selectedYear}
            >
              {Array.from({ length: 12 }).map((_, mi) => {
                const month = mi + 1;
                return (
                  <MenuItem key={month} value={month}>
                    Tháng {month}
                  </MenuItem>
                );
              })}
            </Select>
          </Box>

          {/* Date range picker */}
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
            <StaticDateRangePicker
              displayStaticWrapperAs="desktop"
              value={tempValue}
              onChange={(newValue) => {
                if (newValue[0] && newValue[1]) {
                  const newRange = {
                    from: new Date(newValue[0].setHours(0, 0, 0, 0)),
                    to: new Date(newValue[1].setHours(23, 59, 59, 999)),
                  };
                  setDateRange(newRange);
                }
                setTempValue(newValue);
              }}
              shouldDisableDate={(date) => date > new Date()}
              slots={{ actionBar: () => null }}
              renderInput={(startProps, endProps) => (
                <>
                  <TextField {...startProps} />
                  <Box sx={{ mx: 2 }}> đến </Box>
                  <TextField {...endProps} />
                </>
              )}
            />
          </LocalizationProvider>
        </Box>
      </Popover>
    </>
  );
};

export default DatePickerRange;
