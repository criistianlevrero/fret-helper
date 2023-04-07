import { combineEpics } from 'redux-observable';

import * as todosEpics from '../components/fretboard/store/epics';

export default combineEpics(...Object.values(todosEpics));
