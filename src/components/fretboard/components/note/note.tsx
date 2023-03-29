import { Note as NoteModel} from "../../shared/fretboard-utils"

function Note(props:{noteModel: NoteModel}): JSX.Element {
    return (
        <div data-note={props.noteModel.pitch} data-status={props.noteModel.status}>{props.noteModel.name}</div>
    )
}

export default Note