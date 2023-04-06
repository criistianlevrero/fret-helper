import { Note as NoteModel, getFretboard } from "../../shared/fretboard-utils"
import FretboardViewport from "./fretboard-viewport"
import Note from "../note/note"
import { connect } from "react-redux"
import { Dispatch } from "redux"
import { MouseEventHandler } from "react"
import { RootState } from 'typesafe-actions';

//const fretboardModel:NoteModel[][] = getFretboard()

function Fretboard(props: { onUnload: () => void, getFretboard :NoteModel[][] }) {
    
    const onButtonClick = () => {
        props.onUnload()
        //console.log(props.viewChangeCounter)
    }

    const renderedNotes = props.getFretboard.map((string:NoteModel[]) => {
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

const mapStateToProps = (state :RootState) => {
    return {
        getFretboard: state.fretboard,
    }
}
  ;

const dispatchProps = (dispatch: Dispatch) => ({
    onUnload: () => dispatch({ type: 'REGISTER_PAGE_UNLOADED' })
});

export default connect(mapStateToProps, dispatchProps)(Fretboard);