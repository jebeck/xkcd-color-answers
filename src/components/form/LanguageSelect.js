import React, { useEffect, useState } from 'react';

import firebase from 'firebase/app';
import 'firebase/firestore';

import Box from '@material-ui/core/Box';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

export default function TypeSelect({ index, value }) {
  const [languages, setLanguages] = useState([]);

  useEffect(() => {
    const db = firebase.firestore();
    db.collection('languages')
      .get()
      .then(snapshot => {
        const storedLangs = [];
        snapshot.forEach(doc => {
          const { language } = doc.data();
          storedLangs.push(language);
        });
        setLanguages(storedLangs);
      });
  }, []);

  return (
    <Box display="flex" flexDirection="column-reverse" padding={'0 1.5rem'}>
      <Select
        disabled={!languages.length}
        id={`language-${index}`}
        value={value}
        style={{ width: '208px' }}
      >
        {languages.map(language => (
          <MenuItem key={language} value={language}>
            {language}
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
}
