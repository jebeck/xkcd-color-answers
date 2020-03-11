import {
  createActionCreators,
  createReducerFunction,
  ImmerReducer,
} from 'immer-reducer';

export function makeBaseLemma() {
  return { value: '', type: 'color', unit: 'root', language: 'en' };
}

class FormReducer extends ImmerReducer {
  setCurrentAnswer() {
    this.draftState.currentAnswer += 1;
  }
  setLemmaValue(lemmaIdx, key, value) {
    this.draftState.lemmas[lemmaIdx][key] = value;
  }
  resetUpdatedWarning(index) {
    this.draftState.updatedFromStored[index] = null;
  }
  setUpdatedWarning(index, keys) {
    this.draftState.updatedFromStored[index] = keys.reduce((obj, key) => {
      obj[key] = true;
      return obj;
    }, {});
  }
}

export const actions = createActionCreators(FormReducer);
export const formReducer = createReducerFunction(FormReducer);
