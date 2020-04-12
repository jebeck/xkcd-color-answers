import _ from 'lodash';
import React, { useEffect, useMemo, useReducer } from 'react';
import { range } from 'd3-array';

import firebase from 'firebase/app';
import 'firebase/firestore';

import AddCircleIcon from '@material-ui/icons/AddCircle';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import IconButton from '@material-ui/core/IconButton';
import { useTheme } from '@material-ui/core/styles';

import { actions, formReducer, makeBaseLemma } from '../../formReducer';
import CurrentAnswer from '../CurrentAnswer';
import LemmaRow from './LemmaRow';

export default function DecoderForm({ answers }) {
  const theme = useTheme();
  const db = useMemo(() => firebase.firestore(), []);

  const [state, dispatch] = useReducer(formReducer, {
    answers,
    currentAnswer: 0,
    lemmas: [makeBaseLemma()],
    numLemmas: 1,
    updatedFromStored: [],
  });

  useEffect(() => {
    dispatch(actions.setAnswers(answers));
  }, [answers]);

  return (
    <>
      <hr
        style={{ borderColor: theme.palette.secondary.dark, width: '100%' }}
      />
      <CurrentAnswer
        answerText={state.answers[state.currentAnswer].colorname}
      />
      <Container style={{ padding: '3rem' }}>
        {range(0, state.numLemmas).map((index) => (
          <LemmaRow
            dispatch={dispatch}
            index={index}
            key={index}
            state={state.lemmas[index]}
            warnings={state.updatedFromStored[index]}
          />
        ))}
        <Box align="center" marginTop="2rem">
          <IconButton onClick={() => dispatch(actions.addLemma())}>
            <AddCircleIcon color="primary" fontSize="large" />
          </IconButton>
        </Box>
      </Container>
      <Box flexGrow={1} />
      <Box alignSelf="flex-end" paddingBottom="3rem">
        <Button
          color="primary"
          onClick={async () => {
            const answer = {
              lemmas: [],
              raw: state.answers[state.currentAnswer].colorname,
            };
            for (let i = 0; i < state.lemmas.length; ++i) {
              const lemma = state.lemmas[i];
              const { id } = lemma;
              if (id) {
                const ref = db.collection('lemmas').doc(id);
                answer.lemmas.push(db.doc(ref.path));
              } else {
                try {
                  const ref = await db.collection('lemmas').add(
                    _.mapValues(lemma, (val, key) => {
                      if (key !== 'value') {
                        return db.doc(`${key}s/${val}`);
                      }
                      return val;
                    })
                  );
                  answer.lemmas.push(db.doc(ref.path));
                } catch (error) {
                  throw error;
                }
              }
            }
            db.collection('answers')
              .add(answer)
              .catch((error) => {
                throw error;
              });
            dispatch(actions.reset());
          }}
          variant="outlined"
          style={{ fontWeight: 'bold', fontSize: '2rem' }}
        >
          save &amp; next
        </Button>
      </Box>
      <hr style={{ borderColor: theme.palette.primary.dark, width: '100%' }} />
    </>
  );
}
