import { FC } from 'react';
import { IncludeOnMenu } from '../enumerations/include-on-menu';
import { DropdownMenu } from './dropdown-menu';

export const GameMenu: FC = () => {
  return (
    <DropdownMenu
      menuType={IncludeOnMenu.GameMenu}
      menuIcon={<i className="fa-duotone fa-pepper-hot" />}
    />
  );
};

export default GameMenu;
