import { StringNames } from '@chili-and-cilantro/chili-and-cilantro-lib';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  ExitToApp as LogoutIcon,
  VpnKey as VpnKeyIcon,
} from '@mui/icons-material';
import { Box, IconButton, Menu, MenuItem } from '@mui/material';
import { FC, MouseEvent, useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../auth-provider';
import { useAppTranslation } from '../i18n-provider';

export const UserMenu: FC = () => {
  const { logout } = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const { t } = useAppTranslation();

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      <IconButton color="inherit" onClick={handleClick}>
        <FontAwesomeIcon icon={['fas', 'user-circle']} />
      </IconButton>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem
          component={Link}
          to="/change-password"
          onClick={handleClose}
          sx={{
            display: 'flex',
            alignItems: 'center',
            '& > svg': {
              marginRight: 2,
              width: 24,
              height: 24,
            },
          }}
        >
          <VpnKeyIcon />
          {t(StringNames.Common_ChangePassword)}
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose();
            logout();
            navigate('/');
          }}
          sx={{
            display: 'flex',
            alignItems: 'center',
            '& > svg': {
              marginRight: 2,
              width: 24,
              height: 24,
            },
          }}
        >
          <LogoutIcon /> {t(StringNames.LogoutButton)}
        </MenuItem>
      </Menu>
    </Box>
  );
};
