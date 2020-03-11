import React from 'react';

import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';

import { actions } from '../../formReducer';
import LanguageSelect from './LanguageSelect';
import TypeSelect from './TypeSelect';
import UnitSelect from './UnitSelect';

export default function LemmaRow({ dispatch, index, state }) {
  return (
    <Box display="flex" justifyContent="space-around" width="100%">
      <TextField
        autoFocus={index === 0}
        id={`value-${index}`}
        label="value"
        onChange={e =>
          dispatch(actions.setLemmaValue(index, 'value', e.target.value))
        }
        value={state.value}
      ></TextField>
      <TypeSelect dispatch={dispatch} index={index} value={state.type} />
      <UnitSelect dispatch={dispatch} index={index} value={state.unit} />
      <LanguageSelect
        dispatch={dispatch}
        index={index}
        value={state.language}
      />
    </Box>
  );
}
