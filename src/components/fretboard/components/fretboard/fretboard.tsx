import { Note as NoteModel, getFretboard } from "../../shared/fretboard-utils"
import FretboardViewport from "./fretboard-viewport"
import Note from "../note/note"
import { connect } from "react-redux"
import { Dispatch } from "redux"
import { MouseEventHandler } from "react"
import { RootState } from 'typesafe-actions';

import * as selectors from '../../store/selectors';
import * as actions from '../../store/actions';

const mapStateToProps = (state: RootState) => ({
    fretbardModel: state.todos.fretboard,
    isLoading: state.todos.isLoadingTodos,
    directTodos: state.todos.todos,
    todos: selectors.getTodos(state.todos),
});
    const dispatchProps = {
    removeTodo: actions.removeTodo,
};

type Props = ReturnType<typeof mapStateToProps> & typeof dispatchProps;

function Fretboard({ isLoading, todos = [], fretbardModel, removeTodo }: Props) {
    if (isLoading) {
        return <p>Loading...</p>;
    }
    
    const onButtonClick = () => {
        console.log(fretbardModel)
        //props.onUnload()
        //console.log(props.viewChangeCounter)
    }

    const renderedNotes = fretbardModel[0].map((string:NoteModel[]) => {
        return string.map((note:NoteModel) => {
            return <Note noteModel={note}></Note>
        })
    })

    return (
        <>
            <header>{'props.viewChangeCounter'}</header>
            <button onClick={onButtonClick}>sume</button>
            <FretboardViewport>
                    { renderedNotes }
            </FretboardViewport>
        </>
    )
}


export default connect(mapStateToProps, dispatchProps)(Fretboard);