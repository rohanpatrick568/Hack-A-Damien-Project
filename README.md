# Solfége Light & Sound Memory Game

This project is a web‑based memory game with several interactive modes. The game challenges players to repeat a pattern of musical tones and, additionally, features a “Chorus Practice” mode that uses pitch detection via the Web Audio API.

---

## Overview

- **Memory Game Mode:**  
  The core game plays a sequence of tones (each linked to a solfege note: Do, Re, Mi, etc.). The player must repeat the sequence by clicking buttons corresponding to those notes. The game supports both an easy mode and a hard mode (which adjusts speed and pattern length).

- **Chorus Practice Mode:**  
  In this mode the game randomly chooses one solfege note, plays the tone briefly, displays the note on screen, and then shows a “GO!” signal. The game then automatically turns on the microphone to detect the player's pitch. When the player holds the correct note (ignoring octave differences) for a required duration, the round is passed; the required hold time increases for the next round. The mode displays the current detected note in real‑time.

---

## File Structure

- **index.html**  
  Contains the HTML structure. Important elements include:
  - **Start Screen:** Buttons to start the memory game, toggle hard mode, and (in previous iterations) initiate Chorus Practice mode.
  - **Game Area:** Contains the game buttons for tone input, score display, countdown display, and (in Chorus Practice mode) a section for target note and microphone note display.
  
- **style.css**  
  Contains all CSS styles used to define the appearance of:
  - The overall layout (background, fonts, margins).
  - The game buttons with different active/pressed states.
  - The start screen and countdown elements.
  
- **script.js**  
  Contains all JavaScript logic. Key functionalities include:
  - **Global Variables and Helpers:**  
    Variables such as `pattern`, `progress`, `gamePlaying`, and settings for timing (e.g., `clueHoldTime`, `cluePauseTime`) manage game state.
  - **Game Sequence Management:**  
    Functions such as `startGame()`, `stopGame()`, `playClueSequence()`, and `guess(btn)` control the flow of the memory game. It uses timeouts to sequence the tone playback and a countdown (with dynamic delay computed from score) before the player's input is re‑enabled.
  - **Sound Synthesis:**  
    Functions like `playTone(btn, len)`, `startTone(btn)`, and `stopTone()` use the Web Audio API to generate sounds with specific frequencies mapped from solfege notes (`freqMap`).
  - **Hard Mode:**  
    Toggling hard mode (via `toggleHardMode()`, `enableHardMode()`, and `disableHardMode()`) adjusts game speed, pattern length, and UI elements.
  - **Chorus Practice Mode:**  
    The game offers a Chorus Practice mode featuring:
    - A function `beginChorusPractice()` that sets up the mode.
    - `playChorusNote()` selects a random note (using `getRandomButton()`), plays its tone briefly (300ms), displays the target note, and after showing “GO!” delays turning on the microphone.
    - Pitch detection is implemented via `detectPitchChorus()`, which uses an auto-correlation algorithm (`autoCorrelate()`) to determine the frequency from the microphone input. Helper functions `getClosestNote(freq)` and `getNoteName(noteNum)` normalize pitch information and provide user–friendly note names.
    - Microphone control functions `toggleMicrophone()` and `disableMicrophone()` manage access to the mic with error handling.
    - An exit function `exitChorusPractice()` allows the user to gracefully exit Chorus Practice mode, canceling pending pitch detection loops and stopping the microphone.
  - **Sequence Timeout Management:**  
    To ensure game sequences can be stopped when the player exits or restarts, all timeout IDs are stored in an array (`sequenceTimeouts`). Functions like `stopGame()` and `goToStartScreen()` iterate through this array to cancel pending timeouts.
  - **User Feedback:**  
    Alerts are used in functions like `loseGame()` (triggered when a guess is wrong) to provide immediate feedback.
    
- **README.md**  
  This file explains the complete project.

---

## How to Run

1. Clone or download the repository from GitHub.
2. Open the `index.html` file in your preferred web browser (modern browsers with Web Audio API support are recommended).
3. Use the Start Screen to choose a mode:
   - Click **Start The Game** to play the memory game.
   - Toggle **Hard Mode** as desired during the game.
   - (If implemented in your version) Click **Chorus Practice** to begin practicing pitch matching.
4. Follow on-screen instructions and listen to the tones. In Chorus Practice mode, allow access to your microphone when prompted.

---

## Additional Notes

- **Error Handling:**  
  The code attempts basic error handling when accessing the microphone, alerting the user if microphone access fails.
  
- **Performance Considerations:**  
  The pitch detection loop using `requestAnimationFrame` is properly canceled when exiting Chorus Practice mode.
  
- **User Interface:**  
  The CSS files style game buttons and other UI elements. Button active states change color when pressed, while countdown and chorus displays appear over the game area.
  
- **Extensibility:**  
  The modular design (separating game logic, UI layout, and sound synthesis) makes it easier to extend or update individual components, such as improving the pitch detection algorithm or adding new game modes.

---

Enjoy the game and have fun practicing your solfege skills!
