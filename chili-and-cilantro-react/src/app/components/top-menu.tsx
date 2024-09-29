import { StringNames } from '@chili-and-cilantro/chili-and-cilantro-lib';
import MenuIcon from '@mui/icons-material/Menu';
import {
  AppBar,
  Box,
  Button,
  IconButton,
  Toolbar,
  Typography,
} from '@mui/material';
import { FC, useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import chiliCilantroSymbol from '../../assets/images/Chili-and-Cilantro.png';
import { AuthContext } from '../auth-provider';
import { useAppTranslation } from '../i18n-provider';
import { GameMenu } from './game-menu';
import SideMenu from './side-menu';
import './top-menu.scss';
import { UserLanguageSelector } from './user-language-selector';
import { UserMenu } from './user-menu';

export const TopMenu: FC = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);

  const handleOpenSideMenu = () => setIsSideMenuOpen(true);
  const handleCloseSideMenu = () => setIsSideMenuOpen(false);
  const { t } = useAppTranslation();

  return (
    <AppBar position="fixed" sx={{ top: 10 }}>
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
          onClick={handleOpenSideMenu}
        >
          <MenuIcon />
        </IconButton>
        <Box
          component="img"
          sx={{
            height: 40,
            width: 40,
            marginRight: 2,
          }}
          alt={`${t(StringNames.Common_Site)} ${t(StringNames.Common_Logo)}`}
          src={chiliCilantroSymbol}
        />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {t(StringNames.Common_Site)}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {isAuthenticated ? (
            <>
              <Button color="inherit" component={Link} to="/dashboard">
                {t(StringNames.Common_Dashboard)}
              </Button>
              <GameMenu />
              <UserMenu />
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">
                {t(StringNames.Login_LoginButton)}
              </Button>
              <Button color="inherit" component={Link} to="/register">
                {t(StringNames.RegisterButton)}
              </Button>
            </>
          )}
          <UserLanguageSelector />
        </Box>
      </Toolbar>
      <SideMenu isOpen={isSideMenuOpen} onClose={handleCloseSideMenu} />
    </AppBar>
  );
};

export default TopMenu;
