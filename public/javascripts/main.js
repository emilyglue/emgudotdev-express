// const music = new Audio('../sound/wii-plaza.mp3');

$('header').on('click', playMusic)
$('#about').on('mouseover', previewAbout);

$('#floopy-bird').on('mouseover', previewFloopy);
$('#floopy-bird').on('click', initGame);

$('#minesweepoji').on('mouseover', previewSweeper);
$('#minesweepoji').on('click', initGame);

function initGame() {
  clearPreview();
  clearPreviewEvents();
  // music.pause();

  $('h1').addClass('zoomOut');

  setTimeout(function() {
    $('header').addClass('disappear');
    $('nav').addClass('disappear');
  }, 500);

  let clicked = $(this).attr('id');

  setTimeout(function() {
    $('main').width('100%');
    switch (clicked) {
      case "floopy-bird":
        clearBoard();
        $('#title').text('Floopy Bird').show();
        $('#gameCanvas').show()
        $('<button>', {id: 'start'}).text('New Game').on('click', startFloopy).appendTo('main');
        break;
      case "minesweepoji":
        clearBoard();
        $('#title').text('minesweepoji').show();
        $('#board').show()
        if ($('.input').length === 0) {
          generateInput();
        }
        break;
    }
    initHamburger()
  }, 800);
}

function playMusic() {
  // (music.paused) ? music.play() : music.pause();
  $('header').hasClass('flash') ? $('header').removeClass('flash') : $('header').addClass('flash');
}

function previewFloopy() {
  clearPreview();
  $('#prv-fb').show();
}

function previewSweeper() {
  clearPreview();
  $('#prv-ms').show();
}

function previewAbout() {
  clearPreview();
  $('#prv-about').show();
}

function clearPreview() {
  $('.preview').hide();
}

function clearPreviewEvents() {
  $('#about').unbind('mouseover').unbind('mouseout');
  $('#floopy-bird').unbind('mouseover').unbind('mouseout');
  $('#minesweepoji').unbind('mouseover').unbind('mouseout');
}

function clearBoard() {
  $('#board').children().remove().hide();
  $('#gameCanvas').hide();
  $('#sound').remove();
  $('button').remove();
}

function initHamburger() {
  let $ham = $('<img>', {id: 'hamburger', src: '/images/hamburger.png'});

  $ham.on('click', function() {
    $('nav').hasClass('disappear') ? $('nav').removeClass('disappear') : $('nav').addClass('disappear')
  });

  $('body').append($ham);
}

function initFloopyBird() {
  $('header').hide();
  $('nav').hide();
  $('main').width('100%').height('98vh');
  $('#gameCanvas').show();
  $('<button>', {id: 'start'}).text('New Game').on('click', startFloopy).appendTo('main');
}

function startFloopy() {
  $('#start').blur().prop('disabled', true);
  $('main').focus();
  startGame(window, document, drawModule);
}

function homeCharacter() {
  document.onkeydown = function(event) {
    keyCode = window.event.keyCode;
    if (keyCode === 32) {
      if (soundOn) {
        flapSound.play();
      }

      flap = true;
    }
  }
}