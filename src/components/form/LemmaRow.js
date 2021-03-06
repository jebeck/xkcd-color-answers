import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import bows from 'bows';

import firebase from 'firebase/app';
import 'firebase/firestore';

import Box from '@material-ui/core/Box';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import ReplayIcon from '@material-ui/icons/Replay';
import TextField from '@material-ui/core/TextField';

import { actions } from '../../formReducer';
import ErrorAlert from '../ErrorAlert';
import LanguageSelect from './LanguageSelect';
import TypeSelect from './TypeSelect';
import UnitSelect from './UnitSelect';

const log = bows('LemmaRow');

export default function LemmaRow({
  dispatch,
  fullAnswerString,
  index,
  languages,
  setCanSave,
  state,
  types,
  units,
  verifiedAgainstStored,
  warnings,
}) {
  const [error, setError] = useState(null);
  const fireDb = useMemo(() => firebase.firestore(), []);
  const isSubStringMatch = useMemo(
    () => fullAnswerString.includes(state?.value),
    [fullAnswerString, state]
  );
  const textFieldRef = useRef();

  /** in order to enforce consistent type, unit, and language for each lemma,
   * check for the existence of a lemma and change mismatched form fields to previous stored values
   * with a warning notifying the user that this correction has been made :)
   */
  const checkIfLemmaExists = useCallback(() => {
    if (state.value !== '') {
      log(`Checking if lemma '${state.value}' exists...`);
      setCanSave(false);
      fireDb
        .collection('lemmas')
        .where('value', '==', state.value)
        .get()
        .then(async (snapshot) => {
          if (snapshot.size === 0) {
            log(`Lemma ${state.value} does not exist (yet) in Firestore...`);
            return setCanSave(true);
          } else if (snapshot.size > 1) {
            log(`More than one lemma found matching '${state.value}'...`);
          }
          let storedLemma;
          snapshot.forEach((doc) => {
            const lemma = doc.data();
            if (snapshot.size > 1) {
              if (lemma.preferred) {
                storedLemma = lemma;
                dispatch(actions.setLemmaValue(index, 'id', doc.id));
              }
            } else {
              storedLemma = lemma;
              dispatch(actions.setLemmaValue(index, 'id', doc.id));
            }
          });
          if (snapshot.size > 1 && !storedLemma) {
            throw new Error(
              `No preferred lemma found matching '${state.value}'...`
            );
          }
          const pairs = Object.entries(storedLemma);

          const updatedKeys = [];

          for (let i = 0; i < pairs.length; ++i) {
            const [key, value] = pairs[i];

            if (!['preferred', 'value'].includes(key)) {
              const valueDoc = await value.get();
              const actualValue = valueDoc.data()[key];

              if (actualValue !== state[key]) {
                updatedKeys.push(key);
                dispatch(actions.setLemmaValue(index, key, actualValue));
              } else {
                dispatch(actions.setVerifiedAgainstStored(index));
              }
              setCanSave(true);
            }
          }
          if (updatedKeys.length) {
            dispatch(actions.setUpdatedWarning(index, updatedKeys));
            setTimeout(() => {
              dispatch(actions.resetUpdatedWarning(index));
            }, 2500);
          }
        })
        .catch((error) => {
          setError(
            new Error(
              `Error checking for existence of ${state.value}: ${
                error?.message || 'Unknown error'
              }`
            )
          );
        });
    }
  }, [dispatch, fireDb, index, setCanSave, state]);

  useEffect(() => {
    if (state.value === '' && index === 0) {
      textFieldRef.current.focus();
    }
  }, [index, state.value]);

  const displaySubStrError = Boolean(state?.value && !isSubStringMatch);

  return (
    <>
      {error ? (
        <ErrorAlert clearError={() => setError(null)} error={error} />
      ) : null}
      <Box display="flex" margin="1.5rem 0" minHeight="4.5rem" width="100%">
        <TextField
          autoFocus
          error={displaySubStrError}
          disabled={verifiedAgainstStored}
          helperText={
            displaySubStrError
              ? `Not a sub string of "${fullAnswerString}"`
              : ''
          }
          id={`value-${index}`}
          inputRef={textFieldRef}
          label="value"
          onBlur={checkIfLemmaExists}
          onChange={(e) =>
            dispatch(actions.setLemmaValue(index, 'value', e.target.value))
          }
          required
          value={state?.value}
          style={{ paddingRight: '3rem', width: '312px' }}
        ></TextField>
        <TypeSelect
          dispatch={dispatch}
          index={index}
          types={types}
          value={state?.type}
          verifiedAgainstStored={verifiedAgainstStored}
          warning={warnings?.type}
        />
        <UnitSelect
          dispatch={dispatch}
          index={index}
          units={units}
          value={state?.unit}
          verifiedAgainstStored={verifiedAgainstStored}
          warning={warnings?.unit}
        />
        <LanguageSelect
          dispatch={dispatch}
          index={index}
          languages={languages}
          value={state?.language}
          verifiedAgainstStored={verifiedAgainstStored}
          warning={warnings?.language}
        />
        <IconButton
          onClick={() => dispatch(actions.resetVerifiedWarnings(index))}
        >
          <ReplayIcon color="primary" />
        </IconButton>
        {index > 0 ? (
          <IconButton
            onClick={() => {
              dispatch(actions.removeLemma(index));
              dispatch(actions.resetVerifiedWarnings(index));
            }}
          >
            <DeleteIcon color="secondary" />
          </IconButton>
        ) : null}
      </Box>
    </>
  );
}
