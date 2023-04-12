import * as React from 'react';
import { connect } from 'react-redux';

import { addTodo } from '../store/actions';

const dispatchProps = {
  addItem: addTodo,
};

type Props = {
  addItem: (title: string) => void;
};

type State = {
  title: string;
};

class AddTodoForm extends React.Component<Props, State> {
  readonly state = { title: '' };

  handleTitleChange: React.ReactEventHandler<HTMLInputElement> = ev => {
    this.setState({ title: ev.currentTarget.value });
  };

  handleAddClick = () => {
    this.props.addItem(this.state.title);
    this.setState({ title: '' });
  };

  render() {
    const { title } = this.state;

   
    //   <div className="input-group">
    //     <input type="text" placeholder="Search…" className="input input-bordered" />
    //     <button className="btn btn-square">
    //       <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
    //     </button>
    //   </div>
  
    return (
      <form
        className='form-control'
        onSubmit={ev => {
          ev.preventDefault();
        }}
      >
        <div className="input-group">
          <input
            className="input input-bordered"
            type="text"
            placeholder="Enter new item"
            value={title}
            onChange={this.handleTitleChange}
          />
          <button
            className="btn btn-square"
            type="submit"
            onClick={this.handleAddClick}
            disabled={!title}>
            Add
          </button>
        </div>
      </form>
    );
  }
}

export default connect(
  null,
  dispatchProps
)(AddTodoForm);
