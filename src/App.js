import mine from './icons/mine.svg';
// import redXMine from './icons/red-x-mine.svg';
// import flag from './icons/flag.svg';
import './App.css';
import React, { useState } from 'react';

const gameParams = {
  rows: 9,
  cols: 9,
  mines: 10,
  timer: 999,
};

function App() {
  const [gameBoard, setGameBoard] = useState([]);
  // eslint-disable-next-line
  const [gameRows, setRows] = useState(gameParams.rows);
  // eslint-disable-next-line
  const [gameCols, setCols] = useState(gameParams.cols);
  const [mines, setMines] = useState(0);

  const initGame = () => {
    setMines(gameParams.mines);
    let board = createBoard(gameRows, gameCols);
    let minePosList = [];
    let minesLeft = gameParams.mines;
    const baseProbability = gameParams.mines / (gameRows * gameCols);
    let multiplier = 1;
    while (minesLeft > 0) {
      [board, minePosList, minesLeft, multiplier] = placeMines(
        board,
        minePosList,
        minesLeft,
        baseProbability,
        multiplier
      );
    }
    board = placeNumbers(board, minePosList);
    setGameBoard(board);
  };

  const createBoard = (rows, cols) => {
    const newMap = [];
    for (let row = 0; row < rows; row++) {
      const newRow = new Array(cols);
      newMap.push(newRow);
    }
    setGameBoard(newMap);
    return newMap;
  };

  const shouldPutMine = (probability) => {
    return Math.random() * gameParams.mines < probability;
  };

  const placeMines = (
    board,
    minePosList,
    minesToPlace,
    baseProbability,
    multiplier
  ) => {
    let mines = minesToPlace;
    let currentBoard = board;
    for (let row = 0; row < gameRows; row++) {
      for (let col = 0; col < gameCols; col++) {
        if (!currentBoard[row][col]) {
          if (mines > 0) {
            const probability = baseProbability * multiplier;
            const hasMine = shouldPutMine(probability);
            if (hasMine) {
              currentBoard[row][col] = -1;
              minePosList.push({ row, col });
              mines--;
              multiplier = 1;
            } else {
              currentBoard[row][col] = 0;
              multiplier++;
            }
          } else {
            currentBoard[row][col] = 0;
          }
        }
      }
    }
    setGameBoard(currentBoard);
    return [currentBoard, minePosList, mines, multiplier];
  };

  const placeNumbers = (board, minePosList) => {
    minePosList.forEach((position) => {
      if (position.row === 0) {
        board = placeNumberNextRow(board, position);
      } else if (position.row === gameRows - 1) {
        board = placeNumberPrevRow(board, position);
      } else {
        board = placeNumberPrevRow(board, position);
        board = placeNumberNextRow(board, position);
      }
      board = placeNumberCurrentRow(board, position);
    });
    setGameBoard(board);
    return board;
  };

  const placeNumberPrevRow = (board, position) => {
    let row = position.row - 1;
    for (
      let cellPos = position.col - 1;
      cellPos <= position.col + 1;
      cellPos++
    ) {
      board = placeNumberOnBoard(board, row, cellPos);
    }
    return board;
  };

  const placeNumberCurrentRow = (board, position) => {
    let row = position.row;
    for (
      let cellPos = position.col - 1;
      cellPos <= position.col + 1;
      cellPos++
    ) {
      board = placeNumberOnBoard(board, row, cellPos);
    }
    return board;
  };

  const placeNumberNextRow = (board, position) => {
    let row = position.row + 1;
    for (
      let cellPos = position.col - 1;
      cellPos <= position.col + 1;
      cellPos++
    ) {
      board = placeNumberOnBoard(board, row, cellPos);
    }
    return board;
  };

  const placeNumberOnBoard = (board, row, col) => {
    if (col >= 0 && col < gameParams.cols) {
      console.log(row, col, board[row][col]);
      let currentCellValue = board[row][col];
      let newCellValue = checkForMine(board[row][col]);
      board[row][col] = newCellValue;
    }
    return board;
  };

  const checkForMine = (value) => {
    return value !== -1 ? ++value : value;
  };

  return (
    <div className='App noselect'>
      <header className='App-header'>
        <img src={mine} className='App-logo' alt='logo' />
        <h2>Minesweeper</h2>
      </header>
      <article>
        <div className='row game-header'>
          <div className='mines counter'>{mines}</div>
          <div type='button' className='new-game-btn' onClick={initGame}>
            New Game
          </div>
          <div className='timer counter'>{gameParams.timer}</div>
        </div>
        <div className='game-body'>
          {gameBoard.map((row, i) => (
            <div className='row' key={'row_' + i}>
              {row.map((cell, i) => (
                <div className='cell' key={'cell_' + i}>
                  {cell === -1 ? (
                    <img src={mine} className='icon' alt='logo' />
                  ) : (
                    cell
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </article>
    </div>
  );
}

export default App;
