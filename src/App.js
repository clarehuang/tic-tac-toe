import React, { useEffect, useState } from 'react'
import logo from './logo.svg'
import './App.css'

/** NOTE: utils - create a grid to store tic tac toe values */
const generateGrid = (size) => {
  const grid = []
  for (let i = 0; i < size; i++) {
    const matrix = []
    for (let j = 0; j < size; j++) {
      matrix.push(0)
    }
    grid.push(matrix)
  }
  return grid
}

/** NOTE: utils - check if every element in Array is equal to each other */
const checkEveryElem = (arr) => {
  let res = arr.every(elem => elem === arr[0]) ? arr[0] : 3
  return res
}

/** NOTE: winning condition and return the game results */
const caculateWinner = (matrix) => {
  let winner = 0
  let tie = 0
  let msg = ""
  const res = {} // create a hashmap to store cell status
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix.length; j++) {
      if (matrix[j][i] !== undefined) {
        // NOTE: res in a row
        if (!res[`row-${i}`]) {
          res[`row-${i}`] = [matrix[i][j]]
        } else {
          res[`row-${i}`].push(matrix[i][j])
        }
        // NOTE: res in a column
        if (!res[`col-${i}`]) {
          res[`col-${i}`] = [matrix[j][i]]
        } else {
          res[`col-${i}`].push(matrix[j][i])
        }
        // NOTE: win in diagonal line
        if (!res['dia']) {
          if (i === j) res['dia'] = [matrix[i][j]]
        } else {
          if (i === j) res['dia'].push(matrix[i][j])
        }
        // NOTE: win in inverse diagonal line
        if (!res['inverse-dia']) {
          if (i === matrix.length - 1 - j) res['inverse-dia'] = [matrix[i][j]]
        } else {
          if (i === matrix.length - 1 - j) res['inverse-dia'].push(matrix[i][j])
        }
      }
    }
  }
  Object.values(res).forEach(arr => {
    if (arr.length === matrix.length && checkEveryElem(arr) !== 0 && checkEveryElem(arr) !== 3) {
      winner = checkEveryElem(arr)
    }
    // NOTE: handle a tie
    if (!arr.some(elem => elem === 0) && checkEveryElem(arr) === 3) {
      tie++
      if (tie === matrix.length * 2 + 2) {
        winner = 3
      }
    }
  })
  switch (winner) {
    case 1:
      msg = "Player X WON!!"
      break
    case 2:
      msg = "Player O WON!!"
      break
    case 3:
      msg = "***TIE!!*** Start a new game!"
      break
    default:
      msg = ""
  }
  return msg
}

/** NOTE: reusable dropdown component */
const DropDown = ({ list, onSetValue, defaultValue, ...props }) => {
  const handleChange = (e) => {
    onSetValue(e.target.value)
  }
  return (
    <div className="dropdown--container" {...props}>
      <label htmlFor={props.id} className="dropdown--label">Choose the board size:</label>
      <select className="dropdown--select" name={props.id} id={props.id} onChange={handleChange} value={defaultValue}>
        {list.map((item, index) => <option value={item.value} key={`option-${props.id}-${index}`}>{item.label}</option>)}
      </select>
    </div>
  )
}
/** NOTE: generate boardSize */
const boardSizeList = []
for (let i = 2; i < 20; i++) {
  boardSizeList.push({ value: i + 1, label: `${i + 1}` })
}

/** NOTE: main app */
const App = () => {
  const [isFirstPlayer, setFirstPlayer] = useState(true)
  const [size, setSize] = useState(localStorage.getItem('boardSizeLocalStorage') ? localStorage.getItem('boardSizeLocalStorage') : 3)
  const [matrix, setMatrix] = useState(JSON.parse(localStorage.getItem('gridRes')) ? JSON.parse(localStorage.getItem('gridRes')) : generateGrid(size))
  const [result, setResult] = useState(caculateWinner(matrix) ? caculateWinner(matrix) : "")

  // NOTE: HANDLE BOARDSIZE
  const handleSetBoardSize = (value) => {
    localStorage.removeItem('gridRes')
    setSize(value)
  }
  // NOTE: HANDLE RESET
  const handleReset = () => {
    setFirstPlayer(true)
    setMatrix(generateGrid(size))
    // NOTE: remove local storage of gridRes
    localStorage.removeItem('gridRes')
    setResult("")
  }

  useEffect(() => {
    setMatrix(JSON.parse(localStorage.getItem('gridRes')) ? JSON.parse(localStorage.getItem('gridRes')) : generateGrid(size))
    localStorage.setItem('boardSizeLocalStorage', size)
  }, [size])

  return (
    <div className="App">
      <img src={logo} alt="chegg-logo" className="logo" />
      <h1>Tic Tac Toe</h1>
      <DropDown id="boardSize" list={boardSizeList} onSetValue={handleSetBoardSize} defaultValue={size} />
      <div className="canvas" >
        {matrix.map((row, rowIndex) => {
          return <div className="grid--row" key={`grid--row--${rowIndex}`} >
            {row.map((cell, cellIndex) => {
              // NOTE: HANDLE CLICK CELLS
              const handleCellClick = () => {
                // NOTE: validate to click on the cell
                if (matrix[rowIndex][cellIndex] === 0) {
                  setFirstPlayer(old => !old)
                  matrix[rowIndex][cellIndex] = isFirstPlayer ? 1 : 2
                }
                // NOTE: update the dialog message
                setResult(caculateWinner(matrix))
                // NOTE: set localStorage
                localStorage.setItem('gridRes', JSON.stringify(matrix))
              }

              // NOTE: fill up the content of each cell 
              let string = ""
              switch (cell) {
                case 0:
                  string = ""
                  break
                case 1:
                  string = "X"
                  break
                case 2:
                  string = "O"
                  break
                default:
                  string = ""
              }
              return (
                <div role="button" data-row={rowIndex} data-column={cellIndex} className="grid__cell" onClick={handleCellClick} key={cellIndex}>{string}</div>
              )
            })}
          </div>
        })}
      </div>
      <button className="button--reset" onClick={handleReset}>RESET</button>
      <h1>{result}</h1>
    </div>
  )
}


export default App
