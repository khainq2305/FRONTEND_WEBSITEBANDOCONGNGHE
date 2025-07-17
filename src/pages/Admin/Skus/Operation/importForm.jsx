

import { useState } from "react"
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Typography, Alert } from "@mui/material"


export default function ImportStockDialog({ open, onClose, skuName, currentStock, onSubmit  }) {
  const [formData, setFormData] = useState({
    quantity: "",
    price: "",
    supplier: "Apple Inc.",
    note: "",
    reference: "",
  })

  const handleSubmit = () => {
    const finalData = {
      ...formData,
      stockBefore: currentStock,
      stockAfter: Number(currentStock) + Number(formData.quantity),
      type: 'import'
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

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle className="border-b">
        <Typography variant="h6" className="font-semibold">
          Nhập Kho - {skuName}
        </Typography>
      </DialogTitle>

      <DialogContent className="pt-6">
        <Alert severity="info" className="mb-4">
          Tồn kho hiện tại: <strong>{currentStock} sản phẩm</strong>
        </Alert>

        <div className="space-y-4">
          <TextField
            label="Số lượng nhập *"
            type="number"
            fullWidth
            value={formData.quantity}
            onChange={(e) => handleChange("quantity", e.target.value)}
            placeholder="Nhập số lượng"
            required
          />

          <TextField
            label="Giá nhập (VND) *"
            type="number"
            fullWidth
            value={formData.price}
            onChange={(e) => handleChange("price", e.target.value)}
            placeholder="29,990,000"
            required
          />

          <TextField
            label="Nhà cung cấp"
            fullWidth
            value={formData.supplier}
            onChange={(e) => handleChange("supplier", e.target.value)}
            placeholder="Tên nhà cung cấp"
          />

          <TextField
            label="Mã tham chiếu"
            fullWidth
            value={formData.reference}
            onChange={(e) => handleChange("reference", e.target.value)}
            placeholder="PO-2024-001"
          />

          <TextField
            label="Ghi chú"
            multiline
            rows={3}
            fullWidth
            value={formData.note}
            onChange={(e) => handleChange("note", e.target.value)}
            placeholder="Ghi chú về lô hàng nhập..."
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
          className="bg-green-600 hover:bg-green-700"
          disabled={!formData.quantity || !formData.price}
        >
          Xác Nhận Nhập Kho
        </Button>
      </DialogActions>
    </Dialog>
  )
}
