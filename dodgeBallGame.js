/***************************************************************/
//src = "path/to/p5.dom.js" // Links p5js Libarys
// My cursor I made 
//https://www.cursor.cc/?action=icon&file_id=10192
//
//MOBILE MODE:
//https://editor.p5js.org/Todd.Wellwood/present/rktaoGDQM
//
// Written by Todd Wellwood
// Term 1 & 2 2019
/***************************************************************/
/******************************Global Variables*****************/
/***************************************************************/

/**********************************/
/***********Game Pausing:**********/
/**********************************/
var touchCheck // Checks if user is touching a ball
var pauser = true // does game start?
var programON = true; // Does game pause when user exits screen?

/**********************************/
/***********Score and Lives********/
/**********************************/
var desiredFrameRate = 60 // Changes deafult framerate
var lives = 3             // Starting lives
var score = 0             // Starting score
var dead = false          // is user dead to start
var powerUpZoneScore = 2  // points gained in pZone
var mouseMovingPointGen = 1.8 // Points gained if mouse moving

/**********************************/
/***********Canvas Setup***********/
/**********************************/
var WidthPadding = 230   // Controlls padding on width
var HeightPadding = 50   // controls padding on height
var canvasXaxis = 100    // controlls canvas starting position
var canvasYaxis = 20     // controlls canvas starting position
var canvasWidth          // used to store screen size
var canvasHeight         // used to store screen size

/**********************************/
/*******Sliders and Ball Setup*****/
/**********************************/
var sliderBS;            // creates ball size slider
var circlesTotal;        // Stores total balls
var prevSlider;  
var sliderTotal;
const MAXBALLS = 8;      // constant that sets max balls
const MINBALLS = 2;      // constant that sets min balls (array range)
var dividbyammount = 5   // change to change rate of score generation
var arraycircle = [];    // Creates array for balls
var arraypowerup = [];   // creates array for powerup zone

/**********************************/
/************User Input************/
/**********************************/
var flag                 // creates flag variable
var userName = ""        // Creates variable to store username
var text = ""            // creates variable to store text
var errorMsg = ""        // creates text to store errormsg
var userReply = ""       // used to store userreply
var invalid = true       // checks if user entered invalidINput
var nullTest = true      // tests if user clicked cancel
var regExp = /[^a-zA-Z]/;// standard letters only exp
var regExpNum = /^[1-9]/;// Numbers only exp

/***************************************************************/
/*****************End Of Global Variables***********************/
/***************************************************************/

/*******************************************/
/************User Input Function************/
/*******************************************/
// Is passed username, text and flag and deafultResponse
// Called during setup()
// Uses one prompt to ask questions
// Stores data
// Sets game variables up for Score and Ammount of balls
// Returns validated respons
function userInput(userName, text, flag,deafultResponse) {
  invalid = true
  while (invalid) {
    nullTest = true
    while (nullTest == true) {
      userReply = prompt(userName + errorMsg + text,deafultResponse)
      if (userReply != null) {
        nullTest = false
      }
      errorMsg = "Invalid input detected, please supply an input instead of pressing cancel.\n"
    }
    if (flag == "t") {
      if (regExp.test(userReply) == false && userReply != "") { // 
        userReply = (userReply + ", ")
        invalid = false
      } else {
        errorMsg = "Invalid input detected, Please enter a valid username \n(May not contain symbols or numbers)\n"
      }
    }
    if (flag == "n") {
      if (userReply < MINBALLS || userReply > MAXBALLS || regExpNum.test(userReply) == false) { // Checking 
        errorMsg = "Invalid input detected,\n"
      } else {
        invalid = false
      }
    }
  }
  errorMsg = "" // Clear error messageg
  return userReply // return response
}

/***************************************************************/
/**************************End Of User Input Function***********/
/***************************************************************/

/***************************************************************/
/**************************Class 1 Circle***********************/
/***************************************************************/
//This is the class that generates the balls.
//Also handels bouncing
//And checking if mouse is hovering over a ball
//Colours etc, drawn 60 times a second, ran in setup & draw.
class circle {
  constructor() {
    this.minHsize = height / 15;
    this.minWsize = width / 5;
    this.maxHsize = height / 3;
    this.maxWsize = width / 3;
    this.circleRAD = random(min(this.minHsize, this.minWsize), min(this.maxHsize, this.maxWsize))
    this.xspeedState = 8; // Max speed of balls (X)
    this.yspeedState = 8; // Max speed of balls (Y)
    this.xspeedState1 = 3; // Min speed of balls (X)
    this.yspeedState1 = 3; // Min Speed of balls (Y)
    this.xpos = random(this.circleRAD + 1, width - this.circleRAD - 1)
    this.ypos = random(this.circleRAD + 1, height - this.circleRAD - 1)
    this.xdirection = random(-1, 1);
    this.ydirection = random(-1, 1);
    this.xspeed = random(this.xspeedState, this.xspeedState1)
    this.yspeed = random(this.yspeedState, this.yspeedState1)
    this.colourR = random(0, 255)
    this.colourG = random(0, 255)
    this.colourB = random(0, 255)
  }
  
  bounce() {
    this.xpos = this.xpos + this.xspeed * this.xdirection;
    this.ypos = this.ypos + this.yspeed * this.ydirection;
    if (this.xpos >= width - this.circleRAD / 2) {
      this.xdirection = this.xdirection * -1;
      this.xpos = width - this.circleRAD / 2
    }
    if (this.xpos <= this.circleRAD / 2) {
      this.xdirection = this.xdirection * -1;
      this.xpos = 0 + this.circleRAD / 2
    }
    if (this.ypos >= height - this.circleRAD / 2) {
      this.ydirection = this.ydirection * -1;
      this.ypos = height - this.circleRAD / 2
    }
    if (this.ypos <= this.circleRAD / 2) {
      this.ydirection = this.ydirection * -1;
      this.ypos = 0 + this.circleRAD / 2
    }
  }

  createCircles() { // Creates circles (DISPLAY)
    fill(this.colourR, this.colourG, this.colourB);
    ellipse(this.xpos, this.ypos, this.circleRAD, this.circleRAD);
  }
  
  rtnValue() { // Used to resize balls
    return ([this.minHsize, this.minWsize, this.maxHsize, this.maxWsize]);
  }

  resize(multiplier) { // resets the circle raidus after user changes ball size via slider
    this.circleRAD = this.circleRAD * multiplier; // Resets by multiplier.
  }

  hoverfunction() { // checks if mouse is inside of a ball
    this.dx = ((mouseX - this.xpos) * 2);
    this.dy = ((mouseY - this.ypos) * 2);
    this.dist_squared = ((this.dx * this.dx + this.dy * this.dy) * 2);
    if (this.dist_squared <= (this.circleRAD * this.circleRAD)) {
      pauser = false // pause game so user dosnt instantly loose all lives
      return (touchCheck = 1) // 
    }
  }
}

/*************************************************/
/*************End of Class 1 circle***************/
/*************************************************/

/*************************************************/
/********************Class 2 powerUp**************/
/*************************************************/
// This is the Class that handels powerup generation.
// Creates a powerup zone and adds more points if user is inside of it
// Custom text
// and has a cooldown before it has charged up again
// Random colours
// Called during draw, not passed anything
// Class powerUP
class powerUp { // handels the powerup zone
  constructor() {
    this.powerupX = width - 80 // Pulls powerup away from the wall
    this.powerupY = 120
    this.circlerad = 60 // Size of powerup Array
  }
  
  // Function disp()
  // displays the powerup zone as random colours
  // Flashing colours to show its not a normal ball
  // cooldown so it cant be abused.
  disp() { 
    fill(random(0, 255), random(0, 255), random(0, 255))
    ellipse(this.powerupX, this.powerupY, this.circlerad, this.circlerad);
  }
  
  
  // Function powerUpHoverFunction()
  // tests if user is inside of powerup zone 
  // has a cooldown
  powerUpHoverFunction() { // 
    this.dx = ((mouseX - this.powerupX) * 2);
    this.dy = ((mouseY - this.powerupY) * 2);
    this.dist_squared = ((this.dx * this.dx + this.dy * this.dy) * 2);
    if (this.dist_squared <= (this.circlerad * this.circlerad)) {
      // Checks if distance squared (Diamiter) is less than mouse distance 
      //(EG mouse inside ball)
      scoreBooster()
    }
  }
}
/********************************************************/
/***********************End of Class 2 Powerup***********/
/********************************************************/

/*******************************************/
/*****************Score Functions***********/
/*******************************************/
// Function scoreBooster
// Gives user Score  while in powerup Zone
function scoreBooster() {                // Runs if inside powerup zone
  if (dead == false) {                   // Only Runs while user alive
    score = (score + powerUpZoneScore)   // Score added if mouse in powerup Zone
  }
}

// function dispText
// Shows text, called from draw
// not passed anything
// Part of Gui
function dispText() {
  fill(255, 0, 0)
  strokeWeight(3);
  stroke(255, 0, 200);
  stroke(255);
  textSize(32); // Displays Score
  // Makes score less intimidating by making it smaller.
  text("Your Score: " + Math.round(score / dividbyammount), 10, 35)
  text("Current Lives: " + lives, 10, height - 10) // Displays lives
  textSize(18)
  fill(40, 200, 100)
  stroke(0, 0, 0)
  text("Ball Size Slider:", width - 150, 20)
  text("Ball Count Slider:", width - 150, 50)
  fill(255, 255, 0) // Fills it a differnt colour. 
  text("POWERUP ZONE!", width - 160, 80) // Custom text for number
}

// function scoreGenerator()
//////////////////////////////////////////////////////////
/////////////////////Event!///////////////////////////////
//////////////////////////////////////////////////////////
// Generates score when user is moving thier mouse
// runs from draw, alters score.
function scoreGenerator() {
  // IF MOUSE ISNT DOING ANYTHING DO THIS.//
  if (score >= 0) {
    score = score - 1 // RATE OF DRAIN
  }
  // IF MOUSE IS MOVING DO THIS
  if (dead == false) {
//////////////////////////////////////////////////////////
/////////////////////Event!///////////////////////////////
//////////////////////////////////////////////////////////    
// Gets result of onmousemove to check if mouse is actually moving.
// Returned result is a timeout to avoid lag.
    document.onmousemove = (function() {
      var onmousestop = function() {
          score = score + mouseMovingPointGen // Changes the power per second of mouse move
        },
        thread;
      return function() { // How long we update code (1s to avoid lag and cheating)
        clearTimeout(thread); // Reset thread timeout
        thread = setTimeout(onmousestop, 1000); // Interval  program checks if mouse has stopped
      };
    })();
    //////////////////////////////////////////
  }
}

/*************************************************/
/*****************Game Reset Functions************/
/*************************************************/
//function resetGame
// when game reset is pressed.
// Sets the game back to the default,
function resetGame() {
  pauser = true
  for (i = 0; i < circlesTotal; i++) { // repopulate the array
    arraycircle[i] = new circle();
  }
  setTimeout(() => 1 * 10)      // pauses for a second (Proffesional look)
  pauser = false
  setTimeout(() => {
    pauser = true               // unpauses game
  }, 1 * 1200)
  dead = false                  // kills user
  score = 0                     // sets score to 0 
  lives = 3                     // sets lives back to default
  button.position(-100, -100);  // Hides the button
}

// function resetButton
// Moves the reset button into the center of the screen. (When user dies)
function resetButton() {
  if (dead == true) {
    textSize(500)
    button = createButton('Reboot Game');
    button.position(canvasWidth / 2 + WidthPadding / 4, canvasHeight / 2 - HeightPadding);
    
//////////////////////////////////////////////////////////
/////////////////////Event!///////////////////////////////
//////////////////////////////////////////////////////////  
    // When button is pressed the game is reset.    
    button.mousePressed(resetGame); // runs the reset game function/
    button.size(100, 100)
  }
}

/********************************************************/
/*****************End of Game Reset Functions************/
/********************************************************/

/***************************************************/
/***************** Game pause Functions************/
/**************************************************/
//function pauseCheck()
// checks if user is actually inside of canvas
// Checks if cheating.
// Runs program when the user comes back inside canvas
function pauseCheck() { // Handles user leavingthe screen while game running
  // Pause if mouse outside of the canvas
  if (programON == false && mouseX <= width && mouseX >= 0 && mouseY <= height && mouseY >= 0) {
    programON = true
  }
}

// function pause()
// runs if the user is outside screen
// takes life away and pauses game.
// unpause on re-entry of canvas
function pause() { // take a life off if outside the screen
  if (pauser == true) {
    programON = false // unpauses game
    lifeLost() // Takes life away
  }
}

/***************************************************/
/************* End of Game pause Functions**********/
/**************************************************/

/**************************************************/
/**************Slider & Canvas Functions***********/
/**************************************************/
// Function splicer()
// Splices balls from the array in the correct order.
function splicer() { 
  if (sliderTotal.value() > circlesTotal) { // Makes it so u cant splice to 0 balls
    for (j = 0; j < (sliderTotal.value() - circlesTotal); j++) { // Runs as many times as slider is set
      arraycircle.push(new circle()); // adds new circle
    }
  } else {
    // if user goes other way remove last circle added
    arraycircle.splice(1, circlesTotal - sliderTotal.value());
  }
  // sets total circles on canvas to value of the slider if nothing else is going on
  circlesTotal = sliderTotal.value()
}

// Function circleResize()
// is ran by draw.
// Returns new ball sizes
//////////////////////////////////////////////////////////
/////////////////////Event!///////////////////////////////
//////////////////////////////////////////////////////////
// resizes balls correctly
// Uses slider to do so.
// Gets result of multiplier.
// Is an event that runs multiplier and gets result
function circleResize() {               // Resizes when slider changed
  var multiplier = sliderBS.value() / prevSlider;
  for(i = 0; i < arraycircle.length; i++){
    arraycircle[i].resize(multiplier); // passes back new size 
  }
                                       // update prev slider with new value
  prevSlider = sliderBS.value();       // makes sure that the size is correct.
}

function sliderDisp() {                      // Imports sliders
  var size = arraycircle[1].rtnValue();        // Imports max size.
  var tempMin = random(min(size[0], size[1])); // Generates temporaryMIN
  var tempMax = random(min(size[2], size[3])); // Generates temporaryMAX

  prevSlider = (tempMin + tempMax) / 2; // Makes it in terms of radius
  sliderBS = createSlider(tempMin, tempMax, prevSlider); // Create slider
  sliderBS.position(width + 120, 20);
  sliderBS.style('width', '80px');
  sliderBS.input(circleResize); // Resizes circles when changed

  // creates total circle slider, min circles is set to 1 (----->1<-----,circles total)
  sliderTotal = createSlider(1, circlesTotal);
  sliderTotal.position(width + 120, 50);
  sliderTotal.style('width', '80px');
}

function canvasSetup() { // Sets canvas sizing depending on current screensize
  canvasWidth = windowWidth - WidthPadding
  canvasHeight = windowHeight - HeightPadding
  cnv = createCanvas(canvasWidth, canvasHeight);
  cnv.position(canvasXaxis, canvasYaxis);
}
/**************************************************/
/***********End of Slider & Canvas Functions*******/
/**************************************************/

/**************************************************/
/****************Life Lost Functions***************/
/**************************************************/
// function gameLost()
// ran if user does a game loosing condition.
function gamelost() { // takes a life away from user if they touch a ball
  if (touchCheck == 1) {
    touchCheck = 0 // sets the user to not currently be touching a ball
    lifeLost() // takes a life away
  }
}

// function deadClear()
// Ran constantly while user is dead (By Draw)
// Splices array completly so that user cant break game
function deadClear() {
  if (dead == true) {
    arraycircle.splice(0, circlesTotal); // clear array for fresh round
  }
}

//Function lifeLost()
//Ran when user mouse is detected inside ball our out of bounds
//Returns to normal if user isnt on 0 lives.
function lifeLost() {   // This stops program from loosing 60 lives per second
  if (dead == false) {  // if they are not dead execute this code
    lives = lives - 1   // take 1 life away
    setTimeout(() => {  // pause game for 1.2 seconds
      pauser = true
    }, 1 * 1200);       //Game pause length on ball contact (Difficulty) 
    if (lives <= 0) {
      programON = false // Displays user stats & informs them they have died.
      alert("You died " + userName + "Your score was " + Math.round(score / dividbyammount) + "!")
                        // clear array for fresh round
      arraycircle.splice(0, circlesTotal); 
      score = 0         // Sets score to 0
      dead = true       // Brings user back to life
      resetButton()     // Offers ability to try again
    }
  } else {
    return // If the user isnt dead yet, let game keep going
  }
}

/**************************************************/
/**************End of Life Lost Functions**********/
/**************************************************/

/**********************************************/
/********************HTML TRAIL****************/
/**********************************************/
// Imported from W3Schools
//////////////////////////////////////////////////////////
/////////////////////Event!///////////////////////////////
//////////////////////////////////////////////////////////
window.addEventListener('mousemove', function(e) {
  [1, 0.9, 0.8, 0.5, 0.1].forEach(function(i) {
    var j = (1 - i) * 50;
    var elem = document.createElement('div');
    var size = Math.ceil(Math.random() * 10 * i) + 'px';
    elem.style.position = 'fixed';
    elem.style.top = e.pageY + Math.round(Math.random() * j - j / 2) + 'px';
    elem.style.left = e.pageX + Math.round(Math.random() * j - j / 2) + 'px';
    elem.style.width = size;
    elem.style.height = size;
    elem.style.background = 'hsla(' +
      Math.round(Math.random() * 360) + ', ' +
      '100%, ' +
      '50%, ' +
      i + ')';
    elem.style.borderRadius = size;
    elem.style.pointerEvents = 'none';
    document.body.appendChild(elem);
    window.setTimeout(function() {
      document.body.removeChild(elem);
    }, Math.round(Math.random() * i * 500));
  });
}, false);

/*********************************************/
/******************HTML TRAIL END*************/
/*********************************************/

/***************************************************************/
/**************************************Setup********************/
/***************************************************************/
// Runs once when code starts,  
// Populates arrays,
// Displays gui
// function setup
function setup() {                     // Runs once when code starts
  canvasSetup()                        // Sets canvas up
  frameRate(desiredFrameRate);         // Framerate changer
  userName = userInput(userName, "Please enter a valid username", "t", "Bob")
  circlesTotal = userInput(userName, "Please enter how many balls you would like:\nAmount of balls must be within " + MINBALLS + " and " + MAXBALLS + "", "n","5")
  resetButton()                        // Displays reset button
  for (i = 0; i < circlesTotal; i++) { // Populates circle arrary
    arraycircle[i] = new circle()
  }
  for (i = 0; i < 1; i++) {            // Populates powerup array
    arraypowerup[i] = new powerUp();
  }
  sliderDisp()                         // Displays sliders in terms of canvas
}
/***************************************************************/
/*********************************Setup End*********************/
/***************************************************************/

/***************************************************************/
/*********************************Draw Start********************/
/***************************************************************/
// function draw()
// Displays arrays equal to the framerate.
// Draws Guis,  
// Sets stroke of balls, background etc.
// Makes game appear moving   
//////////////////////////////////////////////////////////
/////////////////////Event!///////////////////////////////
//////////////////////////////////////////////////////////
// CNV.mouseOut runs pause when the mouse is outside screen.  
function draw() {
  cnv.mouseOut(pause)                          // If outside bounds run pause func
  if (programON == true && pauser == true) {   // If game is paused isnt ran
    background(200);                           // Sets background colour
    stroke(0)                                  // Sets ball stroke
    strokeWeight(1) // Sets ball strokeweight
    for (i = 0; i < arraycircle.length; i++) { // Spawns and draws balls
      arraycircle[i].createCircles();          // Displays Balls
      arraycircle[i].bounce();                 // Bounces Balls
      arraycircle[i].hoverfunction()           // Checks if mouse is in bag.
      gamelost();                              // Checks if user is dead
    }
    for (i = 0; i < 1; i++) {                  // Generates powerup zone
      arraypowerup[i].disp();                  // Displays Powerup zone
      arraypowerup[i].powerUpHoverFunction()   // Checks if mouse is inside zone 
    }
    deadClear()                                // Clears balls if dead
    splicer();                                 // Slider for total balls
    dispText();                                // Imports sliders
  }
  pauseCheck()                                 // Pause checking function
  scoreGenerator()                             // Runs Score Generator
}

/***************************************************************/
/*********************************Draw End**********************/
/***************************************************************/

/***************************************************************/
/***********************************END OF CODE*****************/
/***************************************************************/