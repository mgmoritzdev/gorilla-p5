var blueGorillaPos;
var redGorillaPos;
var bananaPosition;
var bananaVelocity;
var blueGorillaAngle;
var redGorillaAngle;
var blueGorillaStrength;
var redGorillaStrength;
var wind;
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
var gravityScaleFactor = 0.01;

function setup() {
  createCanvas(600,600);
  resetGame();
}

function draw() {
  
  background(255);
  
  if (!gameEnded){
    drawBlueGorilla();
    drawRedGorilla();
    updateTarget();
    updateBanana();
    drawBanana();
    drawTarget();
  }
}

function drawTarget() {
  if (isBlueGorillaTurn) {
    fill(0,0,255);
    textAlign(LEFT);
    text ("Força: " + blueGorillaStrength.toFixed(2), 10, 25);
    text ("Ângulo: " + blueGorillaAngle.toFixed(2), 10, 60);
    fill(255);
  } else {
    fill(255,0,0);
    textAlign(RIGHT);
    text ("Força: " + redGorillaStrength.toFixed(2), width-60, 25);    
    text ("Ângulo: " + redGorillaAngle.toFixed(2), width-60, 60);
    fill(255);
    textAlign(RIGHT);
  }
}

function drawBanana() {
  if (isBananaFlying) {
    ellipse(bananaPosition.x, bananaPosition.y, bananaDiameter, bananaDiameter);
  }  
}

function drawBlueGorilla() {
  fill(0,0,255);
  ellipse(blueGorillaPos.x, blueGorillaPos.y, gorillaDiameter, gorillaDiameter);
  fill(255);
}

function drawRedGorilla() {
  fill(255,0,0);
  ellipse(redGorillaPos.x, redGorillaPos.y, gorillaDiameter, gorillaDiameter);
  fill(255);
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
  wind = random(-0.1,0.1);
}

function updateTarget() {
  if (isBananaFlying) {
    return;
  }
  
  if (addStrength){
    if (isBlueGorillaTurn) {
      blueGorillaStrength += 0.05;
      println("strenght: " + blueGorillaStrength);
    } else {
      redGorillaStrength += 0.05;
      println("strenght: " + redGorillaStrength);
    }
  } else if(subtractStrength) {
    if (isBlueGorillaTurn) {
      blueGorillaStrength -= 0.05;
      println("strenght: " + blueGorillaStrength);
    } else {
      redGorillaStrength -= 0.05;
      println("strenght: " + redGorillaStrength);
    }
  }
  
  if (addAngle){
    if (isBlueGorillaTurn) {
      blueGorillaAngle += 0.05;
      println("angle: " + blueGorillaAngle);
    } else {
      redGorillaAngle -= 0.05;
      println("angle: " + redGorillaAngle);
    }
  } else if (subtractAngle) {
    if (isBlueGorillaTurn) {
      blueGorillaAngle -= 0.05;
      println("angle: " + blueGorillaAngle);
    } else {
      redGorillaAngle += 0.05;
      println("angle: " + redGorillaAngle);
    }
  }
}

function initializeBlueGorilla() {  
  blueGorillaAngle = 45;
  blueGorillaStrength = 10;
  blueGorillaPos = { x: random(0.1*width, 0.2*width), y:getRandomYPosition() };
}

function initializeRedGorilla() {
  redGorillaStrength = 10;
  redGorillaAngle = 45;
  redGorillaPos = { x: random(0.8*width, 0.9*width), y: getRandomYPosition() }; 
}

function getRandomYPosition(){
  return random(0.5*height, 0.9*height);
}

function updateBanana(){
  
  if (checkWinState()){
    var gorilla = "";
    if (isBlueGorillaTurn) {
      gorilla = "Blue";
    } else {
      gorilla = "Red";
    } 
    println(gorilla + " Gorilla Wins");
    gameEnded = true;
  }
  
  if (hitGround()){
    println("Hit Ground");
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

function keyPressed(){
  
  if (gameEnded) {
    handleRestart();
    return;
  }
  handleBananaThrow();
  
  
  gameStarted = true;
  handleControls();    
}

function handleBananaThrow() {
  if (keyCode == ENTER && !isBananaFlying) {
    println("thrown");
    throwBanana();
  }
}

function throwBanana() {
  isBananaFlying = true;
   bananaPosition = isBlueGorillaTurn ? blueGorillaPos : redGorillaPos;
   bananaVelocity = { 
     x:
       isBlueGorillaTurn ? blueGorillaStrength * cos(radians(blueGorillaAngle)) : redGorillaStrength * -cos(radians(redGorillaAngle)),
     y: 
       isBlueGorillaTurn ? blueGorillaStrength * -sin(radians(blueGorillaAngle)) : redGorillaStrength * -sin(radians(redGorillaAngle)) };   
}

function handleRestart(){
  if (keyCode == ENTER && gameEnded) {
    println("restarting");
    resetGame();
  }
}

function handleControls(){
  if (keyCode == UP_ARROW) {
    addStrength = true;
  } else if (keyCode == DOWN_ARROW) {
    subtractStrength = true;
  } else if (keyCode == LEFT_ARROW) {
    addAngle = true;
  } else if (keyCode == RIGHT_ARROW) {
    subtractAngle = true;
  }
}

function keyReleased(){  
  if (keyCode == UP_ARROW) {
    addStrength = false;
  } else if (keyCode == DOWN_ARROW) {
    subtractStrength = false;
  } else if (keyCode == LEFT_ARROW) {
    addAngle = false;
  } else if (keyCode == RIGHT_ARROW) {
    subtractAngle = false;
  }
}