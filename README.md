# Solfége Light & Sound Memory Game

This project is a web‑based memory game that challenges you to repeat a sequence of musical tones. It comes with an additional interactive "Chorus Practice" mode that leverages the Web Audio API for pitch detection and microphone input when practicing solfege notes.

---

## Overview

**Memory Game Mode**  
- The game plays a sequence of tones, each corresponding to a solfege note (Do, Re, Mi, Fa, So, La, Ti, Do).
- Players must repeat the sequence by clicking on the respective buttons.
- The game supports both standard and hard modes:
  - **Standard Mode:** Default speed and pattern length.
  - **Hard Mode:** Faster tone playback and longer note patterns.

**Chorus Practice Mode**  
- A random solfege note is chosen and its tone is played briefly (300ms).
- The target note is displayed, then “GO!” appears before the microphone is automatically activated.
- The Web Audio API is used with an auto-correlation algorithm for real‑time pitch detection.
- The player must hold the correct note (ignoring octave differences) for a specified duration. If successful, the required hold time increases for the next round.
- The mode shows the target note and the player's current detected note on screen.
- Users can exit Chorus Practice mode using an “Exit Chorus Practice” button, which stops the microphone, cancels pitch detection, and returns the interface to the main game.

---

## File Structure

- **index.html**  
  Sets up the HTML structure. Key elements:
  - **Start Screen:** Buttons to start the memory game and toggle hard mode.
  - **Game Area:** Contains the tone buttons, score displays, a countdown overlay, and a dedicated Chorus Practice area (with elements for target note, real‑time pitch display, a toggle for microphone control, and an exit button).

- **style.css**  
  Defines the look and feel of the application:
  - Layout and font styling, background color.
  - Styles for game buttons (including active states and hard-mode customizations).
  - Positioning and appearance of the countdown overlay.

- **script.js**  
  Implements the project’s logic:
  - **Global Variables & Helpers:** Manages game state (like `pattern`, `progress`, and timing variables) and includes helper functions for generating random buttons.
  - **Game Sequence Management:**  
    Functions such as `startGame()`, `stopGame()`, `playClueSequence()`, and `guess(btn)` handle playing the sequence of tones and accepting user input.  
    Timeout IDs are stored in an array so that pending sequence timeouts can be cancelled if the game stops or the player returns to the home screen.
  - **Sound Synthesis:**  
    Functions including `playTone(btn, len)`, `startTone(btn)`, and `stopTone()` use the Web Audio API to generate tones based on frequencies defined in `freqMap`.
  - **Hard Mode:**  
    Implemented through functions `toggleHardMode()`, `enableHardMode()`, and `disableHardMode()`, which adjust the game’s tempo and pattern length.
  - **Chorus Practice Mode:**  
    - `beginChorusPractice()` starts the mode.
    - `playChorusNote()` randomly selects a note (using `getRandomButton()`), plays it briefly, and displays it.
    - After showing “GO!”, the microphone is automatically enabled via `toggleMicrophone()`.
    - The `detectPitchChorus()` function uses an auto-correlation algorithm (via `autoCorrelate()`) to detect the current pitch from microphone input in real‑time.  
      If the detected note matches the target note consistently for the required duration, the round is marked as passed, the hold duration is increased for the next round, and a new note is issued.
    - `exitChorusPractice()` provides a graceful exit from Chorus Practice mode by stopping pitch detection, turning off the microphone, and resetting the interface.
  - **Error and Timeout Handling:**  
    Alerts (e.g., in `loseGame()`) provide user feedback. The code also cancels pending timeouts (stored in the `sequenceTimeouts` array) when the game is stopped or the home screen is displayed.

- **README.md**  
  This file, which explains the project in detail.

---

## How to Run

1. Clone or download the repository from GitHub.
2. Open the `index.html` file in a modern browser (with Web Audio API support).
3. From the Start Screen:
   - Click **Start The Game** to play the memory game.
   - Use **Hard Mode** to increase the difficulty.
   - Click **Chorus Practice** to enter the practice mode for pitch detection.
4. In Chorus Practice mode, grants microphone access when prompted and follow on-screen cues.

---

## Additional Notes

- **User Interface:**  
  The interface is designed to be straightforward with clear feedback. The countdown overlay pauses the game until the user input is re-enabled, and the Chorus Practice mode displays both the target note and your detected note.
  
- **Error Handling & Cleanup:**  
  The code includes basic error handling for microphone access. When users leave the game or exit Chorus Practice mode, active timeouts and pitch detection loops are cancelled to prevent background activity.
  
- **Extensibility:**  
  With modular functions for game control, sound synthesis, and mode management, the project is designed for easy updates—whether refining pitch detection or expanding gameplay.

---

Enjoy playing the Solfége Light & Sound Memory Game and practicing your pitch recognition skills in Chorus Practice mode!
