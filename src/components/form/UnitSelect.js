import React, { useEffect, useState } from 'react';

import firebase from 'firebase/app';
import 'firebase/firestore';

import Box from '@material-ui/core/Box';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

export default function UnitSelect({ index, value }) {
  const [units, setUnits] = useState([]);

  useEffect(() => {
    const db = firebase.firestore();
    db.collection('units')
      .get()
      .then(snapshot => {
        const storedUnits = [];
        snapshot.forEach(doc => {
          const { unit } = doc.data();
          storedUnits.push(unit);
        });
        setUnits(storedUnits);
      });
  }, []);

  return (
    <Box display="flex" flexDirection="column-reverse" padding={'0 1.5rem'}>
      <Select
        disabled={!units.length}
        id={`unit-${index}`}
        value={value}
        style={{ width: '208px' }}
      >
        {units.map(unit => (
          <MenuItem key={unit} value={unit}>
            {unit}
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
}
