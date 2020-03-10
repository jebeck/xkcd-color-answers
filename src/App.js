import React, { useEffect, useRef, useState } from 'react';
import { useQueryParam, StringParam } from 'use-query-params';

import ErrorAlert from './components/ErrorAlert';
import Footer from './components/Footer';
import Header from './components/Header';
import Login from './components/Login';
import SQLWorker from './sql.worker';

function App() {
  const workerRef = useRef(null);
  const [apiKey] = useQueryParam('apiKey', StringParam);
  const [data, setData] = useState(null);
  const [dbReady, setDbReady] = useState(false);
  const [workerError, setWorkerError] = useState(null);
  const [user, setUser] = useState(null);

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

  return (
    <>
      <Header />
      {workerError && (
        <ErrorAlert
          clearError={() => setWorkerError(null)}
          error={workerError}
        />
      )}
      {!user && <Login apiKey={apiKey} setUser={setUser} user={user} />}
      <Footer data={data} />
    </>
  );
}

export default App;
