define(["p5", "vector2", "gorilla", "p5.sound"], function(p5, Vector2, Gorilla) {

  var p5Instance = new p5(function( sketch ) {

    var gorillas;
    var currentPlayerIndex;
    var bananaPosition;
    var bananaVelocity;
    var wind;
    var bananaDiameter = 10;
    var gorillaDiameter = 20;
    var isBananaFlying = false;
    var gameEnded = false;
    var strengthAxis = 0;
    var angleAxis = 0;

    var gravity = 9.81;
    var gravityScaleFactor = 1 / 60;
    var cannonLength = 20;
    var strengthOffset = 0.15;
    var angleOffset = 0.9;
    var cannonFireSound;
    var explosionSound;
    var cannonFireSoundFile = 'assets/sounds/Tank Firing-SoundBible.com-998264747.mp3';
    var explosionSoundFile = 'assets/sounds/Bomb 3-SoundBible.com-1260663209.mp3';

    sketch.preload = function() {
      cannonFireSound = sketch.loadSound(cannonFireSoundFile);
      explosionSound = sketch.loadSound(explosionSoundFile);
    }

    sketch.setup = function() {
      sketch.createCanvas(600,600);
      sketch.resetGame();
      sketch.frameRate(60);
    }

    sketch.draw = function() {
      sketch.background(255);

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

    sketch.keyPressed = function () {
      
    };
  }, 'sketch-div'); 

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
    text (endGameText, width / 2, height / 2);
    textSize(14);
    text ('Enter para continuar', width / 2, height / 2 + 20);
  }

  function drawTarget() {
    noStroke();
    var { color, strength, angle, textAlignment, textX } = gorillas[currentPlayerIndex];
    fill(color);
    textAlign(textAlignment);
    textSize(14);
    text ('Força: ' + strength.toFixed(2), textX, 25);
    text ('Ângulo: ' + Math.abs(angle % 90).toFixed(2), textX, 60);
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
    
    initalizeGorila('blue', 45, false);
    initalizeGorila('red', 135, true);
    initalizeGorila('green', 135, true);
    initalizeGorila('magenta', 135, true);
    initalizeGorila('yellow', 135, true);
    currentPlayerIndex = 0;
    isBananaFlying = false;
    gameEnded = false;
    strengthAxis = 0;
    angleAxis = 0;
    wind = random(-0.1,0.1);
  }

  function updateTarget() {

    if (isBananaFlying) {
      return;
    }

    var gorilla = gorillas[currentPlayerIndex];
    if (gorilla.npc) {
      if (gorillas.indexOf(gorilla.ai.target) === -1) {
        gorilla.selectTargetAI(gorillas, currentPlayerIndex);
        gorilla.generateFirstGuessAI();
      } else if (!gorilla.aimDefined()) {
        gorilla.setAimStrategyAI(strengthOffset, angleOffset);
        gorilla.updateAimAI();
      }

      strengthAxis = gorilla.getStrengthAxis(strengthOffset);
      angleAxis = gorilla.getAngleAxis(angleOffset);

      if (strengthAxis === 0 && angleAxis === 0) {
        throwBanana();
        return;
      }
    }

    gorilla.strength += strengthAxis * strengthOffset;
    gorilla.angle += angleAxis * angleOffset;

    gorilla.strength = wrapStrength(gorilla.strength);
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

  function wrapStrength(strength) {
    if (strength > 20) {
      strength = 20;
    } else if (strength < 0) {
      strength = 0;
    }

    return strength;
  }

  function initalizeGorila(gorillaColor, angle, npc) {
    var xPos = (gorillas.length * .2 + .1) * width;
    var newGorilla = new Gorilla(
      gorillaColor,
      new Vector2(xPos, getRandomYPosition()),
      color(gorillaColor),
      10,
      angle,
      npc);
    gorillas.push(newGorilla);
  }

  function getRandomYPosition() {
    return random(0.5 * height, 0.9 * height);
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
        .filter(x => x.position.dist(bananaPosition) < (bananaDiameter / 2 + gorillaDiameter / 2));

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

    if (typeof(currentGorilla.ai.throwResult) === 'undefined') {
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

    if (gorillas[currentPlayerIndex].npc) {
      return;
    }

    handleBananaThrow();
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
      strengthAxis = 1;
    } else if (keyCode === DOWN_ARROW) {
      strengthAxis = -1;
    } else if (keyCode === LEFT_ARROW) {
      angleAxis = 1;
    } else if (keyCode === RIGHT_ARROW) {
      angleAxis = -1;
    }
  }

  function keyReleased() {
    if (keyCode === UP_ARROW) {
      strengthAxis = 0;
    } else if (keyCode === DOWN_ARROW) {
      strengthAxis = 0;
    } else if (keyCode === LEFT_ARROW) {
      angleAxis = 0;
    } else if (keyCode === RIGHT_ARROW) {
      angleAxis = 0;
    }
  }
});