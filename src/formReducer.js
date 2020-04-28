import {
  createActionCreators,
  createReducerFunction,
  ImmerReducer,
} from 'immer-reducer';

export function makeInitialState(answers) {
  return {
    answers,
    currentAnswer: 0,
    lemmas: [makeBaseLemma()],
    numLemmas: 1,
    updatedFromStored: [],
    verifiedAgainstStored: {},
  };
}

export function makeBaseLemma() {
  return { value: '', type: 'color', unit: 'root', language: 'en' };
}

class FormReducer extends ImmerReducer {
  addLemma() {
    this.draftState.numLemmas += 1;
    this.draftState.lemmas.push(makeBaseLemma());
  }
  removeLemma(index) {
    this.draftState.numLemmas -= 1;
    this.draftState.lemmas = this.draftState.lemmas.filter(
      (lemma, idx) => idx !== index
    );
  }
  reset() {
    this.draftState.numLemmas = 1;
    this.draftState.lemmas = [makeBaseLemma()];
    this.draftState.updatedFromStored = [];
    this.draftState.verifiedAgainstStored = {};
  }
  setAnswers(answers) {
    this.draftState.answers = answers;
  }
  setCurrentAnswer() {
    this.draftState.currentAnswer += 1;
  }
  setLemmaValue(lemmaIdx, key, value) {
    this.draftState.lemmas[lemmaIdx][key] = value;
  }
  resetUpdatedWarning(index) {
    this.draftState.updatedFromStored[index] = null;
  }
  resetVerifiedWarnings(index) {
    this.draftState.verifiedAgainstStored[index] = undefined;
  }
  setUpdatedWarning(index, keys) {
    this.draftState.updatedFromStored[index] = keys.reduce((obj, key) => {
      obj[key] = true;
      return obj;
    }, {});
  }
  setVerifiedAgainstStored(index) {
    this.draftState.verifiedAgainstStored[index] = true;
  }
}

export const actions = createActionCreators(FormReducer);
export const formReducer = createReducerFunction(FormReducer);
