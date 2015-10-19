//Dollars and Cents
//BY ALEXANDER NAGAEV @anagaev@gmail.com
//console.log(gameState)

//Here I load the window and define the first function, the one that gets a random number for the game.

$(document).ready(function(){

var $setNextNumber = function(){
   var $nextNumber = Math.floor(Math.random()*8+1);
   if ($nextNumber === 8){
      $nextNumber = '$' //One can make the game more difficult by increasing the number that is generated, so that there is more of a chance of getting the dreaded Dollar.
   }
  return $nextNumber
}

//Here I define the incedious global variables.

var $startButton = $('.myButton') //GameStart button div.
var $moves = $('.moves') //the div that shows how many moves are left until the next level
var $level=$('.level') // the div that shows the level of the game
var $containerDivs = $('.container div'); //the game board divs
var $nextNumberCell = $('.nextmove'); //the div that shows what the next piece that drops will be
var counterDiv = $('.points');//the div that displays points
var pointsCounter = 0;//points counter
var grandCounter=0; //counter to check if the recursion is needed
var superCounter=1; //counter of the depth of the recursion
var noClick = 0;//useless variable
var level=1;//level variable
var moves = 0;//moves variable
var gameState=0;//dubious game state variable

//this function runs the game start function when the game start button is clicked
  $startButton.click(function(){
    gameStart()
  });

//this is what happens when the board is clicked.
  $containerDivs.click( function() {
    //these 2 funcitions are dubious at best and i will not explain them
    if (gameState===0) {
      return;
    }
    if (noClick===1) {
      return;
      //console.log('test')
    }
    noClick = 1;
    //console.log(noClick)
    //$containerDivs.html('');
    var o = $(this);
    grandCounter=0;//resets the recurtion counter
    superCounter=1;//resets the depth counter
    moves-=1;//decreses the moves by one
    //this variable and function selects the top cell in a column and places the game piece there.
    var classes = o.attr('class').split(/\s+/);
    if ($('div.container div.r0.' + classes[1]).text()!==' '){
      return;
    }
    $('div.container div.r0.' + classes[1]).text($nextNumber);
    //this is where the game functions begin
    part1()
    //and end...
    //here I set the next move and update display divs.
    $moves.text('Moves - '+moves)
    $level.text('Level - '+level)
    $nextNumber=$setNextNumber();
    $nextNumberCell.text('Next - '+$nextNumber);
    noClick = 0; //dubious

});
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
  superCounter+=1//depth +=1
  getBoard();//gets the game board from the html divs.
  pushAllDown();//pushes the piece that was placed on the board down to the nearest available space.
  //this levels up the game.
  if (moves ===0) {
    outtaMoves()
  }
  pushBoard();//pushes the game board to the divs.
  getBoard();//gets the board again...
  createLengths();//create the lengs of rows and columns of the pieces.
  animateMatches(); //animate some stuff...
  //Sets delay so that animations can finish if its the first time running part2(), or just runs them if setTimeout is set.
  if (grandCounter>0){
    setTimeout(part2,400);
  } else part2();
}
//this is part 2 of the game function. I don't remember why I have it, but it's most likely here for a reason. Maybe...
var part2 = function(){
   deleteMatches();//This function matches game pieces to the lengths of the rows and columns that they reside in. And deltes them.
   turnToCents();//this one takes dollars and cents and turns then into each other and other game pieces based on the proximity of deletions.
   pushBoard();//pushing the board to the player
   getBoard();//getting the board again.
   pushAllDown();//pushing everyting down.
   counterDiv.text('Score - '+pointsCounter);//updaing the score board. Why not.
   pushBoard();//pushing the board after pushing everything down.
   //re-running part1() if changes were made to the board or clearing the interval for part2().
   if (grandCounter>0){
     part1()
   }else clearInterval(part2);
 }

//start game functions.
var gameStart = function(){
  if (gameState===0){//checks my dubious game state variable.
  $nextNumber = $setNextNumber(); // Creates the next number that will drop.
  gameState=1;
  moves=20;//set moves.
  var randomPieces = Math.floor(Math.random()*8+8)//sets how many random pieces will be put on the board.
  getBoard();//gets the fresh board.
  //assign random pieces
  for (var i=0; i<=randomPieces; i++){
    columnBoard[Math.floor(Math.random()*6+1)][Math.floor(Math.random()*6+1)]=Math.floor(Math.random()*6+1);
  }
  pushBoard();//push the board to the player.
  part1(); //and run the game on the random board.
  //set all the info!
  $moves.text('Moves - '+moves)
  $level.text('Level - '+level)
  $nextNumberCell.text('Next - '+$nextNumber);
  counterDiv.text('Score - '+pointsCounter);
  }
}
//this clears the board when the game is over.
var clearBoard = function(){
  getBoard();
  for (var i=0; i<columnBoard.length;i++){
   for (var j=0; j<columnBoard.length;j++){
     columnBoard[i][j]='$'
   }
  }
  pushBoard();
  gameState=0;
}

//this function moves all game pieces up one row and fills the bottow row with DOLLARS. A prize for getting to the next level.
 var outtaMoves = function(){
     pushBoard();
     getBoard();
     for (var l=0;l<rowBoard.length;l++){
       if (rowBoard[0][l]!==0){
       clearBoard()
       gameState=0}
     }
     level+=1
     moves=20-level
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
console.log('lets DO THIS')

//these empty arrays hold the game board and the lenghts of the boards.
var columnLengths=[]
var rowLengths =[]
var columnBoard=[]
var rowBoard = []
var counter = 0//not sure what this does...
var collectBreakers=[]//these turn dollars into cents.

// var deleteColMatches = function(countArray,lengthsArray){
//     var holder = 0
//   for (var i =0; i <countArray.length; i++){
//     for (var j = 0; j<countArray.length; j++){
//       holder = countArray[i][j]===lengthsArray[j][i]? 0:countArray[i][j]
//       countArray[i][j] = holder
//     }
//   }
//   return countArray
// }
//this function i dont remember what it does...
var countTouch = function(array,num) {
    var sum = []
    if (array[num]===0){
        return 'poop';
    } for (var i = num; (array[i] !== 0 && array[i]!== undefined); i++ ){
        sum.push(array[i])
    } for (var j = num-1; (array[j] !== 0 && array[j]!== undefined); j-- ){
        sum.push(array[j])
    } return sum.length;
};
//this functon gets the lenghts of the rows and columns.
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
//funtion moves the game piece down to the most available space.
var moveDown = function(array){
    array.push(0)
    counter=array.length-1;
    for (var i= array.length-1; i>=0;i--){
        if (array[i] !== 0) {
        array[counter] = array[i];
        array[i] = 0;
        counter-=1;
        }
    }
    array.shift()
    return(array)
}

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

//this function takes the arrays and pushes them into the div.
var pushBoard = function() {
  for(var i = 6 ; i>=0;i--){
    for (var j = 6; j >=0; j--){
      //$('.r'+i+'.c'+j).text(rowBoard[i][j]);
      if(columnBoard[i][j]!==0){
        //console.log(columnBoard[i][j])
        //console.log()
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

// var difference = function(arrNumbers,arrLengths) {
//     var newArr=[]
//     for (var i = 0; i<arrNumbers.length; i++) {
//         if (arrNumbers[i] === arrLengths[i]){
//             newArr[i]=0
//         } else newArr[i]=arrNumbers[i]
//     } return newArr
//   }
// var deleteRowMatches = function(){
//   for (var i = 0; i < rowBoard.length; i++){
//     columnBoard[i]=difference(columnBoard[i],columnLengths[i])
//     }
//   }


//this one matches the pieces to the lenghts and removes them, if necessary.
var deleteMatches = function(){
  grandCounter=0
  for (var i =0; i <rowBoard.length; i++){
    for (var j = 0; j<rowBoard.length; j++){
      if (columnBoard[i][j]===rowLengths[j][i]) {
          columnBoard[i][j] = 0;
          grandCounter=1
          // collectBreakers.push(i,(j+1),'|')
          // collectBreakers.push(i,(j-1),'|')
          // collectBreakers.push((i+1),j,'|')
          // collectBreakers.push((i-1),j,'|')
        }if (columnBoard[i][j]===columnLengths[i][j]){
          columnBoard[i][j] = 0;
          grandCounter=1
          // collectBreakers.push(i,(j+1),'|')
          // collectBreakers.push(i,(j-1),'|')
          // collectBreakers.push((i+1),j,'|')
          // collectBreakers.push((i-1),j)
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
        grandCounter=1;
        pointsCounter+=1*(superCounter-1);
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
var turnToCents = function(){
  var dollarArray = cleanBreakers(collectBreakers)
  //console.log(dollarArray)
  //console.log(columnBoard)
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
    }collectBreakers=[]
  }




});//the END. omg....
