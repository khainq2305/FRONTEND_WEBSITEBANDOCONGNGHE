import React from "react";
import {
  Table, TableHead, TableBody, TableRow, TableCell,
  TableContainer, Paper, Chip
} from "@mui/material";

const getActionChip = (action) => {
  const colorMap = {
    create: "success",
    update: "info",
    delete: "error",
    login: "primary",
    logout: "default",
    export: "secondary",
    restore: "warning",
    permanently_delete: "error",
  };
  return <Chip label={action} size="small" color={colorMap[action] || "default"} />;
};

const LogTable = ({ logs, onView }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Người thao tác</TableCell>
            <TableCell>Module</TableCell>
            <TableCell>Hành động</TableCell>
            <TableCell>Thời gian</TableCell>
            <TableCell align="right">Chi tiết</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {logs.length > 0 ? (
            logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>{log.id}</TableCell>
                <TableCell>{log.actor_name}</TableCell>
                <TableCell>{log.module}</TableCell>
                <TableCell>{getActionChip(log.action)}</TableCell>
<TableCell>
  {new Date(log.createdAt).toLocaleString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })}
</TableCell>

                <TableCell align="right">
                  <Chip
                    label="Xem"
                    onClick={() => onView(log)}
                    clickable
                    color="primary"
                    size="small"
                  />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} align="center">
                Không có dữ liệu
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default LogTable;
