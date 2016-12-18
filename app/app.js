define(['p5', 'vector2', 'gorilla', 'banana', 'collisionManager', 'p5.sound'], function(p5, Vector2, Gorilla, Banana, cm) {

	let processing;

	let banana;
	var gorillas;
	var currentGorilla;
	
	var wind;
	var bananaDiameter = 15;
	var bananaMass = 1;
	
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

		banana = new Banana(bananaMass, gravity * gravityScaleFactor, bananaDiameter);
	}

	function draw() {
		processing.background(255);

		if (!gameEnded) {
			drawGorillas();
			if (banana.isActive) {
				updateBanana();
				drawBanana();
			} else {
				updateTarget();
				displayTouchControl();
				drawTarget();
			}
		} else {
			displayGameResult();
		}
	}
	
	function displayTouchControl() {
		if (currentGorilla.npc) {
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

	function mouseReleased() {
		if (gameEnded) {
			resetGame();
		}

		if (!touchControlDrag && touchControlActive && !banana.isActive) {
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
			var currentGorillaIndex = gorillas.indexOf(currentGorilla);
			var winnersIndex = currentGorillaIndex === 0 ? gorillas.length - 1 : currentGorillaIndex - 1;
			gorilla = gorillas[winnersIndex];
			endGameText = 'Você perdeu!';
		} else {
			gorilla = currentGorilla;
			endGameText = 'Parabéns!';
		}

		var { color } = gorilla;

		processing.noStroke();
		processing.textAlign(processing.CENTER);
		processing.fill(color);
		processing.textSize(26);
		processing.text (endGameText, processing.width / 2, processing.height / 2);
		processing.textSize(14);
		processing.text ('Enter para continuar', processing.width / 2, processing.height / 2 + 20);
	}

	function drawTarget() {
		processing.noStroke();
		var { color, strength, angle, npc } = currentGorilla;

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
		if (typeof(banana) !== 'undefined') {
			banana.render(processing);
		}
	}

	function drawGorillas() {
		gorillas.forEach(gorilla => {
			gorilla.render(processing);
		});
	}
	
	function resetGame() {
		gorillas = [];
		
		initalizeGorila('blue', 45, false);
		initalizeGorila('red', 135, true);
		initalizeGorila('green', 135, true);
		initalizeGorila('magenta', 135, true);
		initalizeGorila('yellow', 135, true);
		currentGorilla = gorillas[0];
		gameEnded = false;
		strengthAxis = 0;
		angleAxis = 0;
		wind = processing.random(-0.1,0.1);
	}

	function updateTarget() {

		var gorilla = currentGorilla;
		if (gorilla.npc) {
			gorilla.updateTargetAI(gorillas, strengthOffset, angleOffset);
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
			npc,
			10,
			40);
		var collisionCallback = function() {
			cm.removeCollider(newGorilla.collider);
			destroyGorilla(newGorilla);
		};
		newGorilla.physics.addCallbackToCollider(collisionCallback);		
		gorillas.push(newGorilla);
	}

	function destroyGorilla(gorilla) {
		gorillas = gorillas.filter(g => g !== gorilla);

		explosionSound.setVolume(0.3);
		explosionSound.play();

		callNextPlayer();

		if (checkEndGameState()) {
			gameEnded = true;
		}

	}

	function getRandomYPosition() {
		return processing.random(0.5 * processing.height, 0.9 * processing.height);
	}

	function updateBanana() {

		updateThrowResult();
		// var enemyDestroyed = getEnemyDestroyed();
		// var enemyDestroyedIndex = gorillas.indexOf(enemyDestroyed);

		if (typeof(enemyDestroyed) !== 'undefined') {

			// explosionSound.setVolume(0.3);
			// explosionSound.play();

			// if (enemyDestroyedIndex < currentPlayerIndex) {
			// 	currentPlayerIndex--;
			// }			
			// gorillas = gorillas.filter(x => x !== enemyDestroyed);
			// isBananaFlying = false;

			// callNextPlayer();

			// if (checkEndGameState()) {
			// 	gameEnded = true;
			// }
		}
		

		if (hitGround()) {
			banana.isActive = false;
			currentGorilla.storeResultAI();
			callNextPlayer();
			return;
		}

		if (typeof(banana) !== 'undefined') {
			banana.update();
			cm.update();
		}
	}

	function checkEndGameState() {
		return gorillas.length === 1 || noMorePlayers();
	}

	function noMorePlayers() {
		return gorillas.filter(x => !x.npc).length === 0;
	}

	function callNextPlayer() {
		var currentGorillaIndex = gorillas.indexOf(currentGorilla);
		currentGorilla = gorillas[++currentGorillaIndex % gorillas.length];
	}

	function getEnemyDestroyed() {
		var hitGorilla = gorillas
			.filter(x => x !== currentGorilla)
			.filter(x => x.destroy);

		if (hitGorilla.length > 0) {
			return hitGorilla[0];
		}
	}

	function updateThrowResult() {
		if (!currentGorilla.npc) {
			return;
		}

		if (typeof(currentGorilla.ai.throwResult) === 'undefined') {
			currentGorilla.ai.throwResult = [];
		}
		currentGorilla.ai.throwResult.push(currentGorilla.ai.target.position.dist(banana.physics.position));
	}

	function hitGround() {
		return banana.physics.position.y > processing.height ||
			banana.physics.position.x > processing.width * 1.5 ||
			banana.physics.position.x < -0.5 * processing.width;		    
	}

	function handleKeyBananaThrow() {
		if (processing.keyCode === processing.ENTER && !banana.isActive) {
			throwBanana();
		}
	}

	function throwBanana() {
		var gorilla = currentGorilla;

		banana.physics.setPosition(gorilla.getGorillaCannonTip());
		banana.physics.setVelocity(new Vector2(
			gorilla.strength * processing.cos(processing.radians(gorilla.angle)),
			gorilla.strength * -processing.sin(processing.radians(gorilla.angle))));		
		banana.isActive = true;
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

		if (currentGorilla.npc) {
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
