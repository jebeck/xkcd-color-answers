import _ from 'lodash';
import React, { useEffect, useMemo, useReducer, useState } from 'react';
import bows from 'bows';
import { range } from 'd3-array';

import firebase from 'firebase/app';
import 'firebase/firestore';

import AddCircleIcon from '@material-ui/icons/AddCircle';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Container from '@material-ui/core/Container';
import FormHelperText from '@material-ui/core/FormHelperText';
import IconButton from '@material-ui/core/IconButton';
import LinearProgress from '@material-ui/core/LinearProgress';
import { useTheme } from '@material-ui/core/styles';

import { actions, formReducer, makeInitialState } from '../../formReducer';
import CurrentAnswer from '../CurrentAnswer';
import ErrorAlert from '../ErrorAlert';
import LemmaRow from './LemmaRow';

const log = bows('DecoderForm');

export default function DecoderForm({ answers }) {
  const [canSave, setCanSave] = useState(false);
  const [error, setError] = useState(null);
  const fireDb = useMemo(() => firebase.firestore(), []);
  const [isSaving, setIsSaving] = useState(false);
  const [languages, setLanguages] = useState([]);
  const [state, dispatch] = useReducer(formReducer, answers, makeInitialState);
  const theme = useTheme();
  const [types, setTypes] = useState([]);
  const [units, setUnits] = useState([]);

  const numWordsInAnswer = useMemo(() => {
    const answer = answers[state?.currentAnswer]?.colorname;
    if (answer) {
      return answer.split(' ').length;
    }
  }, [answers, state]);

  useEffect(() => {
    log('DecoderForm Firebase useEffect');
    const unsubLanguages = fireDb
      .collection('languages')
      .onSnapshot((snapshot) => {
        const storedLangs = [];
        snapshot.forEach((doc) => {
          const { language } = doc.data();
          storedLangs.push(language);
        });
        setLanguages(storedLangs);
      });

    const unsubTypes = fireDb.collection('types').onSnapshot((snapshot) => {
      const storedTypes = [];
      snapshot.forEach((doc) => {
        storedTypes.push(doc.data());
      });
      setTypes(storedTypes);
    });

    const unsubUnits = fireDb.collection('units').onSnapshot((snapshot) => {
      const storedUnits = [];
      snapshot.forEach((doc) => {
        const { unit } = doc.data();
        storedUnits.push(unit);
      });
      setUnits(storedUnits);
    });

    return () => {
      unsubLanguages();
      unsubTypes();
      unsubUnits();
    };
  }, [fireDb]);

  useEffect(() => {
    dispatch(actions.setAnswers(answers));
  }, [answers]);

  const buttonEnabled = canSave && !isSaving;

  return (
    <>
      {error && <ErrorAlert clearError={() => setError(null)} error={error} />}
      <hr
        style={{ borderColor: theme.palette.secondary.dark, width: '100%' }}
      />
      <CurrentAnswer {...state.answers[state.currentAnswer]} />
      {!isSaving ? (
        <Container
          style={{ overflowY: 'scroll', padding: '3rem', position: 'relative' }}
        >
          {range(0, state.numLemmas).map((index) => (
            <LemmaRow
              dispatch={dispatch}
              fullAnswerString={answers[state.currentAnswer]?.colorname}
              index={index}
              key={index}
              languages={languages}
              setCanSave={setCanSave}
              state={state.lemmas[index]}
              types={types}
              units={units}
              verifiedAgainstStored={state.verifiedAgainstStored?.[index]}
              warnings={state.updatedFromStored[index]}
            />
          ))}
          <Box align="center" marginTop="2rem">
            <IconButton onClick={() => dispatch(actions.addLemma())}>
              <AddCircleIcon color="primary" fontSize="large" />
            </IconButton>
          </Box>
        </Container>
      ) : null}
      {isSaving ? (
        <Box
          alignItems="center"
          display="flex"
          flexDirection="column"
          mt="5rem"
        >
          <LinearProgress
            color="primary"
            style={{ margin: '1rem 0', width: '80%' }}
          ></LinearProgress>
          <LinearProgress
            color="secondary"
            style={{ margin: '1rem 0', width: '80%' }}
          ></LinearProgress>
          <LinearProgress
            color="primary"
            style={{ margin: '1rem 0', width: '80%' }}
          ></LinearProgress>
        </Box>
      ) : null}
      <Box flexGrow={1} />
      {numWordsInAnswer !== state?.numLemmas ? (
        <FormHelperText
          error
          style={{ paddingBottom: '0.25rem', textAlign: 'right' }}
        >
          # of lemmas does not match # of words in answer
        </FormHelperText>
      ) : null}
      <Box alignSelf="flex-end" paddingBottom="2rem">
        <Button
          color="primary"
          disabled={!buttonEnabled}
          onClick={
            canSave
              ? async () => {
                  log(`Clicked save & next`);
                  setIsSaving(true);
                  const answer = {
                    lemmas: [],
                    raw: state.answers[state.currentAnswer].colorname,
                  };
                  for (let i = 0; i < state.lemmas.length; ++i) {
                    const lemma = state.lemmas[i];
                    const { id } = lemma;
                    if (id) {
                      const ref = fireDb.collection('lemmas').doc(id);
                      answer.lemmas.push(fireDb.doc(ref.path));
                    } else {
                      try {
                        const ref = await fireDb.collection('lemmas').add(
                          _.mapValues(lemma, (val, key) => {
                            if (key !== 'value') {
                              return fireDb.doc(`${key}s/${val}`);
                            }
                            return val;
                          })
                        );
                        log(`New lemma ${ref.id} added`);
                        answer.lemmas.push(fireDb.doc(ref.path));
                      } catch (error) {
                        setIsSaving(false);
                        return setError(error);
                      }
                    }
                  }
                  try {
                    const ref = await fireDb.collection('answers').add(answer);
                    log(`New answer ${ref.id} added`);
                  } catch (error) {
                    setIsSaving(false);
                    return setError(error);
                  }
                  dispatch(actions.reset());
                  setIsSaving(false);
                }
              : () => {}
          }
          variant="outlined"
          style={{
            cursor: buttonEnabled ? 'pointer' : 'not-allowed',
            fontWeight: 'bold',
            fontSize: '1.5rem',
            minWidth: '12.125rem',
            pointerEvents: 'unset',
          }}
        >
          {isSaving ? (
            <>
              <CircularProgress size="1.5rem" />
              &nbsp;saving
            </>
          ) : (
            ` save & next`
          )}
        </Button>
      </Box>
      <hr style={{ borderColor: theme.palette.primary.dark, width: '100%' }} />
    </>
  );
}
