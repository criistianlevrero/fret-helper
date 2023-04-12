import { Note  as NoteModel } from 'FretboardModels';
import FretboardViewport from "./fretboard-viewport"
import Note from "../note/note"
import { connect } from "react-redux"
import { RootState } from 'typesafe-actions';

import * as selectors from '../../store/selectors';

const mapStateToProps = (state: RootState) => ({
    fretbardModel: selectors.getFretboard(state.fretboard),
});

type Props = ReturnType<typeof mapStateToProps>;

function Fretboard({ fretbardModel }: Props) {
    
    const onButtonClick = () => {
        console.log(fretbardModel)
        //props.onUnload()
        //console.log(props.viewChangeCounter)
    }

    const renderedNotes = fretbardModel.map((string:NoteModel[], stringIndex:number) => {
        return string.map((note:NoteModel, noteIndex) => {
            return <Note key={`${stringIndex}-${noteIndex}`} noteModel={note} chord={stringIndex} fret={noteIndex}></Note>
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


export default connect(mapStateToProps, null)(Fretboard);