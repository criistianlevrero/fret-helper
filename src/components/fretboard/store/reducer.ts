import { FretboardConfig, Note } from 'FretboardModels';
import { combineReducers } from 'redux';
import { createReducer } from 'typesafe-actions';
import { getFretboard} from '../services/fretboard-utils';

import { changeNoteStatus } from './actions';

/* fretboard */
const defaultState = getFretboard()

export const fretboard = createReducer(
    defaultState as Note[][])
  .handleAction(changeNoteStatus, (state, action) => {
    const x = action.payload.string
    const y = action.payload.fret
    return [...state.slice(0, x),
      [...state[x].slice(0, y),
        Object.assign({}, state[x][y], {
          status: action.payload.status
        }),
      ...state[x].slice(y+ 1)],
    ...state.slice(x+ 1)]
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
