import Action from "../actions/fretboard-actions";
import { Note as NoteModel, getFretboard } from "../../components/fretboard/shared/fretboard-utils"

 
const defaultState = getFretboard()

const fretboard = (state = defaultState, action:Action) => {
    switch (action.type) {
        case 'REGISTER_PAGE_UNLOADED':
            return state;

        case 'REGISTER_PAGE_OTRO':
            return state;
        default:
            return state;
    }
};

export default fretboard