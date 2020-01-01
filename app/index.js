import React, { Component } from "react";
import { render } from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";

import "./style.css";

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
    const updatedRow = [...state.board[row]];
    updatedRow[col] = player;
    newBoard[row] = updatedRow;
    updateBoard({
      board: newBoard,
      oneNext: !state.oneNext,
      moves: `House ${player}: row ${row} col ${col}`
    });
    if (calcWinner(row, col, player, newBoard, size)) {
      alert(`House ${player} won !`);
      startGame();
    } else if (tieGame(newBoard)) {
      alert(`Tie Game !`);
      startGame();
    }
  }

  render() {
    const { size } = this.props.state;

    return (
      <div className="boardFullDiv">
        <div className="board">{this.renderBoard(size)}</div>
      </div>
    );
  }
}

// ----------------- SETTER ----------------- //
class GameSetter extends Component {
  constructor() {
    super();
    this.state = {
      size: 3,
      theme: { one: "Stark", two: "Lannister" }
    };
    this.handleSizeChange = this.handleSizeChange.bind(this);
    this.handleOneChange = this.handleOneChange.bind(this);
    this.handleTwoChange = this.handleTwoChange.bind(this);
  }

  handleSizeChange(evt) {
    const val = evt.target.value;
    if (isNaN(val)) return alert("Must input numbers !");
    this.setState({ size: Number(val) });
  }

  handleOneChange(evt) {
    const symbol = evt.target.value,
      curTwo = this.state.theme.two;
    this.setState({ theme: { one: symbol, two: curTwo } });
  }

  handleTwoChange(evt) {
    const symbol = evt.target.value,
      curOne = this.state.theme.one;
    this.setState({ theme: { one: curOne, two: symbol } });
  }

  render() {
    const { updateSetter } = this.props;

    return (
      <div className="innerGameSetter">
        <span className="setterHeader">Set Up your Game!</span>

        <div id="boardSizeDiv">
          Board Size:{" "}
          <input
            id="numCols"
            name="size"
            type="text"
            maxlengh="2"
            placeholder="3"
            onChange={this.handleSizeChange}
            onFocus={e => (e.target.placeholder = "")}
            onBlur={e => (e.target.placeholder = "3")}
          />
        </div>

        <div className="fullSelectDiv">
          <div className="indSelectDiv" id="oneSelectDiv">
            <span>House One:</span>
            <select
              value={this.state.theme.one}
              onChange={this.handleOneChange}
              id="oneSelect"
            >
              {Object.keys(logos)
                .filter(x => x !== this.state.theme.two)
                .map((logo, idx) => {
                  return <option key={idx}>{logo}</option>;
                })}
            </select>
          </div>
          <div className="indSelectDiv" id="twoSelectDiv">
            <span>House Two:</span>
            <select
              value={this.state.theme.two}
              onChange={this.handleTwoChange}
              id="twoSelect"
            >
              {Object.keys(logos)
                .filter(x => x !== this.state.theme.one)
                .map((logo, idx) => {
                  return <option key={idx}>{logo}</option>;
                })}
            </select>
          </div>
        </div>

        <div className="btnDiv">
          <button
            id="startBtn"
            className="btn"
            onClick={() =>
              updateSetter({ size: this.state.size, theme: this.state.theme })
            }
          >
            New Game
          </button>
        </div>
      </div>
    );
  }
}

// ----------------- GAME ----------------- //
class Game extends Component {
  constructor() {
    super();
    this.state = {
      size: 3,
      board: Array(3)
        .fill(null)
        .map(() => Array(3).fill(null)),
      oneNext: true,
      theme: { one: "Stark", two: "Lannister" },
      status: "",
      moves: []
    };
    this.createBoard = this.createBoard.bind(this);
    this.startGame = this.startGame.bind(this);
    this.updateBoard = this.updateBoard.bind(this);
    this.updateSetter = this.updateSetter.bind(this);
  }

  createBoard(size) {
    return Array(size)
      .fill(null)
      .map(() => Array(size).fill(null));
  }

  startGame() {
    const newBoard = this.createBoard(this.state.size);
    this.setState({
      board: newBoard,
      oneNext: true,
      moves: []
    });
  }

  updateBoard(newState) {
    this.setState({
      board: newState.board,
      oneNext: newState.oneNext,
      moves: newState.moves == [] ? [] : [...this.state.moves, newState.moves]
    });
  }

  updateSetter(newState) {
    const newBoard = this.createBoard(newState.size);
    this.setState({
      board: newBoard,
      size: newState.size,
      theme: newState.theme,
      moves: []
    });
  }

  render() {
    return (
      <div className="gameFullDiv">
        <div className="gameSetter">
          <GameSetter updateSetter={this.updateSetter} />
        </div>

        <div className="game-board">
          <Board
            state={this.state}
            startGame={this.startGame}
            updateBoard={this.updateBoard}
          />
        </div>

        <div className="game-info">
          <h3 className="trackerHeader">
            Tracker Board:{" "}
            <span className="playerOneHeader">{this.state.theme.one}</span> vs.{" "}
            <span className="playerTwoHeader">{this.state.theme.two}</span>
          </h3>
          <h4>
            Waiting on House{" "}
            {this.state.oneNext ? this.state.theme.one : this.state.theme.two}!
          </h4>
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

// ----------------- RENDER TO HTML ----------------- //
render(
  <Router>
    <Game />
  </Router>,
  document.getElementById("app")
);
