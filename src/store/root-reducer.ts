import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import fretboardReducer from '../components/fretboard/store/reducer'
import todosReducer from '../components/todos/store/reducer'

const rootReducer = combineReducers({
  router: routerReducer,
  fretboard: fretboardReducer,
  todos: todosReducer,
});

export default rootReducer;
