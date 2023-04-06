import { Dispatch } from "redux"
import Action from "./fretboard-actions"

export const pageUnloaded = () => {
    return (dispatch:Dispatch <Action>) => {
        dispatch({
                type: 'REGISTER_PAGE_UNLOADED',
            })
    }
}