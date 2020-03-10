import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import Box from '@material-ui/core/Box';
import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

const darkTheme = createMuiTheme({
  palette: {
    primary: {
      main: '#b39ddb',
    },
    secondary: {
      main: '#ffccbc',
    },
    type: 'dark',
  },
  typography: {
    fontFamily: ['Space Mono', 'monospace'],
  },
});

ReactDOM.render(
  <ThemeProvider theme={darkTheme}>
    <CssBaseline>
      <Box height="100vh" width="100vw">
        <App />
      </Box>
    </CssBaseline>
  </ThemeProvider>,
  document.getElementById('root')
);
