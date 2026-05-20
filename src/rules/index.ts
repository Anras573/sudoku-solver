import type {
  Board,
  Column,
  Row,
  Block,
  Nine,
  Cell,
  CandidateList,
  SudokuDigit,
} from '../types/sudoku'

type Group = Row | Column | Block
const DIGITS = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const
const INDICES = [0, 1, 2, 3, 4, 5, 6, 7, 8] as const
type Index = (typeof INDICES)[number]
const BLOCK_INDEX_LOOKUP = [
  [0, 0, 0, 1, 1, 1, 2, 2, 2],
  [0, 0, 0, 1, 1, 1, 2, 2, 2],
  [0, 0, 0, 1, 1, 1, 2, 2, 2],
  [3, 3, 3, 4, 4, 4, 5, 5, 5],
  [3, 3, 3, 4, 4, 4, 5, 5, 5],
  [3, 3, 3, 4, 4, 4, 5, 5, 5],
  [6, 6, 6, 7, 7, 7, 8, 8, 8],
  [6, 6, 6, 7, 7, 7, 8, 8, 8],
  [6, 6, 6, 7, 7, 7, 8, 8, 8],
] as const
const VALID_DIGITS = new Set<number>(DIGITS)

/**
 * Returns true when the group contains no duplicate values.
 * EmptyCell and CandidateCell entries are ignored.
 */
export function isValidGroup(group: Group): boolean {
  const seen = new Set<number>()
  for (const cell of group as Nine<Cell>) {
    if (cell.state !== 'value') continue
    if (seen.has(cell.value)) return false
    seen.add(cell.value)
  }
  return true
}

/** Returns the nine rows of the board. */
export function getRows(board: Board): Nine<Row> {
  return board
}

/** Returns the nine columns of the board. */
export function getColumns(board: Board): Nine<Column> {
  return [0, 1, 2, 3, 4, 5, 6, 7, 8].map((col) =>
    ([0, 1, 2, 3, 4, 5, 6, 7, 8] as const).map((row) => board[row][col]),
  ) as unknown as Nine<Column>
}

/** Returns the nine 3×3 blocks of the board (row-major order). */
export function getBlocks(board: Board): Nine<Block> {
  return [0, 1, 2].flatMap((blockRow) =>
    [0, 1, 2].map((blockCol) => {
      const startRow = blockRow * 3
      const startCol = blockCol * 3
      return [
        board[startRow][startCol],
        board[startRow][startCol + 1],
        board[startRow][startCol + 2],
        board[startRow + 1][startCol],
        board[startRow + 1][startCol + 1],
        board[startRow + 1][startCol + 2],
        board[startRow + 2][startCol],
        board[startRow + 2][startCol + 1],
        board[startRow + 2][startCol + 2],
      ]
    }),
  ) as unknown as Nine<Block>
}

/**
 * Returns true when every row, column, and block on the board is valid
 * (no duplicate values; empty and candidate cells are ignored).
 */
export function isValidBoard(board: Board): boolean {
  const groups = [
    ...getRows(board),
    ...getColumns(board),
    ...getBlocks(board),
  ]
  return groups.every(isValidGroup)
}

function getPresentValues(group: Group): Set<SudokuDigit> {
  const seen = new Set<SudokuDigit>()
  for (const cell of group as Nine<Cell>) {
    if (cell.state === 'value') {
      seen.add(cell.value)
    }
  }
  return seen
}

function isCandidateList(values: readonly number[]): values is CandidateList {
  return (
    values.length >= 1 &&
    values.length <= 9 &&
    values.every((value) => VALID_DIGITS.has(value)) &&
    new Set(values).size === values.length
  )
}

function toCellWithCandidates(candidates: readonly number[]): Cell {
  if (candidates.length === 0) return { state: 'empty' }
  if (!isCandidateList(candidates)) return { state: 'empty' }
  return { state: 'candidates', candidates }
}

/**
 * Calculates candidates for every non-value cell:
 * 1) Start with missing digits in the cell's block
 * 2) Remove digits already present in the cell's row
 * 3) Remove digits already present in the cell's column
 */
export function calculateCandidates(board: Board): Board {
  const rows = getRows(board)
  const columns = getColumns(board)
  const blocks = getBlocks(board)

  const rowValues = INDICES.map((row) => getPresentValues(rows[row]))
  const columnValues = INDICES.map((col) => getPresentValues(columns[col]))
  const blockValues = INDICES.map((block) => getPresentValues(blocks[block]))

  const withCandidates = INDICES.map((row) =>
    INDICES.map((col) => {
      const cell = board[row][col]
      if (cell.state === 'value') return cell
      const blockIndex: Index = BLOCK_INDEX_LOOKUP[row][col]
      const afterBlock = DIGITS.filter((digit) => !blockValues[blockIndex].has(digit))
      const afterRow = afterBlock.filter((digit) => !rowValues[row].has(digit))
      const afterColumn = afterRow.filter((digit) => !columnValues[col].has(digit))
      return toCellWithCandidates(afterColumn)
    }),
  )

  // Safe cast: `withCandidates` is built from 9x9 index tuples and each entry is a valid Cell.
  return withCandidates as unknown as Board
}
