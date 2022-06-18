import mine from './icons/mine.svg';
import flaggedMine from './icons/flagged-mine.svg';
import flag from './icons/flag.svg';
import './App.css';
import React, { useState } from 'react';

const gameParams = {
  timer: 999,
};

function App() {
  const [gameOn, setGameOn] = useState(false);
  const [gameBoard, setGameBoard] = useState([]);
  // eslint-disable-next-line
  const [gameRows, setGameRows] = useState(0);
  // eslint-disable-next-line
  const [gameCols, setGameCols] = useState(0);
  const [mineCounter, setMineCounter] = useState(0);
  const [flagCounter, setFlagCounter] = useState(0);
  const [showWarning, setShowWarning] = useState(false);

  const initGame = () => {
    if (gameRows && gameCols && mineCounter) {
      setShowWarning(false);
      let board = createBoard();
      let minePosList = [];
      let minesLeft = mineCounter;
      const baseProbability = mineCounter / (gameRows * gameCols);
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
        newRow.push({
          row,
          col,
          value: 0,
          isOpen: false,
          isFlagged: false,
          hasMine: false,
          clicked: false,
        });
      }
      newMap.push(newRow);
    }
    setGameBoard(newMap);
    return newMap;
  };

  const shouldPutMine = (probability) => {
    return Math.random() * mineCounter < probability;
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
        if (!currentBoard[row][col].value) {
          currentBoard[row][col] = {
            ...currentBoard[row][col],
            row,
            col,
          };
          if (mines > 0) {
            const probability = baseProbability * multiplier;
            const hasMine = shouldPutMine(probability);
            if (hasMine) {
              currentBoard[row][col] = {
                ...currentBoard[row][col],
                value: -1,
                hasMine: true,
              };
              minePosList.push({ row, col });
              mines--;
              multiplier = 1;
            } else {
              multiplier++;
            }
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
        // board = placeNumberNextRow(board, position);
        board = placeNumberOnRow(board, position.row + 1, position.col);
      } else if (position.row === gameRows - 1) {
        // board = placeNumberPrevRow(board, position);
        board = placeNumberOnRow(board, position.row - 1, position.col);
      } else {
        board = placeNumberOnRow(board, position.row + 1, position.col);
        board = placeNumberOnRow(board, position.row - 1, position.col);
      }
      board = placeNumberOnRow(board, position.row, position.col);
    });
    setGameBoard(board);
    return board;
  };

  const placeNumberOnRow = (board, row, col) => {
    for (let colPos = col - 1; colPos <= col + 1; colPos++) {
      if (colPos >= 0 && colPos < gameCols) {
        if (!board[row][colPos].hasMine) {
          board[row][colPos].value += 1;
        }
      }
    }
    return board;
  };

  const handleRowsChange = (event) => {
    let maxRows = getMaxRows();
    let rows =
      +event.target.value < maxRows ? +event.target.value : Math.floor(maxRows);
    setGameRows(rows);
  };

  const handleColsChange = (event) => {
    let maxCols = getMaxCols();
    let cols =
      +event.target.value < maxCols ? +event.target.value : Math.floor(maxCols);
    setGameCols(cols);
  };

  const handleMinesChange = (event) => {
    let maxMines = gameRows > 0 && gameCols > 0 ? gameRows * gameCols - 1 : 0;
    let mines = +event.target.value < maxMines ? +event.target.value : maxMines;
    setMineCounter(mines);
    setFlagCounter(mines);
  };

  const addZeros = (number) => String(number).padStart(3, '0');

  const notOutOfBounds = (row, col) => {
    return row >= 0 && row < gameRows && col >= 0 && col < gameCols;
  };

  const handleLeftClick = (cell) => {
    cell.clicked = true;
    checkCell(cell);
  };

  const checkCell = (cell) => {
    if (!cell.value) {
      openAroundCell(cell);
    } else if (!cell.hasMine) {
      openCell(cell);
    } else {
      handleCellChange(cell);
      finishGame();
    }
  };

  const handleCellChange = (cell) => {
    let board = [...gameBoard];
    board[cell.row][cell.col] = cell;
    setGameBoard(board);
  };

  const finishGame = () => {
    showBoard();
  };

  const showBoard = () => {
    let board = [...gameBoard];
    board.forEach((row) => {
      row.forEach((cell) => {
        cell.isOpen = true;
      });
    });
    setGameBoard([...board]);
  };

  const openCell = (cell) => {
    cell.isOpen = true;
    handleCellChange(cell);
  };

  const openAroundCell = (cell) => {
    let board = [...gameBoard];
    board = openAroundCellRecursive(board, cell);
    setGameBoard(board);
  };

  const openAroundCellRecursive = (board, cellToOpen, cellsToOpen = []) => {
    cellToOpen.isOpen = true;
    board[cellToOpen.row][cellToOpen.col] = cellToOpen;
    for (
      let rowPos = cellToOpen.row - 1;
      rowPos <= cellToOpen.row + 1;
      rowPos++
    ) {
      for (
        let colPos = cellToOpen.col - 1;
        colPos <= cellToOpen.col + 1;
        colPos++
      ) {
        if (notOutOfBounds(rowPos, colPos)) {
          const adjCell = board[rowPos][colPos];
          if (!adjCell.isOpen && !adjCell.clicked) {
            if (!adjCell.value) {
              cellsToOpen.push(adjCell);
            } else {
              adjCell.isOpen = true;
              board[adjCell.row][adjCell.col] = adjCell;
            }
          }
        }
      }
    }
    cellsToOpen.forEach((cell) => {
      if (!cell.isOpen) {
        board = openAroundCellRecursive(board, cell, cellsToOpen);
      }
    });
    board[cellToOpen.row][cellToOpen.col] = cellToOpen;
    return board;
  };

  const handleRightClick = (event, cell) => {
    event.preventDefault();
    cell.isFlagged = !cell.isFlagged;
    handleCellChange(cell);
    recountFlags();
  };

  const recountFlags = () => {
    let flagsUsed = 0;
    gameBoard.forEach((row) => {
      row.forEach((cell) => {
        cell.isFlagged && ++flagsUsed;
      });
    });
    setFlagCounter(mineCounter - flagsUsed);
  };

  const setGameDifficulty = (rows, cols, mines) => {
    setGameRows(rows);
    setGameCols(cols);
    setMineCounter(mines);
    setFlagCounter(mines);
  };

  const getMaxRows = () => (window.innerHeight - 369) / 40;
  const getMaxCols = () => window.innerWidth / 40;

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
            value={mineCounter}
            onChange={handleMinesChange}
          />
        </div>
        <div className='row difficulty-controls'>
          <div
            type='button'
            className='new-game-btn'
            onClick={() => setGameDifficulty(9, 9, 15)}
          >
            Easy
          </div>
          <div
            type='button'
            className='new-game-btn'
            onClick={() => setGameDifficulty(16, 16, 40)}
          >
            Medium
          </div>
          <div
            type='button'
            className='new-game-btn'
            onClick={() => setGameDifficulty(16, 30, 99)}
          >
            Hard
          </div>
        </div>
        <div className='warning'>
          {showWarning ? 'Fill all 3 fields if you want to play!' : ''}
        </div>
        <div className='row game-header'>
          <div className='mines counter'>{addZeros(flagCounter)}</div>
          <div type='button' className='new-game-btn' onClick={initGame}>
            New Game
          </div>
          <div className='timer counter'>{addZeros(gameParams.timer)}</div>
        </div>
        <div className={`game-body ${gameOn && 'show-game'}`}>
          {gameBoard.map((row, index) => (
            <div className='row game-row' key={'row_' + index}>
              {row.map((cell) => (
                <div className='col' key={'row_' + index + '__col_' + cell.col}>
                  {!cell.isOpen && (
                    <div
                      className={`closed-cell ${
                        cell.clicked && cell.hasMine && 'exploded'
                      }`}
                      onClick={() => handleLeftClick(cell)}
                      onContextMenu={(event) => handleRightClick(event, cell)}
                    >
                      {cell.isFlagged ? (
                        <img src={flag} className='icon' alt='flag' />
                      ) : (
                        <span>&nbsp;</span>
                      )}
                    </div>
                  )}
                  {cell.isOpen && (
                    <div
                      className={`open-cell ${
                        cell.clicked && cell.hasMine && 'exploded'
                      }`}
                    >
                      {cell.hasMine && !cell.isFlagged && (
                        <img src={mine} className='icon' alt='mine' />
                      )}
                      {cell.hasMine && cell.isFlagged && (
                        <img
                          src={flaggedMine}
                          className='icon'
                          alt='flagged-mine'
                        />
                      )}
                      {cell.value > 0 && (
                        <span className={'color_' + cell.value}>
                          {cell.value}
                        </span>
                      )}
                    </div>
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
