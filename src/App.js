import mine from './icons/mine.svg';
// import redXMine from './icons/red-x-mine.svg';
// import flag from './icons/flag.svg';
import './App.css';
import React, { useState } from 'react';

const gameParams = {
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
  const [clickedMine, setClickedMine] = useState({ row: 0, col: 0 });

  const initGame = () => {
    if (gameRows && gameCols && mines) {
      setShowWarning(false);
      let board = createBoard();
      let hiddenBoard = hideBoard([...board]);
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

  const showBoard = () => {
    let board = [...clickBoard];
    board.forEach((row, i) => {
      row.forEach((col, j) => {
        board[i][j] = true;
      });
    });
    setClickBoard([...board]);
  };

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
      board[row][col] = !cellHasMine(board[row][col])
        ? board[row][col] + 1
        : board[row][col];
    }
    return board;
  };

  const cellHasMine = (cellValue) => cellValue === -1;

  const isCellEmpty = (cellValue) => cellValue === 0;

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

  const notOutOfBounds = (row, col) => {
    return row >= 0 && row < gameRows && col >= 0 && col < gameCols;
  };

  const isItself = (row, col, rowPos, colPos) => {
    return rowPos === row && colPos === col;
  };

  const finishGame = (row, col) => {
    showBoard();
    setClickedMine({ row, col });
  };

  const openCell = (row, col) => {
    let board = clickBoard;
    board[row][col] = true;
    setClickBoard([...board]);
  };

  const openAroundCell = (row, col) => {
    let tempClickBoard = clickBoard;
    tempClickBoard = openAroundCellRecursive(tempClickBoard, row, col);
    setClickBoard(tempClickBoard);
  };

  const isCellClosed = (row, col) => clickBoard[row][col] === false;

  const openAroundCellRecursive = (board, row, col, cellsToOpen = []) => {
    let tempClickBoard = board;
    // let tempCellsToOpenAround = cellsToOpen.filter(
    //   (cell) => cell.row !== row && cell.col !== col
    // );
    let tempCellsToOpenAround = cellsToOpen;
    tempClickBoard[row][col] = !tempClickBoard[row][col] && true;
    for (let rowPos = row - 1; rowPos <= row + 1; rowPos++) {
      for (let colPos = col - 1; colPos <= col + 1; colPos++) {
        if (
          notOutOfBounds(rowPos, colPos) &&
          !isItself(row, col, rowPos, colPos) &&
          clickBoard[rowPos][colPos] === false
        ) {
          if (isCellEmpty(gameBoard[rowPos][colPos])) {
            tempCellsToOpenAround.push({ rowPos, colPos });
          } else {
            tempClickBoard[rowPos][colPos] =
              !tempClickBoard[rowPos][colPos] && true;
          }
        }
      }
    }
    tempCellsToOpenAround.forEach((cellToOpen) => {
      if (isCellClosed(cellToOpen.rowPos, cellToOpen.colPos)) {
        tempClickBoard = openAroundCellRecursive(
          tempClickBoard,
          cellToOpen.rowPos,
          cellToOpen.colPos,
          tempCellsToOpenAround
        );
      }
    });
    return tempClickBoard;
  };

  const handleClick = (row, col) => {
    checkCell(row, col);
    let board = clickBoard;
    board[row][col] = true;
    setClickBoard([...board]);
  };

  const checkCell = (row, col) => {
    if (isCellEmpty(gameBoard[row][col])) {
      openAroundCell(row, col);
    } else if (!cellHasMine(gameBoard[row][col])) {
      openCell(row, col);
    } else {
      finishGame(row, col);
    }
  };

  const setGameEasy = () => {
    // Easy Difficulty
    setGameRows(9);
    setGameCols(9);
    setMines(15);
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
                  {!clickBoard[rowPos][colPos] && (
                    <div
                      className='closedCell'
                      onClick={() => handleClick(rowPos, colPos)}
                    >
                      &nbsp;
                    </div>
                  )}
                  {clickBoard[rowPos][colPos] && (
                    <div
                      className={`openCell ${
                        rowPos === clickedMine.row &&
                        colPos === clickedMine.col &&
                        'exploded'
                      }`}
                    >
                      {col === -1 ? (
                        <img src={mine} className='icon' alt='logo' />
                      ) : (
                        col !== 0 && (
                          <span className={'color_' + col}>{col}</span>
                        )
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
