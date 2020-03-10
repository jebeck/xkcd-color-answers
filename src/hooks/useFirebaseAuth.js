import _ from 'lodash';
import firebase from 'firebase/app';
import 'firebase/auth';
import { useEffect, useState } from 'react';

firebase.initializeApp({
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: 'xkcd-colors.firebaseapp.com',
  databaseURL: 'https://xkcd-colors.firebaseio.com',
  projectId: 'xkcd-colors',
  storageBucket: 'xkcd-colors.appspot.com',
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSENGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
});

const actionCodeSettings = {
  url: process.env.REACT_APP_URL,
  handleCodeInApp: true,
};

export default function useFirebaseAuth(email, setUser) {
  const [loginError, setLoginError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e) {
    if (e) {
      e.preventDefault();
    }
    setSubmitted(true);
  }

  useEffect(() => {
    if (email && submitted) {
      window.localStorage.setItem('emailForSignIn', email);
      const auth = firebase.auth();
      console.log('Sending Firebase sign-in e-mail...');
      auth.sendSignInLinkToEmail(email, actionCodeSettings).catch(err => {
        setLoginError(_.pick(err, ['code', 'message']));
        setSubmitted(false);
      });
    }
  }, [email, submitted]);

  useEffect(() => {
    if (firebase.auth().isSignInWithEmailLink(window.location.href)) {
      console.log('Firebase sign-in from link...');
      const email = window.localStorage.getItem('emailForSignIn');
      const auth = firebase.auth();
      auth
        .signInWithEmailLink(email, window.location.href)
        .then(result => {
          setUser(result.user);
          setSubmitted(false);
        })
        .catch(err => {
          setLoginError(_.pick(err, ['code', 'message']));
          setSubmitted(false);
        });
    }
  }, [email, setUser]);

  function clearError() {
    setLoginError(null);
  }

  function resetSubmission() {
    setSubmitted(false);
  }

  return {
    clearError,
    loginError,
    onSubmit: handleSubmit,
    resetSubmission,
    submitted,
  };
}
