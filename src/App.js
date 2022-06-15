import mine from './icons/mine.svg';
// import redXMine from './icons/red-x-mine.svg';
// import flag from './icons/flag.svg';
import './App.css';
import React, { useState } from 'react';

const gameParams = {
  rows: 15,
  cols: 20,
  mines: 30,
  timer: 999,
};

function App() {
  const [gameOn, setGameOn] = useState(false);
  const [gameBoard, setGameBoard] = useState([]);
  const [clickBoard, setClickBoard] = useState([]);
  // eslint-disable-next-line
  const [gameRows, setGameRows] = useState(0);
  // eslint-disable-next-line
  const [gameCols, setGameCols] = useState(0);
  const [mines, setMines] = useState(0);
  const [showWarning, setShowWarning] = useState(false);

  const initGame = () => {
    if (gameRows && gameCols && mines) {
      setShowWarning(false);
      let board = createBoard();
      let hiddenBoard = hideBoard(board);
      setClickBoard(hiddenBoard);
      let minePosList = [];
      let minesLeft = mines;
      const baseProbability = mines / (gameRows * gameCols);
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
      setGameOn(true);
    } else {
      setShowWarning(true);
    }
  };

  const createBoard = () => {
    const newMap = [];
    for (let row = 0; row < gameRows; row++) {
      const newRow = [];
      for (let col = 0; col < gameCols; col++) {
        newRow.push(0);
      }
      newMap.push(newRow);
    }
    setGameBoard(newMap);
    return newMap;
  };

  const hideBoard = (board) =>
    board.map((row) => row.map((col) => (col = false)));

  const showBoard = (board) =>
    board.map((row) => row.map((col) => (col = true)));

  const shouldPutMine = (probability) => {
    return Math.random() * mines < probability;
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
    for (let colPos = position.col - 1; colPos <= position.col + 1; colPos++) {
      board = placeNumberOnBoard(board, row, colPos);
    }
    return board;
  };

  const placeNumberCurrentRow = (board, position) => {
    let row = position.row;
    for (let colPos = position.col - 1; colPos <= position.col + 1; colPos++) {
      board = placeNumberOnBoard(board, row, colPos);
    }
    return board;
  };

  const placeNumberNextRow = (board, position) => {
    let row = position.row + 1;
    for (let colPos = position.col - 1; colPos <= position.col + 1; colPos++) {
      board = placeNumberOnBoard(board, row, colPos);
    }
    return board;
  };

  const placeNumberOnBoard = (board, row, col) => {
    if (col >= 0 && col < gameCols) {
      board[row][col] = checkForMine(board[row][col]);
    }
    return board;
  };

  const checkForMine = (value) => {
    return value !== -1 ? ++value : value;
  };

  const handleRowsChange = (event) => {
    setGameRows(+event.target.value);
  };

  const handleColsChange = (event) => {
    setGameCols(+event.target.value);
  };

  const handleMinesChange = (event) => {
    setMines(+event.target.value);
  };

  const addZeros = (number) => String(number).padStart(3, '0');

  const setGameEasy = () => {
    // Easy Difficulty
    setGameRows(9);
    setGameCols(9);
    setMines(10);
  };
  const setGameMedium = () => {
    // Medium Difficulty
    setGameRows(16);
    setGameCols(16);
    setMines(40);
  };
  const setGameHard = () => {
    // Hard Difficulty
    setGameRows(16);
    setGameCols(30);
    setMines(99);
  };

  const isHidden = (row, col) => {
    return clickBoard[row][col];
  };

  const handleClick = (row, col) => {    
    let board = clickBoard;
    board[row][col] = true;
    setClickBoard([...board]);
  };

  return (
    <div className='App noselect'>
      <div className='background'></div>
      <header className={`header ${gameOn ? 'small-header' : 'full-header'}`}>
        <img src={mine} className='logo' alt='logo' />
        <h2>Minesweeper</h2>
      </header>
      <article>
        <div className='row custom-controls'>
          <input
            type='number'
            name='rows'
            id='rows'
            placeholder='rows'
            value={gameRows}
            onChange={handleRowsChange}
          />
          <input
            type='number'
            name='cols'
            id='cols'
            placeholder='cols'
            value={gameCols}
            onChange={handleColsChange}
          />
          <input
            type='number'
            name='mines'
            id='mines'
            placeholder='mines'
            value={mines}
            onChange={handleMinesChange}
          />
        </div>
        <div className='row difficulty-controls'>
          <div type='button' className='new-game-btn' onClick={setGameEasy}>
            Easy
          </div>
          <div type='button' className='new-game-btn' onClick={setGameMedium}>
            Medium
          </div>
          <div type='button' className='new-game-btn' onClick={setGameHard}>
            Hard
          </div>
        </div>
        <div className='warning'>
          {showWarning ? 'Fill all 3 fields if you want to play!' : ''}
        </div>
        <div className='row game-header'>
          <div className='mines counter'>{addZeros(mines)}</div>
          <div type='button' className='new-game-btn' onClick={initGame}>
            New Game
          </div>
          <div className='timer counter'>{addZeros(gameParams.timer)}</div>
        </div>
        <div className={`game-body ${gameOn && 'show-game'}`}>
          {gameBoard.map((row, rowPos) => (
            <div className='row game-row' key={'row_' + rowPos}>
              {row.map((col, colPos) => (
                <div className='col' key={'col_' + colPos}>
                {!clickBoard[rowPos][colPos]
                ? (<div
                    className='closedCell'
                    onClick={() => handleClick(rowPos, colPos)}
                  >
                    &nbsp;
                  </div>)
                : (<div
                    className='openCell'
                  >
                    {col === -1 ? (
                      <img src={mine} className='icon' alt='logo' />
                    ) : col !== 0 && (
                      <span className={'color_' + col}>{col}</span>
                    )}
                  </div>)
                }
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
