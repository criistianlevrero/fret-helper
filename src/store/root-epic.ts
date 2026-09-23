import { combineEpics, Epic } from 'redux-observable';
import { RootAction, RootState, Services } from 'typesafe-actions';

const rootEpic: Epic<RootAction, RootAction, RootState, Services> = combineEpics();

export default rootEpic;
