define(["p5", "vector2", "gorilla", "banana", "p5.sound"], function(p5, Vector2, Gorilla, Banana) {

  let processing;

	let banana;
	
  var gorillas;
  var currentPlayerIndex;
  var bananaPosition;
  var bananaVelocity;
  var wind;
  var bananaDiameter = 15;
  var gorillaDiameter = 40;
  var isBananaFlying = false;
  var gameEnded = false;
  var strengthAxis = 0;
  var angleAxis = 0;

  var touchControlCenter;
  var touchControlActive = false;
  var touchControlDrag = false;
  var touchControlButtonDist = 100;
  var touchControlActivationDist = 15;
  var touchControlRadius = 50;
  var touchControlPosition = touchControlCenter;

  var gravity = 9.81;
  var gravityScaleFactor = 1 / 60;
  var cannonLength = 30;
  var strengthOffset = 0.15;
  var angleOffset = 0.9;
  var cannonFireSound;
  var explosionSound;
  var cannonFireSoundFile = 'assets/sounds/Tank Firing-SoundBible.com-998264747.mp3';
  var explosionSoundFile = 'assets/sounds/Bomb 3-SoundBible.com-1260663209.mp3';

  var p5Instance = new p5(function( sketch ) {

    processing = sketch;
    sketch.preload = preload;
    sketch.setup = setup;
    sketch.draw = draw;

    sketch.keyPressed = keyPressed;
    sketch.keyReleased = keyReleased;
    sketch.mousePressed = mousePressed;
    sketch.mouseDragged = mouseDragged;
    sketch.mouseReleased = mouseReleased;
  }, 'sketch-div');

  function preload() {
    cannonFireSound = processing.loadSound(cannonFireSoundFile);
    explosionSound = processing.loadSound(explosionSoundFile);
  }

  function setup() {    
    processing.createCanvas(window.innerWidth, window.innerHeight);
    
    touchControlCenter = new Vector2(processing.width / 2, processing.height / 2);
    
    resetGame();
    processing.frameRate(60);
  }

  function draw() {
    processing.background(255);

    if (!gameEnded) {
      drawGorillas();
      updateTarget();
      displayTouchControl();
	    updateBanana();
      drawBanana();
      drawTarget();
    } else {
      displayGameResult();
    }
  }
  
  function displayTouchControl() {
    if (getCurrentGorilla().npc || isBananaFlying) {
      return;
    }

    if (touchControlActive) {
      touchControlPosition.x = processing.mouseX;
      touchControlPosition.y = processing.mouseY;

      processing.strokeWeight(0);
      processing.fill(processing.color('red'));
      processing.ellipse(touchControlPosition.x, touchControlPosition.y, touchControlRadius, touchControlRadius);
    } else {
      processing.noStroke();
      processing.fill(processing.color('red'));
      processing.ellipse(touchControlCenter.x, touchControlCenter.y, touchControlRadius, touchControlRadius);
      processing.fill(processing.color('white'));
      processing.ellipse(touchControlCenter.x, touchControlCenter.y, 0.7 * touchControlRadius, 0.7 * touchControlRadius);
      processing.fill(processing.color('red'));
      processing.ellipse(touchControlCenter.x, touchControlCenter.y, 0.3 * touchControlRadius, 0.3 * touchControlRadius);
    }
  }

  function mousePressed() {
    touchControlPosition = new Vector2(processing.mouseX, processing.mouseY);
    touchControlActive = touchControlPosition.dist(touchControlCenter) <= touchControlRadius;
  }

  function mouseDragged() {
    touchControlDrag = true;
    
    touchControlPosition.x = processing.mouseX;
    touchControlPosition.y = processing.mouseY;

    var yDiff = touchControlCenter.y - touchControlPosition.y;
    var xDiff = touchControlCenter.x - touchControlPosition.x;

    if (Math.abs(yDiff) > processing.height/20) {
      strengthAxis = 2 * yDiff / processing.height;
    } else {
      strengthAxis = 0;
    }

    if (Math.abs(xDiff) > processing.width/20) {
      angleAxis = 2 * xDiff / processing.width;
    } else {
      angleAxis = 0;
    }
  }

  // stub
  function mouseReleased() {
    if (gameEnded) {
      resetGame();
    }

    if (!touchControlDrag && touchControlActive && !isBananaFlying) {
      throwBanana();
    }

    touchControlActive = false;
    touchControlDrag = false;
    touchControlPosition = touchControlCenter;
    strengthAxis = 0;
    angleAxis = 0;
  }

  function displayGameResult() {

    var gorilla;
    var endGameText = '';

    if (noMorePlayers()) {
      var lastPlayerIndex = currentPlayerIndex === 0 ? 0 : currentPlayerIndex - 1;
      gorilla = gorillas[lastPlayerIndex];

      endGameText = 'Você perdeu!';
    } else {
      gorilla = getCurrentGorilla();
      endGameText = 'Parabéns!';
    }

    var { color, strength, angle } = gorilla;

    processing.textAlign(processing.CENTER);
    processing.fill(color);
    processing.textSize(26);
    processing.text (endGameText, processing.width / 2, processing.height / 2);
    processing.textSize(14);
    processing.text ('Enter para continuar', processing.width / 2, processing.height / 2 + 20);
  }

  function drawTarget() {
    processing.noStroke();
    var { color, strength, angle, npc } = getCurrentGorilla();

    const textAlignment = npc ? processing.RIGHT : processing.LEFT;
    const textX = npc ? processing.width - 60 : 10;

    processing.fill(color);
    processing.textAlign(textAlignment);
    processing.textSize(14);
    processing.text ('Força: ' + strength.toFixed(2), textX, 25);
    processing.text ('Ângulo: ' + Math.abs(angle % 90).toFixed(2), textX, 60);
    processing.fill(255);
  }

  function drawBanana() {
    if (isBananaFlying) {
      processing.ellipse(bananaPosition.x, bananaPosition.y, bananaDiameter, bananaDiameter);

	    if (typeof(banana) !== 'undefined')
			  banana.render(processing);

    }
  }

  function drawGorillas() {
    gorillas.forEach(gorilla => {
      const { color, position } = gorilla;

      var cannonEnd = getGorillaCannonTip(gorilla);

      processing.fill(color);
      processing.stroke(color);
      processing.strokeWeight(10);
      processing.ellipse(position.x, position.y, gorillaDiameter, gorillaDiameter);
      processing.line(
        position.x,
        position.y,
        cannonEnd.x,
        cannonEnd.y);
      processing.fill(255);
      processing.strokeWeight(1);
      processing.stroke(1);
    });
  }

  function getGorillaCannonTip(gorilla) {
    const { color, strength, angle, position } = gorilla;

    return new Vector2(
      position.x + (cannonLength + strength) * processing.cos(processing.radians(angle)),
      position.y + (cannonLength + strength) * -processing.sin(processing.radians(angle))
    );
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
    wind = processing.random(-0.1,0.1);
  }

  function updateTarget() {

    if (isBananaFlying) {
      return;
    }

    var gorilla = getCurrentGorilla();
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

    gorilla.addStrength(strengthAxis * strengthOffset);
    gorilla.addAngle(angleAxis * angleOffset);
  }

  function initalizeGorila(gorillaColor, angle, npc) {
    var xPos = (gorillas.length * 0.2 + 0.1) * processing.width;
    var newGorilla = new Gorilla(
      gorillaColor,
      new Vector2(xPos, getRandomYPosition()),
      processing.color(gorillaColor),
      10,
      angle,
      npc);
    gorillas.push(newGorilla);
  }

  function getRandomYPosition() {
    return processing.random(0.5 * processing.height, 0.9 * processing.height);
  }

  function getCurrentGorilla() {
    return gorillas[currentPlayerIndex];
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
      getCurrentGorilla().storeResultAI();
      callNextPlayer();
      return;
    }

    if (isBananaFlying) {
      bananaPosition = { x: bananaPosition.x + bananaVelocity.x, y: bananaPosition.y + bananaVelocity.y};
      bananaVelocity = { x: bananaVelocity.x + wind, y: bananaVelocity.y + gravity * gravityScaleFactor };

	    if (typeof(banana) !== 'undefined')
			  banana.update();

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
      var otherGorillas = gorillas.filter(x => x !== getCurrentGorilla());
      var hitGorilla = otherGorillas
        .filter(x => x.position.dist(bananaPosition) < (bananaDiameter / 2 + gorillaDiameter / 2));

      if (hitGorilla.length > 0) {
        return hitGorilla[0];
      }  
    }
  }

  function updateThrowResult() {
    var currentGorilla = getCurrentGorilla();

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
      return bananaPosition.y > processing.height ||
        bananaPosition.x > processing.width * 1.5 ||
        bananaPosition.x < -0.5 * processing.width;
    }

    return false;
  }

  function handleKeyBananaThrow() {
    if (processing.keyCode === processing.ENTER && !isBananaFlying) {
      throwBanana();
    }
  }

  function throwBanana() {
    isBananaFlying = true;
    var gorilla = getCurrentGorilla();
    bananaPosition = getGorillaCannonTip(gorilla);
    bananaVelocity = new Vector2(
      gorilla.strength * processing.cos(processing.radians(gorilla.angle)),
      gorilla.strength * -processing.sin(processing.radians(gorilla.angle)));

	  var bananaMass = 1;
	  banana = new Banana(bananaMass, gravity * gravityScaleFactor, bananaDiameter);
	  
	  banana.physics.setPosition(getGorillaCannonTip(gorilla));
	  banana.physics.setVelocity(new Vector2(
		  gorilla.strength * processing.cos(processing.radians(gorilla.angle)),
      gorilla.strength * -processing.sin(processing.radians(gorilla.angle))));
	  
	  
    cannonFireSound.setVolume(0.3);
    cannonFireSound.play();
  }

  function handleKeyRestart() {
    if (processing.keyCode === processing.ENTER && gameEnded) {
      resetGame();
    }
  }

  function handleKeyControls() {
    if (processing.keyCode === processing.UP_ARROW) {
      strengthAxis = 1;
    } else if (processing.keyCode === processing.DOWN_ARROW) {
      strengthAxis = -1;
    } else if (processing.keyCode === processing.LEFT_ARROW) {
      angleAxis = 1;
    } else if (processing.keyCode === processing.RIGHT_ARROW) {
      angleAxis = -1;
    }
  }

  function keyPressed() {

    if (gameEnded) {
      handleKeyRestart();
      return;
    }

    if (getCurrentGorilla().npc) {
      return;
    }

    handleKeyBananaThrow();
    handleKeyControls();
  }

  function keyReleased() {
    if (processing.keyCode === processing.UP_ARROW) {
      strengthAxis = 0;
    } else if (processing.keyCode === processing.DOWN_ARROW) {
      strengthAxis = 0;
    } else if (processing.keyCode === processing.LEFT_ARROW) {
      angleAxis = 0;
    } else if (processing.keyCode === processing.RIGHT_ARROW) {
      angleAxis = 0;
    }
  }
});
