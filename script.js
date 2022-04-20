var pattern;
var progress = 0;
var gamePlaying = false;
var tonePlaying = false;
var volume = 0.5;
const clueHoldTime = 1000;
const cluePauseTime = 333; //how long to pause in between clues
const nextClueWaitTime = 1000; //how long to wait before starting playback of the clue sequence
var guessCounter = 0;
var strikesLeft;

var audioArr = ["https://cdn.glitch.global/e6b51d74-ec50-46fe-892f-73e8bba4422c/bark.mp3?v=1650339432225",
               "https://cdn.glitch.global/e6b51d74-ec50-46fe-892f-73e8bba4422c/bark3.mp3?v=1650339434670",
               "https://cdn.glitch.global/e6b51d74-ec50-46fe-892f-73e8bba4422c/deepbark.mp3?v=1650339438397",
               "https://cdn.glitch.global/e6b51d74-ec50-46fe-892f-73e8bba4422c/dogbark5.mp3?v=1650339441764"]


function startGame() {
  //initialize game variables
  pattern = createPattern();
  strikesLeft = 3;
  document.getElementById("strikes").innerHTML = strikesLeft;
  progress = 0;
  gamePlaying = true;
  document.getElementById("startBtn").classList.add("hidden");
  document.getElementById("stopBtn").classList.remove("hidden");
  playClueSequence();
}

function stopGame() {
  gamePlaying = true;
  document.getElementById("startBtn").classList.remove("hidden");
  document.getElementById("stopBtn").classList.add("hidden");
}




// Page Initialization
// Init Sound Synthesizer
var AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new AudioContext();
var o = context.createOscillator();
var g = context.createGain();
g.connect(context.destination);
g.gain.setValueAtTime(0, context.currentTime);
o.connect(g);
o.start(0);

function lightButton(btn) {
  document.getElementById("button" + btn).classList.add("lit");
}
function clearButton(btn) {
  document.getElementById("button" + btn).classList.remove("lit");
}

function playSingleClue(btn) {
  if (gamePlaying) {
    lightButton(btn);
    var index = btn - 1;
    var au = new Audio(audioArr[index]);
    au.play();
    setTimeout(clearButton, clueHoldTime, btn);
  }
}

function playClueSequence() {
  guessCounter = 0;
  context.resume();
  let delay = nextClueWaitTime; //set delay to initial wait time
  for (let i = 0; i <= progress; i++) {
    // for each clue that is revealed so far
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms");
    setTimeout(playSingleClue, delay, pattern[i]); // set a timeout to play that clue
    delay += clueHoldTime;
    delay += cluePauseTime;
  }
}

function loseGame() {
  stopGame();
  alert("Game Over. You lost.");
}

function winGame() {
  stopGame();
  alert("Game Over. You won.");
}

function guess(btn) {
  console.log("user guessed: " + btn);
  
  if (strikesLeft >= 0){
  document.getElementById("strikes").innerHTML = strikesLeft;
  }
  if (!gamePlaying) {
    return;
  }
  var index = btn - 1;
    var au = new Audio(audioArr[index]);
    au.play();
  if (pattern[guessCounter] == btn) {
    //Guess was correct!
    if (guessCounter == progress) {
      if (progress == pattern.length - 1) {
        //GAME OVER: WIN!
        winGame();
      } else {
        //Pattern correct. Add next segment
        progress++;
        playClueSequence();
      }
    } else {
      //so far so good... check the next guess
      guessCounter++;
    }
  } else {
    
    strikesLeft--;
    if (strikesLeft >= 0){
      document.getElementById("strikes").innerHTML = strikesLeft;
    }
    //Guess was incorrect
    //GAME OVER: LOSE!
    if (strikesLeft == 0) loseGame();
  }
}


function createPattern(){
  var arr = [];
  for(var i=0;i<6;i++){
  var num = Math.floor(Math.random() * 4)
  num++;
   arr.push(num); 
  }
  
  return arr;
}