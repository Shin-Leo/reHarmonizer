# reHarmonizer #
- - - -
This Flask project is for reharmonizing a small section of a song when given the chord progression and the main melody.

## Try it Here! ##
- - - -

https://sleepy-ocean-50160.herokuapp.com/

## How It Works ##
- - - -

* ### Notation ###
    * #### Melody ####
      To get the melody from the user, [VexFlow.js](https://github.com/0xfe/vexflow) is used to dynamically render empty stave svgs. These svgs are
      overlayed with a matrix of horizontal rectanglular svgs to define the pitch regions and vertical rectangles to
      define the beat regions. These rectangles are then assigned mousemove event listeners to track cursor movement and
      project indicator notes.
    * #### Chords ####
      To get the chords from the user, [Scribbletune.js](https://github.com/scribbletune/scribbletune) is used to get all the possible chords and Tonal.js is used to
      parse the Chord name into an array of notes.
* ### Playback ###
    * Melody and chords are played using [Tone.js](https://github.com/Tonejs/Tone.js/) with the synth and the polysynth instrument

* ### Reharmonization ###
    * Planning on using [Tonal.js](https://github.com/tonaljs/tonal) to manipulate the inputted chord progression

## Current Progress ##
- - - -

* ### Notation ###
    - [ ] Undo Button For Notes
    - [ ] Render Drawn Chords
    - [x] Undo Button For Chords

* ### Playback ###
    - [ ] Bpm Functionality
    - [ ] Volume Control
    - [x] Pause Button For Chords
    - [x] Music Playback

* ### Reharmonization ###
    - [ ] Retrieve Drawn Chord Progression and Melody



