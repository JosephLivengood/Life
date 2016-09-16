/*  LOGIC RULES
*   1   Any live cell with fewer than two live neighbours dies, as if caused by under-population.
*   2   Any live cell with two or three live neighbours lives on to the next generation.
*   3   Any live cell with more than three live neighbours dies, as if by over-population.
*   4   Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
*/

'use strict';

var gameSize = [60, 60];
var density = 0.35; //min: 0, max: 1; .35 = ~35% of board populated at start

//Possibly make game more complex than original? THEN seperate into multiple React classes!
var Game = React.createClass({
  displayName: 'Game',

  getInitialState: function getInitialState() {
    //build the board, asign starting roles
    var grid = [];
    for (var i = 0; i < gameSize[0]; i++) {
      var row = [];
      for (var j = 0; j < gameSize[1]; j++) row.push(Math.random() < density);
      grid.push(row);
    }
    return { game: grid, time: 100, gen: 0 };
  },
  cellLives: function cellLives(a, b) {
    var count = 0;
    var own_c = this.state.game[a][b];
    for (var i = -1; i <= 1; i++) for (var j = -1; j <= 1; j++) if (a + i >= 0 && a + i < gameSize[0] && b + j >= 0 && b + j < gameSize[1] && !(i == 0 && j == 0)) if (this.state.game[a + i][b + j]) count++;
    return count === 3 || own_c && count === 2;
  },
  nextGen: function nextGen() {
    var ret = [];
    for (var i = 0; i < gameSize[0]; i++) {
      ret.push([]);
      for (var j = 0; j < gameSize[1]; j++) ret[i].push(this.cellLives(i, j));
    }

    return ret;
  },
  setTime: function setTime(v) {
    var t = this;
    return function () {
      return t.setState({ time: v });
    };
  },
  clearGame: function clearGame() {
    var grid = [];
    for (var i = 0; i < gameSize[0]; i++) {
      var row = [];
      for (var j = 0; j < gameSize[1]; j++) row.push(false);
      grid.push(row);
    }

    this.setState({ game: grid, gen: 0 });
  },
  setInterval: function setInterval() {
    if (this.interval) clearInterval();
    var t = this;
    var timeout = function timeout() {
      t.interval = setTimeout(timeout, t.state.time);
      t.setState({ game: t.nextGen(), gen: t.state.gen + 1 });
    };
    this.interval = setTimeout(timeout, this.state.time);
  },
  clearInterval: function clearInterval() {
    clearTimeout(this.interval);
    console.log('cleared');
    this.interval = false;
  },
  componentDidMount: function componentDidMount() {
    console.log('componentDidMount');
    this.setInterval();
  },
  componentWillUnmount: function componentWillUnmount() {
    console.log('componentWillUnmount');
    this.clearInterval();
  },
  toggleCell: function toggleCell(i, j) {
    var grid = this;
    return function () {
      var temp = [];
      for (var k = 0; k < gameSize[0]; k++) temp.push(grid.state.game[k].slice(0));
      temp[i][j] = !temp[i][j];
      grid.setState({ game: temp });
    };
  },

  /*
  * Finally manipulating the DOM.
  */

  render: function render() {
    var _this = this;

    return React.createElement(
      'div',
      { className: 'gameContainer' },
      React.createElement(
        'h1',
        null,
        'Game of Life'
      ),
      React.createElement(
        'h4',
        null,
        'Generation ',
        this.state.gen
      ),
      React.createElement(
        'div',
        { className: 'game' },
        this.state.game.map(function (row, i) {
          return React.createElement(
            'div',
            { className: 'liveboard' },
            row.map(function (cell, j) {
              return React.createElement('div', { onMouseDown: _this.toggleCell(i, j), className: 'cell ' + (_this.state.game[i][j] ? 'old' : '') });
            })
          );
        })
      ),
      React.createElement(
        'div',
        { className: 'buttons' },
        React.createElement(
          'div',
          { className: 'btn-group' },
          React.createElement(
            'button',
            { className: 'btn btn-success', onClick: this.setTime(500) },
            'Slow'
          ),
          React.createElement(
            'button',
            { className: 'btn btn-success', onClick: this.setTime(200) },
            'Mild'
          ),
          React.createElement(
            'button',
            { className: 'btn btn-success', onClick: this.setTime(100) },
            'Fast'
          )
        ),
        React.createElement(
          'div',
          { className: 'btn-group' },
          React.createElement(
            'button',
            { className: 'btn btn-success', onClick: this.setInterval },
            'Start'
          ),
          React.createElement(
            'button',
            { className: 'btn btn-success', onClick: this.clearInterval },
            'Stop'
          ),
          React.createElement(
            'button',
            { className: 'btn btn-success', onClick: this.clearGame },
            'Clear'
          )
        )
      )
    );
  }
});

ReactDOM.render(React.createElement(Game, null), document.querySelector('.content'));