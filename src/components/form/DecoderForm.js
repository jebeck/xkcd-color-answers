import React, { useReducer } from 'react';
import { range } from 'd3-array';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import { useTheme } from '@material-ui/core/styles';

import { formReducer, makeBaseLemma } from '../../formReducer';
import CurrentAnswer from '../CurrentAnswer';
import LemmaRow from './LemmaRow';

export default function DecoderForm({ answers, bounds }) {
  const theme = useTheme();

  const [state, dispatch] = useReducer(formReducer, {
    answers,
    currentAnswer: 0,
    lemmas: [makeBaseLemma()],
    numLemmas: 1,
  });

  return (
    <Box
      display="flex"
      flexDirection="column"
      height={`calc(100vh - ${bounds.top + bounds.bottom}px)`}
      margin={`${bounds.top}px 0 ${bounds.bottom}px`}
      padding="0 1.5rem"
      width="100%"
    >
      <hr
        style={{ borderColor: theme.palette.secondary.dark, width: '100%' }}
      />
      <CurrentAnswer
        answerText={state.answers[state.currentAnswer].colorname}
      />
      <Container style={{ padding: '3rem' }}>
        {range(0, state.numLemmas).map(index => (
          <LemmaRow
            dispatch={dispatch}
            index={index}
            key={index}
            state={state.lemmas[index]}
          />
        ))}
      </Container>
      <Box flexGrow={1} />
      <Box alignSelf="flex-end" paddingBottom="1rem">
        <Button color="primary" size="large" variant="contained">
          save &amp; next
        </Button>
      </Box>
      <hr style={{ borderColor: theme.palette.primary.dark, width: '100%' }} />
    </Box>
  );
}
