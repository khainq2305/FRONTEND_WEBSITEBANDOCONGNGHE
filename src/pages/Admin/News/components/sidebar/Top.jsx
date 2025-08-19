import React from 'react';
import SearchInput from 'components/common/SearchInput';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

import {
  Box, Button, Chip, IconButton, Menu, MenuItem,
  Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField, Select, FormControl, Checkbox, Avatar, Typography
} from '@mui/material';
import ButtonCustom from '@/components/Admin/Button';
const Top = ({
  title = 'Tiêu đề',
  tabs = [],
  activeTab,
  onTabChange,
  to, label,
  counts,
  action = null
}) => {
  const navigate = useNavigate();
  return (
    <div className="space-y-2">
      {/* Tiêu đề + nút thêm */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
      {to && <ButtonCustom label={label} to={to} action={action} />}
      </Box>

      {/* Tabs */}
      <div className="flex items-center justify-between border-gray-200 font-bold">
        <div>
          {tabs.map((tab) => (
            <span
              key={tab.value}
              className="relative px-3 py-2 cursor-pointer text-sm "
              onClick={() => onTabChange(tab.value)}
            >
              <span
                className={`transition-all ${activeTab === tab.value
                    ? 'text-white font-semibold bg-blue-600 p-2 rounded-md'
                    : 'text-gray-800 hover:text-blue-500'
                  }`}
              >
                {tab.label} {counts[tab.value] || 0}
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Top;
