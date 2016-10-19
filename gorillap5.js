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

var Gorilla = function(position, color, strength, angle, quadrant, npc) {
  this.position = position;
  this.color = color;
  this.strength = strength;
  this.angle = angle;
  this.textAlignment = quadrant === 1 ? LEFT : RIGHT;
  this.textX = quadrant === 1 ? 10 : width - 60;
  this.angleDirection = quadrant === 1 ? 1 : -1;
  this.npc = npc || false;
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
  } else {
    displayGameResult();
  }
}

function displayGameResult() {
  var { color, strength, angle, textAlignment, textX } = gorillas[currentPlayerIndex];
  
  textAlign(CENTER);
  fill(color);
  textSize(26);
  text ('Parabéns!', width/2, height/2);
  textSize(14);
  text ('Enter para continuar', width/2, height/2 + 20);
}

function drawTarget() {
  noStroke();
  var { color, strength, angle, textAlignment, textX } = gorillas[currentPlayerIndex];
  fill(color);
  textAlign(textAlignment);
  textSize(14);
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
  initializeGreenGorilla();
  initializeMagentaGorilla();
  initializeYellowGorilla();
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

  var gorilla = gorillas[currentPlayerIndex];
  if (gorilla.npc) {
    if (typeof(gorilla.target) === 'undefined') {
      selectTargetAI();
      generateFirstGuessAI();
    } else {
      setAimStrategyAI();
      updateAimAI();
    }
    throwBanana();
    return;
  }

  if (addStrength) {
    gorilla.strength += strengthOffset;
  } else if (subtractStrength) {
    gorilla.strength -= strengthOffset;
  }

  if (addAngle) {
    gorilla.angle += gorilla.angleDirection * angleOffset;
  } else if (subtractAngle) {
    gorilla.angle -= gorilla.angleDirection * angleOffset;
  }
}

function initializeBlueGorilla() {
  var newGorilla = new Gorilla(
    new Vector2(random(0.1*width, 0.2*width), getRandomYPosition()),
    color(0,0,255),
    10,
    45,
    1,
    false);
  gorillas.push(newGorilla);
}

function initializeRedGorilla() {
  var newGorilla = new Gorilla(
    new Vector2(random(0.8*width, 0.9*width), getRandomYPosition()),
    color(255,0,0),
    10,
    45,
    3,
    true);
  gorillas.push(newGorilla);
}

function initializeGreenGorilla() {
  var newGorilla = new Gorilla(
    new Vector2(random(0.45*width, 0.55*width), getRandomYPosition()),
    color(0,255,0),
    10,
    45,
    3,
    true);
  gorillas.push(newGorilla);
}

function initializeMagentaGorilla() {
  var newGorilla = new Gorilla(
    new Vector2(random(0.3*width, 0.4*width), getRandomYPosition()),
    color(255,255,0),
    10,
    45,
    3,
    true);
  gorillas.push(newGorilla);
}

function initializeYellowGorilla() {
  var newGorilla = new Gorilla(
    new Vector2(random(0.6*width, 0.7*width), getRandomYPosition()),
    color(0,255,255),
    10,
    45,
    3,
    true);
  gorillas.push(newGorilla);
}

function getRandomYPosition() {
  return random(0.5 * height, 0.9*height);
}

function updateBanana() {

  updateThrowResult();
  var enemyDestroyed = getEnemyDestroyed();

  if (typeof(enemyDestroyed) !== 'undefined') {
    explosionSound.setVolume(0.3);
    explosionSound.play();
    gorillas = gorillas.filter((x) => x !== enemyDestroyed);
    isBananaFlying = false;
    callNextPlayer();

    if (checkWinState()) {
      gameEnded = true;
    }
  }

  if (hitGround()) {
    isBananaFlying = false;
    storeResultAI();
    callNextPlayer();
    return;
  }

  if (isBananaFlying) {
    bananaPosition = { x: bananaPosition.x + bananaVelocity.x, y: bananaPosition.y + bananaVelocity.y};
    bananaVelocity = { x: bananaVelocity.x + wind, y: bananaVelocity.y + gravity * gravityScaleFactor };
  }
}

function checkWinState() {
  return gorillas.length === 1;
}

function callNextPlayer() {
  currentPlayerIndex = ++currentPlayerIndex % gorillas.length;
}

function getEnemyDestroyed() {
  if (isBananaFlying) {
    var otherGorillas = gorillas.filter(x => x !== gorillas[currentPlayerIndex]);
    var hitGorilla = otherGorillas
      .filter(x => x.position.dist(bananaPosition) < (bananaDiameter/2 + gorillaDiameter/2));    

    if (hitGorilla.length > 0) {
      return hitGorilla[0];
    }
  }
}

function updateThrowResult() {
  var currentGorilla = gorillas[currentPlayerIndex];

  if (!currentGorilla.npc) {
    return;
  }

  // if (Math.abs(bananaPosition.y - currentGorilla.target.position.y) < 10) {
  if(currentGorilla.target.position.dist(bananaPosition) < currentGorilla.throwResult || typeof(currentGorilla.throwResult) === 'undefined') {
    currentGorilla.throwResult = currentGorilla.target.position.dist(bananaPosition);
    console.log(currentGorilla.throwResult);
  }
  // }
}

function hitGround() {
  if (isBananaFlying) {
    return bananaPosition.y > height ||
      bananaPosition.x > width * 1.5 ||
      bananaPosition.x < -0.5 * width;
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

/* AI Functions 
* new gorilla attributes:
* - target: Gorilla
* - throwResult
* - previousThrowResult
* - aimProgress
* - aimStrategy
*     .angle
*     .strength
*/


function selectTargetAI() {
  var currentGorilla = gorillas[currentPlayerIndex];
  if (typeof(currentGorilla.target) === 'undefined') {
    var targetIndex = Math.floor(random(gorillas.length - 1));

    // discard itself
    if (targetIndex >= currentPlayerIndex) {
      targetIndex++;
    }

    currentGorilla.target = gorillas[targetIndex];
  }
}

function generateFirstGuessAI() {
  var currentGorilla = gorillas[currentPlayerIndex];
  currentGorilla.strength = 8;

  // target on the left or right?
  if (currentGorilla.target.position.x > currentGorilla.position) {
    if (currentGorilla.quadrant === 1) {
      currentGorilla.angle = 45;
    } else {
      currentGorilla.angle = 135;
    }
  } else {
    if (currentGorilla.quadrant === 1) {
      currentGorilla.angle = 135;
    } else {
      currentGorilla.angle = 45;
    }
  }
}

// need improvements, would be better if I could know which side of target was the thrown
function storeResultAI() {
  var currentGorilla = gorillas[currentPlayerIndex];

  // if target exists store the distance, otherwhise the target has been destroyed
  if (currentGorilla.target) {
    if (typeof(currentGorilla.previousThrowResult) !== 'undefined') {
      currentGorilla.aimProgress = currentGorilla.previousThrowResult - currentGorilla.throwResult;
    }
    currentGorilla.previousThrowResult = currentGorilla.throwResult;
    currentGorilla.throwResult = undefined;
  } else {
    currentGorilla.throwResult = undefined;
    currentGorilla.previousThrowResult = undefined;
  }
}

/* Consider two strategies that can be combined: angle strategy and strength strategy */
function setAimStrategyAI() {
  var currentGorilla = gorillas[currentPlayerIndex];
  var randomOffsetFactor = random(5, 20);

  // first set strategy
  if (typeof(currentGorilla.aimStrategy) === 'undefined') {
    currentGorilla.aimStrategy = {
      angle: angleOffset * randomOffsetFactor,
      strength: strengthOffset * randomOffsetFactor
    };

    return;
  }

  var strengthStrategy = 1;
  var angleStrategy = 1;

  // aim diverging
  if (currentGorilla.aimProgress <= 0) {
    // flip a coin
    if (Math.floor(random(2)) > 0) {
      strengthStrategy *= -1;
    } else {
      angleStrategy *= -1;
    }

    currentGorilla.aimStrategy.angle *= angleStrategy;
    currentGorilla.aimStrategy.strength *= strengthStrategy;
  }
}

function updateAimAI() {
  var currentGorilla = gorillas[currentPlayerIndex];

  currentGorilla.angle += currentGorilla.aimStrategy.angle;
  currentGorilla.strength += currentGorilla.aimStrategy.strength;
}
