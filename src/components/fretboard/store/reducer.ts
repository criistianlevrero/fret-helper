import { combineReducers } from 'redux';
import { createReducer } from 'typesafe-actions';
import { getFretboard, Note } from '../shared/fretboard-utils';

// import { loadTodosAsync, addTodo, removeTodo } from './actions';

/* fretboard */
const defaultState = getFretboard()

export const fretboard = createReducer([
    defaultState,
  ] as Note[][][])
  //.handleAction(changeNoteStatus, (state, action) => state.filter((i) => i.id !== action.payload))

/* Convined Reducers */
const fretboardReducer = combineReducers({
  fretboard,
});

export default fretboardReducer;
export type TodosState = ReturnType<typeof fretboardReducer>;
