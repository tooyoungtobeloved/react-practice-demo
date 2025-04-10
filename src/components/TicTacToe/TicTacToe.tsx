import "./style.css";
import { useState } from "react";
export default function TicTacToe() {
  const [player, setPlayer] = useState<"X" | "O">("X");
  const [cells, setCells] = useState<string[]>(Array(9).fill(null));
  const winner = checkWinner(cells);
  function handleCellClick(index: number) {
    if (cells[index] || winner) return;
    const newCells = [...cells];
    newCells[index] = player;
    setCells(newCells);
    setPlayer((prev) => (prev === "X" ? "O" : "X"));
  }
  function handleReset() {
    setCells(Array(9).fill(null));
    setPlayer("X");
  }
  function checkWinner(cells: string[]) {
    const matchArray = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    if (cells.filter(Boolean).length < 5) return null;
    for (let i = 0; i < matchArray.length; i++) {
      const [a, b, c] = matchArray[i];
      if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
        return cells[a];
      }
    }
    if (cells.every(Boolean)) {
      return "Draw";
    }
    return null;
  }
  return (
    <div className="container">
      {!winner ? (
        <span>Player {player} turn</span>
      ) : winner === "Draw" ? (
        <span> It's a draw! </span>
      ) : (
        <span> Player {winner} wins! </span>
      )}
      <div className="player"></div>
      <div className="tictactoe">
        {cells.map((value, index) => (
          <div
            onClick={() => handleCellClick(index)}
            className="cell"
            key={index}
          >
            {value}
          </div>
        ))}
      </div>
      <div className="reset">
        <button onClick={handleReset}>Reset</button>
      </div>
    </div>
  );
}
