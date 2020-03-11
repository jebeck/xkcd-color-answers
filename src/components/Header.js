import React, { forwardRef } from 'react';

import { useTheme } from '@material-ui/core/styles';

export default forwardRef(function Header(props, ref) {
  const theme = useTheme();

  return (
    <header
      ref={ref}
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
});
