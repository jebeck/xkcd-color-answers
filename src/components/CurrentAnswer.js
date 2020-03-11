import React from 'react';

import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

export default function CurrentAnswer({ answerText }) {
  return (
    <Box display="flex" flexDirection="column">
      <Typography
        color="textSecondary"
        variant="subtitle1"
        style={{ fontSize: '4rem' }}
      >
        current answer:
      </Typography>
      <Typography align="center" variant="h1" style={{ alignSelf: 'center' }}>
        {answerText}
      </Typography>
    </Box>
  );
}
