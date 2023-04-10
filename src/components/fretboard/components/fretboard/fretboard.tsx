import { Note as NoteModel } from "../../shared/fretboard-utils"
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


export default connect(mapStateToProps, null)(Fretboard);