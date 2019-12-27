import React, { Component } from "react";
import { render } from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";

import "./style.css";

// ----------------- VARIABLES ----------------- //
let size = 3;
// const startGame = size => {
//   return Array(size)
//     .fill(null)
//     .map(() => Array(size).fill(null));
// };
// const theme = {
//   one: "X",
//   two: "O"
// };

// ----------------- SQUARE ----------------- //
const Square = props => {
  return (
    <button className="square" onClick={props.onClick}>
      {props.status}
    </button>
  );
};

// ----------------- BOARD ----------------- //
class Board extends Component {
  constructor() {
    super();
    this.renderSquare = this.renderSquare.bind(this);
    this.renderBoard = this.renderBoard.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  renderSquare(i, size) {
    let row = Math.floor(i / size),
      col = i % size;
    return (
      <Square
        key={i}
        status={this.props.state.board[row][col]}
        onClick={() => this.handleClick(i)}
      />
    );
  }

  renderBoard(size, count = 0, table = []) {
    for (let row = 0; row < size; row++) {
      let children = [];
      for (let col = 0; col < size; col++) {
        children.push(this.renderSquare(count++, size));
      }
      table.push(
        <div className="boardrow" key={row}>
          {children}
        </div>
      );
    }
    return table;
  }

  handleClick(i) {
    const { state, updateBoard, startGame } = this.props;
    let newBoard = [...state.board],
      row = Math.floor(i / size),
      col = i % size;

    if (newBoard[row][col] !== null) return alert("Choose Another Box!");
    newBoard[row][col] = state.oneNext ? state.theme.one : state.theme.two;
    updateBoard({ board: newBoard, oneNext: !state.oneNext });
    if (calcWinner(row, col, newBoard[row][col], state.board)) {
      alert(`${newBoard[row][col]} WON !`);
      updateBoard({ board: startGame(size), oneNext: true });
    }
  }

  render() {
    const { state } = this.props;
    const status =
      "Next Player: " + (state.oneNext ? state.theme.one : state.theme.two);

    return (
      <div className="boardFullDiv">
        <h3 className="status">{status}</h3>
        {this.renderBoard(size)}
      </div>
    );
  }
}

// ----------------- GAME ----------------- //
class Game extends Component {
  constructor() {
    super();
    this.state = {
      board: this.startGame(size),
      oneNext: true,
      theme: this.selectTheme()
    };
    this.startGame = this.startGame.bind(this);
    this.selectTheme = this.selectTheme.bind(this);
    this.updateBoard = this.updateBoard.bind(this);
    this.clearGame = this.clearGame.bind(this);
    this.sizeValue = this.sizeValue.bind(this);
  }

  sizeValue() {
    const size = document.getElementById("num-columns").value;
    console.log("size --", size);
    return size;
  }

  selectTheme(one = "X", two = "O") {
    return {
      one: one,
      two: two
    };
  }

  startGame(size) {
    const newBoard = Array(size)
      .fill(null)
      .map(() => Array(size).fill(null));
    this.setState();
    return newBoard;
  }

  updateBoard(newState) {
    this.setState({ board: newState.board, oneNext: newState.oneNext });
  }

  clearGame() {
    this.setState({
      board: this.startGame(size),
      oneNext: true
    });
  }

  render() {
    return (
      <div className="gameFullDiv">
        <div className="gameHeader">
          <div id="boardSizeDiv">
            Board Size:{" "}
            <input
              id="num-columns"
              name="size"
              type="text"
              maxlengh="2"
              placeholder="3"
              // value={this}
              onFocus={e => (e.target.placeholder = "")}
              onBlur={e => (e.target.placeholder = "3")}
            />
          </div>
          <button id="startBtn" onClick={this.sizeValue}>
            Start Game
          </button>
          <button id="clearBtn" onClick={this.clearGame}>
            Clear Game
          </button>
          <div id="selectDiv">
            Player One:
            <select value={this.state.theme.one}>
              <option>X</option>
              <option>O</option>
            </select>
          </div>
        </div>

        <div className="game">
          <div className="game-board">
            <Board
              state={this.state}
              startGame={this.startGame}
              updateBoard={this.updateBoard}
              size={this.sizeValue}
            />
          </div>

          <div className="game-info">
            <h3>Tracker Board: </h3>
            <h5>Status: </h5>
            <ol></ol>
          </div>
        </div>
      </div>
    );
  }
}

// ----------------- HELPER FUNCTIONS ----------------- //
function calcWinner(row, col, player, board) {
  let count = 1;
  // ROW WIN
  for (let i = 1; i < size; i++) {
    if (board[row] && board[row][col - i] == player) count++;
    if (board[row] && board[row][col + i] == player) count++;
  }
  if (count === size) return true;
  else count = 1;
  // COLUMN WIN
  for (let i = 1; i < size; i++) {
    if (board[row - i] && board[row - i][col] == player) count++;
    if (board[row + i] && board[row + i][col] == player) count++;
  }
  if (count === size) return true;
  else count = 1;
  // DOWN DIAGONAL WIN
  for (let i = 1; i < size; i++) {
    if (board[row - i] && board[row - i][col - i] == player) count++;
    if (board[row + i] && board[row + i][col + i] == player) count++;
  }
  if (count === size) return true;
  else count = 1;
  // UP DIAGONAL WIN
  for (let i = 1; i < size; i++) {
    if (board[row - i] && board[row - i][col + i] == player) count++;
    if (board[row + i] && board[row + i][col - i] == player) count++;
  }
  if (count === size) return true;
  else return false;
}

// ----------------- RENDER TO HTML ----------------- //
render(
  <Router>
    <Game />
  </Router>,
  document.getElementById("app")
);
