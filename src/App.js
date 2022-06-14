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
  const [gameMap, setGameMap] = useState([]);
  // eslint-disable-next-line
  const [minesPos, setMinesPos] = useState([]);
  // eslint-disable-next-line
  const [gameRows, setRows] = useState(gameParams.rows);
  // eslint-disable-next-line
  const [gameCols, setCols] = useState(gameParams.cols);
  const [mines, setMines] = useState(0);

  const initGame = () => {
    setMines(gameParams.mines);
    let createdMap = createMap(gameRows, gameCols);
    let minesLeft = gameParams.mines;
    const baseProbability = gameParams.mines / (gameRows * gameCols);
    while (minesLeft > 0) {
      [createdMap, minesLeft] = placeMines(
        createdMap,
        minesLeft,
        baseProbability
      );
    }
  };

  const createMap = (rows, cols) => {
    const newMap = [];
    for (let row = 0; row < rows; row++) {
      const newRow = new Array(cols);
      newMap.push(newRow);
    }
    setGameMap(newMap);
    return newMap;
  };

  const shouldPutMine = (probability) => {
    return Math.random() * 3 < probability;
  };

  const placeMines = (
    createdMap,
    minesToPlace,
    baseProbability,
    multiplier = 1
  ) => {
    let mines = minesToPlace;
    let currentMap = createdMap;
    for (let row = 0; row < gameRows; row++) {
      for (let col = 0; col < gameCols; col++) {
        if (mines > 0) {
          const probability = baseProbability * multiplier;
          const hasMine = shouldPutMine(probability);
          if (hasMine) {
            currentMap[row][col] = -1;
            setMinesPos((prevState) => [...prevState, { row, col }]);
            mines--;
            multiplier = 1;
          } else {
            currentMap[row][col] = 0; // checkMinesAround
            multiplier++;
          }
        } else {
          currentMap[row][col] = 0;
        }
      }
    }
    setGameMap(currentMap);
    return [currentMap, mines];
  };

  // const placeNumbers = () => {
  //   minesPos.forEach((position) => {
  //     if (position.row === 0) {
  //       placeNumberCurrentRow();
  //       placeNumberNextRow();
  //     } else if (position.row === rows) {
  //       placeNumberPrevRow();
  //       placeNumberCurrentRow();
  //     } else {
  //       placeNumberPrevRow();
  //       placeNumberCurrentRow();
  //       placeNumberNextRow();
  //     }
  //   });
  // };

  // const placeNumber

  return (
    <div className='App'>
      <header className='App-header'>
        <img src={mine} className='App-logo' alt='logo' />
        <h2>Minesweeper</h2>
      </header>
      <article>
        <div className='row game-header'>
          <div className='mines-counter'>{mines}</div>
          <div type='button' className='new-game-btn' onClick={initGame}>
            New Game
          </div>
          <div className='timer'>{gameParams.timer}</div>
        </div>
        <div className='game-body'>
          {gameMap.map((row, i) => (
            <div className='row' key={'row_' + i}>
              {row.map((cell, i) => (
                <div className='cell' key={'cell_' + i}>
                  {cell}
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
