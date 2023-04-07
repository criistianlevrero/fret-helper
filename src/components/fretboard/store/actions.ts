import { Todo } from 'MyModels';
import { createAction, createAsyncAction } from 'typesafe-actions';

export const addTodo = createAction('ADD_TODO', (title: string) => ({
  id: '15',
  title,
}))<Todo>();

export const removeTodo = createAction('REMOVE_TODO')<string>();

export const loadTodosAsync = createAsyncAction(
  'LOAD_TODOS_REQUEST',
  'LOAD_TODOS_SUCCESS',
  'LOAD_TODOS_FAILURE'
)<undefined, Todo[], string>();

export const saveTodosAsync = createAsyncAction(
  'SAVE_TODOS_REQUEST',
  'SAVE_TODOS_SUCCESS',
  'SAVE_TODOS_FAILURE'
)<undefined, undefined, string>();
