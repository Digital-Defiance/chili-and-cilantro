import {
  IGameObject,
  StringNames,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  TextField,
} from '@mui/material';
import { environment } from 'chili-and-cilantro-react/src/environments/environment';
import { QRCodeCanvas } from 'qrcode.react';
import { FC, useState } from 'react';
import { useAppTranslation } from '../i18n-provider';

interface ShareGameProps {
  game: IGameObject;
}

export const ShareGame: FC<ShareGameProps> = ({ game }) => {
  const [open, setOpen] = useState(false);
  const [includePassword, setIncludePassword] = useState(false);
  const [generateQRCode, setGenerateQRCode] = useState(false);
  const { t } = useAppTranslation();

  const { code: gameCode, password: gamePassword } = game;

  const generateLink = () => {
    return `${environment.game.siteUrl}/cook/join/${gameCode}${includePassword && gamePassword ? `?gamePassword=${gamePassword}` : ''}`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateLink());
  };

  return (
    <>
      <Button variant="outlined" color="primary" onClick={() => setOpen(true)}>
        <i className="fa-solid fa-share-nodes" style={{ marginRight: '8px' }} />{' '}
        {t(StringNames.Common_ShareGame)}
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{t(StringNames.Common_ShareGame)}</DialogTitle>
        <DialogContent>
          {gamePassword && (
            <FormControlLabel
              control={
                <Checkbox
                  checked={includePassword}
                  onChange={(e) => setIncludePassword(e.target.checked)}
                  color="primary"
                />
              }
              label={t(StringNames.Common_IncludePassword)}
            />
          )}
          <FormControlLabel
            control={
              <Checkbox
                checked={generateQRCode}
                onChange={(e) => setGenerateQRCode(e.target.checked)}
                color="primary"
              />
            }
            label={t(StringNames.Common_GenerateQRCode)}
          />
          {generateQRCode && (
            <Box>
              <QRCodeCanvas value={generateLink()} />
            </Box>
          )}
          <TextField
            label={t(StringNames.Common_ShareLink)}
            value={generateLink()}
            fullWidth
            margin="normal"
            slotProps={{
              input: {
                readOnly: true,
              },
            }}
          />
          <Button onClick={copyToClipboard} color="primary">
            {t(StringNames.Common_CopyLink)}
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            {t(StringNames.Common_Close)}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ShareGame;
