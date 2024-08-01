import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay, winner }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i] || !xIsNext) {
      return;
    }

    const nextSquares = squares.slice();
    nextSquares[i] = 'X'; // Player 1's move

    // Call onPlay to handle the next move
    onPlay(nextSquares);
  }

  // Determine title based on winner
  const title = winner ? (winner === 'X' ? "You are the winner!" : "Oops, you lost!") : "Can you beat me?";

  return (
    <>
      <div className="mainTitle">{title}</div>
      <div className="ticTacToeGrid">
        <div className="board-row">
          <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
          <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
          <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
        </div>
        <div className="board-row">
          <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
          <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
          <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
        </div>
        <div className="board-row">
          <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
          <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
          <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
        </div>
      </div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [xIsNext, setXIsNext] = useState(true); // Track whose turn it is
  const currentSquares = history[currentMove];
  const winner = calculateWinner(currentSquares);

  function handlePlay(nextSquares) {
    if (winner || nextSquares.every(square => square !== null)) {
      return;
    }

    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);

    setXIsNext(false);

    if (!calculateWinner(nextSquares)) {
      setTimeout(() => {
        makeComputerMove(nextSquares);
      }, 1000); // Delay for visual effect
    }
  }

  function makeComputerMove(nextSquares) {
    const availableSquares = nextSquares.map((square, index) => (square === null ? index : null)).filter(index => index !== null);

    if (availableSquares.length > 0) {
      const randomIndex = availableSquares[Math.floor(Math.random() * availableSquares.length)];
      nextSquares[randomIndex] = 'O'; // Player 2's move

      const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
      setHistory(nextHistory);
      setCurrentMove(nextHistory.length - 1);

      setXIsNext(true);
    }
  }

  function restartGame() {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
    setXIsNext(true); // Reset to Player 1's turn
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} winner={winner} />
      </div>
      <div className="game-info">
        <button className="restart-button" onClick={restartGame}>Restart</button>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}