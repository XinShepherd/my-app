import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button
      className="square"
      onClick={() => props.onClick()}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {

  renderSquare(i) {
    const line = this.props.line;
    let value = this.props.squares[i];
    // 5. 每当有人获胜时，高亮显示连成一线的 3 颗棋子。
    if (line && line.includes(i)) {
      value = <mark>{value}</mark>;
    }
    return (
      <Square
        key={i}
        value={value}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    let index = 0;
    const result = [];
    // 3. 使用两个循环来渲染出棋盘的格子，而不是在代码里写死（hardcode）。
    for (let i = 0; i < 3; i++) {
      const squareElements = [];
      for (let j = 0; j < 3; j++) {
        squareElements.push(this.renderSquare(index));
        index++;
      }
      result.push(<div key={index} className="board-row">{squareElements}</div>);
    }
    return <div>{result}</div>;
  }
}

class Game extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      history: [{
        squares: Array(9).fill(null)
      }],
      stepNumber: 0,
      xIsNext: true,
      asc: true,
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares).length || squares[i]) {
      return;
    }
    const xIsNext = this.state.xIsNext;
    squares[i] = xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        location: i,
      }]),
      stepNumber: history.length,
      xIsNext: !xIsNext,
    })
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    })
  }

  render() {
    let history = this.state.history.slice();
    const current = history[this.state.stepNumber];
    const [winner, line] = calculateWinner(current.squares);
    if (!this.state.asc) {
      // 4. 添加一个可以升序或降序显示历史记录的按钮。
      history = history.reverse();
    }
    // 历史列表
    const moves = history.map((step, move) => {
      if (!this.state.asc) {
        move = history.length - 1 - move;
      }
      // 1. 在游戏历史记录列表显示每一步棋的坐标，格式为 (列号, 行号)。
      const x = move ? Math.floor(step.location / 3) : -1;
      const y = move ? step.location % 3 : -1;
      let desc = move ?
        `Go to move #${move} (${x}, ${y})`:
        'Go to game start';
      if (this.state.stepNumber === move) {
        // 2. 在历史记录列表中加粗显示当前选择的项目。
        desc = <b>{desc}</b>
      }
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else if (this.state.stepNumber === 9){
      status = 'No Winner.'; // 6. 当无人获胜时，显示一个平局的消息。
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            line={line}
          />
        </div>
        <div className="game-info">
          <div>{status} <button onClick={() => this.setState({asc: !this.state.asc})}>{this.state.asc ? "升序" : "降序"}</button></div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game/>,
  document.getElementById('root')
);

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
      return [squares[a], lines[i]];
    }
  }
  return [];
}
