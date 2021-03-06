import React from 'react';

import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

export default function CurrentAnswer({ colorname, count }) {
  return (
    <Box display="flex" flexDirection="column">
      <Typography
        color="textSecondary"
        variant="subtitle1"
        style={{ fontSize: '3rem' }}
      >
        current answer:
      </Typography>
      <Typography
        align="center"
        variant="h1"
        style={{ alignSelf: 'center', fontSize: '4.5rem' }}
      >
        {colorname}
      </Typography>
      <small style={{ alignSelf: 'center' }}>{`(${count} instances)`}</small>
    </Box>
  );
}
