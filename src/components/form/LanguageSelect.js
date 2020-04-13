import React from 'react';

import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

import { actions } from '../../formReducer';

export default function TypeSelect({
  dispatch,
  index,
  languages,
  onBlur,
  value,
  warning,
}) {
  return (
    <FormControl error={warning} style={{ paddingRight: '3rem' }}>
      <InputLabel id={`language-${index}-label`}>lang</InputLabel>
      <Select
        disabled={!languages?.length}
        id={`language-${index}`}
        labelId={`language-${index}-label`}
        onBlur={onBlur}
        onChange={(e) =>
          dispatch(actions.setLemmaValue(index, 'language', e.target.value))
        }
        value={languages?.length ? value : ''}
        style={{ width: '208px' }}
      >
        {languages.map((language) => (
          <MenuItem key={language} value={language}>
            {language}
          </MenuItem>
        ))}
      </Select>
      {warning && <FormHelperText>Updated from store!</FormHelperText>}
    </FormControl>
  );
}
