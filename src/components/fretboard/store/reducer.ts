import { Todo } from 'MyModels';
import { combineReducers } from 'redux';
import { createReducer } from 'typesafe-actions';
import { getFretboard, Note } from '../shared/fretboard-utils';

import { loadTodosAsync, addTodo, removeTodo } from './actions';

export const isLoadingTodos = createReducer(false as boolean)
  .handleAction([loadTodosAsync.request], (state, action) => true)
  .handleAction(
    [loadTodosAsync.success, loadTodosAsync.failure],
    (state, action) => false
  );

export const todos = createReducer([
    {
      id: '0',
      title: 'You can add new todos using the form or load saved snapshot...',
    },
  ] as Todo[])
  .handleAction(loadTodosAsync.success, (state, action) => action.payload)
  .handleAction(addTodo, (state, action) => [...state, action.payload])
  .handleAction(removeTodo, (state, action) =>
    state.filter(i => i.id !== action.payload)
  );


/* fretboard */
const defaultState = getFretboard()

export const fretboard = createReducer([
    defaultState,
  ] as Note[][][])
  //.handleAction(changeNoteStatus, (state, action) => state.filter((i) => i.id !== action.payload))

/* Convined Reducers */
const fretboardReducer = combineReducers({
  isLoadingTodos,
  todos,
  fretboard,
});

export default fretboardReducer;
export type TodosState = ReturnType<typeof fretboardReducer>;
