import React, { useState } from 'react';

import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import HomeIcon from '@material-ui/icons/Home';
import Snackbar from '@material-ui/core/Snackbar';
import TextField from '@material-ui/core/TextField';

import ErrorAlert from './ErrorAlert';
import useFirebaseAuth from '../hooks/useFirebaseAuth';

export default function Login({ apiKey, setUser, user }) {
  const [anonymous, setAnonymous] = useState(false);
  const [email, setEmail] = useState('');

  const {
    clearError,
    loginError,
    onSubmit,
    resetSubmission,
    submitted,
  } = useFirebaseAuth(email, setUser);

  if (loginError) {
    return (
      <ErrorAlert
        ActionComponent={
          <Button href="/" size="small" startIcon={<HomeIcon />}>
            Return home
          </Button>
        }
        clearError={clearError}
        error={loginError}
      />
    );
  }

  if (submitted) {
    return (
      <Snackbar
        anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
        autoHideDuration={5000}
        onClose={resetSubmission}
        open={submitted}
      >
        <Alert severity="info">{`Sent login link to ${email}!`}</Alert>
      </Snackbar>
    );
  }

  if (anonymous || apiKey || user) {
    return null;
  }

  return (
    <Dialog open={true} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">
        <span role="img" aria-label="ogre emoji">
          👹
        </span>
        &nbsp;Login
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          You give e-mail. Then&nbsp;
          <span role="img" aria-label="ogre emoji">
            👹
          </span>
          &nbsp;sends sign-in link.
        </DialogContentText>
        <TextField
          autoFocus
          fullWidth
          id="name"
          label="Email Address"
          margin="dense"
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          value={email}
        />
      </DialogContent>
      <DialogActions>
        <Button color="secondary" onClick={() => setAnonymous(true)}>
          Cancel
        </Button>
        <Button onClick={onSubmit} color="primary">
          Login
        </Button>
      </DialogActions>
    </Dialog>
  );
}
