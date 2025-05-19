import { Box } from '@mui/material';

const StatusTabs = ({ status, setStatus, statusTabs, coupons }) => (
  <Box sx={{ display: 'flex', gap: 4, borderBottom: '1px solid #eee', mb: 2 }}>
    {statusTabs.map((tab) => {
      const count = tab.value === '' ? coupons.length : coupons.filter((c) => c.status === tab.value).length;
      return (
        <Box
          key={tab.value}
          onClick={() => setStatus(tab.value)}
          sx={{
            pb: 1,
            px: 1,
            cursor: 'pointer',
            borderBottom: status === tab.value ? '2px solid red' : '2px solid transparent',
            color: status === tab.value ? 'red' : 'black',
            fontWeight: status === tab.value ? 600 : 400,
            fontSize: 15,
            userSelect: 'none'
          }}
        >
          {tab.label} ({count})
        </Box>
      );
    })}
  </Box>
);

export default StatusTabs;
