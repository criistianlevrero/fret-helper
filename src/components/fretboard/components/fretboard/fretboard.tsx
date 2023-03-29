import { Note as NoteModel, getFretboard } from "../../shared/fretboard-utils"
import FretboardViewport from "./fretboard-viewport"
import Note from "../note/note"

const fretboardModel:NoteModel[][] = getFretboard()

function Fretboard() {

    const renderedNotes = fretboardModel.map((string:NoteModel[]) => {
        return string.map((note:NoteModel) => {
            return <Note noteModel={note}></Note>
        })
    })

    return (
        <>
            <header>Barra de herramientas del módulo fretbord</header>
            <FretboardViewport>
                    { renderedNotes }
            </FretboardViewport>
        </>
    )
}

export default Fretboard