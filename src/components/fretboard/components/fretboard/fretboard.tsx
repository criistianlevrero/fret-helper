import { Note  as NoteModel } from 'FretboardModels';
import FretboardViewport from "./fretboard-viewport"
import Note from "../note/note"
import { connect } from "react-redux"
import { RootState } from 'typesafe-actions';

import * as selectors from '../../store/selectors';
import { getFretboard} from '../../services/fretboard.service';

const mapStateToProps = (state: RootState) => ({
    fretbardModel: selectors.getFretboard(state.fretboard),
});

type Props = ReturnType<typeof mapStateToProps>;

function Fretboard({ fretbardModel }: Props) {
    
    const onButtonClick = () => {
        console.log(getFretboard())
        //props.onUnload()
        //console.log(props.viewChangeCounter)
    }

    const renderedNotes = fretbardModel.map((note:NoteModel, noteIndex:number) => {
        return <Note key={noteIndex} noteModel={note} noteIndex={noteIndex}></Note>
    })

    return (
        <>
            <header>Frethelper</header>
            <button onClick={onButtonClick}>log</button>
            <FretboardViewport>
                    { renderedNotes }
            </FretboardViewport>
        </>
    )
}


export default connect(mapStateToProps, null)(Fretboard);