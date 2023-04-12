import * as React from 'react';

import TodoList from './TodoList';
import AddTodoForm from './AddTodoForm';
import TodoListActions from './TodoListActions';

export default () => (
  <section className='max-w-4xl mx-auto'>
    <TodoListActions />
    <br />
    <AddTodoForm />
    <div className='divider'></div>
    <TodoList />
  </section>
);
