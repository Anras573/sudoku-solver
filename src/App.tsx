import './App.css'

const cells = Array.from({ length: 81 })

function App() {
  return (
    <main className="app">
      <h1>Sudoku Solver</h1>
      <section className="grid" aria-label="Sudoku grid">
        {cells.map((_, index) => (
          <div key={index} className="cell" />
        ))}
      </section>
    </main>
  )
}

export default App
