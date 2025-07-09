"use client"

import { useState } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material"


export default function ExportStockDialog({ open, onClose, skuName, currentStock, onSubmit }) {
  const [formData, setFormData] = useState({
    quantity: "",
    reason: "sale",
    recipient: "",
    note: "",
    reference: "",
  })

  const handleSubmit = () => {
    const finalData = {
      ...formData,
      stockBefore: currentStock,
      stockAfter: Number(currentStock) - Number(formData.quantity),
      type: 'export'
    };

    console.log("👉 Data gửi lên cha:", finalData);
    onSubmit(finalData); // ✅ GỌI callback để cha chạy API!
    onClose()
    // Reset form
    setFormData({
      quantity: "",
      price: "",
      supplier: "Apple Inc.",
      note: "",
      reference: "",
    })
  }

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const reasons = [
    { value: "sale", label: "Bán hàng" },
    { value: "transfer", label: "Chuyển kho" },
    { value: "damaged", label: "Hỏng hóc" },
    { value: "return", label: "Trả hàng" },
    { value: "other", label: "Khác" },
  ]

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle className="border-b">
        <Typography variant="h6" className="font-semibold">
          Xuất Kho - {skuName}
        </Typography>
      </DialogTitle>

      <DialogContent className="pt-6">
        <Alert severity="warning" className="mb-4">
          Tồn kho hiện tại: <strong>{currentStock} sản phẩm</strong>
        </Alert>

        <div className="space-y-4">
          <TextField
            label="Số lượng xuất *"
            type="number"
            fullWidth
            value={formData.quantity}
            onChange={(e) => handleChange("quantity", e.target.value)}
            placeholder="Nhập số lượng"
            required
            inputProps={{ max: currentStock }}
          />

          <FormControl fullWidth>
            <InputLabel>Lý do xuất *</InputLabel>
            <Select
              value={formData.reason}
              onChange={(e) => handleChange("reason", e.target.value)}
              label="Lý do xuất *"
            >
              {reasons.map((reason) => (
                <MenuItem key={reason.value} value={reason.value}>
                  {reason.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Người nhận"
            fullWidth
            value={formData.recipient}
            onChange={(e) => handleChange("recipient", e.target.value)}
            placeholder="Tên khách hàng hoặc người nhận"
          />

          <TextField
            label="Mã tham chiếu"
            fullWidth
            value={formData.reference}
            onChange={(e) => handleChange("reference", e.target.value)}
            placeholder="SO-2024-001"
          />

          <TextField
            label="Ghi chú"
            multiline
            rows={3}
            fullWidth
            value={formData.note}
            onChange={(e) => handleChange("note", e.target.value)}
            placeholder="Ghi chú về việc xuất kho..."
          />
        </div>
      </DialogContent>

      <DialogActions className="p-4 border-t">
        <Button onClick={onClose} variant="outlined">
          Hủy
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          className="bg-red-600 hover:bg-red-700"
          disabled={!formData.quantity || Number.parseInt(formData.quantity) > currentStock}
        >
          Xác Nhận Xuất Kho
        </Button>
      </DialogActions>
    </Dialog>
  )
}
