import { createAction, createAsyncAction } from 'typesafe-actions';
import { NoteStatus } from '../services/fretboard.service';

export const changeNoteStatus = createAction('CHANGE_NOTE_STATUS', (noteIndex: number, status: NoteStatus ) => ({
    noteIndex,
    status
  }))();