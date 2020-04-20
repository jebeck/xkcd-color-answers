import _ from 'lodash';
import React from 'react';

import 'firebase/firestore';

import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

import { actions } from '../../formReducer';

export default function TypeSelect({
  dispatch,
  index,
  onBlur,
  types,
  value,
  verifiedAgainstStored,
  warning,
}) {
  return (
    <FormControl error={warning} style={{ paddingRight: '3rem' }}>
      <InputLabel id={`type-${index}-label`} required>
        type
      </InputLabel>
      <Select
        disabled={!types?.length || verifiedAgainstStored}
        id={`type-${index}`}
        labelId={`type-${index}-label`}
        onBlur={onBlur}
        onChange={(e) =>
          dispatch(actions.setLemmaValue(index, 'type', e.target.value))
        }
        value={types?.length ? value : ''}
        style={{ width: '208px' }}
      >
        {_.sortBy(types, 'index').map(({ type }) => (
          <MenuItem key={type} value={type}>
            {type}
          </MenuItem>
        ))}
      </Select>
      {warning && <FormHelperText>Updated from store!</FormHelperText>}
    </FormControl>
  );
}
