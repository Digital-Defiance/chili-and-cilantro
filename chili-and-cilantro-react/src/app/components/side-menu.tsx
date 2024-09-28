import { StringNames } from '@chili-and-cilantro/chili-and-cilantro-lib';
import {
  Dashboard as DashboardIcon,
  LockOpen as LockOpenIcon,
  Login as LoginIcon,
  ExitToApp as LogoutIcon,
  PersonAdd as PersonAddIcon,
  VpnKey as VpnKeyIcon,
} from '@mui/icons-material';
import {
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { FC, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth-provider';
import { useAppTranslation } from '../i18n-provider';
import { useMenu } from '../menu-context';

export interface IMenuItem {
  text: string;
  icon?: ReactNode;
  link?: string;
  divider?: boolean;
  action?: () => void;
}

const SideMenu: FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { t } = useAppTranslation();
  const { gameOptions } = useMenu();
  const { isAuthenticated } = useAuth();
  const menuItems: IMenuItem[] = isAuthenticated
    ? [
        {
          text: t(StringNames.Common_Dashboard),
          icon: <DashboardIcon />,
          link: '/dashboard',
        },
        { text: 'gameOptions', divider: true },
        ...(gameOptions
          ? gameOptions.map((o) => ({
              text: o.label,
              icon: o.icon,
              link: o.link,
              action: o.action,
            }))
          : []),
        { text: 'userOptions', divider: true },
        {
          text: t(StringNames.Common_ChangePassword),
          icon: <VpnKeyIcon />,
          link: '/change-password',
        },
        {
          text: t(StringNames.LogoutButton),
          icon: <LogoutIcon />,
          link: '/logout',
        },
      ]
    : [
        {
          text: t(StringNames.Login_LoginButton),
          icon: <LoginIcon />,
          link: '/login',
        },
        {
          text: t(StringNames.RegisterButton),
          icon: <PersonAddIcon />,
          link: '/register',
        },
        {
          text: t(StringNames.ForgotPassword_Title),
          icon: <LockOpenIcon />,
          link: '/forgot-password',
        },
      ];

  return (
    <Drawer anchor="left" open={isOpen} onClose={onClose}>
      <List>
        {menuItems.map((item) => {
          if (!item.link) {
            return null;
          }
          if (item.divider) {
            return <Divider key={item.text} />;
          }
          return (
            <ListItemButton
              key={item.text}
              component={Link}
              to={item.link}
              onClick={() => {
                if (item.action) {
                  item.action();
                }
                onClose();
              }}
            >
              {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
              <ListItemText primary={item.text} />
            </ListItemButton>
          );
        })}
      </List>
    </Drawer>
  );
};

export default SideMenu;
