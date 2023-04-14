import { Note, } from "FretboardModels";

enum NoteStatus {
  inactive = 'inactive',
  root = 'root',
  interval = 'interval',
  marked = 'marked',
}

enum NoteNames {
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

enum Intervals {
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

const chromaticScale: Note[] = [
  {name: NoteNames.A, status: NoteStatus.inactive},
  {name: NoteNames.ASharp, status: NoteStatus.inactive},
  {name: NoteNames.B, status: NoteStatus.inactive},
  {name: NoteNames.C, status: NoteStatus.inactive},
  {name: NoteNames.CSharp, status: NoteStatus.inactive},
  {name: NoteNames.D, status: NoteStatus.inactive},
  {name: NoteNames.DSharp, status: NoteStatus.inactive},
  {name: NoteNames.E, status: NoteStatus.inactive},
  {name: NoteNames.F, status: NoteStatus.inactive},
  {name: NoteNames.FSharp, status: NoteStatus.inactive},
  {name: NoteNames.G, status: NoteStatus.inactive},
  {name: NoteNames.GSharp, status: NoteStatus.inactive},
]


const fretsNumber = 27;
const tuning = [64,59,55,50,45,40,]
const midiNumberOffset = 21


const createFretborda = ():Note[]  => {
  const chromaticNotes = Array.from(chromaticScale.values())
  let fretboard:Note[] = []
  tuning.forEach((chordTuing: number) => {
    for (var i = 0; i < fretsNumber; i++) {
      const noteIndex: number = (i+chordTuing-midiNumberOffset)%chromaticNotes.length
      const note:Note = { ...chromaticNotes[noteIndex], pitch : noteIndex + fretsNumber }
      fretboard.push(note)
    }
  });
  return fretboard;
}

const fretboard = createFretborda();

const getFretboard = (): Note[] => {
  console.log(fretboard)
  return fretboard
}

export {
  getFretboard,
  NoteStatus
}

export type {
  NoteNames,
  Intervals
}
