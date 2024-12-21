import {
  IGameChefResponse,
  StringNames,
  constants,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import {
  Box,
  Button,
  FormControlLabel,
  Switch,
  TextField,
  Typography,
  styled,
} from '@mui/material';
import { AxiosResponse } from 'axios';
import { useFormik } from 'formik';
import React from 'react';
import * as Yup from 'yup';
import { useAuth } from '../auth-provider';
import { useAppTranslation } from '../i18n-provider';
import api from '../services/authenticated-api';

type GameMode = 'CREATE' | 'JOIN';

interface IFormValues {
  gameName?: string;
  gameCode?: string;
  displayname: string;
  gamePassword?: string;
  gameMode: GameMode;
  maxChefs: number;
}

const GameSetup: React.FC = () => {
  const { t } = useAppTranslation();
  const { user } = useAuth();

  const validationSchema = Yup.object().shape({
    gameName: Yup.string().test(
      'gameName',
      t(StringNames.Validation_InvalidGameName),
      function (value) {
        const { gameMode } = this.parent;
        if (gameMode === 'CREATE') {
          if (!value)
            return this.createError({
              message: t(StringNames.Validation_GameNameRequired),
            });
          if (
            !constants.GAME_NAME_REGEX.test(value) ||
            value.length < constants.MIN_GAME_NAME_LENGTH ||
            value.length > constants.MAX_GAME_NAME_LENGTH
          ) {
            return this.createError({
              message: t(StringNames.Validation_InvalidGameNameTemplate),
            });
          }
        }
        return true;
      },
    ),
    gameCode: Yup.string().test(
      'gameCode',
      t(StringNames.Validation_InvalidGameCode),
      function (value) {
        const { gameMode } = this.parent;
        if (gameMode === 'JOIN') {
          if (!value)
            return this.createError({
              message: t(StringNames.Validation_GameCodeRequired),
            });
          if (!constants.GAME_CODE_REGEX.test(value)) {
            return this.createError({
              message: t(StringNames.Validation_InvalidGameCodeTemplate),
            });
          }
        }
        return true;
      },
    ),
    displayname: Yup.string()
      .matches(
        constants.USER_DISPLAY_NAME_REGEX,
        t(StringNames.Validation_DisplayNameRegexErrorTemplate),
      )
      .required(t(StringNames.Validation_DisplayNameRequired)),
    gamePassword: Yup.string()
      .matches(
        constants.GAME_PASSWORD_REGEX,
        t(StringNames.Validation_GamePasswordRegexErrorTemplate),
      )
      .optional(),
    maxChefs: Yup.number().test(
      'maxChefs',
      t(StringNames.Validation_InvalidMaxChefs),
      function (value) {
        const { gameMode } = this.parent;
        if (gameMode === 'CREATE') {
          if (!value)
            return this.createError({
              message: t(StringNames.Validation_MaxChefsRequired),
            });
          if (value < constants.MIN_CHEFS || value > constants.MAX_CHEFS) {
            return this.createError({
              message: t(StringNames.Validation_InvalidMaxChefs),
            });
          }
        }
        return true;
      },
    ),
    gameMode: Yup.string()
      .oneOf(['CREATE', 'JOIN'])
      .required(t(StringNames.Validation_Required)),
  });

  const formik = useFormik<IFormValues>({
    initialValues: {
      gameName: '',
      gameCode: '',
      displayname: user?.displayName ?? '',
      gamePassword: '',
      maxChefs: constants.MAX_CHEFS,
      gameMode: 'CREATE',
    },
    validationSchema,
    onSubmit: (values) => {
      console.log('Form submitted:', values);
      if (values.gameMode === 'CREATE') {
        createGame();
      } else {
        joinGame();
      }
    },
    validateOnMount: true,
    validateOnBlur: true,
    validateOnChange: true,
  });

  const handleGameResponse = async (response: AxiosResponse) => {
    const data = response.data as IGameChefResponse;
    if (response.status === 201) {
      console.log('create', data);
    } else if (response.status === 200) {
      console.log('join', data);
    }
  };

  const createGame = async () => {
    const response = await api.post('/game/create', {
      name: formik.values.gameName,
      password: formik.values.gamePassword,
      displayname: formik.values.displayname,
    });
    await handleGameResponse(response);
  };

  const joinGame = async () => {
    const response = await api.post(`/game/${formik.values.gameCode}/join`, {
      password: formik.values.gamePassword,
      displayname: formik.values.displayname,
    });
    await handleGameResponse(response);
  };

  const handleGameModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newMode = event.target.checked ? 'CREATE' : 'JOIN';
    formik.setFieldValue('gameMode', newMode);
    formik.setFieldValue('gameName', '');
    formik.setFieldValue('gameCode', '');
    formik.setFieldTouched(
      newMode === 'CREATE' ? 'gameName' : 'gameCode',
      false,
    );
  };

  const handleChefIncrement = () => {
    const newValue = Math.min(formik.values.maxChefs + 1, constants.MAX_CHEFS);
    formik.setFieldValue('maxChefs', newValue);
  };

  const handleChefDecrement = () => {
    const newValue = Math.max(formik.values.maxChefs - 1, constants.MIN_CHEFS);
    formik.setFieldValue('maxChefs', newValue);
  };

  const StyledButtonPrimary = styled(Button)(({ theme }) => ({
    minWidth: '50px',
    minHeight: '50px',
    fontSize: '1.5rem',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
  }));

  const StyledButtonSecondary = styled(Button)(({ theme }) => ({
    minWidth: '50px',
    minHeight: '50px',
    fontSize: '1.5rem',
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.secondary.dark,
    },
  }));

  return (
    <Box
      component="form"
      onSubmit={formik.handleSubmit}
      noValidate
      sx={{ mt: 1 }}
    >
      <Typography variant="h4" gutterBottom>
        Game Setup
      </Typography>
      <FormControlLabel
        control={
          <Switch
            checked={formik.values.gameMode === 'CREATE'}
            onChange={handleGameModeChange}
            color="primary"
          />
        }
        label={
          formik.values.gameMode === 'CREATE'
            ? t(StringNames.Game_CreateGame)
            : t(StringNames.Game_JoinGame)
        }
      />
      {formik.values.gameMode === 'CREATE' ? (
        <TextField
          fullWidth
          id="gameName"
          name="gameName"
          label="Game Name"
          value={formik.values.gameName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.gameName && Boolean(formik.errors.gameName)}
          helperText={formik.touched.gameName && formik.errors.gameName}
          margin="normal"
        />
      ) : (
        <TextField
          fullWidth
          id="gameCode"
          name="gameCode"
          label="Game Code"
          value={formik.values.gameCode}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.gameCode && Boolean(formik.errors.gameCode)}
          helperText={formik.touched.gameCode && formik.errors.gameCode}
          margin="normal"
        />
      )}
      <TextField
        fullWidth
        id="displayname"
        name="displayname"
        label="Display Name"
        value={formik.values.displayname}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.displayname && Boolean(formik.errors.displayname)}
        helperText={formik.touched.displayname && formik.errors.displayname}
        margin="normal"
      />
      <TextField
        fullWidth
        id="gamePassword"
        name="gamePassword"
        label="Game Password (optional)"
        type="password"
        value={formik.values.gamePassword}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={
          formik.touched.gamePassword && Boolean(formik.errors.gamePassword)
        }
        helperText={formik.touched.gamePassword && formik.errors.gamePassword}
        margin="normal"
      />
      {formik.values.gameMode === 'CREATE' && (
        <Box display="flex" alignItems="center" mt={2} mb={2}>
          <Typography variant="body1" mr={2}>
            Max Chefs:
          </Typography>
          <StyledButtonSecondary
            size="small"
            variant="outlined"
            onClick={handleChefDecrement}
            disabled={formik.values.maxChefs <= constants.MIN_CHEFS}
            style={{ minWidth: '50px', minHeight: '50px' }}
          >
            <i className="fa-duotone fa-knife-kitchen" />
          </StyledButtonSecondary>
          <TextField
            name="maxChefs"
            value={formik.values.maxChefs}
            inputProps={{
              readOnly: true,
            }}
            sx={{ width: '60px', mx: 1, '& input': { textAlign: 'center' } }}
          />
          <StyledButtonPrimary
            size="small"
            variant="outlined"
            onClick={handleChefIncrement}
            disabled={formik.values.maxChefs >= constants.MAX_CHEFS}
          >
            <i className="fa-duotone fa-user-chef" />
          </StyledButtonPrimary>
        </Box>
      )}
      <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
        {formik.values.gameMode === 'CREATE'
          ? t(StringNames.Game_CreateGame)
          : t(StringNames.Game_JoinGame)}
      </Button>
    </Box>
  );
};

export default GameSetup;
