import { Box, IconButton, Menu, MenuItem } from '@mui/material';
import {
  FC,
  MouseEvent as ReactMouseEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { useMenu } from '../menu-context';

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

  return (
    <Box ref={dropdownRef}>
      <IconButton color="inherit" onClick={handleClick}>
        <i className="fa-duotone fa-pepper-hot" />
      </IconButton>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        {gameOptions.map((option, index) => (
          <MenuItem
            key={index}
            onClick={() => {
              if (option.action) {
                option.action();
              }
              if (option.link) {
                navigate(option.link);
              }

              handleClose();
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
            {option.icon}
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};
