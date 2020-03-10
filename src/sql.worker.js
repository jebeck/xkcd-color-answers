/* eslint-disable no-restricted-globals */

import initSqlJs from 'sql.js';

let surveyDb;

function initialize() {
  initSqlJs({ locateFile: filename => filename })
    .then(SQL => {
      console.log('Initialized SQL.js');

      const xhr = new XMLHttpRequest();
      xhr.open('GET', 'xkcd_color_survey.sqlite', true);
      xhr.responseType = 'arraybuffer';
      xhr.onload = e => {
        var surveyArray = new Uint8Array(xhr.response);
        surveyDb = new SQL.Database(surveyArray);
        console.log('Loaded survey DB');
        postMessage({ type: 'init' });
      };
      xhr.send();
    })
    .catch(error => {
      throw error;
    });
}

initialize();

self.onmessage = ({ data: { payload, type } }) => {
  console.log(`SQLWorker received message of type: ${type}`);
  switch (type) {
    case 'query': {
      const data = surveyDb.exec(payload[type]);
      const { columns, values } = data[0];
      postMessage({
        type: 'data',
        payload: {
          data: values.map(([v1, v2]) => ({
            [columns[0]]: v1,
            [columns[1]]: v2,
          })),
        },
      });
      break;
    }
    default: {
      throw new Error(`Unrecognized message type: ${type}`);
    }
  }
};
