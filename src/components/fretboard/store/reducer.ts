import { FretboardConfig, Note } from 'FretboardModels';
import { combineReducers } from 'redux';
import { createReducer } from 'typesafe-actions';
import { getFretboard} from '../services/fretboard.service';

import { changeNoteStatus } from './actions';

/* fretboard */
const defaultState = getFretboard()

export const fretboard = createReducer(
    defaultState as Note[])
  .handleAction(changeNoteStatus, (state, action) => {
    const noteIndex = action.payload.noteIndex
    
    return [...state.slice(0, noteIndex),
      Object.assign({}, state[noteIndex], {
        status: action.payload.status
      }),
    ...state.slice(noteIndex+ 1)]
  })

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
