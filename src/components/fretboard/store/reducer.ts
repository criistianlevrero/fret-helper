import { FretboardConfig, Note } from 'FretboardModels';
import { combineReducers } from 'redux';
import { createReducer } from 'typesafe-actions';
import { getFretboard} from '../shared/fretboard-utils';

// import { loadTodosAsync, addTodo, removeTodo } from './actions';

/* fretboard */
const defaultState = getFretboard()

export const fretboard = createReducer(
    defaultState as Note[][])
  //.handleAction(changeNoteStatus, (state, action) => state.filter((i) => i.id !== action.payload))

/* config */
export const fretboardConfig = createReducer(
  {
    id:"new",
    title:"New fretboard"
  } as FretboardConfig)


/* Convined Reducers */
const fretboardReducer = combineReducers({
  fretboard,
  fretboardConfig,
});

export default fretboardReducer;
export type FretboardState = ReturnType<typeof fretboardReducer>;
