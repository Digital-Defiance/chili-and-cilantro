import { Drawer, List } from '@mui/material';
import { FC } from 'react';
import { IncludeOnMenu } from '../enumerations/include-on-menu';
import { IMenuOption } from '../interfaces/menu-option';
import { useMenu } from '../menu-context';
import SideMenuListItem from './side-menu-list-item';

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const SideMenu: FC<SideMenuProps> = ({ isOpen, onClose }) => {
  const { getMenuOptions } = useMenu();

  const menuOptions = getMenuOptions(IncludeOnMenu.SideMenu);

  return (
    <Drawer anchor="left" open={isOpen} onClose={onClose}>
      <List>
        {menuOptions.map((item: IMenuOption) => (
          <SideMenuListItem key={item.id} menuItem={item} onClose={onClose} />
        ))}
      </List>
    </Drawer>
  );
};

export default SideMenu;
