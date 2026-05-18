import { describe, it, expect } from 'vitest'
import {
  isValidGroup,
  isValidBoard,
  getRows,
  getColumns,
  getBlocks,
  calculateCandidates,
} from './index'
import type {
  Board,
  CandidateList,
  Cell,
  Row,
} from '../types/sudoku'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const empty: Cell = { state: 'empty' }

function value(v: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9): Cell {
  return { state: 'value', value: v }
}

function candidates(list: CandidateList): Cell {
  return { state: 'candidates', candidates: list }
}

/** Build a Nine<Cell> row from exactly 9 cells. */
function row(...cells: [Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell]): Row {
  return cells as unknown as Row
}

const emptyRow = row(empty, empty, empty, empty, empty, empty, empty, empty, empty)

const ROW_INDICES = [0, 1, 2, 3, 4, 5, 6, 7, 8] as const
type RowIndex = (typeof ROW_INDICES)[number]

/**
 * Build a Board from an array of up to 9 rows.
 * Any unspecified rows default to emptyRow.
 */
function makeBoard(overrides: Partial<Record<RowIndex, Row>> = {}): Board {
  const rows: Row[] = ROW_INDICES.map((i) => overrides[i] ?? emptyRow)
  return rows as unknown as Board
}

// ---------------------------------------------------------------------------
// isValidGroup
// ---------------------------------------------------------------------------

describe('isValidGroup', () => {
  it('returns true for a group with all empty cells', () => {
    expect(isValidGroup(emptyRow)).toBe(true)
  })

  it('returns true for a group with unique values', () => {
    const group = row(
      value(1), value(2), value(3),
      value(4), value(5), value(6),
      value(7), value(8), value(9),
    )
    expect(isValidGroup(group)).toBe(true)
  })

  it('returns false when a value appears twice', () => {
    const group = row(
      value(1), value(2), value(1),
      empty, empty, empty,
      empty, empty, empty,
    )
    expect(isValidGroup(group)).toBe(false)
  })

  it('ignores candidate cells when checking for duplicates', () => {
    // Both value(5) and candidates(5) – the candidate should NOT count.
    const group = row(
      value(5), candidates([5]), empty,
      empty, empty, empty,
      empty, empty, empty,
    )
    expect(isValidGroup(group)).toBe(true)
  })

  it('returns false when two value cells share the same digit (ignoring candidates)', () => {
    const group = row(
      value(3), candidates([3]), value(3),
      empty, empty, empty,
      empty, empty, empty,
    )
    expect(isValidGroup(group)).toBe(false)
  })

  it('returns true for a group with only candidate cells', () => {
    const group = row(
      candidates([1]), candidates([2]), candidates([3]),
      candidates([4]), candidates([5]), candidates([6]),
      candidates([7]), candidates([8]), candidates([9]),
    )
    expect(isValidGroup(group)).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// isValidBoard – rows
// ---------------------------------------------------------------------------

describe('isValidBoard – row validation', () => {
  it('returns true for an empty board', () => {
    expect(isValidBoard(makeBoard())).toBe(true)
  })

  it('returns false when a row contains a duplicate value', () => {
    const badRow = row(value(1), value(1), empty, empty, empty, empty, empty, empty, empty)
    expect(isValidBoard(makeBoard({ 0: badRow }))).toBe(false)
  })

  it('returns true when each row has unique values', () => {
    const goodRow = row(value(1), value(2), value(3), empty, empty, empty, empty, empty, empty)
    expect(isValidBoard(makeBoard({ 4: goodRow }))).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// isValidBoard – columns
// ---------------------------------------------------------------------------

describe('isValidBoard – column validation', () => {
  it('returns false when a column contains a duplicate value', () => {
    // Place value(7) in column 0, rows 0 and 1.
    const board = makeBoard({
      0: row(value(7), empty, empty, empty, empty, empty, empty, empty, empty),
      1: row(value(7), empty, empty, empty, empty, empty, empty, empty, empty),
    })
    expect(isValidBoard(board)).toBe(false)
  })

  it('returns true when a column has all unique values', () => {
    const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const
    const overrides = Object.fromEntries(
      digits.map((d, i) => [i, row(value(d), empty, empty, empty, empty, empty, empty, empty, empty)]),
    ) as Partial<Record<0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8, Row>>
    expect(isValidBoard(makeBoard(overrides))).toBe(true)
  })

  it('does not count candidate cells in column validation', () => {
    // Column 0 has value(4) in row 0 and candidates(4) in row 1 – should be valid.
    const board = makeBoard({
      0: row(value(4), empty, empty, empty, empty, empty, empty, empty, empty),
      1: row(candidates([4]), empty, empty, empty, empty, empty, empty, empty, empty),
    })
    expect(isValidBoard(board)).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// isValidBoard – blocks
// ---------------------------------------------------------------------------

describe('isValidBoard – block validation', () => {
  it('returns false when a 3×3 block contains a duplicate value', () => {
    // Top-left block: place value(5) at (0,0) and (1,1).
    const board = makeBoard({
      0: row(value(5), empty, empty, empty, empty, empty, empty, empty, empty),
      1: row(empty, value(5), empty, empty, empty, empty, empty, empty, empty),
    })
    expect(isValidBoard(board)).toBe(false)
  })

  it('returns true when each 3×3 block has unique values', () => {
    // Fill top-left block with 1–9 across its nine cells.
    const board = makeBoard({
      0: row(value(1), value(2), value(3), empty, empty, empty, empty, empty, empty),
      1: row(value(4), value(5), value(6), empty, empty, empty, empty, empty, empty),
      2: row(value(7), value(8), value(9), empty, empty, empty, empty, empty, empty),
    })
    expect(isValidBoard(board)).toBe(true)
  })

  it('does not count candidate cells in block validation', () => {
    // Top-left block: value(9) at (0,0) and candidates(9) at (0,1) – should be valid.
    const board = makeBoard({
      0: row(value(9), candidates([9]), empty, empty, empty, empty, empty, empty, empty),
    })
    expect(isValidBoard(board)).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// getRows / getColumns / getBlocks helpers
// ---------------------------------------------------------------------------

describe('getRows', () => {
  it('returns 9 rows', () => {
    expect(getRows(makeBoard())).toHaveLength(9)
  })
})

describe('getColumns', () => {
  it('returns 9 columns', () => {
    expect(getColumns(makeBoard())).toHaveLength(9)
  })

  it('each column contains the correct cells', () => {
    const board = makeBoard({
      0: row(value(1), value(2), empty, empty, empty, empty, empty, empty, empty),
    })
    const cols = getColumns(board)
    expect(cols[0][0]).toEqual(value(1))
    expect(cols[1][0]).toEqual(value(2))
    expect(cols[0][1]).toEqual(empty)
  })
})

describe('getBlocks', () => {
  it('returns 9 blocks', () => {
    expect(getBlocks(makeBoard())).toHaveLength(9)
  })

  it('each block contains exactly 9 cells', () => {
    getBlocks(makeBoard()).forEach((block) => {
      expect(block).toHaveLength(9)
    })
  })

  it('the first block contains the top-left 3×3 cells', () => {
    const board = makeBoard({
      0: row(value(1), value(2), value(3), empty, empty, empty, empty, empty, empty),
      1: row(value(4), value(5), value(6), empty, empty, empty, empty, empty, empty),
      2: row(value(7), value(8), value(9), empty, empty, empty, empty, empty, empty),
    })
    const block0 = getBlocks(board)[0]
    expect(block0).toEqual([
      value(1), value(2), value(3),
      value(4), value(5), value(6),
      value(7), value(8), value(9),
    ])
  })
})

// ---------------------------------------------------------------------------
// calculateCandidates
// ---------------------------------------------------------------------------

describe('calculateCandidates', () => {
  it('keeps value cells unchanged', () => {
    const board = makeBoard({
      0: row(value(1), empty, empty, empty, empty, empty, empty, empty, empty),
    })

    const result = calculateCandidates(board)
    expect(result[0][0]).toEqual(value(1))
  })

  it('calculates candidates using block, then row, then column elimination', () => {
    const board = makeBoard({
      0: row(value(1), value(2), value(3), empty, empty, empty, empty, empty, empty),
      1: row(empty, empty, empty, value(4), empty, empty, empty, empty, empty),
      2: row(value(7), value(8), value(9), empty, empty, empty, empty, empty, empty),
      4: row(empty, value(5), empty, empty, empty, empty, empty, empty, empty),
    })

    const result = calculateCandidates(board)

    // (1,1): block missing {4,5,6} -> remove row value 4 -> remove column value 5 => {6}
    expect(result[1][1]).toEqual(candidates([6]))
    // (1,0): block missing {4,5,6} -> remove row value 4 => {5,6}; column has no 5/6 values
    expect(result[1][0]).toEqual(candidates([5, 6]))
  })
})
