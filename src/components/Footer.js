import React, { forwardRef } from 'react';
import { format } from 'd3-format';

import { useTheme } from '@material-ui/core/styles';

export default forwardRef(function Footer({ answersSize, data }, ref) {
  const theme = useTheme();

  return (
    <footer
      ref={ref}
      style={{
        bottom: 0,
        fontSize: '1.5rem',
        fontStyle: 'italic',
        left: 0,
        padding: '1rem 1.5rem',
        position: 'fixed',
        textAlign: 'right',
        textDecoration: `underline ${theme.palette.secondary.main} double`,
        width: '100%',
      }}
    >{`${
      answersSize && data ? format(',')(data.length) : '?,???'
    } answers left to tag`}</footer>
  );
});
