export type SudokuDigit = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

type Nine<T> = readonly [T, T, T, T, T, T, T, T, T]

export type EmptyCell = {
  state: 'empty'
}

export type ValueCell = {
  state: 'value'
  value: SudokuDigit
}

export type CandidatesCell = {
  state: 'candidates'
  values: readonly SudokuDigit[]
}

export type Cell = EmptyCell | ValueCell | CandidatesCell

export type Block = Nine<Cell>
export type Row = Nine<Cell>
export type Column = Nine<Cell>
export type Board = Nine<Row>
