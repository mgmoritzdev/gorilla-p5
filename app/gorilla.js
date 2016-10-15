define(['p5', 'p5sound'], function(p5, p5sound) {

  var processing;
  var blueGorillaPos;
  var redGorillaPos;
  var bananaPosition;
  var bananaVelocity;
  var blueGorillaAngle;
  var redGorillaAngle;
  var blueGorillaStrength;
  var redGorillaStrength;
  var wind;
  var width = 600;
  var height = 600;
  var bananaDiameter = 10;
  var gorillaDiameter = 20;
  var isBananaFlying = false;
  var isBlueGorillaTurn = true;
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

  Vector2.dist = function(otherVector) {
    
  };

  var Gorilla = function(position, color, angle, quadrant) {
    this.position = position;
    this.color = color;
    this.angle = angle;
  };

  var myp5 = new p5(function(sketch) {
    
    var t = p5sound;
    processing = sketch;

    sketch.preload = function() {
      cannonFireSound = sketch.loadSound(cannonFireSoundFile);
      explosionSound = sketch.loadSound(explosionSoundFile);
    }

    sketch.setup = function() {
      sketch.createCanvas(width,height);
      resetGame();
      sketch.frameRate(60);
    }

    sketch.draw = function() {

      sketch.background(255);

      if (!gameEnded) {
        drawBlueGorilla();
        drawRedGorilla();
        updateTarget();
        updateBanana();
        drawBanana();
        drawTarget();
      }
    }

    sketch.keyPressed = function() {

      if (gameEnded) {
        handleRestart();
        return;
      }
      handleBananaThrow();


      gameStarted = true;
      handleControls();
    }

    sketch.keyReleased = function() {
      if (sketch.keyCode === sketch.UP_ARROW) {
        addStrength = false;
      } else if (sketch.keyCode === sketch.DOWN_ARROW) {
        subtractStrength = false;
      } else if (sketch.keyCode === sketch.LEFT_ARROW) {
        addAngle = false;
      } else if (sketch.keyCode === sketch.RIGHT_ARROW) {
        subtractAngle = false;
      }
    }
  });
  

  

  function drawTarget() {
    if (isBlueGorillaTurn) {
      processing.noStroke();
      processing.fill(0,0,255);
      processing.textAlign(processing.LEFT);
      processing.text ('Força: ' + blueGorillaStrength.toFixed(2), 10, 25);
      processing.text ('Ângulo: ' + blueGorillaAngle.toFixed(2), 10, 60);
      processing.fill(255);
    } else {
      processing.noStroke();
      processing.fill(255,0,0);
      processing.textAlign(processing.RIGHT);
      processing.text ('Força: ' + redGorillaStrength.toFixed(2), width-60, 25);
      processing.text ('Ângulo: ' + redGorillaAngle.toFixed(2), width-60, 60);
      processing.fill(255);
      processing.textAlign(processing.RIGHT);
    }
  }

  function drawBanana() {
    if (isBananaFlying) {
      processing.ellipse(bananaPosition.x, bananaPosition.y, bananaDiameter, bananaDiameter);
    }
  }

  function drawBlueGorilla() {
    processing.fill(0,0,255);
    processing.stroke(0,0,255);
    processing.strokeWeight(5);
    processing.ellipse(blueGorillaPos.x, blueGorillaPos.y, gorillaDiameter, gorillaDiameter);
    processing.line(
      blueGorillaPos.x,
      blueGorillaPos.y,
      blueGorillaPos.x + cannonLength * processing.cos(processing.radians(blueGorillaAngle)),
      blueGorillaPos.y + cannonLength * -processing.sin(processing.radians(blueGorillaAngle)));
    processing.fill(255);
    processing.strokeWeight(1);
    processing.stroke(1);
  }

  function drawRedGorilla() {
    processing.fill(255,0,0);
    processing.stroke(255,0,0);
    processing.strokeWeight(5);
    processing.ellipse(redGorillaPos.x, redGorillaPos.y, gorillaDiameter, gorillaDiameter);
    processing.line(
      redGorillaPos.x,
      redGorillaPos.y,
      redGorillaPos.x + cannonLength * -processing.cos(processing.radians(redGorillaAngle)),
      redGorillaPos.y + cannonLength * -processing.sin(processing.radians(redGorillaAngle)));
    processing.fill(255);
    processing.strokeWeight(1);
    processing.stroke(1);
  }

  function resetGame() {
    initializeBlueGorilla();
    initializeRedGorilla();
    isBananaFlying = false;
    isBlueGorillaTurn = true;
    gameStarted = true;
    gameEnded = false;
    addStrength = false;
    subtractStrength = false;
    addAngle = false;
    subtractAngle = false;
    wind = processing.random(-0.1,0.1);
  }

  function updateTarget() {
    if (isBananaFlying) {
      return;
    }

    if (addStrength) {
      if (isBlueGorillaTurn) {
        blueGorillaStrength += strengthOffset;
      } else {
        redGorillaStrength += strengthOffset;
      }
    } else if (subtractStrength) {
      if (isBlueGorillaTurn) {
        blueGorillaStrength -= strengthOffset;
      } else {
        redGorillaStrength -= strengthOffset;
      }
    }

    if (addAngle) {
      if (isBlueGorillaTurn) {
        blueGorillaAngle += angleOffset;
      } else {
        redGorillaAngle -= angleOffset;
      }
    } else if (subtractAngle) {
      if (isBlueGorillaTurn) {
        blueGorillaAngle -= angleOffset;
      } else {
        redGorillaAngle += angleOffset;
      }
    }
  }

  function initializeBlueGorilla() {
    blueGorillaAngle = 45;
    blueGorillaStrength = 10;
    blueGorillaPos = { x: processing.random(0.1*width, 0.2*width), y:getRandomYPosition() };
  }

  function initializeRedGorilla() {
    redGorillaStrength = 10;
    redGorillaAngle = 45;
    redGorillaPos = { x: processing.random(0.8*width, 0.9*width), y: getRandomYPosition() };
  }

  function getRandomYPosition() {
    return processing.random(0.5*height, 0.9*height);
  }

  function updateBanana() {

    if (checkWinState()) {
      var gorilla = '';
      if (isBlueGorillaTurn) {
        gorilla = 'Blue';
      } else {
        gorilla = 'Red';
      }
      explosionSound.setVolume(0.3);
      explosionSound.play();
      gameEnded = true;
    }

    if (hitGround()) {
      isBananaFlying = false;
      isBlueGorillaTurn = !isBlueGorillaTurn;
      return;
    }

    if (isBananaFlying) {
      bananaPosition = { x: bananaPosition.x + bananaVelocity.x, y: bananaPosition.y + bananaVelocity.y};
      bananaVelocity = { x: bananaVelocity.x + wind, y: bananaVelocity.y + gravity * gravityScaleFactor };
    }
  }

  function checkWinState() {
    if (isBananaFlying) {
      return distance(bananaPosition, isBlueGorillaTurn ? redGorillaPos : blueGorillaPos) < (bananaDiameter/2 + gorillaDiameter/2);
    }
    return false;
  }

  function distance(v1, v2) {
    return Math.pow(Math.pow(Math.abs(v1.x - v2.x), 2) + Math.pow(Math.abs(v1.y - v2.y),2), 0.5);
  }

  function hitGround() {
    if (isBananaFlying) {
      return bananaPosition.y > height;
    }

    return false;
  }

  function handleBananaThrow() {
    if (processing.keyCode === processing.ENTER && !isBananaFlying) {
      throwBanana();
    }
  }

  function throwBanana() {
    isBananaFlying = true;
    bananaPosition = isBlueGorillaTurn ? blueGorillaPos : redGorillaPos;
    bananaVelocity = {
      x:
        isBlueGorillaTurn ? blueGorillaStrength * processing.cos(processing.radians(blueGorillaAngle)) : redGorillaStrength * -processing.cos(processing.radians(redGorillaAngle)),
      y:
        isBlueGorillaTurn ? blueGorillaStrength * -processing.sin(processing.radians(blueGorillaAngle)) : redGorillaStrength * -processing.sin(processing.radians(redGorillaAngle)) };
    
    cannonFireSound.setVolume(0.3);
    cannonFireSound.play();
  }

  function handleRestart() {
    if (processing.keyCode === processing.ENTER && gameEnded) {
      resetGame();
    }
  }

  function handleControls() {
    if (processing.keyCode === processing.UP_ARROW) {
      addStrength = true;
    } else if (processing.keyCode === processing.DOWN_ARROW) {
      subtractStrength = true;
    } else if (processing.keyCode === processing.LEFT_ARROW) {
      addAngle = true;
    } else if (processing.keyCode === processing.RIGHT_ARROW) {
      subtractAngle = true;
    }
  }
});