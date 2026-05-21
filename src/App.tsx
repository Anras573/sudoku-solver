import './App.css'
import type { Cell } from './types/sudoku'

// Sample board for demonstration
const sampleBoard: readonly (readonly Cell[])[] = [
  [
    { state: 'value', value: 5 },
    { state: 'candidates', candidates: [1, 2, 3] },
    { state: 'candidates', candidates: [1, 2, 3, 4, 5, 6, 7, 8, 9] },
    { state: 'empty' },
    { state: 'empty' },
    { state: 'empty' },
    { state: 'empty' },
    { state: 'empty' },
    { state: 'empty' },
  ],
  [
    { state: 'empty' },
    { state: 'value', value: 3 },
    { state: 'empty' },
    { state: 'empty' },
    { state: 'empty' },
    { state: 'empty' },
    { state: 'empty' },
    { state: 'empty' },
    { state: 'empty' },
  ],
  [
    { state: 'empty' },
    { state: 'empty' },
    { state: 'empty' },
    { state: 'empty' },
    { state: 'empty' },
    { state: 'empty' },
    { state: 'empty' },
    { state: 'empty' },
    { state: 'empty' },
  ],
  [
    { state: 'empty' },
    { state: 'empty' },
    { state: 'empty' },
    { state: 'empty' },
    { state: 'empty' },
    { state: 'empty' },
    { state: 'empty' },
    { state: 'empty' },
    { state: 'empty' },
  ],
  [
    { state: 'empty' },
    { state: 'empty' },
    { state: 'empty' },
    { state: 'empty' },
    { state: 'value', value: 7 },
    { state: 'empty' },
    { state: 'empty' },
    { state: 'empty' },
    { state: 'empty' },
  ],
  [
    { state: 'empty' },
    { state: 'empty' },
    { state: 'empty' },
    { state: 'empty' },
    { state: 'empty' },
    { state: 'empty' },
    { state: 'empty' },
    { state: 'empty' },
    { state: 'empty' },
  ],
  [
    { state: 'empty' },
    { state: 'empty' },
    { state: 'empty' },
    { state: 'empty' },
    { state: 'empty' },
    { state: 'empty' },
    { state: 'empty' },
    { state: 'empty' },
    { state: 'empty' },
  ],
  [
    { state: 'empty' },
    { state: 'empty' },
    { state: 'empty' },
    { state: 'empty' },
    { state: 'empty' },
    { state: 'empty' },
    { state: 'empty' },
    { state: 'empty' },
    { state: 'empty' },
  ],
  [
    { state: 'empty' },
    { state: 'empty' },
    { state: 'empty' },
    { state: 'empty' },
    { state: 'empty' },
    { state: 'empty' },
    { state: 'empty' },
    { state: 'empty' },
    { state: 'empty' },
  ],
] as const

function CellDisplay({ cell }: { cell: Cell }) {
  if (cell.state === 'empty') {
    return null
  }

  if (cell.state === 'value') {
    return <div className="cell-value">{cell.value}</div>
  }

  if (cell.state === 'candidates') {
    const candidates = cell.candidates
    const line1 = candidates.filter((c) => c >= 1 && c <= 3)
    const line2 = candidates.filter((c) => c >= 4 && c <= 6)
    const line3 = candidates.filter((c) => c >= 7 && c <= 9)

    return (
      <div className="cell-candidates">
        <div className="candidates-line">{line1.join('')}</div>
        <div className="candidates-line">{line2.join('')}</div>
        <div className="candidates-line">{line3.join('')}</div>
      </div>
    )
  }
}

function App() {
  const cells = sampleBoard.flat()

  return (
    <main className="app">
      <h1>Sudoku Solver</h1>
      <section className="grid" aria-label="Sudoku grid">
        {cells.map((cell, index) => (
          <div key={index} className="cell">
            <CellDisplay cell={cell} />
          </div>
        ))}
      </section>
    </main>
  )
}

export default App
