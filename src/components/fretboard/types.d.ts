declare module 'FretboardModels' {

    export interface Note {
      name: NoteNames;
      status: NoteStatus;
      pitch?: number;
      interval?: Intervals;
    }

    export type FretboardConfig = {
      id: string;
      title: string;
      category?: string;
    };
  
}