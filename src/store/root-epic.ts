import { combineEpics } from 'redux-observable';

import * as todosEpics from '../components/todos/store/epics';

export default combineEpics(...Object.values(todosEpics));
