//Dollars and Cents
//BY ALEXANDER NAGAEV @anagaev@gmail.com
//Here I load the window and define the first function, the one that gets a random number for the game.

$(document).ready(function(){

var $setNextNumber = function(){
   var $nextNumber = Math.floor(Math.random()*8+1);
   if ($nextNumber === 8){
      $nextNumber = '$' //One can make the game more difficult by increasing the number that is generated, so that there is more of a chance of getting the dreaded Dollar.
   }
  return $nextNumber
}

// This animates the help screen.
$('.help').hide()
$( ".how" ).hover(
  function() {
    $(".help").show();
    $('.help').animate({
      width: '400px'
    })
  },
  function(){
    $('.help').animate({
      width: '0px'
    })
    setTimeout(
      function(){
        $(".help").hide();
      }, 500
    );
  }
);

//Here I define the global variables.

var $startButton = $('.myButton') //GameStart button.
var $moves = $('.moves, .moves_min') //div that shows how many moves are left until the next level
var $level=$('.level') // div that shows the level of the game
var $combo=$('.combo') //div that shows the comboCounter
var $containerDivs = $('.container div'); //the game board divs
var $nextNumberCell = $('.nextmove, .nextmove_min'); //the div that shows what the next piece that drops will be
var counterDiv = $('.points, .points_min');//the div that displays points
var pointsCounter = 0;//points counter
var rCounter=0; //counter to check if the recursion is needed
var depthCounter=1; //counter of the depth of the recursion
var level=1;//level variable
var moves = 0;//moves variable
var gameState = 1;//used to counter double clicking
var firstMove = 0;//used to reset points
//this function runs the game start function when the game start button is clicked
  $startButton.click(function(){
    gameStart()
  });

  // this shows the next move to appear on the board on hover, and plays the game when is clicked
  $containerDivs.hover(
    function(){
      if (gameState===0) {
        return;
      }
      var classes = $(this).attr('class').split(/\s+/);
      if ($('div.container div.r0.' + classes[1]).css("background-color") !== "rgb(255, 250, 250)"){
        gameState=1;
        return;
      }
      $('div.container div.r0.' + classes[1]).text($nextNumber)
    },
    function(){
      if (gameState===0) {
        return;
      }
      var classes = $(this).attr('class').split(/\s+/);
      if ($('div.container div.r0.' + classes[1]).css("background-color") !== "rgb(255, 250, 250)"){
        gameState=1;
        return;
      }
      $('div.container div.r0.' + classes[1]).text(" ")
    }).click(function(){
      if (gameState===0) {
        return;
      }
      gameState = 0;
      rCounter = 0; //resets the recurtion counter
      depthCounter = 1; //resets the depth counter
      //this variable and function selects the top cell in a column and places the game piece there.
      var classes = $(this).attr('class').split(/\s+/);
      if ($('div.container div.r0.' + classes[1]).css("background-color") !== "rgb(255, 250, 250)"){
        gameState=1;
        return;
      }
      $('div.container div.r0.' + classes[1]).text($nextNumber);
      //this is where the game functions begin
      moves-=1;//decreses the moves by one
      part1()
      //and end...
      //here I set the next move and update display divs.
      $moves.text('Moves - '+ pad10(moves));
      $level.text('Level - '+pad10(level));
      $nextNumber=$setNextNumber();
      $nextNumberCell.text('Next - '+$nextNumber);
      $combo.text('Combo - 00');
    })


//this function checks every game piece on the board and assigns a color.
var addColor = function(){
  for (var i =0; i <rowBoard.length; i++){
    for (var j = 0; j<rowBoard.length; j++){
      if ($('.c'+i+'.r'+j).text()==='1'){
        $('.c'+i+'.r'+j).css("background-color", "#81BEF7")
      }
      if ($('.c'+i+'.r'+j).text()==='2'){
        $('.c'+i+'.r'+j).css("background-color", "#F6CEEC")
      }
      if ($('.c'+i+'.r'+j).text()==='3'){
        $('.c'+i+'.r'+j).css("background-color", "#AC58FA")
      }
      if ($('.c'+i+'.r'+j).text()==='4'){
        $('.c'+i+'.r'+j).css("background-color", "#D7DF01")
      }
      if ($('.c'+i+'.r'+j).text()==='5'){
        $('.c'+i+'.r'+j).css("background-color", "#F78181")
      }
      if ($('.c'+i+'.r'+j).text()==='6'){
        $('.c'+i+'.r'+j).css("background-color", "#58D3F7")
      }
      if ($('.c'+i+'.r'+j).text()==='7'){
        $('.c'+i+'.r'+j).css("background-color", "gold")
      }
      if ($('.c'+i+'.r'+j).text()===' '){
        $('.c'+i+'.r'+j).css("background-color", "snow")
      }
      if ($('.c'+i+'.r'+j).text()==='$'){
        $('.c'+i+'.r'+j).css("background-color", "silver")
      }
      if ($('.c'+i+'.r'+j).text()==='¢'){
        $('.c'+i+'.r'+j).css("background-color", "sienna")
      }
    }
  }
}



//this runs all the functions which run the game.
var part1 = function(){
  gameState=0
  depthCounter+=1//depth +=1
  getBoard();//gets the game board from the html divs.
  pushAllDown();//pushes the piece that was placed on the board down to the nearest available space.
  //this levels up the game.
  if (moves === 0) {
    if (outtaMoves()==='Game Over'){return}
  }
  pushBoard();//pushes the game board to the divs.
  getBoard();//gets the board.
  createLengths();//create the lengs of rows and columns of the pieces.
  animateMatches(); //animates the game pieces
  //Sets delay so that animations can finish if its the first time running part2(), or just runs them if setTimeout is set.
  if (rCounter>0){
    setTimeout(part2,400);
  } else part2();
}
//this is part 2 of the game function. I don't remember why I have it, but it's most likely here for a reason. Maybe...
var part2 = function(){
   gameState=0
   deleteMatches();//This function matches game pieces to the lengths of the rows and columns that they reside in. And deltes them.
   turnToCents();//this function pops Dollars and Cents based on the proximity of deletions.
   pushBoard();//pushing the board to the player
   getBoard();//getting the board again.
   pushAllDown();//pushing everyting down.
   counterDiv.text('Score - '+ pad100(pointsCounter));//updaing the score board. Why not.
   pushBoard();//pushing the board after pushing everything down.
   //re-running part1() if changes were made to the board or clearing the interval for part2().
   if (rCounter>0){
     part1()
   }else clearInterval(part2);
 }
 function pad10(n) {
     return (n < 10) ? ("0" + n) : n;
 }
 function pad100(n) {
    return (n > 100) ? (n) : ((n < 10) ? ("00" + n) : ("0"+n));
}
//start game functions.
var gameStart = function(){
  if (moves!==0){
    return}
  else{
    clearBoard();
    $nextNumber = $setNextNumber(); // Creates the next number that will drop.
    var randomPieces = Math.floor(Math.random()*8+8)//sets how many random pieces will be put on the board.
    getBoard();//gets the fresh board.
    moves=16;
    //assign random pieces
    for (var i=0; i<=randomPieces; i++){
      columnBoard[Math.floor(Math.random()*6+1)][Math.floor(Math.random()*6+1)]=Math.floor(Math.random()*6+1);
    }
    pushBoard();//push the board to the player.
    part1(); //and run the game on the random board.
    //set all the info!
    moves=15;
    level=1;
    pointsCounter=0;
    $moves.text('Moves - ' + pad10(moves))
    $level.text('Level - ' + pad10(level))
    $nextNumberCell.text('Next - '+ $nextNumber);
    counterDiv.text('Score - '+ pad100(pointsCounter));
  };
};
//this clears the board when the game is over.
var clearBoard = function(){
  getBoard();
  for (var i=0; i<columnBoard.length;i++){
   for (var j=0; j<columnBoard.length;j++){
     columnBoard[i][j]=' '
   }
  }
  pushBoard();
  gameState=1;
};
 var gameOver = function(){
   $('div.container div.r2.c0').text("G")
   $('div.container div.r2.c1').text("A")
   $('div.container div.r2.c2').text("M")
   $('div.container div.r2.c3').text("E")
   $('div.container div.r3.c3').text("O")
   $('div.container div.r3.c4').text("V")
   $('div.container div.r3.c5').text("E")
   $('div.container div.r3.c6').text("R")
   gameState=0;
 };

//this function moves all game pieces up one row and fills the bottow row with DOLLARS. A prize for getting to the next level.
 var outtaMoves = function(){
   pushBoard();
   getBoard();
   for (var l=0;l<rowBoard.length;l++){
     if (rowBoard[0][l]!==0){
       clearBoard();
       moves=0;
       gameState=1;
       gameOver();
       return 'Game Over';
     };
   };
   level += 1;
   pointsCounter += level * 25;
   moves=15-level;
   for (var i=0; i<columnBoard.length;i++){
    for (var j=0; j<7;j++){
      columnBoard[i][j]=columnBoard[i][j+1]
      animateDiv('.c'+i+'.r'+j)
    }}
    for (var k=0; k<columnBoard.length;k++){
       columnBoard[k][6]='$'
       //animateDiv('.c'+k+'.r6')//this doubles the animation.
    }
   pushBoard();
   getBoard();
 }

//this tiny function animates a div.
var animateDiv = function(div){
    $(div).animate(
      {fontSize: '10em'}, "fast"
    );
    $(div).animate(
      {fontSize: '75px'}, "fast"
    );
}
//this is where i started writing this.
console.log('Lets do this!')

//these empty arrays hold the game board and the lenghts of the boards.
var columnLengths=[]
var rowLengths =[]
var columnBoard=[]
var rowBoard = []
var arrayCounter = 0//helper to for the function that pushes the game pieces down.
var collectBreakers=[]//these turn dollars into cents.



//these functons get the lenghts of the rows and columns.
var countTouch = function(array,num) {
    var sum = []
    if (array[num]===0){
        return;
    } for (var i = num; (array[i] !== 0 && array[i]!== undefined); i++ ){
        sum.push(array[i])
    } for (var j = num-1; (array[j] !== 0 && array[j]!== undefined); j-- ){
        sum.push(array[j])
    } return sum.length;
};
var getLengths = function(array){
    var lengths=[];
    for (var i=0; i <7; i++){
    lengths.push(countTouch(array,i))
    }
    return lengths
}

//this fucntion gets the boards ready for ingestion into the div.
var cleanArray = function(array){
    return array.map(function(i){
        if (i==='$'){
            return '$'
        }
        if (i==='¢'){
          return '¢'
        }
       return i === ' ' ? 0 : parseInt(i);
    })
}
//the code snippet below was taken form here: http://viralpatel.net/blogs/jquery-get-text-element-without-child-element/
//this gets the div data and turns it into arrays.
var getBoard = function(){
  for (var i =0; i < 7;i++){
    var cb = $('.c' + i);
    var rb = $('.r' + i);
    rb = rb.clone()    //clone the element
        .children() //select all the children
        .remove()   //remove all the children
        .end()  //again go back to selected element
        .text();
    cb = cb.clone()    //clone the element
            .children() //select all the children
            .remove()   //remove all the children
            .end()  //again go back to selected element
            .text();
    rb = cleanArray(rb.split(''))
    cb = cleanArray(cb.split(''))
    columnBoard.push(cb);
    rowBoard.push(rb)
  }
}
//this one moves every column down.
var pushAllDown=function(){
  for(var i=0;i<rowBoard.length;i++){
    moveDown(columnBoard[i]);
  }
}
//funtion moves the game piece down to the most available space.
var moveDown = function(array){
    array.push(0)
    arrayCounter=array.length-1;
    for (var i= array.length-1; i>=0;i--){
        if (array[i] !== 0) {
        array[arrayCounter] = array[i];
        array[i] = 0;
        arrayCounter-=1;
        }
    }
    array.shift()
    return(array)
}
//this function takes the arrays and pushes them into the div.
var pushBoard = function() {
  if (columnBoard[0]===undefined){
    return;
  }
  for(var i = 6 ; i>=0;i--){
    for (var j = 6; j >=0; j--){
      //$('.r'+i+'.c'+j).text(rowBoard[i][j]);
      if(columnBoard[i][j]!==0){
        $('.c'+i+'.r'+j).text(columnBoard[i][j]);
      } else $('.c'+i+'.r'+j).text(' ')
    }
  }
  addColor();
  rowBoard=[];
  columnBoard=[];
  columnLengths=[]
  rowLengths =[]
}

//this puts together the lenghts arrays.
var createLengths = function(){
  for(var i=0 ;i<rowBoard.length ;i++){
    rowLengths.push(getLengths(rowBoard[i]));
    columnLengths.push(getLengths(columnBoard[i]));
    }
  }



//this one matches the pieces to the lenghts and removes them, if necessary.
var deleteMatches = function(){
  rCounter=0
  for (var i =0; i <rowBoard.length; i++){
    for (var j = 0; j<rowBoard.length; j++){
      if (columnBoard[i][j]===rowLengths[j][i]) {
          columnBoard[i][j] = 0;
          rCounter=1
        }if (columnBoard[i][j]===columnLengths[i][j]){
          columnBoard[i][j] = 0;
          rCounter=1
      }
    }
  }
}
//¢
//var breakers = cleanBreakers(collectBreakers);
//this function takes the data from adjacent explosion cells and makes it workable.
var cleanBreakers = function(testArray){
    test=testArray.join('').split('|')
    newArr=[]
    for (var i = 0;i<test.length;i++){
        if (test[i][0]!=='7'&&test[i][1]!=='7'&&test[i][0]!=='-'&&test[i][1]!=='-'&&test[i][1]!==undefined){
            newArr.push(test[i])
        }
    }return newArr
}

//this function animates pieces that are to be deleted...
var animateMatches = function(){
  for (var i =0; i <rowBoard.length; i++){
    for (var j = 0; j<rowBoard.length; j++){
      if ((columnBoard[i][j]===rowLengths[j][i])||(columnBoard[i][j]===columnLengths[i][j])) {
        rCounter=1;
        $combo.text('Combo - '+pad10((depthCounter-1)));
        //console.log(depthCounter)
        pointsCounter+=1*(depthCounter-1);
        animateDiv('.c'+i+'.r'+j)
        collectBreakers.push(i,(j+1),'|')
        collectBreakers.push(i,(j-1),'|')
        collectBreakers.push((i+1),j,'|')
        collectBreakers.push((i-1),j,'|')
            }
          }
        }
      }

      //this one turns dollars into cents and cents into game pieces.
var dollarCounter =0;
var turnToCents = function(){
  var dollarArray = cleanBreakers(collectBreakers)
  gameState=0

  for (var i in dollarArray){
    if(columnBoard[dollarArray[i][0]][dollarArray[i][1]]==='¢'){
      columnBoard[dollarArray[i][0]][dollarArray[i][1]]=Math.floor(Math.random()*7+1)
      }
    }
    for (var i in dollarArray){
      if(columnBoard[dollarArray[i][0]][dollarArray[i][1]]==='$'){
        columnBoard[dollarArray[i][0]][dollarArray[i][1]]='¢'
        animateDiv('.c'+dollarArray[i][0]+'.r'+[dollarArray[i][1]])
        }
      }
    collectBreakers=[]
    gameState=1
  }


    //   }

});//the END. omg....
