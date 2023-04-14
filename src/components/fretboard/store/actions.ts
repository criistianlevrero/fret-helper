import { createAction, createAsyncAction } from 'typesafe-actions';
import { NoteStatus } from '../services/fretboard-utils';

export const changeNoteStatus = createAction('CHANGE_NOTE_STATUS', (string: number, fret:number, status: NoteStatus ) => ({
    string,
    fret,
    status
  }))();