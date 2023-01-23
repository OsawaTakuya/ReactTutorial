import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import SortButton from './SortButton';





function Square(props) {
  const className = props.isHighLight ? 'square high-light' : 'square';
  return (
    <button className={className} onClick={props.onClick}>
      {props.value}
    </button>
  );
}


//================================================================
//================================================================


class Board extends React.Component {

  includesValue = (arr, val) => {
    for (let v of arr) {
      if (v === val) return true;
    }
    return false;
  };

  renderSquare(i, isHighLight) {
    return <
      Square
      key={i}
      value={this.props.squares[i]}
      isHighLight={isHighLight}
      onClick={() => { this.props.onClick(i) }}
    />;
  }


  render() {


    return (
      <div>
        {
          Array(3).fill(0).map((v, i) => {
            return (
              <div className="board-row" key={i}>
                {
                  Array(3).fill(0).map((v, j) => {
                    const index = i * 3 + j;
                    const winLine = this.props.winLine;
                    let isHighLight;

                    if (winLine) {
                      isHighLight = this.includesValue(winLine, index);
                    } else {
                      isHighLight = false;
                    }

                    return this.renderSquare(index, isHighLight);
                  })
                }
              </div>
            )
          })
        }
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        place: 0,
      }],
      xIsNext: true,
      stepNumber: 0,
      asc: true,
    }
    this.setAscState = this.setAscState.bind(this);
  }

  setAscState(b) {
    this.setState({
      asc: b
    });
  }



  hundleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = [...current.squares];
    const [win] = calculateWinner(squares);

    if (win || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'x' : 'o';
    this.setState({
      history: history.concat([{
        squares: squares,
        place: i,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const [win, winLine, isDraw] = calculateWinner(current.squares);
    let moves = history.map((step, move) => {
      const col = Math.floor(step.place / 3) + 1;
      const row = step.place % 3 + 1;
      const desc = move ?
        `Go to move #${move} | player:${move % 2 === 1 ? 'x' : 'o'} put on (${col},${row})` : 'Go to game start';

      return (
        <li key={move} >
          <button className={this.state.stepNumber === move ? 'selected' : ''} onClick={() => { this.jumpTo(move) }}>{desc}</button>
        </li>
      );


    })


    if (!this.state.asc) { moves = [...moves.reverse()] };

    let status;
    if (win) {
      status = `Winner: ${win}`;
    } else if (isDraw) {
      status = 'Draw';
    } else {
      status = `【${isDraw}】Next player is ${this.state.xIsNext ? 'x' : 'o'}`;
    }




    return (
      <div>
        <div className='sort-button'>
          <p>Sort game history</p>

          {/* <SortButton hundleSortClick={this.setAscState} /> */}
          <div className='sort-button'>
            <button onClick={() => { this.setState({ asc: !this.state.asc }) }}>昇順/降順</button>
          </div>

        </div>
        <hr></hr>


        <div className="game">
          <div className="game-board">
            <p>Selected at {this.state.stepNumber}</p>
            <Board
              squares={current.squares}
              onClick={(i) => { this.hundleClick(i) }}
              winLine={winLine}
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol className="game-history">{moves}</ol>
          </div>
        </div>
      </div>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

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
      return [
        squares[a],
        [a, b, c],
        false,
      ];
    }
  }
  const isAllSquaresfilled = squares.filter(value => value !== null).length === squares.length;
  return [null, null, isAllSquaresfilled];
}

