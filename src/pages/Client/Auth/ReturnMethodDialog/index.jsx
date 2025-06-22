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
} from "@mui/material";
import { orderService } from "../../../../services/client/orderService";

export default function ReturnMethodDialog({ open, onClose, returnRequestId, onSuccess }) {
  const [returnMethod, setReturnMethod] = useState("ghn_pickup");
  const [trackingCode, setTrackingCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const data = { returnMethod };
      if (returnMethod === "self_send" && trackingCode.trim()) {
        data.trackingCode = trackingCode.trim();
      }

      await orderService.chooseReturnMethod(returnRequestId, data);
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error("Lỗi khi chọn phương thức hoàn hàng:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Chọn phương thức hoàn hàng</DialogTitle>
      <DialogContent>
        <FormLabel component="legend">Vui lòng chọn 1 trong 2 cách:</FormLabel>
        <RadioGroup
          value={returnMethod}
          onChange={(e) => setReturnMethod(e.target.value)}
        >
          <FormControlLabel value="ghn_pickup" control={<Radio />} label="GHN đến lấy hàng tại nhà" />
          <FormControlLabel value="self_send" control={<Radio />} label="Tôi sẽ tự gửi hàng đến shop" />
        </RadioGroup>

        {returnMethod === "self_send" && (
          <TextField
            label="Mã vận đơn (nếu có)"
            fullWidth
            margin="normal"
            value={trackingCode}
            onChange={(e) => setTrackingCode(e.target.value)}
            placeholder="VD: VN123456789"
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Huỷ</Button>
        <Button onClick={handleSubmit} disabled={loading} variant="contained">
          {loading ? <CircularProgress size={20} /> : "Xác nhận"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
