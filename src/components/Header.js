import React from 'react';

import { useTheme } from '@material-ui/core/styles';

export default function Header() {
  const theme = useTheme();

  return (
    <header
      style={{
        fontSize: '2.5rem',
        fontStyle: 'italic',
        left: 0,
        padding: '1rem 1.5rem',
        position: 'fixed',
        textDecoration: `underline ${theme.palette.primary.main} double`,
        top: 0,
        width: '100%',
      }}
    >
      xkcd color survey answers decoder
    </header>
  );
}
