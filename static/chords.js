import {chords} from 'scribbletune';

const scribble = require('scribbletune/browser');
const allChords = chords();


document.querySelector("#button-addon2").addEventListener("click", function () {
  let chord = document.querySelector("#chord-inputs > input").attributes[1].value
  console.log(allChords)
  console.log(chord)
})