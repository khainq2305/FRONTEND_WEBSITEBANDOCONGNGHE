import PropTypes from 'prop-types';
import { useRef, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import ButtonBase from '@mui/material/ButtonBase';
import CardContent from '@mui/material/CardContent';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';

// project imports
import Avatar from 'components/Admin/@extended/Avatar';
import MainCard from 'components/Admin/MainCard';
import Transitions from 'components/Admin/@extended/Transitions';

// assets
import LogoutOutlined from '@ant-design/icons/LogoutOutlined';
import avatar1 from 'assets/Admin/images/users/avatar-1.png';
import useAuthStore from '@/stores/AuthStore';

export default function Profile() {
  const { user, logout } = useAuthStore();
  const theme = useTheme();
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 0.75 }}>
      <ButtonBase
        sx={(theme) => ({
          p: 0.25,
          bgcolor: open ? 'grey.100' : 'transparent',
          borderRadius: 1,
          '&:hover': { bgcolor: 'secondary.lighter' },
          '&:focus-visible': { outline: `2px solid ${theme.palette.secondary.dark}`, outlineOffset: 2 },
          ...theme.applyStyles('dark', { bgcolor: open ? 'background.default' : 'transparent', '&:hover': { bgcolor: 'secondary.light' } })
        })}
        aria-label="open profile"
        ref={anchorRef}
        aria-controls={open ? 'profile-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
      >
        <Stack direction="row" sx={{ gap: 1.25, alignItems: 'center', p: 0.5 }}>
          <Avatar alt="profile user" src={avatar1} size="sm" />
          <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
            Xin chào {user?.fullName}
          </Typography>
        </Stack>
      </ButtonBase>

      <Popper
        placement="bottom-end"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, 9]
              }
            }
          ]
        }}
      >
        {({ TransitionProps }) => (
          <Transitions type="grow" position="top-right" in={open} {...TransitionProps}>
            <Paper sx={(theme) => ({ boxShadow: theme.customShadows.z1, width: 240 })}>
              <ClickAwayListener onClickAway={handleClose}>
                <MainCard elevation={0} border={false} content={false}>
                  {/* Header user info */}
                  <CardContent sx={{ px: 2.5, pt: 3, pb: 1 }}>
                    <Grid container alignItems="center">
                      <Grid item>
                        <Stack direction="row" spacing={1.25} alignItems="center">
                          <Avatar alt="profile user" src={avatar1} sx={{ width: 32, height: 32 }} />
                          <Stack>
                            <Typography variant="h6">{user?.fullName}</Typography>
                            {user?.roles?.map((r) => (
                              <Typography key={r.id} variant="body2" color="text.secondary">
                                {r.name}
                              </Typography>
                            ))}
                          </Stack>
                        </Stack>
                      </Grid>
                    </Grid>
                  </CardContent>

                  <Divider />

                  {/* Logout button */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      px: 2.5,
                      py: 1.5,
                      cursor: 'pointer',
                      '&:hover': { bgcolor: 'action.hover' }
                    }}
                    onClick={logout}
                  >
                    <LogoutOutlined style={{ marginRight: 8 }} />
                    <Typography variant="body1">Đăng xuất</Typography>
                  </Box>
                </MainCard>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
    </Box>
  );
}

