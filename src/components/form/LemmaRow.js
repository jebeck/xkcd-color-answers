import React, { useCallback, useEffect, useRef } from 'react';

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
  const textFieldRef = useRef();
  const checkIfLemmaExists = useCallback(() => {
    if (state.value !== '') {
      console.log(`Checking if lemma '${state.value}' exists...`);
      const db = firebase.firestore();
      db.collection('lemmas')
        .where('value', '==', state.value)
        .get()
        .then((snapshot) => {
          snapshot.forEach(async (doc) => {
            dispatch(actions.setLemmaValue(index, 'id', doc.id));
            const pairs = Object.entries(doc.data());
            for (let i = 0; i < pairs.length; ++i) {
              const [key, value] = pairs[i];
              if (key !== 'value') {
                const valueDoc = await value.get();
                const actualValue = valueDoc.data()[key];
                const updatedKeys = [];
                if (actualValue !== state[key]) {
                  updatedKeys.push(key);
                  dispatch(actions.setLemmaValue(index, key, actualValue));
                }
                if (updatedKeys.length) {
                  dispatch(actions.setUpdatedWarning(index, updatedKeys));
                  setTimeout(() => {
                    dispatch(actions.resetUpdatedWarning(index));
                  }, 2500);
                }
              }
            }
          });
        });
    }
  }, [dispatch, index, state]);

  useEffect(() => {
    if (state.value === '' && index === 0) {
      textFieldRef.current.focus();
    }
  }, [index, state.value]);

  return (
    <Box display="flex" margin="1.5rem 0" width="100%">
      <TextField
        autoFocus={index === 0}
        id={`value-${index}`}
        inputRef={textFieldRef}
        label="value"
        onBlur={checkIfLemmaExists}
        onChange={(e) =>
          dispatch(actions.setLemmaValue(index, 'value', e.target.value))
        }
        value={state?.value}
        style={{ paddingRight: '3rem', width: '312px' }}
      ></TextField>
      <TypeSelect
        dispatch={dispatch}
        index={index}
        onBlur={checkIfLemmaExists}
        value={state?.type}
        warning={warnings?.type}
      />
      <UnitSelect
        dispatch={dispatch}
        index={index}
        onBlur={checkIfLemmaExists}
        value={state?.unit}
        warning={warnings?.unit}
      />
      <LanguageSelect
        dispatch={dispatch}
        index={index}
        onBlur={checkIfLemmaExists}
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
