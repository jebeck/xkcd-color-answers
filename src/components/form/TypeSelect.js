import React, { useEffect, useState } from 'react';

import firebase from 'firebase/app';
import 'firebase/firestore';

import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

import { actions } from '../../formReducer';

export default function TypeSelect({ dispatch, index, value, warning }) {
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
    <FormControl error={warning}>
      <InputLabel id={`type-${index}-label`}>type</InputLabel>
      <Select
        disabled={!types.length}
        id={`type-${index}`}
        labelId={`type-${index}-label`}
        onChange={e =>
          dispatch(actions.setLemmaValue(index, 'type', e.target.value))
        }
        value={types.length ? value : ''}
        style={{ width: '208px' }}
      >
        {types.map(type => (
          <MenuItem key={type} value={type}>
            {type}
          </MenuItem>
        ))}
      </Select>
      {warning && <FormHelperText>Updated from store!</FormHelperText>}
    </FormControl>
  );
}
