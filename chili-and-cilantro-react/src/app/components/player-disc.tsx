import { CardType } from '@chili-and-cilantro/chili-and-cilantro-lib';
import { Box, Typography } from '@mui/material';
import { FC } from 'react';

export interface PlayerDiscProps {
  player: number;
  type: CardType;
  reveal: boolean;
}

export const PlayerDisc: FC<PlayerDiscProps> = ({
  player,
  type,
  reveal,
}: {
  player: number;
  type: CardType;
  reveal: boolean;
}) => {
  const playerThemes = [
    { background: '#ff5733', border: '#c70039' }, // Player 1: Chili red
    { background: '#4caf50', border: '#087f23' }, // Player 2: Cilantro green
    { background: '#ffc107', border: '#c79100' }, // Player 3: Spicy yellow
    { background: '#3f51b5', border: '#2c387e' }, // Player 4: Bold blue
    { background: '#e91e63', border: '#b0003a' }, // Player 5: Vibrant pink
    { background: '#795548', border: '#4b2c20' }, // Player 6: Earthy brown
  ];

  // Get the current player's theme
  const theme = playerThemes[player - 1];

  // Determine the icon to display
  const iconSrc =
    type === 'chili'
      ? '/assets/images/chili.png'
      : '/assets/images/cilantro.png';

  return (
    <Box
      sx={{
        width: 200,
        height: 200,
        borderRadius: '50%',
        backgroundColor: theme.background,
        border: `8px solid ${theme.border}`,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2), 0 2px 4px rgba(0, 0, 0, 0.1)',
        transform: reveal ? 'rotateY(180deg)' : 'none',
        transition: 'transform 0.3s ease-in-out',
        overflow: 'hidden',
      }}
    >
      {reveal ? (
        <Box
          className="card-back"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            background: `repeating-radial-gradient(circle, #ffffff, rgba(255, 255, 255, 0.1) 20%)`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box
            className="flourish"
            sx={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
              background: `repeating-radial-gradient(circle, transparent, rgba(255, 255, 255, 0.2) 20%)`,
            }}
          />
          <Typography
            variant="h6"
            sx={{
              color: 'white',
              fontFamily: `'Playfair Display', serif`,
              textAlign: 'center',
            }}
          >
            Reveal
          </Typography>
        </Box>
      ) : (
        <Box
          className="card-front"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
          }}
        >
          <Box
            component="img"
            src={iconSrc}
            alt={type}
            sx={{
              width: '70%',
              height: '70%',
              objectFit: 'contain',
            }}
          />
        </Box>
      )}
    </Box>
  );
};
