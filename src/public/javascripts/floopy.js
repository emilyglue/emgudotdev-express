const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

ctx.canvas.width = $('main').width()/3*4;
ctx.canvas.height = $('main').height()/3*2;

const w = ctx.canvas.width;
const h = ctx.canvas.height;

// start bird on left middle of screen;
let bird = {x: 45, y: h/2-15};
const birdHeight = 50;
const birdWidth = 50;

// load original image
let birdImg = new Image();
birdImg.src = '/images/bird.png';

//keep track of whether bird is flapping
let flap = false;
let soundOn = true;

// keep track of score and level
let score = 0;
let level = 1;
let time = 0;

// store all current pipes in an array
let pipes = [];
const pipeWidth = 50;

// store all current clouds in an array
let clouds = [];
const cloudWidth = 100;
const cloudHeight = 50;

// gap between the pipes
let gap = birdHeight * 3;

// instructions
ctx.fillStyle = 'black';
ctx.font = '30px Arial';
ctx.textAlign = 'center';
ctx.fillText('WELCOME TO FLOOPY BIRD', w/2, h/2);
ctx.font = '20px Arial';
ctx.fillText('Press [space bar] to FLAP', w/2, h/2+40);
ctx.fillText('Avoid the pipes!!!', w/2, h/2+60)

// load audio
// const flapSound = new Audio('./sound/jump.mov');
// const gameOverSound = new Audio('./sound/game-over.wav');

const drawModule = function() {
  // draw clouds in background
  const initClouds = function() {
    const numClouds = Math.floor(Math.random()*5+2);
    for (let i = 0; i < numClouds; i++) {
      // get random placements for each cloud and store cloud in array
      const cloudX = Math.floor(Math.random()*w);
      const cloudY = Math.floor(Math.random()*h);
      const cloud = Math.floor(Math.random()*4+1);
      const cloudImg = new Image();
      cloudImg.src = `/images/cloud-${cloud}.png`;
      cloudImg.onload = function() {
        ctx.drawImage(cloudImg, cloudX, cloudY, cloudWidth, cloudHeight);
      }
      clouds.push({image: cloudImg, x: cloudX, y: cloudY});
    }
  }

  const initBird = function() {
    birdImg.onload = function() {
      ctx.drawImage(birdImg, bird.x, bird.y, 100, 100);
    }
  }

  const initPipes = function() {
    // get random height for top pipe
    const topHeight = Math.floor(Math.random()*(h-gap));
    const bottomHeight = h - topHeight - gap;

    // let grd = ctx.createLinearGradient(w, 0, w+pipeWidth, h);
    // grd.addColorStop(0, '#3C896D');
    // grd.addColorStop(1, '#E4F0D0');
    // ctx.fillStyle = grd;
    ctx.fillRect(w, 0, pipeWidth, topHeight);
    pipes.push({x: w, y: 0, height: topHeight, gap});
    ctx.fillRect(w, topHeight + gap, pipeWidth, bottomHeight);
    pipes.push({x: w, y: topHeight + gap, height: bottomHeight, gap});
  }

  const drawBird = function(x,y) {
    ctx.drawImage(birdImg, x-30, y-25, 100, 100);
  }

  const drawPipes = function (x, y, h, type) {
    let grd = ctx.createLinearGradient(w, 0, w+pipeWidth, 0);
    grd.addColorStop(0, '#3C896D');
    grd.addColorStop(1, '#E4F0D0');
    ctx.fillStyle = grd;
    ctx.fillRect(x, y, pipeWidth, h);

    if (type === "bottom") {
      ctx.fillRect(x-10, y, pipeWidth + 20, 20);
    } else {
      ctx.fillRect(x-10, y+h-20, pipeWidth + 20, 20);
    }
  }

  const drawClouds = function(x, y, image) {
    try {
      ctx.drawImage(image, x, y, cloudWidth, cloudHeight);
    } catch (error) {
      // console.log(error);
    }
  }

  const checkCollision = function() {
    for (let i = 0; i < pipes.length; i+=2) {
      if (((bird.y < pipes[i].height
          || bird.y + birdHeight >= pipes[i].height + pipes[i].gap)
          && bird.x + birdWidth >= pipes[i].x
          && bird.x + birdWidth <= pipes[i].x+pipeWidth)
          || ((bird.y < pipes[i].height
            || bird.y + birdHeight >= pipes[i].height + pipes[i].gap)
            && bird.x >= pipes[i].x
            && bird.x <= pipes[i].x+pipeWidth)) {
        return true;
      } else {
        return false;
      }
    }
  }

  const updateScore = function() {
    ctx.fillStyle = 'black';
    ctx.font = '30px Times New Roman';
    ctx.fillText('Score: '+score, 60, h-50);
    ctx.fillText('Level: '+level, 60, h-20);
  }

  const addCloud = function() {
    const cloudX = w;
    const cloudY = Math.floor(Math.random()*h);
    const cloud = Math.floor(Math.random()*4+1);
    const cloudImg = new Image();
    cloudImg.src = `/images/cloud-${cloud}.png`;
    clouds.push({image: cloudImg, x: cloudX, y: cloudY});
  }

  const updateClouds = function() {
    if (clouds[0].x + cloudWidth < 0) {
      clouds.shift()
    }
  }

  const levelUp = function() {
    ctx.fillStyle = '#022B3A';
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('LEVEL UP!!', w/2, h/2);
    time++;
  }

  const winGame = function() {
    gameloop = clearInterval(gameloop);
    clearInterval(newPipe);
    clearInterval(addCloud);
    endGame('win');
  }

  const removePipes = function() {
    if (pipes[0].x + pipeWidth < 0) {
      pipes.shift();
      pipes.shift();

      score++;

      if (score % 10 === 0 && score > 0) {
        //level up!
        level++;
        gap *= 0.8;
        if (gap <= birdHeight) {
          winGame();
        } else {
          levelUp();
        }
      }
    }
  }

  const endGame = function(outcome) {
    // gameOverSound.play();
    ctx.fillStyle = '#022B3A';
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    switch (outcome) {
      case 'lose':
        ctx.fillText('GAME OVER', w/2, h/2);
        ctx.fillText('SCORE: '+score, w/2, h/2+40);
        break;
      case 'win':
        ctx.fillText('YOU WON!!', w/2, h/2);
        ctx.fillText('SCORE: '+score, w/2, h/2+40);
        break;
    }

    clouds = [];
    pipes = [];
    score = 0;
    level = 1;
    time = 0;
    gap = birdHeight * 3;
    bird = {x:45, y: h/2-15};
    $('#start').prop('disabled', false);
  }

  const paint = function() {
    ctx.clearRect(0,0,w,h);

    for (let i = 0; i < clouds.length; i++) {
      clouds[i].x -= 0.5;
      drawClouds(clouds[i].x, clouds[i].y, clouds[i].image);
    }

    // keep bird descending
    bird.y += 5;

    if (bird.y < 0 || bird.y >= (h-birdHeight) || checkCollision()) {
      gameloop = clearInterval(gameloop);
      clearInterval(newPipe);
      clearInterval(addCloud);
      endGame('lose');
      return;
    }

    if (flap) {
      bird.y -= 50;
    }

    for (let i = 0; i < pipes.length; i++) {
      let type = (i%2 === 0) ? 'top' : 'bottom';
      pipes[i].x -=10;
      drawPipes(pipes[i].x, pipes[i].y, pipes[i].height, type);
    }

    drawBird(bird.x, bird.y);

    if (time > 0 && time < 20) {
      levelUp();
      time %= 20;
    }

    removePipes();
    updateClouds();

    updateScore();
  }

  const init = function() {
    initClouds();
    initBird();
    initPipes();
    gameloop = setInterval(paint, 50);
    newPipe = setInterval(initPipes, 3000);
    newCloud = setInterval(addCloud, 10000)
  }

  return {
    init
  }
}

const addSoundFlappy = function() {
  let sound = $('<div>', {id: 'sound'}).html(soundEmojis[0]).appendTo('main');
  if (soundOn) {
    $(this).html(soundEmojis[1]);
    sound = false;
  } else {
    $(this).html(soundEmojis[0]);
    sound = true;
  }
}

// when game starts, draw canvas and add the space bar event listener
const startGame = function(window, document, drawModule) {
  // if ($('#sound').length === 0) {
  //   addSoundFlappy();
  // }

  drawModule().init();

  document.onkeydown = function(event) {
    keyCode = window.event.keyCode;
    if (keyCode === 32) {
      event.preventDefault();
      if (soundOn) {
        // flapSound.play();
      }
      flap = true
    }
  }

  document.onkeyup = function(event) {
    flap = false
  }
}

// start game on click
$('#start').on('click', function() {
  $('#start').prop('disabled', true);
  startGame(window, document, drawModule)
});