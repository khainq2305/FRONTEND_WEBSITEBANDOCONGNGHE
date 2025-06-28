import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  FormLabel,
  CircularProgress,
  Box,
  Typography
} from "@mui/material";
import { toast } from "react-toastify";
import { orderService } from "../../../../services/client/orderService";

export default function ReturnMethodDialog({
  open,
  onClose,
  returnRequestId,
  onSuccess
}) {
  // ----------------------------- state
  const [returnMethod, setReturnMethod] = useState("ghn_pickup");
  const [trackingCode, setTrackingCode] = useState("");
  const [loading, setLoading] = useState(false);

  // ----------------------------- handlers
  const handleSubmit = async () => {
    try {
      setLoading(true);

      /* 1. Lưu phương thức KH chọn */
      const payload = { returnMethod };
      if (returnMethod === "self_send" && trackingCode.trim()) {
        payload.trackingCode = trackingCode.trim();
      }
      await orderService.chooseReturnMethod(returnRequestId, payload);

      /* 2. Nếu KH chọn GHN đến lấy → book pickup */
      if (returnMethod === "ghn_pickup") {
        await orderService.bookReturnPickup(returnRequestId);
        toast.success("Đã đặt GHN đến lấy hàng!");
      } else {
        toast.success("Đã lưu phương thức hoàn hàng!");
      }

      onSuccess?.(); // refetch ở parent
      onClose();
    } catch (err) {
      console.error("[ReturnMethodDialog]", err);
      toast.error(
        err?.response?.data?.message ||
          "Không thể cập nhật phương thức hoàn hàng"
      );
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------- UI
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth              // chiếm fullWidth
      maxWidth="sm"          // rộng hơn mặc định (“xs”) – thử “md” nếu muốn
      sx={{
        "& .MuiDialog-paper": { borderRadius: 3 } // bo góc đẹp
      }}
    >
      <DialogTitle>
        <Typography variant="h6" fontWeight={700}>
          Chọn phương thức hoàn hàng
        </Typography>
      </DialogTitle>

      <DialogContent dividers>
        <FormLabel component="legend" sx={{ mb: 2 }}>
          Vui lòng chọn 1 trong 2 cách
        </FormLabel>

        <RadioGroup
          value={returnMethod}
          onChange={(e) => setReturnMethod(e.target.value)}
        >
          <FormControlLabel
            value="ghn_pickup"
            control={<Radio />}
            label="GHN đến lấy hàng tại nhà"
          />
          <FormControlLabel
            value="self_send"
            control={<Radio />}
            label="Tôi sẽ tự gửi hàng đến shop"
          />
        </RadioGroup>

        {returnMethod === "self_send" && (
          <Box mt={2}>
            <TextField
              label="Mã vận đơn (nếu có)"
              fullWidth
              value={trackingCode}
              onChange={(e) => setTrackingCode(e.target.value)}
              placeholder="VD: VN123456789"
            />
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose}>Huỷ</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          startIcon={loading && <CircularProgress size={18} />}
        >
          {loading ? "Đang xử lý..." : "Xác nhận"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
