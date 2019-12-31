import React, { Component } from "react";
import { render } from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";

import "./style.css";

// ----------------- VARIABLE ----------------- //
const logos = {
  Stark: `https://www.freelogoservices.com/blog/wp-content/uploads/House_Stark.svg_.png`,
  Lannister: `https://www.freelogoservices.com/blog/wp-content/uploads/House_Lannister.svg_.png`,
  Arryn: `https://www.freelogoservices.com/blog/wp-content/uploads/House_Arryn.svg-1.png`,
  Tyrell: `https://www.freelogoservices.com/blog/wp-content/uploads/House_Tyrell.svg_.png`,
  Greyjoy: `https://www.freelogoservices.com/blog/wp-content/uploads/House_Greyjoy.svg_.png`,
  Martell: `https://www.freelogoservices.com/blog/wp-content/uploads/House_Martell.svg_.png`,
  Baratheon: `https://www.freelogoservices.com/blog/wp-content/uploads/House_Baratheon.svg_.png`,
  Tully: `https://awoiaf.westeros.org/thumb.php?f=House_Tully.svg&width=545&lang=en`,
  Targaryen: `https://www.freelogoservices.com/blog/wp-content/uploads/House_Targaryen.svg_.png`
};

// ----------------- SQUARE ----------------- //
const Square = props => {
  return (
    <button
      className={`square ${props.status}`}
      onClick={props.onClick}
      style={{
        backgroundImage: `url(${logos[props.status]})`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "contain"
      }}
    />
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
    if (calcWinner(row, col, player, state.board, size)) {
      alert(`House ${player} won !`);
      startGame();
    } else if (tieGame(state.board)) {
      alert(`Tie Game !`);
      startGame();
    }
  }

  render() {
    const { state, size } = this.props;
    const status =
      "Next Player: " + (state.oneNext ? state.theme.one : state.theme.two);

    return (
      <div className="boardFullDiv">
        <div className="board">{this.renderBoard(size)}</div>
      </div>
    );
  }
}

// ----------------- GAME ----------------- //
class Game extends Component {
  constructor() {
    super();
    this.players = { one: "Stark", two: "Lannister" };
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
    this.sizeValue = this.sizeValue.bind(this);
    this.moveTracker = this.moveTracker.bind(this);
  }

  sizeValue() {
    const input = document.getElementById("numCols");
    return !input || !input.value ? 3 : Number(input.value);
  }

  handleOneChange(evt) {
    const symbol = evt.target.value;
    if (symbol === this.players.two) return alert("Can't choose same House!");
    else this.players = { one: symbol, two: this.players.two };
  }

  handleTwoChange(evt) {
    const symbol = evt.target.value;
    if (symbol === this.players.one) return alert("Can't choose same House!");
    else this.players = { one: this.players.one, two: symbol };
  }

  startGame() {
    const size = this.sizeValue();
    const newBoard = Array(size)
      .fill(null)
      .map(() => Array(size).fill(null));
    this.setState({
      board: newBoard,
      oneNext: true,
      theme: this.players,
      moves: []
    });
    return newBoard;
  }

  updateBoard(newState) {
    this.setState({
      board: newState.board,
      oneNext: newState.oneNext,
      moves: newState.moves == [] ? [] : [...this.state.moves, newState.moves]
    });
  }

  moveTracker() {
    return (
      <ol>
        {this.state.moves.map((move, idx) => {
          return <li key={idx}>{move}</li>;
        })}
      </ol>
    );
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
          <div className="fullSelectDiv">
            <div className="indSelectDiv" id="oneSelectDiv">
              <span>Player One: </span>
              <select onChange={this.handleOneChange} id="oneSelect">
                <option>Stark</option>
                <option>Lannister</option>
                <option>Arryn</option>
                <option>Tyrell</option>
                <option>Greyjoy</option>
                <option>Martell</option>
                <option>Baratheon</option>
                <option>Tully</option>
                <option>Targaryen</option>
              </select>
            </div>
            <div className="indSelectDiv" id="twoSelectDiv">
              <span>Player Two: </span>
              <select onChange={this.handleTwoChange} id="twoSelect">
                <option>Lannister</option>
                <option>Stark</option>
                <option>Arryn</option>
                <option>Tyrell</option>
                <option>Greyjoy</option>
                <option>Martell</option>
                <option>Baratheon</option>
                <option>Tully</option>
                <option>Targaryen</option>
              </select>
            </div>
          </div>
          <div className="btnDiv">
            <button id="startBtn" className="btn" onClick={this.startGame}>
              New Game
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
            <span className="playerOneHeader">{this.players.one}</span> vs.{" "}
            <span className="playerTwoHeader">{this.players.two}</span>
          </h3>
          <h4>
            Waiting on House{" "}
            {this.state.oneNext ? this.players.one : this.players.two}!
          </h4>
          {this.moveTracker()}
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
