import {MouseEvent} from 'react';
import { connect } from 'react-redux';

import { Note  as NoteModel, NoteStatus } from '../../models';
import { changeNoteStatus } from '../../store/actions';
import { ToolDispatcher } from '../tools'

import noteStyles from './note.module.css'

const dispatchProps = {
    changeStatus: changeNoteStatus,
};

type DispatchType = typeof dispatchProps.changeStatus;

function Note(props:{noteModel: NoteModel, noteIndex: number, changeStatus:DispatchType}): JSX.Element {

    const onNoteClick = (event: MouseEvent) => {
        event.preventDefault();
        const statusArray = Object.values(NoteStatus)
        const statusIndex = statusArray.indexOf(props.noteModel.status)
        const newStatus = statusArray[(statusIndex + 1) % statusArray.length]

        console.log(newStatus, statusArray, props.noteModel.status)
        
        props.changeStatus(props.noteIndex, newStatus )
    }
    return (
        <div
            className={noteStyles.note}
            data-note={props.noteModel.pitch}
            data-status={props.noteModel.status}
            onClick={onNoteClick}>
                <ToolDispatcher noteModel={props.noteModel}>
                    {props.noteModel.name}
                </ToolDispatcher>
        </div>
    )
}

export default connect(
    null,
    dispatchProps
  )(Note);