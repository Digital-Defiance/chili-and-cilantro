import { StringNames } from '@chili-and-cilantro/chili-and-cilantro-lib';
import {
  Box,
  Button,
  Container,
  List,
  ListItem,
  ListItemText,
  styled,
  Typography,
} from '@mui/material';
import React, { memo } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import chiliCilantroLogo from '../../assets/images/Chili-and-Cilantro-logo.png';
import { useAppTranslation } from '../i18n-provider';

const StyledImage = styled('img')({
  width: '60%',
  maxWidth: '1035px',
  height: 'auto',
});

const SplashPage: React.FC = () => {
  const { t } = useAppTranslation();
  return (
    <Container maxWidth="md">
      <Box display="flex" flexDirection="column" alignItems="center" my={4}>
        <StyledImage
          src={chiliCilantroLogo}
          alt={`${t(StringNames.Common_Site)} ${t(StringNames.Common_Logo)}`}
        />
        <Typography variant="h5" color="primary" mt={2} mb={4}>
          {t(StringNames.Common_Tagline)}
        </Typography>

        <Box mb={4}>
          <Typography
            variant="h4"
            gutterBottom
            className="playfair-display-regular"
          >
            {t(StringNames.KeyFeatures_Title)}:
          </Typography>
          <List>
            {[
              t(StringNames.KeyFeatures_1),
              t(StringNames.KeyFeatures_2),
              t(StringNames.KeyFeatures_3),
              t(StringNames.KeyFeatures_4),
              t(StringNames.KeyFeatures_5),
              t(StringNames.KeyFeatures_6),
              t(StringNames.KeyFeatures_7),
              t(StringNames.KeyFeatures_8),
            ].map((feature, index) => (
              <ListItem key={index}>
                <ListItemText primary={feature} />
              </ListItem>
            ))}
          </List>
        </Box>

        <Box mb={4}>
          <Typography variant="h5" gutterBottom>
            {t(StringNames.Splash_HowToPlay)}:
          </Typography>
          <Typography>{t(StringNames.Splash_Description)}</Typography>
        </Box>

        <Box display="flex" justifyContent="center" gap={2}>
          <Button
            component={RouterLink}
            to="/register"
            variant="contained"
            color="primary"
          >
            {t(StringNames.Common_StartCooking)}!
          </Button>
          <Button
            component={RouterLink}
            to="/login"
            variant="contained"
            color="secondary"
          >
            {t(StringNames.Common_ReturnToKitchen)}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default memo(SplashPage);
