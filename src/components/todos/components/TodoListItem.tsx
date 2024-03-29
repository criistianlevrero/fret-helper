import * as React from 'react';

interface Props {
  title: string;
  onRemoveClick: () => void;
}

function TodoListItem({ title, onRemoveClick }: Props) {
  return (
    <tr>
      <td><span className='text-ellipsis overflow-hidden'>{title}</span></td>
      <td className='w-20'>
        <button
          className="btn btn-circle"
          onClick={onRemoveClick}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </td>
    </tr>
  );
}

export default TodoListItem;
