import React from 'react';
import { Grid, Typography, MenuItem, Box, Avatar, Divider, InputLabel, Select, FormControl, Button, Chip } from '@mui/material';
const RolesPresent = ({ roles }) => {
  console.log('RolesPresent user nè hihi :', roles);

  const safeRoles = Array.isArray(roles) ? roles : [];

  const isAdmin = safeRoles.some((role) => role.name?.toLowerCase() === 'admin');

  return (
    <>
      <Box sx={{ mb: 2, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        {isAdmin ? (
          <Chip label="Admin (toàn quyền)" size="small" color="error" sx={{ height: 22, fontSize: 12, mr: 0.5, mb: 0.5 }} />
        ) : (
          safeRoles.map((role, index) => (
            <Chip key={role.id || index} label={role.description} size="small" sx={{ height: 22, fontSize: 12, mr: 0.5, mb: 0.5 }} />
          ))
        )}
      </Box>
    </>
  );
};

export default RolesPresent;
