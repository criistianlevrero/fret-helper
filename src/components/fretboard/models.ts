export interface Note {
  name: NoteNames;
  status: NoteStatus;
  pitch?: number;
  interval?: Intervals;
  finger?: Finger;
}

export type FretboardConfig = {
  id: string;
  title: string;
  category?: string;
};

export enum Finger {
  none,
  thumb = 0,
  index = 1,
  middle = 2,
  ring =3,
  little = 4,
}

export enum NoteStatus {
  inactive = 'inactive',
  root = 'root',
  interval = 'interval',
  marked = 'marked',
}

export enum NoteNames {
  C= 'C',
  CSharp= 'C#',
  D= 'D',
  DSharp= 'D#',
  E= 'E',
  F= 'F',
  FSharp= 'F#',
  G= 'G',
  GSharp= 'G#',
  A= 'A',
  ASharp= 'A#',
  B= 'B',
}

export enum Intervals {
  P1 = 'P1',
  m2 = 'm2',
  M2 = 'M2',
  m3 = 'm3',
  M3 = 'M3',
  P4 = 'P4',
  d5 = 'd5',
  P5 = 'P5',
  m6 = 'm6',
  M6 = 'M6',
  m7 = 'm7',
  M7 = 'M7',
  P8 = 'P8',
}