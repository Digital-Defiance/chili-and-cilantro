import { CardType } from '@chili-and-cilantro/chili-and-cilantro-lib';
import {
  Box,
  FormControl,
  FormLabel,
  Grid2,
  MenuItem,
  Select,
} from '@mui/material'; // Import necessary MUI components
import { FC, useState } from 'react';
import PlayerDisc, { PatternTypeStrings, patternType } from './player-disc';

const DiscTest: FC = () => {
  const [selectedPattern, setSelectedPattern] = useState<string>(
    PatternTypeStrings[0],
  );

  return (
    <Box>
      <FormControl fullWidth margin="normal">
        <FormLabel id="pattern-select-label">Pattern Type</FormLabel>
        <Select
          labelId="pattern-select-label"
          id="patternType"
          value={selectedPattern}
          onChange={(e) => setSelectedPattern(e.target.value)}
        >
          {PatternTypeStrings.map((patternType) => (
            <MenuItem key={patternType} value={patternType}>
              {patternType}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Grid2 container spacing={2}>
        {' '}
        {/* Added spacing between grid items */}
        {Array.from({ length: 8 }).map((_, i) => (
          <Grid2 key={i} size={6} container direction="column" spacing={1}>
            {' '}
            {/* Improved layout */}
            <Grid2 size={6}>
              <PlayerDisc
                player={i + 1}
                type={CardType.Chili}
                patternType={patternType(selectedPattern)}
              />
            </Grid2>
          </Grid2>
        ))}
      </Grid2>
    </Box>
  );
};

export default DiscTest;
