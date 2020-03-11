import React, { useCallback } from 'react';

import firebase from 'firebase/app';
import 'firebase/firestore';

import Box from '@material-ui/core/Box';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';

import { actions } from '../../formReducer';
import LanguageSelect from './LanguageSelect';
import TypeSelect from './TypeSelect';
import UnitSelect from './UnitSelect';

export default function LemmaRow({ dispatch, index, state, warnings }) {
  const checkIfLemmaExists = useCallback(() => {
    if (state.value !== '') {
      console.log(`Checking if lemma '${state.value}' exists...`);
      const db = firebase.firestore();
      db.collection('lemmas')
        .where('value', '==', state.value)
        .get()
        .then(snapshot => {
          snapshot.forEach(doc => {
            Object.entries(doc.data()).forEach(([key, value]) => {
              const updatedKeys = [];
              if (value !== state[key]) {
                updatedKeys.push(key);
                dispatch(actions.setLemmaValue(index, key, value));
              }
              if (updatedKeys.length) {
                dispatch(actions.setUpdatedWarning(index, updatedKeys));
                setTimeout(() => {
                  dispatch(actions.resetUpdatedWarning(index));
                }, 2500);
              }
            });
          });
        });
    }
  }, [dispatch, index, state]);

  return (
    <Box display="flex" margin="1.5rem 0" width="100%">
      <TextField
        autoFocus={index === 0}
        id={`value-${index}`}
        label="value"
        onBlur={checkIfLemmaExists}
        onChange={e =>
          dispatch(actions.setLemmaValue(index, 'value', e.target.value))
        }
        value={state?.value}
        style={{ paddingRight: '3rem', width: '312px' }}
      ></TextField>
      <TypeSelect
        dispatch={dispatch}
        index={index}
        value={state?.type}
        warning={warnings?.type}
      />
      <UnitSelect
        dispatch={dispatch}
        index={index}
        value={state?.unit}
        warning={warnings?.unit}
      />
      <LanguageSelect
        dispatch={dispatch}
        index={index}
        value={state?.language}
        warning={warnings?.language}
      />
      {index > 0 ? (
        <IconButton onClick={() => dispatch(actions.removeLemma(index))}>
          <DeleteIcon color="secondary" />
        </IconButton>
      ) : null}
    </Box>
  );
}
