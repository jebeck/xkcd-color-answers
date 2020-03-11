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
}

export const actions = createActionCreators(FormReducer);
export const formReducer = createReducerFunction(FormReducer);
