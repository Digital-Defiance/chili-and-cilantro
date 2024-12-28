import { FC } from 'react';
import { IncludeOnMenu } from '../enumerations/include-on-menu';
import { DropdownMenu } from './dropdown-menu';

export const UserMenu: FC = () => {
  return (
    <DropdownMenu
      menuType={IncludeOnMenu.UserMenu}
      menuIcon={<i className="fa-duotone fa-user-circle" />}
    />
  );
};

export default UserMenu;
