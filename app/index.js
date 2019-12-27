import React, { Component } from "react";
import { render } from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";

import "./style.css";

// ----------------- VARIABLES ----------------- //
// const size = document.getElementById("num-columns").value;
let size = 3;
const startBoard = size => Array(size).fill(Array(size).fill(null));
const theme = {
  one: "X",
  two: "O"
};

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
    this.state = {
      board: startBoard(size),
      oneNext: true
    };
    this.renderSquare = this.renderSquare.bind(this);
    this.renderBoard = this.renderBoard.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  renderSquare(i) {
    let row = Math.floor(i / size),
      col = i % size;
    return (
      <Square
        key={i}
        status={this.state.board[row][col]}
        onClick={() => this.handleClick(i)}
      />
    );
  }

  renderBoard(size, count = 0, table = []) {
    for (let row = 0; row < size; row++) {
      let children = [];
      for (let col = 0; col < size; col++) {
        children.push(this.renderSquare(count++));
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
    let newBoard = [...this.state.board],
      row = Math.floor(i / size),
      col = i % size;

    console.log("handle -", i, newBoard, row, col, newBoard[row][col]);

    if (newBoard[row][col] !== null) return alert("Choose Another Box!");
    newBoard[row][col] = this.state.oneNext ? theme.one : theme.two;
    this.setState({ board: newBoard, oneNext: !this.state.oneNext });
    // if (calcWinner(row, col, newBoard[row][col], this.state.board)) {
    //   alert(`${newBoard[row][col]} WON !`);
    //   this.setState({ board: startBoard(size), oneNext: true });
    //   return;
    // }
  }

  render() {
    const status =
      "Next Player: " + (this.state.oneNext ? theme.one : theme.two);

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
    this.clearGame = this.clearGame.bind(this);
  }

  clearGame() {
    this.setState({
      board: startBoard,
      oneNext: true
    });
  }

  render() {
    return (
      <div className="gameFullDiv">
        <div className="gameHeader">
          Board Size:
          <input
            id="num-columns"
            name="size"
            type="text"
            maxlengh="2"
            placeholder="5"
            // value={this}
            onFocus={e => (e.target.placeholder = "")}
            onBlur={e => (e.target.placeholder = "5")}
          />
          <button id="startBtn">Start Game</button>
          <button id="clearBtn">Clear Game</button>
        </div>
        <div className="game">
          <div className="game-board">
            <Board clearGame={this.clearGame} />
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

// ----------------- HELPER ----------------- //
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
    if (board[row - i] && board[row + i][col - i] == player) count++;
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
