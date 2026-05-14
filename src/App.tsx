import './App.css'

const cells = Array.from({ length: 81 })

function App() {
  return (
    <main className="app">
      <h1>Sudoku Solver</h1>
      <section className="grid" aria-label="Sudoku grid">
        {cells.map((_, index) => {
          const row = Math.floor(index / 9)
          const col = index % 9

          return (
            <div
              key={index}
              className="cell"
              style={{
                borderTopWidth: row % 3 === 0 ? '2px' : '1px',
                borderLeftWidth: col % 3 === 0 ? '2px' : '1px',
                borderRightWidth: col === 8 ? '2px' : '1px',
                borderBottomWidth: row === 8 ? '2px' : '1px',
              }}
            />
          )
        })}
      </section>
    </main>
  )
}

export default App
