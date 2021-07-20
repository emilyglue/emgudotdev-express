const numberEmojis = [0, '&#x261D','&#x203C', '&#x1F332', '&#x1F340', '&#x2B50', '&#x1F555', '&#x0037', '&#x1F3B1'];
const mineEmojis = ['&#x1F4A3', '&#x1F62C', '&#x1F338']; //[mine, grimace, flower]
const faceEmojis = ['&#x1F60F', '&#x1F630', '&#x1F92F', '&#x1F929']; //[normal, scared, explode, stars]
const soundEmojis = ['&#x1F508', '&#x1F507'] //sound on, sound off
const winText = 'BROOOOOOooOOOO U WON!!', loseText = 'bro... u lost :(';

const clock = new Audio()
const explode = new Audio()
const cheer = new Audio()

let m,n,mines;
const input = ['row', 'col', 'mine'];

let boardArray = [];

function startNewGame() {
  clearBoard();
  generateInput();
}

function generateInput() {
  let $modal = $('<div>', {class: 'modal'}).appendTo('#board');
  let $inputDiv = $('<div>', {class: 'input modal-content'}).appendTo($modal);
  $('<h3>').text('Welcome to minesweepoji').appendTo($inputDiv);
  for (let i = 0; i < input.length; i++) {
      const prop = input[i];
      $('<label>', {for: prop}).text(`Number of ${prop}s:`).appendTo($inputDiv);
      $('<input>', {type: 'number', name: prop, id: `${prop}s`}).appendTo($inputDiv);
  }
  $('<button>', {id: 'start', class: 'small'}).text('Start Game').appendTo($inputDiv);
  $('<p>', {id: 'error'}).html('- Grid must be at least 3x3 and no more than 10x10 <br/>- Must have at least one mine and less than (row x col) mines').appendTo($inputDiv);
  $('#start').on('click', generateBoard);
}

function generateBoard() {
  //TODO: get user input and make sure its valid
  //function validateInput(m, n, mines)
  //m > 0, n > 0, mines > 0 && mines < m*n
  m = parseInt($('#rows').val());
  n = parseInt($('#cols').val());
  mines = parseInt($('#mines').val());
  boardArray = [];

  if (isValidInput(m, n, mines)) {
      //get indices of where the mines will be
      const randArray = getMineLocations();
      //make sure the board is clear before creating new one
      clearBoard();
      addFace();
      for (let i = 0; i < m; i++) {
          //create a row
          let $row = $('<div>', {class: 'row', id: 'row-'+i});
          for (let j = 0; j < n; j++) {
              let index = i*n+j;
              let $boxDiv = $('<div>', {class: 'box', id: 'box-'+index});
              //if the current index is a mine, push that onto the board
              if (randArray.indexOf(index) !== -1) {
                  boardArray.push('mine');
                  // $boxDiv.text('BOMB');
              }
              else {
                  //otherwise push the index number
                  boardArray.push(index);
              }
              $row.append($boxDiv);
          }
          $('#board').append($row);
      }
      addNumbers();
      $('<h3>', {id: 'minesScore'}).text('Mines left: ' + mines).appendTo($('#board'))
    //   addSound();
  }
  else {
      $('#error').show();
  }
}

function addSound() {
  clock.loop = true;
  clock.play();
  const sound = $('<div>', {id: 'sound'}).html(soundEmojis[0]).appendTo('#board');
  sound.on('click', function() {
      if (!clock.paused) {
          $(this).html(soundEmojis[1]);
          clock.pause();
      }
      else {
          $(this).html(soundEmojis[0]);
          clock.play();
      }
  })
}

function addFace() {
  //faces = [normal, scared, exploding]
  $('<div>', {id: 'face'}).html(faceEmojis[0]).appendTo('#board');
  $('#board').on('mousedown', function() {
      $('#face').html(faceEmojis[1]);
  });
  $('#board').on('mouseup', function() {
      $('#face').html(faceEmojis[0]);
  });
}

function isValidInput(m, n, mines) {
  return (m <= 10) && (n <= 10) && (m > 2) && (n > 2) && (mines > 0) && (mines < m*n);
}

function getMineLocations() {
  const array = [];
  while (array.length < mines) {
      const rando = Math.floor(Math.random()*m*n);
      if (!array.includes(rando)) {
          array.push(rando);
      }
  }
  console.log('mines are located in', array);
  return array;
}

function hasWon() {
  if (($('.showing').length + $('.maybe').length) === boardArray.length) {
      let count = 0;
      for (let i = 0; i < boardArray.length; i++) {
          if (boardArray[i] === 'mine') {
              if ($('#box-'+i).hasClass('maybe')) {
                  count++;
              }
          }
      }
      return (count === mines);
  }
}

function updateMinesLeft() {
  $('#minesScore').text('Mines left: ' + (mines - $('.maybe').length));
}

function getIndex($box) {
  let boxId = $box.attr('id');
  return boxId.split('-')[1];
}

function showBoxes(...indices) {
  for ( let i = 0; i < indices.length; i++) {
      let index = parseInt(indices[i]);
      if (index < 0) {
          continue;
      }
      let $box = $('#box-'+index);
      checkForMaybe($box);
      showBox($box);
      if (boardArray[index] === 'zero' && !$box.hasClass('showing')) {
          $box.css('background-color', 'green');
          $box.addClass('showing');
          //top right
          if (index === (n-1)) {
              console.log('clicked a topright corner');
              topRight(index, showBoxes);
          }
          //bottom left
          else if (index === ((m-1)*n)) {
              console.log('got a bottomleft corner');
              bottomLeft(index, showBoxes);
          }
          //bottom right
          else if (index === (m*n-1)) {
              console.log('got a bottom right corner');
              bottomRight(index, showBoxes);
          }
          //top left
          else if (index === 0) {
              console.log('got a top left corner');
              topLeft(index, showBoxes);
          }
          else if (index > 0 && index < n) {
              console.log('got a top');
              topRow(index, showBoxes);
          }
          else if (index > (m-1)*n && index < (m*n-1)) {
              console.log('got a bottom');
              bottomRow(index, showBoxes);
          }
          //left side
          else if (index % n === 0) {
              console.log('got a left side');
              left(index, showBoxes);
          }
          //right side
          else if (index % n === (n-1)) {
              console.log('got a right side');
              right(index, showBoxes);
          }
          //in the center
          else {
              console.log('got a center');
              around(index, showBoxes);
          }
      }
      else if ($box.text() !== 'BOMB'){
          $box.css('background-color', 'green');
      }
  }
}

function clickBox($box) {
  //get index of box clicked
  let index = getIndex($box);
  //if its empty start revealing all the numbers around it
  if(boardArray[index] === 'zero') {
      checkForMaybe($box);
      $box.on('click', function() {
          showBoxes(getIndex($(this)));
          if (hasWon()) {
              endGame(faceEmojis[3], winText, true);
          }
      });
  }
  //click on a mine and it ends the game
  else if (boardArray[index] === 'mine') {
      $box.on('click', function() {
          endGame(faceEmojis[2], loseText, false);
      });
  }
  //click on a number it displays the number
  else {
      //display number
      $box.on('click', function() {
          checkForMaybe($box);
          $box.css('background-color', 'green');
          showBox($box);
          if (hasWon()) {
              endGame(faceEmojis[3], winText, true);
          }
      });
  }

  $box.on('contextmenu', function() {
      if (!$box.hasClass('maybe')) {
          $box.addClass('maybe');
          $box.html(mineEmojis[1]);
      }
      else {
          $box.removeClass('maybe');
          $box.empty();
      }
      if ($('.maybe').length === mines) {
          if (hasWon()) {
              endGame(faceEmojis[3], winText, true);
          }
      }
      updateMinesLeft();
      return false;
  })
}

function checkForMaybe($box) {
  if ($box.hasClass('maybe')) {
      $box.removeClass('maybe');
      $box.empty();
  }
}

function addNumbers() {
  for (let index = 0; index < boardArray.length; index++) {
      let $boxDiv = $('#box-'+index);
      // let id = getIndex($boxDiv);
      //populate the board array with the values
      if (boardArray[index] !== 'mine') {
          if (index === (n-1)) {
              boardArray[index] = topRight(index, getCounter);
          }
          else if (index === (n*n)) {
              boardArray[index] = bottomLeft(index, getCounter);
          }
          else if (index === (m*n-1)) {
              boardArray[index] = bottomRight(index, getCounter);
          }
          else if (index === 0) {
              boardArray[index] = topLeft(index, getCounter);
          }
          else if (index % n === 0) {
              boardArray[index] = left(index, getCounter);
          }
          else if (index % n === (n-1)) {
              boardArray[index] = right(index, getCounter);
          }
          else {
              boardArray[index] = around(index, getCounter);
          }
      }
      clickBox($boxDiv);
  }
}

function clearBoard() {
  $('#board').children().remove();
  boardArray = [];
  console.log('cleared the board for a new game');
}

function showBox($boxDiv) {
  let id = getIndex($boxDiv);
  if (boardArray[id] === 'mine') {
      $boxDiv.html(mineEmojis[0]).css('background-color', 'red');
  }
  else if (boardArray[id] === 'dud') {
      $boxDiv.html(mineEmojis[2]);
  }
  else if (boardArray[id] === 'zero') {
      //do nothing
  }
  else {
      $boxDiv.html(numberEmojis[boardArray[id]]);
      $boxDiv.addClass('showing');
  }
}

function showBoard(isWon) {
  for (let i = 0; i < boardArray.length; i++) {
      if (boardArray[i] === 'mine') {
          boardArray[i] = isWon ? 'dud' : 'mine';
      }
      showBox($('#box-'+i));
  }
}

function endGame(face, text, isWon) {
  clock.pause();
  isWon ? cheer.play() : explode.play();
  showBoard(isWon);
  $('#board').off('mouseup').off('mousedown');
  $('#face').html(face);
  $('.box').off('click').off('contextmenu');
  $('<h2>').text(text).appendTo('#board');
  let $button = $('<button>', {id: 'newGame'}).text('play again').on('click', startNewGame).appendTo('#board');
  $button.get(0).scrollIntoView();
}

function getCounter(...indices) {
  let count = 0;
  for (let i = 0; i < indices.length; i++) {
      if (boardArray[indices[i]] === 'mine') {
          count++;
      }
  }
  if (count === 0) {
      return 'zero';
  }
  return count;
}

//can call on a center box, 
function around(i, fun) {
  //if n is # of columns(in this example 3)
  //top: i - n, bottm: i+n, left: i-1, right: i+1;
  //topleft: i-n-1, topright: i-n+1, bottomleft: i+n-1, bottomrightL i+n+1
  const top = i-n;
  const bottom = i+n;
  const left = i-1;
  const right = i+1;
  const topLeft = i-n-1;
  const topRight = i-n+1;
  const bottomLeft = i+n-1;
  const bottomRight = i+n+1;
  return fun(top, bottom, left, right, topLeft, topRight, bottomLeft, bottomRight);
}

function topRow(i, fun) {
  const bottom = i+n;
  const left = i-1;
  const right = i+1;
  const bottomLeft = i+n-1;
  const bottomRight = i+n+1;
  return fun(bottom, left, right, bottomLeft, bottomRight);
}

function bottomRow(i, fun) {
  const top = i-n;
  const left = i-1;
  const right = i+1;
  const topLeft = i-n-1;
  const topRight = i-n+1;
  return fun(top, left, right, topLeft, topRight);
}


// can call on a box in the right row
function right(i, fun) {
  //top: i - n, bottm: i+n, left: i-1;
  //topleft: i-n-1, bottomleft: i+n-1
  const top = i-n;
  const bottom = i+n;
  const left = i-1;
  const topLeft = i-n-1;
  const bottomLeft = i+n-1;
  return fun(top, bottom, left, topLeft, bottomLeft);
  
}

//can call on a box in the left row
function left(i, fun) {
  //top: i - n, bottom: i+n, right: i+1;
  //topright: i-n+1, bottomright: i+n+1
  const top = i-n;
  const bottom = i+n;
  const right = i+1;
  const topRight = i-n+1;
  const bottomRight = i+n+1;
  return fun(top, bottom, right, topRight, bottomRight);
}

function topLeft(i, fun) {
  //right: i+1, bottm: i+n
  //bottomright: i+n+1
  const bottom = i+n;
  const right = i+1;
  const bottomRight = i+n+1;
  return fun(bottom, right, bottomRight);
}

function bottomLeft(i, fun) {
  //top: i - n, right: i+1
  //topright: i-n+1
  const top = i-n;
  const right = i+1;
  const topRight = i-n+1;
  return fun(top, right, topRight);

}

function topRight(i, fun) {
  //left: i-1, bottm: i+n
  //bottomleft: i+n-1
  const left = i-1;
  const bottom = i+n;
  const bottomLeft = i+n-1;
  return fun(left, bottom, bottomLeft);
}

function bottomRight(i, fun) {
  //top: i - n, left: i-1
  //topleft: i-n-1
  const left = i-1;
  const top = i-n;
  const topLeft = i-n-1;
  return fun(left, top, topLeft);
}