import React from 'react';

import Alert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';

export default function ErrorAlert({ ActionComponent, clearError, error }) {
  return (
    <Snackbar
      anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
      autoHideDuration={5000}
      onClose={clearError}
      open={!!error}
    >
      <Alert action={ActionComponent} severity="error">
        {error?.message || 'Unknown error'}
      </Alert>
    </Snackbar>
  );
}
