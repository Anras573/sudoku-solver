export type SudokuDigit = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

export type Nine<T> = readonly [T, T, T, T, T, T, T, T, T]
export type OneToNine<T> =
  | readonly [T]
  | readonly [T, T]
  | readonly [T, T, T]
  | readonly [T, T, T, T]
  | readonly [T, T, T, T, T]
  | readonly [T, T, T, T, T, T]
  | readonly [T, T, T, T, T, T, T]
  | readonly [T, T, T, T, T, T, T, T]
  | readonly [T, T, T, T, T, T, T, T, T]

export type CandidateList = OneToNine<SudokuDigit>

export type EmptyCell = {
  state: 'empty'
}

export type ValueCell = {
  state: 'value'
  value: SudokuDigit
}

export type CandidateCell = {
  state: 'candidates'
  candidates: CandidateList
}

export type Cell = EmptyCell | ValueCell | CandidateCell

export type Block = Nine<Cell>
export type Row = Nine<Cell>
export type Column = Nine<Cell>
export type Board = Nine<Row>
