import { Box, Fade, IconButton, Menu, MenuItem } from '@mui/material';
import {
  FC,
  MouseEvent as ReactMouseEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { GameMenuOption, useMenu } from '../menu-context';

export const GameMenu: FC = () => {
  const { gameOptions } = useMenu();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleClick = (event: ReactMouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        handleClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside as EventListener);
    return () => {
      document.removeEventListener(
        'mousedown',
        handleClickOutside as EventListener,
      );
    };
  }, []);

  if (gameOptions.length === 0) {
    return null;
  }

  const handleMenuItemClick = (option: GameMenuOption) => {
    return (e: ReactMouseEvent<HTMLLIElement, MouseEvent>) => {
      e.stopPropagation(); // Stop event propagation immediately

      if (option.link !== undefined) {
        const link: string = option.link;
        e.preventDefault(); // Prevent default still needed for <Link> components
        handleClose();

        setTimeout(() => {
          // Introduce the small delay
          navigate(link);
        }, 100);
      } else if (option.action) {
        option.action();
        handleClose();
      } else {
        handleClose(); // Ensure the menu closes in all cases
      }
    };
  };

  return (
    <Box ref={dropdownRef}>
      <IconButton color="inherit" onClick={handleClick}>
        <i className="fa-duotone fa-pepper-hot" />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        TransitionComponent={Fade} // Use Fade for transition
        sx={{
          '& .MuiBackdrop-root': {
            // Target the backdrop specifically
            visibility: 'hidden', // Hide backdrop but don't remove from DOM for closing animation to work correctly
          },
          '& .MuiPopover-paper': {
            // Target the actual popover/menu paper to handle the overlay
            opacity: 1, // Ensure menu items are opaque when the backdrop is hidden
            overflow: 'visible', // prevent content from being clipped within the popover
          },
        }}
      >
        {gameOptions.map((option, index) => (
          <MenuItem
            key={index}
            onClick={handleMenuItemClick(option)}
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
            {option.icon}
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};
