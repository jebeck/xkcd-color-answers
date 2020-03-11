import React, { useEffect, useState } from 'react';

import firebase from 'firebase/app';
import 'firebase/firestore';

import Box from '@material-ui/core/Box';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

export default function TypeSelect({ index, value }) {
  const [types, setTypes] = useState([]);

  useEffect(() => {
    const db = firebase.firestore();
    db.collection('types')
      .get()
      .then(snapshot => {
        const storedTypes = [];
        snapshot.forEach(doc => {
          const { type } = doc.data();
          storedTypes.push(type);
        });
        setTypes(storedTypes);
      });
  }, []);

  return (
    <Box display="flex" flexDirection="column-reverse" padding={'0 1.5rem'}>
      <Select
        disabled={!types.length}
        id={`type-${index}`}
        value={value}
        style={{ width: '208px' }}
      >
        {types.map(type => (
          <MenuItem key={type} value={type}>
            {type}
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
}
