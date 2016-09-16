/*  LOGIC RULES
*   1   Any live cell with fewer than two live neighbours dies, as if caused by under-population.
*   2   Any live cell with two or three live neighbours lives on to the next generation.
*   3   Any live cell with more than three live neighbours dies, as if by over-population.
*   4   Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
*/


var gameSize = [80, 140];
var density = 0.15;          //min: 0, max: 1; .35 = ~35% of board populated at start
var isLive = false;

//Possibly make game more complex than original? THEN seperate into multiple React classes!
var Game = React.createClass({
  getInitialState() {
    //build the board, asign starting roles
    var grid = [];
    for (var i = 0; i < gameSize[0]; i++) {
      var row = [];
      for (var j = 0; j < gameSize[1]; j++)
        row.push(Math.random() < density);
      grid.push(row);
    }
    return {game: grid, time: 100, gen: 0};
  },
  cellLives(a, b) {
    var count = 0;
    var own_c = this.state.game[a][b];
    for (var i = -1; i <= 1; i++)
      for (var j = -1; j <= 1; j++)
        if ((a + i) >= 0 && (a + i) < gameSize[0] && (b + j) >= 0 && (b + j) < gameSize[1] && !(i == 0 && j == 0))
          if (this.state.game[a+i][b+j])
            count++;
    return count === 3 || (own_c && count === 2);
  },
  nextGen() {
    var ret = [];
    for (var i = 0; i < gameSize[0]; i++) {
      ret.push([]);
      for (var j = 0; j < gameSize[1]; j++)
        ret[i].push(this.cellLives(i, j));
    }
    
    return ret;
  },
  setTime(v) {
    var t = this;
    return () => t.setState({time: v});
  },
  clearGame() {
    isLive = false;
    var grid = [];
    for (var i = 0; i < gameSize[0]; i++) {
      var row = [];
      for (var j = 0; j < gameSize[1]; j++)
        row.push(false);
      grid.push(row);
    }
    this.setState({game: grid, gen: 0});
  },
  setInterval() {
    if (isLive) {
        clearTimeout(this.interval);
        this.interval = false;
        isLive = false;        
    } else {
        isLive = true;
        if (this.interval) clearInterval();
        var t = this;
        var timeout = function() {
            t.interval = setTimeout(timeout, t.state.time);
            t.setState({game: t.nextGen(), gen: t.state.gen + 1});
        };
    this.interval = setTimeout(timeout, this.state.time);
    }
  },
  componentDidMount() {
    console.log('componentDidMount');
    this.setInterval();
  },
  componentWillUnmount() {
    console.log('componentWillUnmount');
    this.clearInterval();
  },
  toggleCell(i, j) {
    var grid = this;
    return function() {
      var temp = [];
      for (var k = 0; k < gameSize[0]; k++)
        temp.push(grid.state.game[k].slice(0));
      temp[i][j] = !temp[i][j];
      grid.setState({game: temp});
    };
  },
    
    /*
    * Finally manipulating the DOM.
    */
    
  render() {
    return (
      <div className='gameContainer'>
        <h1>Game of Life</h1>
        <div className='game'>
          {
            this.state.game.map( (row, i) => 
              <div className='liveboard'>
                {
                  row.map( (cell, j) => <div onMouseDown={this.toggleCell(i, j)} className={'cell ' + (this.state.game[i][j] ? 'old' : '')}></div> )
                }
              </div>
          )}
        </div>
        
        <div className='buttons'>
          <div className='btn-group'>
            <button className='btn btn-success' onClick={this.setTime(500)}>Slow</button>
            <button className='btn btn-primary' onClick={this.setTime(100)}>Normal</button>
          </div>
            
            <h4>Generation {this.state.gen}</h4>
            
          <div className='btn-group'>
            <button className='btn btn-success' onClick={this.setInterval}>Play/Pause</button>
            <button className='btn btn-danger' onClick={this.clearGame}>Clear</button>
          </div>
        </div>
      </div>
    );
  }
});

ReactDOM.render(<Game/>, document.querySelector('.content'));
