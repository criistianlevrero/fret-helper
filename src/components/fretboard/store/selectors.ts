// import { createSelector } from 'reselect';

import { FretboardState } from './reducer';

export const getFretboard = (state: FretboardState) => state.fretboard;
