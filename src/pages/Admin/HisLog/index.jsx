import { useEffect, useState } from "react";
import { Box } from "@mui/material";

import Filter from "./Filter";
import LogTable from "./Table";
import DetailModal from "./DetailModal";
import Pagination from "components/common/Pagination";
import Toastify from "components/common/Toastify";

const mockLogs = [
  {
    id: 1,
    actor_name: "Admin1",
    module: "product",
    action: "update",
    createdAt: "2025-05-19T09:00:00Z",
    old_data: { name: "iPhone 13", price: "20,000,000", stock: 100 },
    new_data: { name: "iPhone 14", price: "24,000,000", stock: 80 },
  },
  {
    id: 2,
    actor_name: "Admin2",
    module: "user",
    action: "delete",
    createdAt: "2025-05-18T14:30:00Z",
    old_data: { email: "user@example.com", role: "customer", status: "active" },
    new_data: null,
  },
  {
    id: 3,
    actor_name: "Admin3",
    module: "order",
    action: "create",
    createdAt: "2025-05-17T11:00:00Z",
    old_data: null,
    new_data: { order_id: "ORD123", total: "2,300,000", status: "pending" },
  },
  {
    id: 4,
    actor_name: "Admin1",
    module: "account",
    action: "login",
    createdAt: "2025-05-17T08:15:00Z",
    old_data: null,
    new_data: { ip: "192.168.1.2", device: "Chrome/Windows" },
  },
  {
    id: 5,
    actor_name: "Admin1",
    module: "account",
    action: "logout",
    createdAt: "2025-05-17T17:30:00Z",
    old_data: { session_id: "xyz456" },
    new_data: null,
  },
  {
    id: 6,
    actor_name: "Admin4",
    module: "coupon",
    action: "export",
    createdAt: "2025-05-16T10:00:00Z",
    old_data: null,
    new_data: { format: "Excel", range: "All" },
  },
  {
    id: 7,
    actor_name: "Admin2",
    module: "category",
    action: "restore",
    createdAt: "2025-05-15T16:00:00Z",
    old_data: null,
    new_data: { id: 9, name: "Máy tính bảng", status: "active" },
  },
  {
    id: 8,
    actor_name: "Admin3",
    module: "product",
    action: "permanently_delete",
    createdAt: "2025-05-14T12:45:00Z",
    old_data: { id: 44, name: "Samsung Note 10" },
    new_data: null,
  },
  {
    id: 9,
    actor_name: "Admin4",
    module: "user",
    action: "update",
    createdAt: "2025-05-14T15:30:00Z",
    old_data: { name: "Nguyen Van A", role: "customer" },
    new_data: { name: "Nguyen Van A", role: "VIP" },
  }
];


const AuditLogList = () => {
  const [search, setSearch] = useState("");
  const [action, setAction] = useState("");
  const [page, setPage] = useState(1);
  const [selectedLog, setSelectedLog] = useState(null);

  const itemsPerPage = 5;

  const filteredLogs = mockLogs.filter(
    (log) =>
      (log.actor_name.toLowerCase().includes(search.toLowerCase()) ||
        log.module.toLowerCase().includes(search.toLowerCase())) &&
      (action === "" || log.action === action)
  );

  const paginatedLogs = filteredLogs.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  useEffect(() => {
    setPage(1);
  }, [search, action]);

  return (
    <Box sx={{ p: 2 }}>
      <Filter
        search={search}
        setSearch={setSearch}
        action={action}
        setAction={setAction}
      />

      <LogTable logs={paginatedLogs} onView={setSelectedLog} />

      <Pagination
        currentPage={page}
        totalItems={filteredLogs.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setPage}
      />

      <DetailModal log={selectedLog} onClose={() => setSelectedLog(null)} />

      <Toastify />
    </Box>
  );
};

export default AuditLogList;
