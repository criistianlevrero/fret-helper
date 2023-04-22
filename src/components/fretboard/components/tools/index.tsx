import { Fingers } from "./fingers/fingers"
import { Scales } from "./scales/scales"

import { Note  as NoteModel } from 'FretboardModels';

interface CardProps {
  children: React.ReactNode | React.ReactNode[];
  noteModel: NoteModel
}

const ToolDispatcher = ({ children, noteModel }: CardProps): JSX.Element => {
  return (
    <div className="grid grid-cols-4 gap-4 h-10">
      <div>
        <Scales noteModel={noteModel} />
      </div>
      <div>{children}</div>
      <Fingers noteModel={noteModel} />
    </div>
  )
}

export {ToolDispatcher}