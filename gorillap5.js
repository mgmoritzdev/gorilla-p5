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

var Gorilla = function(position, color, strength, angle, faceRight, npc) {
  this.position = position;
  this.color = color;
  this.strength = strength;
  this.angle = angle;

  this.npc = npc || false;
  this.ai = {};

  this.textAlignment = this.npc ? RIGHT : LEFT;
  this.textX = this.npc ? width - 60 : 10;
  this.angleDirection = this.npc ? 1 : 1;
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

  var gorilla;
  var endGameText = '';

  if (noMorePlayers()) {
    var lastPlayerIndex = currentPlayerIndex === 0 ? 0 : currentPlayerIndex - 1;
    gorilla = gorillas[lastPlayerIndex];

    endGameText = 'Você perdeu!';
  } else {
    gorilla = gorillas[currentPlayerIndex];
    endGameText = 'Parabéns!';
  }

  var { color, strength, angle, textAlignment, textX } = gorilla;

  textAlign(CENTER);
  fill(color);
  textSize(26);
  text (endGameText, width/2, height/2);
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
    if (gorillas.indexOf(gorilla.ai.target) === -1) {
      gorilla.selectTargetAI();
      gorilla.generateFirstGuessAI();
    } else if(!gorilla.aimDefined()) {
      gorilla.setAimStrategyAI();
      gorilla.updateAimAI();
    } 

    if(gorilla.isLocked()) {
      throwBanana();
      return;
    }
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

  gorilla.angle = wrapAngle(gorilla.angle);
}

function wrapAngle(angle) {
  if (angle > 360) {
    angle -= 360;
  } else if (angle < 0) {
    angle += 360;
  }
  
  return angle;
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
    135,
    3,
    true);
  gorillas.push(newGorilla);
}

function initializeGreenGorilla() {
  var newGorilla = new Gorilla(
    new Vector2(random(0.45*width, 0.55*width), getRandomYPosition()),
    color(0,255,0),
    10,
    135,
    3,
    true);
  gorillas.push(newGorilla);
}

function initializeYellowGorilla() {
  var newGorilla = new Gorilla(
    new Vector2(random(0.3*width, 0.4*width), getRandomYPosition()),
    color(255,255,0),
    10,
    135,
    3,
    true);
  gorillas.push(newGorilla);
}

function initializeMagentaGorilla() {
  var newGorilla = new Gorilla(
    new Vector2(random(0.6*width, 0.7*width), getRandomYPosition()),
    color(255,0,255),
    10,
    135,
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
  var enemyDestroyedIndex = gorillas.indexOf(enemyDestroyed);

  if (typeof(enemyDestroyed) !== 'undefined') {

    explosionSound.setVolume(0.3);
    explosionSound.play();

    if (enemyDestroyedIndex < currentPlayerIndex) {
      currentPlayerIndex--;
    }
    gorillas = gorillas.filter(x => x !== enemyDestroyed);
    isBananaFlying = false;

    callNextPlayer();

    if (checkEndGameState()) {
      gameEnded = true;
    }
  }

  if (hitGround()) {
    isBananaFlying = false;
    gorillas[currentPlayerIndex].storeResultAI();
    callNextPlayer();
    return;
  }

  if (isBananaFlying) {
    bananaPosition = { x: bananaPosition.x + bananaVelocity.x, y: bananaPosition.y + bananaVelocity.y};
    bananaVelocity = { x: bananaVelocity.x + wind, y: bananaVelocity.y + gravity * gravityScaleFactor };
  }
}

function checkEndGameState() {
  return gorillas.length === 1 || noMorePlayers();
}

function noMorePlayers() {
  return gorillas.filter(x => !x.npc).length === 0;
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

  if (!currentGorilla.npc || !isBananaFlying) {
    return;
  }

  if (typeof(currentGorilla.ai.throwResult) === 'undefined'){
    currentGorilla.ai.throwResult = [];
  }
  currentGorilla.ai.throwResult.push(currentGorilla.ai.target.position.dist(bananaPosition));
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


Gorilla.prototype.selectTargetAI = function() {
  var targetIndex = Math.floor(random(gorillas.length - 1));

  // discard itself
  if (targetIndex >= currentPlayerIndex) {
    targetIndex++;
  }

  this.ai.target = gorillas[targetIndex];
};

Gorilla.prototype.generateFirstGuessAI = function() {
  this.ai.strength = 8;

  // target on the left or right?
  if (this.ai.target.position.x < this.position.x) {
    this.ai.angle = 135;
  } else {
    this.ai.angle = 45;
  }
};

// need improvements, would be better if I could know which side of target was the thrown
Gorilla.prototype.storeResultAI = function() {
  // if target exists store the distance, otherwhise the target has been destroyed
  if (this.ai.target) {
    if (typeof(this.ai.previousThrowResult) !== 'undefined') {
      this.ai.aimProgress = getAverage(this.ai.previousThrowResult.sort().slice(0,3)) - getAverage(this.ai.throwResult.sort().slice(0,3));
    }
    this.ai.previousThrowResult = this.ai.throwResult;
    this.ai.throwResult = undefined;
    this.ai.aimDefined = false;
  } else {
    this.ai.throwResult = undefined;
    this.ai.previousThrowResult = undefined;
    this.ai.aimDefined = false;
  }
};

function getAverage(array) {
  var sum = array.reduce(function(a, b) { return a + b; });
  return sum/array.length;
}

/* Consider two strategies that can be combined: angle strategy and strength strategy */
// all combinations of strength and angle are possible:
// strength: [-1, 0, 1] * strength
// angle: [-1, 0, 1] * angle
Gorilla.prototype.setAimStrategyAI = function() {
  var randomOffsetFactor = random(5, 20);

  if (!this.isStrategySet()) {
    this.setStrategy(0, 1);
    return;
  }

  // aim diverging
  if (this.ai.aimProgress <= 0) {
    this.setNextStrategy();
  }
};

Gorilla.prototype.isStrategySet = function() {
  return typeof(this.ai.aimStrategy) !== 'undefined';
};

Gorilla.prototype.setNextStrategy = function() {
  var strategies = [-1, 0, 1];
  var currStrength = this.getDirection(this.ai.aimStrategy.strength);
  var currAngle = this.getDirection(this.ai.aimStrategy.angle);

  if (currAngle === 1) {
    if (currStrength === 1) {
      this.setStrategy(-1, -1);
    }
    else {
      this.setStrategy(currStrength + 1, -1);
    }
  } else {
    this.setStrategy(currStrength, currAngle + 1);
  }
};

Gorilla.prototype.getDirection = function(value) {
  if (value > 0) {
    return 1;
  } else if (value < 0) {
    return -1;
  } else {
    return 0;
  }
};

Gorilla.prototype.setStrategy = function(strengthStrategy, angleStrategy) {
  this.ai.aimStrategy = {
    strength: strengthOffset * strengthStrategy * 10,
    angle: angleOffset * angleStrategy * 10
  };
};

Gorilla.prototype.updateAimAI = function() {
  this.ai.angle = wrapAngle(this.ai.angle + this.ai.aimStrategy.angle);
  this.ai.strength += this.ai.aimStrategy.strength;
  this.ai.aimDefined = true;
};

Gorilla.prototype.aimDefined = function() {
  return this.ai.aimDefined;
};

Gorilla.prototype.isLocked = function() {
  subtractAngle = (this.angle - this.ai.angle > angleOffset);
  addAngle = (this.ai.angle - this.angle > angleOffset);
  addStrength = (this.ai.strength - this.strength > strengthOffset);
  subtractStrength = (this.strength - this.ai.strength  > strengthOffset);

  return !subtractAngle && !addAngle && !subtractStrength && !addStrength;
};
