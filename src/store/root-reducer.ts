import { combineReducers } from 'redux';

import { routerReducer } from 'react-router-redux';
import fretboardReducer from '../components/fretboard/store/reducer'

const rootReducer = combineReducers({
  router: routerReducer,
  fretboard: fretboardReducer,
});

export default rootReducer;
