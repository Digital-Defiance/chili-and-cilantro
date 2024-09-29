import { Box, Typography } from '@mui/material';
import { styled } from '@mui/system';
import React from 'react';
import ChiliAndCilantroImage from '../assets/images/Chili-and-Cilantro.png';

const SplashContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
  backgroundColor: '#FFFDD0',
});

const SplashImage = styled('img')({
  maxWidth: '100%',
  height: 'auto',
});

const SplashTitle = styled(Typography)({
  fontSize: '121pt',
  marginTop: '20px',
});

const SplashPage: React.FC = () => {
  return (
    <SplashContainer>
      <SplashImage src={ChiliAndCilantroImage} alt="Chili & Cilantro" />
      <SplashTitle variant="h1" className="playfair-display-regular">
        Chili & Cilantro
      </SplashTitle>
    </SplashContainer>
  );
};

export default SplashPage;
