import React, { Component } from "react";
import { render } from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";

import "./style.css";

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
      squares: Array(9).fill(null),
      xNext: true
    };
    this.renderSquare = this.renderSquare.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  renderSquare(i) {
    return (
      <Square
        status={this.state.squares[i]}
        onClick={() => this.handleClick(i)}
      />
    );
  }

  handleClick(i) {
    const update = [...this.state.squares];
    if (update[i] !== null) return alert("Choose Another Box!");
    update[i] = this.state.xNext ? "X" : "O";
    this.setState({ squares: update, xNext: !this.state.xNext });
  }

  render() {
    const winner = calcWinner(this.state.squares, this.state.xNext);
    const status = "Next Player: " + (this.state.xNext ? "X" : "O");

    return (
      <div>
        <div className="status">{status}</div>
        <div className="boardrow row1">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>

        <div className="boardrow row2">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>

        <div className="boardrow row3">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

// ----------------- GAME ----------------- //
class Game extends Component {
  render() {
    return (
      <div className="gameFullDiv">
        <h2>Status: </h2>
        <div className="game">
          <div className="game-board">
            <Board />
          </div>
          <div className="game-info">
            <div></div>
            <ol></ol>
          </div>
        </div>
      </div>
    );
  }
}

// ----------------- HELPER ----------------- //
function calcWinner(square, xNext) {}

// ----------------- RENDER TO HTML ----------------- //
render(
  <Router>
    <Game />
  </Router>,
  document.getElementById("app")
);
