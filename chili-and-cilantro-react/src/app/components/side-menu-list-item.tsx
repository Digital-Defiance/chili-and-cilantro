import {
  Divider,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { FC } from 'react';
import { Link } from 'react-router-dom';
import { IMenuOption } from '../interfaces/menu-option';

interface SideMenuListItemProps {
  menuItem: IMenuOption;
  onClose: () => void;
}

export const SideMenuListItem: FC<SideMenuListItemProps> = ({
  menuItem,
  onClose,
}) => {
  if (menuItem.divider) {
    return <Divider key={menuItem.label} />;
  } else if (menuItem.link) {
    return (
      <ListItemButton
        key={menuItem.id}
        component={Link}
        to={menuItem.link}
        onClick={() => {
          onClose();
        }}
      >
        {menuItem.icon && <ListItemIcon>{menuItem.icon}</ListItemIcon>}
        <ListItemText primary={menuItem.label} />
      </ListItemButton>
    );
  } else if (menuItem.action) {
    const action = menuItem.action;
    return (
      <ListItemButton
        key={menuItem.id}
        onClick={async () => {
          await action();
          onClose();
        }}
      >
        {menuItem.icon && <ListItemIcon>{menuItem.icon}</ListItemIcon>}
        <ListItemText primary={menuItem.label} />
      </ListItemButton>
    );
  }
  return null;
};

export default SideMenuListItem;
