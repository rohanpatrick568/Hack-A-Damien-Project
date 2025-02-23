//Add your global variables here
let pattern = []; // stores the pattern of the game
let progress = 0; 
let gamePlaying = false;
// store the start and stop buttons
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
let tonePlaying = false;
const volume = 0.5;
let clueHoldTime = 1000;
const cluePauseTime = 333; //how long to pause in between clues
const nextClueWaitTime = 1000; //how long to wait before starting playback of the clue sequence
let guessCounter = 0;
let score = 0;
let highScore = 0;
let patternSpeed = 1000; // Normal speed (in milliseconds)
let patternLength = 3; // Normal pattern length
let isPatternPlaying = false; // existing flag
let allowGuessing = false;    // new flag controlling button activation
let sequenceTimeouts = []; // new global array to hold all sequence timeouts

function getRandomButton(){ 
    // generates a random number between 1 and 8 (8 Buttons)
    return Math.floor(Math.random() * 8) + 1; // Do to Do 
}

// Add your functions here
function startGame(){
  //function body
  pattern = []; // clear pattern
  pattern.push(getRandomButton()); // add a random button to the pattern
  progress = 0;
  gamePlaying = true;
  // swap the Start and Stop buttons
  startBtn.classList.add("hidden");
  stopBtn.classList.remove("hidden");
  playClueSequence();
}
function stopGame(){
  gamePlaying = false;
  startBtn.classList.remove("hidden");
  stopBtn.classList.add("hidden");
  resetScore();
  // Cancel all sequence timeouts
  sequenceTimeouts.forEach(id => clearTimeout(id));
  sequenceTimeouts = [];
  stopGuessTimer();
  if(countdownInterval) {
    clearInterval(countdownInterval);
    countdownInterval = null;
  }
  document.getElementById("countdown").style.display = "none";
  document.getElementById("guessTimerDisplay").style.display = "none";
  allowGuessing = false;
  isPatternPlaying = false;
}

function lightButton(btn){
  document.getElementById("button"+btn).classList.add("lit")
}

function clearButton(btn){
  //btnElement.remove.classList("button" + btn);
  //document.getElementById("button" + btn)?.classList.remove("lit");
  let buttonElement = document.getElementById("button" + btn);
    if (buttonElement) {
        buttonElement.classList.remove("lit");
    }
    console.log("Removing 'lit' class from button:", btn);
}

function playSingleClue(btn){
  if(gamePlaying){
    lightButton(btn);
    playTone(btn,clueHoldTime);
    setTimeout(clearButton,clueHoldTime,btn);
    console.log("Playing clue for button:", btn);

  }
}
function playClueSequence(){
  // Clear any previous sequence timeouts
  sequenceTimeouts.forEach(id => clearTimeout(id));
  sequenceTimeouts = [];
  
  guessCounter = 0;
  isPatternPlaying = true; // disable note button clicks
  allowGuessing = false;   // disable guessing until delay passes
  // Disable pointer events to prevent the darkening effect
  document.getElementById("gameButtonArea").style.pointerEvents = "none";
  context.resume();
  let delay = nextClueWaitTime; //set delay to initial wait time
  for(let i=0;i<=progress;i++){ // for each clue that is revealed so far
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms")
    let timeoutId = setTimeout(playSingleClue, delay, pattern[i]);
    sequenceTimeouts.push(timeoutId);
    delay += clueHoldTime 
    delay += cluePauseTime;
  }
  // After the sequence, start a 5-second countdown.
  let countdownTimeoutId = setTimeout(startCountdown, delay);
  sequenceTimeouts.push(countdownTimeoutId);
}

// Updated countdown function with dynamic delay computed as (0.01 * score)
function startCountdown(){
  let dynamicDelay = 0.01 * score; // no fixed addition
  let count = dynamicDelay;
  const countdownEl = document.getElementById("countdown");
  countdownEl.style.display = "block";
  countdownEl.innerText = "Wait(" + count + ")..";
  count -= 1;
  const countdownInterval = setInterval(() => {
    if(count > 0) {
      countdownEl.innerText = "Wait(" + count + ")..";
      count -= 1;
    } else {
      countdownEl.innerText = "GO!";
      clearInterval(countdownInterval);
      setTimeout(() => {
          countdownEl.style.display = "none";
          isPatternPlaying = false;
          allowGuessing = true;
          document.getElementById("gameButtonArea").style.pointerEvents = "auto";
      }, 1000);
    }
  }, 1000);
}

function loseGame(){
  stopGame();
  alert("Whomp Whomp! You Lost😂🫵🏾! Click the 'Retry' button to try again.");
}

function winGame(){
  stopGame();
  alert("Congratulations, you've won! 🏆 ");
}

function guess(btn){
  // ignore guesses if input is not yet allowed
  if(!allowGuessing) return;
  
  console.log("user guessed: " + btn);
  
  if(!gamePlaying){
    return;
  }
  
  if(pattern[guessCounter] == btn){
    //Guess was correct!
    correctGuess();
    if(guessCounter == progress){
        // completed the currrent sequence correctly; add another level
        pattern.push(getRandomButton());
        progress++;
        playClueSequence();
      
    } else{
      //so far so good... check the next guess
      guessCounter++;
    }
  }else{
    //Guess was incorrect
    //GAME OVER: LOSE!
    loseGame();
  }
} 

// Sound Synthesis Functions
const freqMap = {
  1: 261.63, // Do
  2: 293.66, // Re
  3: 329.63, // Mi
  4: 349.23, // Fa
  5: 392.00, // So
  6: 440.00, // La
  7: 493.88, // Ti
  8: 523.25 // Do
}

function playTone(btn,len){ 
  o.frequency.value = freqMap[btn]
  g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
  context.resume()
  tonePlaying = true
  setTimeout(function(){
    stopTone()
  },len)
  console.log("Stopping tone for button:", btn);
}

function startTone(btn){
  // prevent note activation if guessing isn't allowed
  if(!allowGuessing) return;
  if(!tonePlaying){
    context.resume()
    o.frequency.value = freqMap[btn]
    g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
    context.resume()
    tonePlaying = true
  }
}

function stopTone(){
  g.gain.setTargetAtTime(0,context.currentTime + 0.05,0.025)
  tonePlaying = false
  console.log("Stopping the tone.");

}

function beginGame() {
  // Hide the start screen
  document.getElementById("startScreen").style.display = "none";

  // Show the game content
  document.getElementById("gameArea").classList.remove("hidden");
  document.getElementById("gameButtonArea").classList.remove("hidden");

  // Call your game function here 
  startGame();
}

function goToStartScreen() {
  // Show the start screen
  document.getElementById("startScreen").classList.remove("hidden");
  document.getElementById("startScreen").style.display = "block";
  // Hide the game area
  document.getElementById("gameArea").classList.add("hidden");
  tonePlaying = false;
  // Cancel all sequence timeouts
  sequenceTimeouts.forEach(id => clearTimeout(id));
  sequenceTimeouts = [];
  stopGuessTimer();
  if(countdownInterval) {
    clearInterval(countdownInterval);
    countdownInterval = null;
  }
  document.getElementById("countdown").style.display = "none";
  document.getElementById("guessTimerDisplay").style.display = "none";
  allowGuessing = false;
  isPatternPlaying = false;
}
// Page Initialization
// Init Sound Synthesizer
let AudioContext = window.AudioContext || window.webkitAudioContext 
let context = new AudioContext()
let o = context.createOscillator()
let g = context.createGain()
g.connect(context.destination)
g.gain.setValueAtTime(0,context.currentTime)
o.connect(g)
o.start(0)

function updateScore(points) {
  score += points; // Increase the score
  document.getElementById("scoreDisplay").innerText = "Score: " + score;

  if (score > highScore) {
    highScore = score;
    document.getElementById("highScoreDisplay").innerText = "High Score: " + highScore;
}
}

// Example: Call this function when the player scores
function correctGuess() {
  updateScore(1); // Add 1 points for a correct guess
}

// Example: Reset score when game restarts
function resetScore() {
  score = 0;
  document.getElementById("scoreDisplay").innerText = "Score: " + score;
}

let hardModeEnabled = false; // Flag to track Hard Mode state

function toggleHardMode() {
    hardModeEnabled = !hardModeEnabled; // Toggle the hard mode state

    // Update button text based on current state
    if (hardModeEnabled) {
        document.getElementById("hardModeToggle").innerText = "Disable Hard Mode";
        // Apply hard mode settings (e.g., faster speed, more difficult pattern)
        enableHardMode();
    } else {
        document.getElementById("hardModeToggle").innerText = "Enable Hard Mode";
        // Revert to normal mode settings
        disableHardMode();
    }
}

function enableHardMode() {
    // Apply changes for hard mode (example: reduce time interval, increase speed)
    console.log("Hard Mode Enabled");
    document.querySelectorAll('button').forEach(button => {
      document.getElementById('gameButtonArea').classList.add('hardModeToggle');});
    clueHoldTime = 300; // Speed up the pattern (in milliseconds)
    patternLength = 5;  // Make the pattern longer (more tones)
    // For example: faster pattern generation
    // You can modify the game logic here to make the game harder
    document.getElementById("stopBtn").innerText = "End Hard Mode";
}

function disableHardMode() {
    // Revert any changes made for hard mode
    console.log("Hard Mode Disabled");
    clueHoldTime = 1000; // Reset speed
    patternLength = 2;   // Reset pattern length
    // Revert back to normal mode game settings
    document.getElementById("stopBtn").innerText = "End Easy Mode";
    document.querySelectorAll('button').forEach(button => {
      document.getElementById('gameButtonArea').classList.remove('hardModeToggle');});
}
