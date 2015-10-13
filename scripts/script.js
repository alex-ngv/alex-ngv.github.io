window.onload = function () {

//This script will run TIC TAC TOE in your browser.

// CELL FACTORY Start
// This is a factory for creating cells. Each cell comes with an cellId, smallId which is the ID without the 'id'; playState which is used to check if the cell can be played.
//the function on the cell are:
//setPiece - checks play state and currentPlayer and then change the innerHTML of the cell to accomodate the player. Also if player is 'X', i change the cell class to give it a different color. Also, changes the value of the next player box.
var CellFactory = function(i){
    this.id = 'id'+i;
    this.player = null;
    this.smallId = i;
    this.playState=0;
};
CellFactory.prototype.setPiece = function(currentPlayer) {
  if (this.playState === 0 && currentPlayer % 2 === 0) {
    document.getElementById(this.id).innerHTML = 'O';
    this.player = currentPlayer;
    document.getElementById('id10').innerHTML = 'X';
    document.getElementById(this.id).className.replace( /(?:^|\s)MyClass(?!\S)/g , '' );
    document.getElementById(this.id).className = 'cell2';}
  else if (this.playState === 0 && currentPlayer % 2 !== 0) {
    document.getElementById(this.id).innerHTML = 'X';
    this.player = currentPlayer;
    document.getElementById('id10').innerHTML = 'O';};
  this.playState=1;
  };
// CELL FACTORY end
//Board Facotory creates the board for the game. It houses all of cells and the value of the currentPlayer
//Board Factory functions are:
//makePlay - runs the setPiece cell function on selected cell.
//CheckWinner - checks for the winner and clears the board. If no winners is found the board is also cleared
// BOARD FACTORY Start
var BoardFactory = function(){
  this.cells = [];
  this.winner = 0;
  this.currentPlayer = 0;
}
BoardFactory.prototype.makePlay = function(cellId) {
  if (this.cells[cellId].playState === 0){
  this.cells[cellId].setPiece(this.currentPlayer)
  this.currentPlayer+=1
} if (this.currentPlayer > 1) (
  this.currentPlayer=0
)
};
BoardFactory.prototype.checkWinner = function(){
  var result = [];
  var winning = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  for (var i in winning) {
    result.push([this.cells[winning[i][0]].player,this.cells[winning[i][1]].player,this.cells[winning[i][2]].player])
  }
  for (var i in result) {
    if (result[i][0] !== null && result[i][0] === result[i][1] && result[i][1]===result[i][2]){
      alert('Winner')
      clearBoard();
      for (var i in this.cells) {
        this.cells[i].playState=0;
        this.cells[i].player=null;
        document.getElementById(this.cells[i].id).className.replace( /(?:^|\s)MyClass(?!\S)/g , '' );
        document.getElementById(this.cells[i].id).className = 'cell';
      }
    }
  }
  var counter = 0
  for (var i in this.cells){
    if (this.cells[i].player !== null){
      counter+=1
    }
    if (counter === 9){
      alert('No Winner')
      clearBoard();
      for (var i in this.cells) {
        this.cells[i].playState=0;
        this.cells[i].player=null;
        document.getElementById(this.cells[i].id).className.replace( /(?:^|\s)MyClass(?!\S)/g , '' );
        document.getElementById(this.cells[i].id).className = 'cell';
      }

    }
  }
}
//    result << [strArr[winning[i][0]],strArr[winning[i][1]],strArr[winning[i][2]]]

// BOARD FACTORY End
//Game houses the Board.
//startGame function creates the board.
//THE GAME Start
var TheGame = function (){
  this.board = new BoardFactory()
}
TheGame.prototype.startGame = function (){
  for (var row = 1; row < 10; row++) {
    var cell = document.createElement('div');
    cell.classList.add('cell');
    cell.id = 'id'+row;
    cell.addEventListener("click", myFunction)
    container.appendChild(cell);
    this.board.cells.push(new CellFactory(row));
  } var playerBox = document.createElement('div')
    playerBox.classList.add('cell')
    body.appendChild(playerBox)
    playerBox.id='id10'
    playerBox.innerHTML='O'
}
//THE GAME End
//crear board function
var clearBoard = function() {
  for (var i = 1; i < 10; i++) {
    var cellId = 'id' + i
    document.getElementById(cellId).innerHTML = ''
  }
}
//the click function of the cell
function myFunction() {
    var thisEvent =  event.target.id;
    var thisEventNum = parseInt(thisEvent.split('id')[1])-1;
    newGame.board.makePlay(thisEventNum);
    newGame.board.checkWinner();
};
//creates a new game.
var newGame = new TheGame();

//general variables for the page.
var container = document.getElementById('container');
var startGameButton = document.getElementById('game');
var playerBox = document.getElementById('id10');
var body = document.body;
var isGame = 0;
var newGame = new TheGame()
//starts the game.
startGameButton.addEventListener('click', function() {
    if (isGame === 0) {
      newGame.startGame()
      }
  isGame = 1;
  container.className =
   container.className.replace( /(?:^|\s)MyClass(?!\S)/g , '' );
  container.className = 'container';
})


  console.log('hello')
};
