import {
  IGameChefResponse,
  StringNames,
  constants,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Box,
  Button,
  FormControlLabel,
  Switch,
  TextField,
  Typography,
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
      'Invalid game name',
      function (value) {
        const { gameMode } = this.parent;
        if (gameMode === 'CREATE') {
          if (!value)
            return this.createError({ message: 'Game name is required' });
          if (
            !constants.MULTILINGUAL_STRING_REGEX.test(value) ||
            value.length < constants.MIN_GAME_NAME_LENGTH ||
            value.length > constants.MAX_GAME_NAME_LENGTH
          ) {
            return this.createError({ message: 'Invalid game name' });
          }
        }
        return true;
      },
    ),
    gameCode: Yup.string().test(
      'gameCode',
      'Invalid game code',
      function (value) {
        const { gameMode } = this.parent;
        if (gameMode === 'JOIN') {
          if (!value)
            return this.createError({ message: 'Game code is required' });
          if (!constants.GAME_CODE_REGEX.test(value)) {
            return this.createError({
              message: constants.GAME_CODE_REGEX_ERROR,
            });
          }
        }
        return true;
      },
    ),
    displayname: Yup.string()
      .matches(
        constants.USER_DISPLAY_NAME_REGEX,
        constants.USER_DISPLAY_NAME_REGEX_ERROR,
      )
      .required('Display name is required'),
    gamePassword: Yup.string()
      .matches(
        constants.GAME_PASSWORD_REGEX,
        constants.GAME_PASSWORD_REGEX_ERROR,
      )
      .optional(),
    maxChefs: Yup.number().test(
      'maxChefs',
      'Invalid number of chefs',
      function (value) {
        const { gameMode } = this.parent;
        if (gameMode === 'CREATE') {
          if (!value)
            return this.createError({ message: 'Max chefs is required' });
          if (value < constants.MIN_CHEFS || value > constants.MAX_CHEFS) {
            return this.createError({ message: 'Invalid number of chefs' });
          }
        }
        return true;
      },
    ),
    gameMode: Yup.string()
      .oneOf(['CREATE', 'JOIN'])
      .required('Game mode is required'),
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
          <Button
            size="small"
            variant="outlined"
            onClick={handleChefDecrement}
            disabled={formik.values.maxChefs <= constants.MIN_CHEFS}
          >
            <FontAwesomeIcon icon={['fas', 'knife-kitchen']} />
          </Button>
          <TextField
            name="maxChefs"
            value={formik.values.maxChefs}
            inputProps={{
              readOnly: true,
            }}
            sx={{ width: '60px', mx: 1, '& input': { textAlign: 'center' } }}
          />
          <Button
            size="small"
            variant="outlined"
            onClick={handleChefIncrement}
            disabled={formik.values.maxChefs >= constants.MAX_CHEFS}
          >
            <FontAwesomeIcon icon={['fas', 'user-chef']} />
          </Button>
        </Box>
      )}
      <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
        {formik.values.gameMode === 'CREATE'
          ? t(StringNames.Game_CreateGame)
          : t(StringNames.Game_JoinGame)}
      </Button>
      <FontAwesomeIcon icon={['fas', 'user-chef']} />
    </Box>
  );
};

export default GameSetup;
