var gorillas;
var currentPlayerIndex;
var bananaPosition;
var bananaVelocity;
var wind;
var bananaDiameter = 10;
var gorillaDiameter = 20;
var isBananaFlying = false;
var gameStarted = true;
var gameEnded = false;
var addStrength = false;
var subtractStrength = false;
var addAngle = false;
var subtractAngle = false;
var gravity = 9.81;
var gravityScaleFactor = 1/60;
var cannonLength = 20;
var strengthOffset = 0.05;
var angleOffset = 0.3;
var cannonFireSound;
var explosionSound;
var cannonFireSoundFile = 'assets/sounds/Tank Firing-SoundBible.com-998264747.mp3';
var explosionSoundFile = 'assets/sounds/Bomb 3-SoundBible.com-1260663209.mp3';

var Vector2 = function(x, y) {
  this.x = x;
  this.y = y;
};

Vector2.prototype.dist = function(otherVector) {
  return Math.pow(
    Math.pow(
      Math.abs(this.x - otherVector.x), 2) +
      Math.pow(Math.abs(this.y - otherVector.y),2),
    0.5);
};

var Gorilla = function(position, color, strength, angle, quadrant) {
  this.position = position;
  this.color = color;
  this.strength = strength;
  this.angle = angle;
  this.textAlignment = quadrant === 1 ? LEFT : RIGHT;
  this.textX = quadrant === 1 ? 10 : width - 60;
  this.angleDirection = quadrant === 1 ? 1 : -1;
};

function preload() {
  cannonFireSound = loadSound(cannonFireSoundFile);
  explosionSound = loadSound(explosionSoundFile);
}

function setup() {
  createCanvas(600,600);
  resetGame();
  frameRate(60);
}

function draw() {

  background(255);

  if (!gameEnded) {
    drawGorillas();
    updateTarget();
    updateBanana();
    drawBanana();
    drawTarget();
  }
}

function drawTarget() {
  noStroke();
  var { color, strength, angle, textAlignment, textX } = gorillas[currentPlayerIndex];
  fill(color);
  textAlign(textAlignment);
  text ('Força: ' + strength.toFixed(2), textX, 25);
  text ('Ângulo: ' + Math.abs(angle%90).toFixed(2), textX, 60);
  fill(255);
}

function drawBanana() {
  if (isBananaFlying) {
    ellipse(bananaPosition.x, bananaPosition.y, bananaDiameter, bananaDiameter);
  }
}

function drawGorillas() {
  gorillas.forEach(gorilla => {
    let { color, strength, angle, textAlignment, textX, position, angleDirection } = gorilla;
  
    fill(color);
    stroke(color);
    strokeWeight(5);
    ellipse(position.x, position.y, gorillaDiameter, gorillaDiameter);
    line(
      position.x,
      position.y,
      position.x + cannonLength * angleDirection * cos(radians(angle)),
      position.y + cannonLength * -sin(radians(angle)));
    fill(255);
    strokeWeight(1);
    stroke(1);  
  });
}

function resetGame() {
  gorillas = [];
  initializeBlueGorilla();
  initializeRedGorilla();
  currentPlayerIndex = 0;
  isBananaFlying = false;
  gameStarted = true;
  gameEnded = false;
  addStrength = false;
  subtractStrength = false;
  addAngle = false;
  subtractAngle = false;
  wind = random(-0.1,0.1);
}

function updateTarget() {
  if (isBananaFlying) {
    return;
  }

  if (addStrength) {
    gorillas[currentPlayerIndex].strength += strengthOffset;
  } else if (subtractStrength) {
    gorillas[currentPlayerIndex].strength -= strengthOffset;
  }

  if (addAngle) {
    gorillas[currentPlayerIndex].angle += gorillas[currentPlayerIndex].angleDirection * angleOffset;
  } else if (subtractAngle) {
    gorillas[currentPlayerIndex].angle -= gorillas[currentPlayerIndex].angleDirection * angleOffset;
  }
}

function initializeBlueGorilla() {
  var newGorilla = new Gorilla(
    new Vector2(random(0.1*width, 0.2*width), getRandomYPosition()),
    color(0,0,255),
    10,
    45,
    1);
  gorillas.push(newGorilla);
}

function initializeRedGorilla() {
  var newGorilla = new Gorilla(
    new Vector2(random(0.8*width, 0.9*width), getRandomYPosition()),
    color(255,0,0),
    10,
    45,
    3);
  gorillas.push(newGorilla);
}

function getRandomYPosition() {
  return random(0.5*height, 0.9*height);
}

function updateBanana() {

  if (checkWinState()) {
    explosionSound.setVolume(0.3);
    explosionSound.play();
    gameEnded = true;
  }

  if (hitGround()) {
    isBananaFlying = false;
    callNextPlayer();
    return;
  }

  if (isBananaFlying) {
    bananaPosition = { x: bananaPosition.x + bananaVelocity.x, y: bananaPosition.y + bananaVelocity.y};
    bananaVelocity = { x: bananaVelocity.x + wind, y: bananaVelocity.y + gravity * gravityScaleFactor };
  }
}

function callNextPlayer() {
  currentPlayerIndex = ++currentPlayerIndex % gorillas.length;
}

function checkWinState() {
  if (isBananaFlying) {
    var nextGorilla = gorillas[(currentPlayerIndex + 1) % gorillas.length];
    return nextGorilla.position.dist(bananaPosition) < (bananaDiameter/2 + gorillaDiameter/2);
  }
  return false;
}

function hitGround() {
  if (isBananaFlying) {
    return bananaPosition.y > height;
  }

  return false;
}

function keyPressed() {

  if (gameEnded) {
    handleRestart();
    return;
  }
  handleBananaThrow();


  gameStarted = true;
  handleControls();
}

function handleBananaThrow() {
  if (keyCode === ENTER && !isBananaFlying) {
    throwBanana();
  }
}

function throwBanana() {
  isBananaFlying = true;
  var gorilla = gorillas[currentPlayerIndex];
  bananaPosition = gorilla.position;
  bananaVelocity = new Vector2(
    gorilla.strength * gorilla.angleDirection * cos(radians(gorilla.angle)),
    gorilla.strength * -sin(radians(gorilla.angle)));
  cannonFireSound.setVolume(0.3);
  cannonFireSound.play();
}

function handleRestart() {
  if (keyCode === ENTER && gameEnded) {
    resetGame();
  }
}

function handleControls() {
  if (keyCode === UP_ARROW) {
    addStrength = true;
  } else if (keyCode === DOWN_ARROW) {
    subtractStrength = true;
  } else if (keyCode === LEFT_ARROW) {
    addAngle = true;
  } else if (keyCode === RIGHT_ARROW) {
    subtractAngle = true;
  }
}

function keyReleased() {
  if (keyCode === UP_ARROW) {
    addStrength = false;
  } else if (keyCode === DOWN_ARROW) {
    subtractStrength = false;
  } else if (keyCode === LEFT_ARROW) {
    addAngle = false;
  } else if (keyCode === RIGHT_ARROW) {
    subtractAngle = false;
  }
}
