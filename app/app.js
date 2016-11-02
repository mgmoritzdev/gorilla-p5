define(["p5", "vector2", "gorilla", "p5.sound"], function(p5, Vector2, Gorilla) {

  let processing;

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

  var touchControlActive = false;
  var touchControlDrag = false;
  var touchControlCenter = new Vector2(300,300);
  var touchControlButtonDist = 100;
  var touchControlActivationDist = 15;
  var touchControlStrengthUp = new Vector2(touchControlCenter.x, touchControlCenter.y - touchControlButtonDist);
  var touchControlStrengthDown = new Vector2(touchControlCenter.x, touchControlCenter.y + touchControlButtonDist);
  var touchControlAngleCW = new Vector2(touchControlCenter.x + touchControlButtonDist, touchControlCenter.y);
  var touchControlAngleCCW = new Vector2(touchControlCenter.x - touchControlButtonDist, touchControlCenter.y);
  var touchControlRadius = 50;
  var touchControlPosition = touchControlCenter;

  var gravity = 9.81;
  var gravityScaleFactor = 1 / 60;
  var cannonLength = 20;
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
    processing.createCanvas(600,600);
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
  
  // stub
  function displayTouchControl() {
    if (gorillas[currentPlayerIndex].npc) {
      return;
    }

    if (touchControlActive) {
      touchControlPosition.x = processing.mouseX;
      touchControlPosition.y = processing.mouseY;

      diplayTouchControlTargets();
      processing.strokeWeight(0);
      processing.fill(processing.color('red'));
      processing.ellipse(touchControlPosition.x, touchControlPosition.y, touchControlRadius, touchControlRadius);
    } else {
      processing.fill(processing.color('blue'));
      processing.ellipse(touchControlCenter.x, touchControlCenter.y, touchControlRadius, touchControlRadius);
    }
  }

  // stub
  function mousePressed() {
    touchControlPosition = new Vector2(processing.mouseX, processing.mouseY);
    touchControlActive = touchControlPosition.dist(touchControlCenter) <= touchControlRadius;
  }

  function mouseDragged() {
    touchControlDrag = true;
    // detect if some action was activated
    touchControlPosition.x = processing.mouseX;
    touchControlPosition.y = processing.mouseY;

    if (touchControlStrengthUp.dist(touchControlPosition) <= touchControlActivationDist){
      strengthAxis = 1;
    } else if (touchControlStrengthDown.dist(touchControlPosition) <= touchControlActivationDist){
      strengthAxis = -1;
    } else {
      strengthAxis = 0;
    }

    if (touchControlAngleCW.dist(touchControlPosition) <= touchControlActivationDist){
      angleAxis = -1;
    } else if (touchControlAngleCCW.dist(touchControlPosition) <= touchControlActivationDist){
      angleAxis = 1;
    } else {
      angleAxis = 0;
    }
  }

  // stub
  function mouseReleased() {
    if (gameEnded) {
      resetGame();
    }

    if (!touchControlDrag && touchControlActive) {
      throwBanana();
    }

    touchControlActive = false;
    touchControlDrag = false;
    touchControlPosition = touchControlCenter;
    strengthAxis = 0;
    angleAxis = 0;
  }

  function diplayTouchControlTargets() {
    processing.strokeWeight(1);
    processing.fill(processing.color(0,0,0,0));
    // touchControlPosition.x = processing.mouseX;
    // touchControlPosition.y = processing.mouseY;
    processing.ellipse(touchControlStrengthUp.x, touchControlStrengthUp.y, touchControlRadius, touchControlRadius);
    processing.ellipse(touchControlStrengthDown.x, touchControlStrengthDown.y, touchControlRadius, touchControlRadius);
    processing.ellipse(touchControlAngleCW.x, touchControlAngleCW.y, touchControlRadius, touchControlRadius);
    processing.ellipse(touchControlAngleCCW.x, touchControlAngleCCW.y, touchControlRadius, touchControlRadius);
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
    var { color, strength, angle, npc } = gorillas[currentPlayerIndex];

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
    }
  }

  function drawGorillas() {
    gorillas.forEach(gorilla => {
      const { color, strength, angle, position, angleDirection } = gorilla;

      processing.fill(color);
      processing.stroke(color);
      processing.strokeWeight(5);
      processing.ellipse(position.x, position.y, gorillaDiameter, gorillaDiameter);
      processing.line(
        position.x,
        position.y,
        position.x + (cannonLength + strength / 2) * processing.cos(processing.radians(angle)),
        position.y + (cannonLength + strength / 2) * -processing.sin(processing.radians(angle)));
      processing.fill(255);
      processing.strokeWeight(1);
      processing.stroke(1);
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
    wind = processing.random(-0.1,0.1);
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
      return bananaPosition.y > processing.height ||
        bananaPosition.x > processing.width * 1.5 ||
        bananaPosition.x < -0.5 * processing.width;
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
    var gorilla = gorillas[currentPlayerIndex];
    bananaPosition = gorilla.position;
    bananaVelocity = new Vector2(
      gorilla.strength * gorilla.angleDirection * processing.cos(processing.radians(gorilla.angle)),
      gorilla.strength * -processing.sin(processing.radians(gorilla.angle)));
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
      handleRestart();
      return;
    }

    if (gorillas[currentPlayerIndex].npc) {
      return;
    }

    handleBananaThrow();
    handleControls();
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