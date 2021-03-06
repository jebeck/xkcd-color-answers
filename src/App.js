import React, { useEffect, useMemo, useRef, useState } from 'react';
import bows from 'bows';
import useMeasure from 'react-use-measure';
import { useQueryParam, StringParam } from 'use-query-params';

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

import Box from '@material-ui/core/Box';
import LinearProgress from '@material-ui/core/LinearProgress';

import DecoderForm from './components/form/DecoderForm';
import ErrorAlert from './components/ErrorAlert';
import Footer from './components/Footer';
import Header from './components/Header';
import Login from './components/Login';
import SQLWorker from './sql.worker';

const log = bows('App');

function App() {
  const [answersSize, setAnswersSize] = useState(null);
  const [apiKey] = useQueryParam('apiKey', StringParam);
  const [data, setData] = useState(null);
  const [dbReady, setDbReady] = useState(false);
  const [error, setError] = useState(null);
  const [filteredData, setFilteredData] = useState(null);
  const fireDb = useMemo(() => firebase.firestore(), []);
  const [footerRef, footerBounds] = useMeasure();
  const [headerRef, headerBounds] = useMeasure();
  const [user, setUser] = useState(true);
  const [workerError, setWorkerError] = useState(null);
  const workerRef = useRef(null);

  /** set up SQLWorker */
  useEffect(() => {
    const worker = new SQLWorker();
    workerRef.current = worker;

    worker.onmessage = ({ data: { payload, type } }) => {
      log(`App.js received message of type: ${type}`);
      switch (type) {
        case 'init': {
          setDbReady(true);
          break;
        }
        case 'data': {
          setData(payload?.data);
          break;
        }
        default: {
          setWorkerError(
            new Error(`Unrecognized message type from SQLWorker: ${type}`)
          );
        }
      }
    };

    worker.onerror = (error) => {
      setWorkerError(error);
    };

    return () => {
      worker.terminate();
    };
  }, []);

  /** use SQLWorker to query for all distinct colornames occurring at least 25 times from XKCD color survey answers table */
  useEffect(() => {
    if (dbReady) {
      const worker = workerRef.current;

      worker.postMessage({
        type: 'query',
        payload: {
          query:
            'SELECT colorname, COUNT(colorname) as count FROM answers GROUP BY colorname HAVING count >= 25 ORDER BY count DESC;',
        },
      });
    }
  }, [dbReady]);

  /** once distinct colornames retrieved, fetch tagged answers from Firestore
   * and filter data down to only un-tagged colornames
   */
  useEffect(() => {
    if (data) {
      const unsubscribe = fireDb.collection('answers').onSnapshot(
        (snapshot) => {
          setAnswersSize(snapshot.size);
          const rawValues = [];
          snapshot.forEach((doc) => {
            const { raw } = doc.data();
            rawValues.push(raw);
          });
          setFilteredData(
            data.filter((d) => {
              if (rawValues.includes(d.colorname)) {
                return false;
              }
              return true;
            })
          );
        },
        (error) => {
          setError(error);
        }
      );

      return unsubscribe;
    }
  }, [data, fireDb]);

  /** set user in state on Firebase auth state change */
  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      }
    });
  }, []);

  /** allow 2.5 seconds for previously logged-in Firebase user to repopulate */
  useEffect(() => {
    setTimeout(() => {
      if (!firebase.auth().currentUser) {
        setUser(null);
      }
    }, 2500);
  }, [user]);

  return (
    <div style={{ overflow: 'hidden' }}>
      <Header ref={headerRef} />
      {error && <ErrorAlert clearError={() => setError(null)} error={error} />}
      {workerError && (
        <ErrorAlert
          clearError={() => setWorkerError(null)}
          error={workerError}
        />
      )}
      {!user && <Login apiKey={apiKey} setUser={setUser} user={user} />}
      <Box
        display="flex"
        flexDirection="column"
        height={`calc(100vh - ${headerBounds.height + footerBounds.height}px)`}
        margin={`${headerBounds.height}px 0 ${footerBounds.height}px`}
        padding="0 1.5rem"
        width="100%"
      >
        {!!answersSize && filteredData && (
          <DecoderForm answers={filteredData} />
        )}
        {!answersSize && (
          <Box
            alignItems="center"
            display="flex"
            flexDirection="column"
            height="95%"
            justifyContent="center"
          >
            <LinearProgress
              color="primary"
              style={{ margin: '1rem 0', width: '80%' }}
            ></LinearProgress>
            <LinearProgress
              color="secondary"
              style={{ margin: '1rem 0', width: '80%' }}
            ></LinearProgress>
            <LinearProgress
              color="primary"
              style={{ margin: '1rem 0', width: '80%' }}
            ></LinearProgress>
            <LinearProgress
              color="primary"
              style={{ margin: '1rem 0', width: '80%' }}
            ></LinearProgress>
            <LinearProgress
              color="primary"
              style={{ margin: '1rem 0', width: '80%' }}
            ></LinearProgress>
            <LinearProgress
              color="secondary"
              style={{ margin: '1rem 0', width: '80%' }}
            ></LinearProgress>
            <LinearProgress
              color="primary"
              style={{ margin: '1rem 0', width: '80%' }}
            ></LinearProgress>
          </Box>
        )}
      </Box>
      <Footer answersSize={answersSize} data={filteredData} ref={footerRef} />
    </div>
  );
}

export default App;
