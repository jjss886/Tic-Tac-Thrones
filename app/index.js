import React, { Component } from "react";
import { render } from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";

import "./style.css";

// ----------------- SQUARE ----------------- //
const Square = props => {
  return (
    <button className="square" onClick={props.onClick}>
      <span className="squareText">{props.status}</span>
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

  renderBoard(size, count = 0, table = []) {
    for (let row = 0; row < size; row++) {
      let children = [];
      for (let col = 0; col < size; col++) {
        children.push(this.renderSquare(count++, size));
      }
      table.push(
        <div className={`boardrow row-${row}`} key={row}>
          {children}
        </div>
      );
    }
    return table;
  }

  renderSquare(i, size) {
    let row = Math.floor(i / size),
      col = i % size;
    return (
      <Square
        key={i}
        status={this.props.state.board[row][col]}
        onClick={() => this.handleClick(i, size)}
      />
    );
  }

  handleClick(i, size) {
    const { state, updateBoard, startGame } = this.props;
    let newBoard = [...state.board],
      row = Math.floor(i / size),
      col = i % size,
      player = state.oneNext ? state.theme.one : state.theme.two;

    if (newBoard[row][col] !== null) return alert("Choose Another Box!");
    newBoard[row][col] = player;
    updateBoard({
      board: newBoard,
      oneNext: !state.oneNext,
      moves: `House ${player}: row ${row} col ${col}`
    });
    if (calcWinner(row, col, newBoard[row][col], state.board, size)) {
      alert(`${newBoard[row][col]} WON !`);
      updateBoard({ board: startGame(), oneNext: true, moves: [] });
    }
    if (tieGame(state.board)) {
      alert(`TIE GAME !`);
      updateBoard({ board: startGame(), oneNext: true, moves: [] });
    }
  }

  render() {
    const { state, size } = this.props;
    const status =
      "Next Player: " + (state.oneNext ? state.theme.one : state.theme.two);

    return (
      <div className="boardFullDiv">
        <h3 className="status">{status}</h3>
        <div className="board">{this.renderBoard(size)}</div>
      </div>
    );
  }
}

// ----------------- GAME ----------------- //
class Game extends Component {
  constructor() {
    super();
    this.players = { one: "X", two: "O" };
    this.state = {
      board: Array(3)
        .fill(null)
        .map(() => Array(3).fill(null)),
      oneNext: true,
      theme: this.players,
      status: "",
      moves: []
    };
    this.startGame = this.startGame.bind(this);
    this.handleOneChange = this.handleOneChange.bind(this);
    this.handleTwoChange = this.handleTwoChange.bind(this);
    this.updateBoard = this.updateBoard.bind(this);
    this.clearGame = this.clearGame.bind(this);
    this.sizeValue = this.sizeValue.bind(this);
  }

  sizeValue() {
    const input = document.getElementById("numCols");
    return !input || !input.value ? 3 : Number(input.value);
  }

  handleOneChange(evt) {
    const symbol = evt.target.value;
    if (symbol === this.players.two) return alert("Choose another house!");
    this.players = { one: symbol, two: this.players.two };
  }

  handleTwoChange(evt) {
    const symbol = evt.target.value;
    if (symbol === this.players.one) return alert("Choose another house!");
    this.players = { one: this.players.one, two: symbol };
  }

  startGame() {
    const size = this.sizeValue();
    const newBoard = Array(size)
      .fill(null)
      .map(() => Array(size).fill(null));
    this.setState({ board: newBoard, theme: this.players });
    return newBoard;
  }

  updateBoard(newState) {
    this.setState({
      board: newState.board,
      oneNext: newState.oneNext,
      moves: [...this.state.moves, newState.moves]
    });
  }

  clearGame() {
    this.setState({
      board: this.startGame(),
      oneNext: true
    });
  }

  render() {
    return (
      <div className="gameFullDiv">
        <div className="gameSetter">
          <span className="setterHeader">Set Up your Game!</span>
          <div id="boardSizeDiv">
            Board Size:{" "}
            <input
              id="numCols"
              name="size"
              type="text"
              maxlengh="2"
              placeholder="3"
              onFocus={e => (e.target.placeholder = "")}
              onBlur={e => (e.target.placeholder = "3")}
            />
          </div>
          <div id="oneSelectDiv">
            Player One:{" "}
            <select onChange={this.handleOneChange} id="oneSelect">
              <option>X</option>
              <option>A</option>
              <option>B</option>
              <option>C</option>
              <option>D</option>
            </select>
          </div>
          <div id="twoSelectDiv">
            Player Two:{" "}
            <select onChange={this.handleTwoChange} id="twoSelect">
              <option>O</option>
              <option>A</option>
              <option>B</option>
              <option>C</option>
              <option>D</option>
            </select>
          </div>
          <div className="btnDiv">
            <button id="startBtn" className="btn" onClick={this.startGame}>
              New Game
            </button>
            <button id="clearBtn" className="btn" onClick={this.clearGame}>
              Clear Game
            </button>
          </div>
        </div>

        <div className="game-board">
          <Board
            state={this.state}
            startGame={this.startGame}
            updateBoard={this.updateBoard}
            size={this.sizeValue()}
          />
        </div>

        <div className="game-info">
          <h3 className="trackerHeader">
            Tracker Board:{" "}
            <span className="playerHeader">
              {this.players.one} vs. {this.players.two}
            </span>
          </h3>
          <h5>Status: {this.state.status}</h5>
          <ol>
            {this.state.moves.map((move, idx) => {
              return <li key={idx}>{move}</li>;
            })}
          </ol>
        </div>
      </div>
    );
  }
}

// ----------------- HELPER FUNCTIONS ----------------- //
function calcWinner(row, col, player, board, size) {
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

function tieGame(board) {
  let flattenBoard = [].concat.apply([], board);
  return !flattenBoard.includes(null);
}

// ----------------- RENDER TO HTML ----------------- //
render(
  <Router>
    <Game />
  </Router>,
  document.getElementById("app")
);
