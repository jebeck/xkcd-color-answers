import React, { useEffect, useRef, useState } from 'react';
import useMeasure from 'react-use-measure';
import { useQueryParam, StringParam } from 'use-query-params';

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

import DecoderForm from './components/form/DecoderForm';
import ErrorAlert from './components/ErrorAlert';
import Footer from './components/Footer';
import Header from './components/Header';
import Login from './components/Login';
import SQLWorker from './sql.worker';

function App() {
  const workerRef = useRef(null);
  const [apiKey] = useQueryParam('apiKey', StringParam);
  const [answersSize, setAnswersSize] = useState(null);
  const [data, setData] = useState(null);
  const [dbReady, setDbReady] = useState(false);
  const [workerError, setWorkerError] = useState(null);
  const [user, setUser] = useState(true);
  const [headerRef, headerBounds] = useMeasure();
  const [footerRef, footerBounds] = useMeasure();

  useEffect(() => {
    const worker = new SQLWorker();
    workerRef.current = worker;

    worker.onmessage = ({ data: { payload, type } }) => {
      console.log(`App.js received message of type: ${type}`);
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

    worker.onerror = error => {
      setWorkerError(error);
    };
  }, []);

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

  useEffect(() => {
    if (data) {
      const db = firebase.firestore();
      db.collection('answers').onSnapshot(snapshot => {
        if (snapshot.size !== answersSize) {
          setAnswersSize(snapshot.size);
          const rawValues = [];
          snapshot.forEach(doc => {
            const { raw } = doc.data();
            rawValues.push(raw);
          });
          setData(
            data.filter(d => {
              if (rawValues.includes(d.colorname)) {
                return false;
              }
              return true;
            })
          );
        }
      });
    }
  }, [answersSize, data]);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        setUser(user);
      }
    });
  }, []);

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
      {workerError && (
        <ErrorAlert
          clearError={() => setWorkerError(null)}
          error={workerError}
        />
      )}
      {!user && <Login apiKey={apiKey} setUser={setUser} user={user} />}
      {data && (
        <DecoderForm
          bounds={{ top: headerBounds.height, bottom: footerBounds.height }}
          answers={data}
        />
      )}
      <Footer data={data} ref={footerRef} />
    </div>
  );
}

export default App;
