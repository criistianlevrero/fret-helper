import { Note  as NoteModel } from 'FretboardModels';

function Note(props:{noteModel: NoteModel, chord: number, fret: number}): JSX.Element {
    
    return (
        <div data-note={props.noteModel.pitch} data-status={props.noteModel.status}>{props.noteModel.name}</div>
    )
}

export default Note