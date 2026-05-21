import './App.css'
import type { Cell } from './types/sudoku'
import { calculateCandidates } from './rules'
import { samplePuzzle } from './fixtures/puzzles'

// Auto-calculate candidates from the puzzle
const boardWithCandidates = calculateCandidates(samplePuzzle)

function CellDisplay({ cell }: { cell: Cell }) {
  switch (cell.state) {
    case 'empty':
      return null
    case 'value':
      return <div className="cell-value">{cell.value}</div>
    case 'candidates': {
      const candidates = cell.candidates
      const line1 = candidates.filter((c) => c >= 1 && c <= 3)
      const line2 = candidates.filter((c) => c >= 4 && c <= 6)
      const line3 = candidates.filter((c) => c >= 7 && c <= 9)

      return (
        <div className="cell-candidates">
          <div className="candidates-line">
            {line1.map((digit) => <span key={digit}>{digit}</span>)}
          </div>
          <div className="candidates-line">
            {line2.map((digit) => <span key={digit}>{digit}</span>)}
          </div>
          <div className="candidates-line">
            {line3.map((digit) => <span key={digit}>{digit}</span>)}
          </div>
        </div>
      )
    }
    default: {
      const exhaustiveCheck: never = cell
      throw new Error(`Unhandled cell state: ${JSON.stringify(exhaustiveCheck)}`)
    }
  }
}

function App() {
  const cells = boardWithCandidates.flat()

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
