import type { Board, Column, Row, Block, Nine, Cell } from '../types/sudoku'

type Group = Row | Column | Block

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
