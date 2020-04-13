import React from 'react';
import 'firebase/firestore';

import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

import { actions } from '../../formReducer';

export default function UnitSelect({
  dispatch,
  index,
  onBlur,
  units,
  value,
  warning,
}) {
  return (
    <FormControl error={warning} style={{ paddingRight: '3rem' }}>
      <InputLabel id={`unit-${index}-label`}>unit</InputLabel>
      <Select
        disabled={!units?.length}
        id={`unit-${index}`}
        labelId={`unit-${index}-label`}
        onBlur={onBlur}
        onChange={(e) =>
          dispatch(actions.setLemmaValue(index, 'unit', e.target.value))
        }
        value={units?.length ? value : ''}
        style={{ width: '208px' }}
      >
        {units.map((unit) => (
          <MenuItem key={unit} value={unit}>
            {unit}
          </MenuItem>
        ))}
      </Select>
      {warning && <FormHelperText>Updated from store!</FormHelperText>}
    </FormControl>
  );
}
