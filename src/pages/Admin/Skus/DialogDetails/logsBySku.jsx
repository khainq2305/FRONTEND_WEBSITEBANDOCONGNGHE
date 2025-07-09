import React from 'react';
import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  IconButton,
  Typography,
  TextField,
  LinearProgress,
  Card,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  Close as CloseIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Inventory as InventoryIcon,
  History as HistoryIcon,
  Info as InfoIcon,
  AttachMoney as MoneyIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
const LogsAction = ({ logsAction, fetchLogsBySku, skuId }) => {
  const [typeFilter, setTypeFilter] = useState('all');

const handleChange = (event) => {
  const value = event.target.value;
  setTypeFilter(value);
  fetchLogsBySku(skuId , value);
};
  return (
    <>
      <Card className="p-4 h-full">
        <div className="flex justify-between items-center gap-2 mb-4">
          <div className="flex items-center gap-2">
            <HistoryIcon className="text-purple-600 text-lg" />
            <Typography variant="h6" className="font-semibold">
              Lịch Sử Hoạt Động
            </Typography>
          </div>
          <FormControl size="small" sx={{ minWidth: 200 }}>
  <InputLabel id="log-type-label">Chọn hoạt động</InputLabel>
  <Select
    labelId="log-type-label"
    id="log-type-select"
    value={typeFilter}
    label="Chọn hoạt động"
    onChange={handleChange}
  >
    <MenuItem value="all">Tất cả</MenuItem>
    <MenuItem value="import">Nhập hàng</MenuItem>
    <MenuItem value="export">Xuất hàng</MenuItem>
  </Select>
</FormControl>

        </div>

        <div className="space-y-3 max-h-[500px] overflow-y-auto">
          {logsAction.length === 0 ? (
            <div className="flex justify-center mt-3">
              <span className="text-gray-500">Sản phẩm chưa có hoạt động nào</span>
            </div>
          ) : (
            logsAction?.map((logs) => (
              <div
                key={logs.id}
                className={`p-3 rounded-lg border-l-4 ${
                  logs.type === 'export' ? 'bg-red-50 border-red-400' : 'bg-green-50 border-green-400'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {logs.type === 'export' ? (
                      <TrendingDownIcon className="text-red-600 text-sm" />
                    ) : (
                      <TrendingUpIcon className="text-green-600 text-sm" />
                    )}
                    <Typography variant="subtitle2" className="font-semibold">
                      {logs.type === 'export' ? 'Xuất kho' : 'Nhập kho'}
                    </Typography>
                  </div>
                  <Typography variant="caption" className="text-gray-500">
                    {logs.createdAt}
                  </Typography>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm mb-2">
                  <div>
                    <span className="text-gray-600">Trước</span>
                    <div className="font-medium">
                      {logs.type === 'export' ? logs?.stockAfter + Math.abs(logs.quantity) : logs?.stockAfter - logs.quantity}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600">Thay đổi</span>
                    <div className={`font-bold ${logs.type === 'export' ? 'text-red-600' : 'text-green-600'}`}>
                      {logs.type === 'export' ? '-' : '+'}
                      {logs.quantity}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600">Sau</span>
                    <div className="font-medium">{logs?.stockAfter}</div>
                  </div>
                </div>

                <Typography variant="body2" fontWeight="bold" className="mb-2 font-bold">
                  {logs.description}
                </Typography>

                <div className="flex justify-between text-xs text-gray-500">
                  <div className="flex gap-1">
                    <span>{logs?.user?.fullName}</span>
                    <span>-</span>
                    <span>{logs?.user?.roles?.[0]?.name}</span>
                  </div>
                  <span>Ref: {logs.reference}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </>
  );
};

export default LogsAction;
