let rendererArray = []
let vexContextArray = []
let staveArray = []
let svgArray = []


function projectNote(xPos, rectangle, availableWidth, id) {
    if (xPos === "none" && (rectangle.attributes[0].id !== ("note-projection-" + id))) {
        return
    }
    let divOffset = document.querySelector("#center-col").offsetLeft
    let rect = rectangle.attributes
    let rectId = rect[0].value.split("-")[1]
    let start = parseInt(rect[1].value) * rectId + divOffset + 3
    let barOffset = (parseInt(rectId) - 1) * (availableWidth + parseInt(rect[1].value) + 40)
    let subdivision = document.querySelector('#subdivision').attributes.getNamedItem('value').value
    let yPos = rect[2].value - 2.5
    if (subdivision[0] === "Q") {

    }
    let selector = "note-projection-" + (id)
    let projected_note = document.getElementById(selector)
    projected_note.setAttribute("cx", String(xPos))
    projected_note.setAttribute("cy", String(yPos))
}

function newStave() {
    let div = document.getElementById("boo")
    let renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);
    let rendererHeight = 200
    let rendererWidth = 460
    renderer.resize(rendererWidth, rendererHeight);
    let vexContext = renderer.getContext();
    let staveX = 440
    let staveY = 50
    let stave = new VF.Stave(10, staveY, staveX);
    return {renderer, rendererHeight, rendererWidth, vexContext, staveX, staveY, stave};
}

function addNoteBoundaries(id, yRectWidth, staveX, index, letters, inc, xRectHeight, multiplier, staveY, svg, xRectangles, pt, numBar) {
    let yRectangles = []
    let rectWidth = yRectWidth - 20
    for (let i = 0; i < 16; i++) {
        rectWidth += 21.875
        let rectId = "yRectangleHtml-" + String(id) + String(i + 1)
        let yRectangleHtml = `<rect id=\"${rectId}\" x=\"${rectWidth + staveX * 0.2}\" y=\"60\" width=\"21.875\" height=\"100\" style=\"fill:rgb(183,241,222);\" opacity=\"0\">\n"+"</rect>`
        svg.insertAdjacentHTML('beforeEnd', yRectangleHtml)
        let yRectangle = document.getElementById(letters[index] + inc + "-" + id + "-")
        yRectangles.push(yRectangle)
    }
    for (let i = 0; i < 16; i++) {
        let xRectangleHtml;
        index = i % letters.length;
        if (i % 2) {
            xRectangleHtml = `<rect id=\"${letters[index] + String(inc) + "-" + String(id) + "-"}\" x=\"${staveX * 0.2}\" y=\"${xRectHeight + multiplier * staveY}\" width=\"350\" height=\"6\" style=\"fill:rgb(183,241,222);\" opacity=\"0\">\n"+"</rect>`
            xRectHeight += 6
        } else {
            xRectangleHtml = `<rect id=\"${letters[index] + String(inc) + "-" + String(id) + "-"}\" x=\"${staveX * 0.2}\" y=\"${xRectHeight + multiplier * staveY}\" width=\"350\" height=\"4\" style=\"fill:rgb(183,241,222);\" opacity=\"0\">\n"+"</rect>`
            xRectHeight += 4
        }
        svg.insertAdjacentHTML('beforeend', xRectangleHtml)
        let xRectangle = document.getElementById(letters[index] + inc + "-" + id + "-")
        xRectangles.push(xRectangle)
        if (letters[index] === letters[0]) {
            inc--;
        }
    }
}

function setupBoundaryParams(svg) {
    let yRectWidth = 0
    let xRectHeight = 0
    let id = 1
    let inc = 6
    let index = 0
    let yRectangles = []
    let xRectangles = []
    let multiplier = 1.47
    let letters = ['c/', 'b/', 'a/', 'g/', 'f/', 'e/', 'd/']
    let pt = svg.createSVGPoint();
    return {yRectWidth, xRectHeight, id, inc, index, xRectangles, multiplier, letters, pt};
}

function autocomplete(inp, arr) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function (e) {
        var a, b, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) {
            return false;
        }
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        /*for each item in the array...*/
        for (i = 0; i < arr.length; i++) {
            /*check if the item starts with the same letters as the text field value:*/
            if (arr[i].substr(0, val.length).toUpperCase() === val.toUpperCase()) {
                /*create a DIV element for each matching element:*/
                b = document.createElement("DIV");
                /*make the matching letters bold:*/
                b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
                b.innerHTML += arr[i].substr(val.length);
                /*insert a input field that will hold the current array item's value:*/
                b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                /*execute a function when someone clicks on the item value (DIV element):*/
                b.addEventListener("click", function (e) {
                    /*insert the value for the autocomplete text field:*/
                    inp.value = this.getElementsByTagName("input")[0].value;
                    inp.innerHTML = this.getElementsByTagName("input")[0].value
                    // inp.attributes.setAttribute("value", this.getElementsByTagName("input")[0].value)
                    /*close the list of autocompleted values,
                    (or any other open lists of autocompleted values:*/
                    closeAllLists();
                });
                a.appendChild(b);
            }
        }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function (e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode === 40) {
            /*If the arrow DOWN key is pressed,
            increase the currentFocus variable:*/
            currentFocus++;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode === 38) { //up
            /*If the arrow UP key is pressed,
            decrease the currentFocus variable:*/
            currentFocus--;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode === 13) {
            /*If the ENTER key is pressed, prevent the form from being submitted,*/
            e.preventDefault();
            if (currentFocus > -1) {
                /*and simulate a click on the "active" item:*/
                if (x) x[currentFocus].click();
            }
        }
    });

    function addActive(x) {
        /*a function to classify an item as "active":*/
        if (!x) return false;
        /*start by removing the "active" class on all items:*/
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        /*add class "autocomplete-active":*/
        x[currentFocus].classList.add("autocomplete-active");
    }

    function removeActive(x) {
        /*a function to remove the "active" class from all autocomplete items:*/
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }

    function closeAllLists(elmnt) {
        /*close all autocomplete lists in the document,
        except the one passed as an argument:*/
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }

    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}

function getSubdivisionLength(note) {
    let relativeLength
    if (note === "W") {
        relativeLength = "1n"
    } else if (note === "H") {
        relativeLength = "2n"
    } else if (note === "Q") {
        relativeLength = "4n"
    } else if (note === "E") {
        relativeLength = "8n"
    } else if (note === "S") {
        relativeLength = "16n"
    }
    return relativeLength;
}

$(document).ready(function () {
    VF = Vex.Flow;
    let allChords = scribble.chords()
    const {ChordType} = require("@tonaljs/tonal");
    let chordsAutofillInput = document.querySelector("#chord-autocomplete")
    autocomplete(chordsAutofillInput, allChords)
    let {renderer, rendererHeight, rendererWidth, vexContext, staveX, staveY, stave} = newStave();
    stave.addClef("treble").addTimeSignature("4/4");
    stave.setContext(vexContext).draw();
    let svg = document.querySelector("#boo").lastChild
    rendererArray.push(renderer)
    vexContextArray.push(vexContext)
    staveArray.push(stave)
    svgArray.push(svg)
    let {yRectWidth, xRectHeight, id, inc, index, xRectangles, multiplier, letters, pt} = setupBoundaryParams(svg);
    addNoteBoundaries(id, yRectWidth, staveX, index, letters, inc, xRectHeight, multiplier, staveY, svg, xRectangles, pt);

    svg.insertAdjacentHTML('beforeend', '<g id="note-group-1"></g>')
    svg.insertAdjacentHTML('beforeend', `<ellipse id="note-projection-1" cx=\"400\" cy=\"400\" rx=\"5\" ry=\"4\" opacity=\"1\"/>`)

    svg.addEventListener("click", function (e) {
        let projectionX = document.querySelector("#note-projection-1").attributes[1].value
        let projectionY = document.querySelector("#note-projection-1").attributes[2].value
        drawNote(projectionX, projectionY, xRectangles, vexContext, stave, svg, renderer, rendererWidth, rendererHeight, staveX, staveY)
        getMousePosition(e, pt)
    })

    svg.addEventListener("mousemove", function (evt) {
        let svgIndex = parseInt(evt.target.attributes[0].value.split("-")[1]) - 1
        let elementList = document.elementsFromPoint(evt.clientX, evt.clientY)
        let subdivision = document.querySelector('#subdivision').attributes.getNamedItem('value').value
        if ((elementList.length === 10 || elementList.length === 11) && elementList[0].attributes.length > 3 && elementList[0].nodeName && elementList[0].nodeName !== "ellipse") {
            let hBar = elementList[0]
            let vBar = elementList[1]
            let rectangleNumber = parseInt(vBar.attributes[0].value.split("-")[1].substring(1,))
            if (subdivision[0] === "Q") {
                if (rectangleNumber !== 16) {
                    vBar = document.querySelector("#yRectangleHtml-" + String(id) + String(Math.floor(rectangleNumber / 4) * 4 + 2))
                } else {
                    vBar = document.querySelector("#yRectangleHtml-" + String(id) + "14")
                }
            } else if (subdivision[0] === "H") {
                if (rectangleNumber !== 16) {
                    vBar = document.querySelector("#yRectangleHtml-" + String(id) + String(Math.floor(rectangleNumber / 8) * 8 + 4))
                } else {
                    vBar = document.querySelector("#yRectangleHtml-" + String(id) + "12")
                }
            } else if (subdivision[0] === "E") {
                if (rectangleNumber !== 16) {
                    vBar = document.querySelector("#yRectangleHtml-" + String(id) + String(Math.floor(rectangleNumber / 2) * 2 + 2))
                } else {
                    vBar = document.querySelector("#yRectangleHtml-" + String(id) + "15")
                }
            }
            let xposition = vBar.attributes[1].value
            projectNote(xposition, hBar, staveX, 1)
        }
    })

    document.querySelector("#play-button").addEventListener("click", () => {

        function timeFromDurations(value, i, arr) {
            let prevTime = arr[i - 1]?.time;
            value.time = prevTime + arr[i - 1]?.duration || 0;
            return value;
        }

        let totalTime = 0

        let drawnNotesString = document.querySelector("#drawn-notes").value
        let drawnChordsString = document.querySelector("#drawn-chords").value
        let drawnChords = drawnChordsString.split("-")
        drawnChords.pop()
        let notesAndDurations = []
        let drawnNotes = drawnNotesString.split(",")
        drawnNotes.pop()
        for (let note of drawnNotes) {
            let relativeLength = note.split(":")[0] + "n"
            relativeLength = getSubdivisionLength(note.split(":")[0]);
            let pitch = note.split(":")[1].split("-")[0]
            notesAndDurations.push({"note": pitch.replace("/", ""), "duration": Tone.Time(relativeLength).toSeconds()})
            totalTime += Tone.Time(relativeLength).toSeconds()
        }

        notesAndDurations.map(timeFromDurations)

        let chordArray = []
        let durationArray = []

        drawnChords.forEach((item, index) => {
            let chord = item.split(",")
            let duration = chord.pop()
            chord.shift()
            durationArray.push(duration)
            chordArray.push(chord)
        })

        let inc = 0
        let mainChords = []
        chordArray.forEach((item, index) => {
            let temp = {"time": inc, 'note': item, 'duration': parseInt(durationArray[index]) / 2}
            inc += parseInt(durationArray[index]) / 2
            mainChords.push(temp)
        })

        // let bpm = document.getElementById("bpm").value
        let synth = new Tone.Synth().toDestination();
        let part = new Tone.Part((time, value) => {
            synth.triggerAttackRelease(value.note, value.duration, time);
        }, notesAndDurations).start(Tone.now());
        const polySynth = new Tone.PolySynth(Tone.Synth).toDestination();
        let chordPart = new Tone.Part((time, value) => {
            polySynth.triggerAttackRelease(value.note, value.duration, time);
        }, mainChords).start(Tone.now());
        Tone.Transport.start(Tone.now());
    })

    function processChordInput() {
        let rootPitch = document.getElementById("root-pitch").value.split(":")
        let root = rootPitch[0]
        let pitch = rootPitch[1]
        let chordModifier = document.getElementById("chord-autocomplete").value
        return root + pitch + " " + chordModifier
    }

    document.querySelector("#add-chord").addEventListener("click", function () {
        let chord = processChordInput()
        let drawnChords = document.querySelector("#drawn-chords")
        let chordDuration = document.getElementById("chord-duration").value
        drawnChords.setAttribute("value", drawnChords.value + chord + "," + scribble.chord(chord).toString() + "," + chordDuration + "-")
    })

    document.querySelector("#remove-chord").addEventListener("click", function () {
        let drawnChords = document.getElementById("drawn-chords").value
        if (drawnChords.length > 0) {
            let drawnChordArray = drawnChords.split("-")
            drawnChordArray.pop()
            drawnChordArray.pop()
            if (drawnChordArray.length > 0) {
                let retVal = drawnChordArray.join("-") + "-"
                document.getElementById("drawn-chords").setAttribute("value", retVal)
            } else {
                document.getElementById("drawn-chords").setAttribute("value", "")
            }
        }
    })
    document.querySelector("#preview-chord").addEventListener("click", function () {
        let chord = processChordInput()
        let chordDuration = document.getElementById("chord-duration").value
        let chordNoteArray = scribble.chord(chord)
        let mainChords = [{"time": 0, 'note': chordNoteArray, 'duration': parseInt(chordDuration) / 2}]
        // let bpm = document.getElementById("bpm").value
        // console.log(bpm)
        const polySynth = new Tone.PolySynth().toDestination();
        let chordPart = new Tone.Part((time, value) => {
            polySynth.triggerAttackRelease(value.note, value.duration, time);
        }, mainChords).start(Tone.now());
        Tone.Transport.start(Tone.now())
    })

    document.getElementById("pause-button").addEventListener("click", () => {
        if (Tone.Transport.state === "paused") {
            Tone.Transport.start("+0.1")
        } else {
            Tone.Transport.pause()
        }
    })

    document.getElementById("stop-button").addEventListener("click", () => {
        Tone.Transport.stop()
    })

    // let bpm = document.getElementById("bpm")
    //
    //
    // let bpmRaise = document.getElementById("bpm-raise")
    // bpmRaise.addEventListener("click", () => {
    //     bpm = document.getElementById("bpm")
    //     bpm.setAttribute("value", String(parseInt(bpm.value) + 5))
    // })
    //
    // let bpmLower = document.getElementById("bpm-lower")
    // bpmLower.addEventListener("click", () => {
    //     bpm = document.getElementById("bpm")
    //     bpm.setAttribute("value", String(parseInt(bpm.value) - 5))
    // })
    //
    // let volumeControl = document.getElementById("volume-control")
    // volumeControl.addEventListener("change", () => {
    //     console.log(Tone.Transport.context)
    //     let value = volumeControl.value
    //     const vol = new Tone.Volume().toDestination();
    // })

    // document.getElementById("undo-button").addEventListener("click", () => {
    //     let drawnNotes = document.getElementById("drawn-notes")
    //     let fillCount = document.getElementById("fill-count")
    //     let fillCapacity = document.getElementById("fill-capacity")
    //     let newDrawnNoteArray = drawnNotes.value.split(",")
    //     if (newDrawnNoteArray[newDrawnNoteArray.length - 1] === "") {
    //         newDrawnNoteArray.pop()
    //     }
    //     let deletedNote = newDrawnNoteArray.pop()
    //     let subdivision = deletedNote.split(":")[0]
    //     let noteLength = evalNoteLength(subdivision[0])["dec"]
    //     let fillCountValue = parseInt(fillCount.getAttribute("value"))
    //     console.log(fillCountValue)
    //     let fillCapacityValue = parseInt(fillCapacity.getAttribute("value"))
    //     fillCount.setAttribute("value", String(fillCountValue - noteLength));
    //     console.log(String(fillCountValue - noteLength))
    //     let newDrawnNotes = newDrawnNoteArray.join()
    //     drawnNotes.setAttribute("value", newDrawnNotes)
    //     let id = "note-group-" + String(svgArray.length)
    //     let noteGroup = document.getElementById(id)
    //     noteGroup.lastChild.remove()
    // })

    // let volume = document.querySelector("#volume-control");
    // volume.addEventListener("change", function (e) {
    //     Tone.volume = e.currentTarget.value / 100;
    // })

    let noteButtons = [...document.querySelector("#note-buttons").children]

    noteButtons.forEach((button) => {
        if (button.nodeName === "BUTTON" && button.attributes[1].value !== "play-button" &&
            button.attributes[1].value !== "stop-button" &&
            button.attributes[1].value !== "pause-button" &&
            button.attributes[1].value !== "undo-button") {
            button.addEventListener("click", () => {
                let value = button.attributes[1].value
                document.querySelector("#subdivision").setAttribute("value", value)
            })
        }
    })
})

function cursorPoint(evt, pt) {
    pt.x = evt.clientX;
    pt.y = evt.clientY;
    return pt;
}

function getMousePosition(evt, pt) {
    let cursorPt = cursorPoint(evt, pt);
    return cursorPt
}

function evalNoteLength(noteLength) {
    let context = {}
    if (noteLength === "Q") {
        context["dec"] = 1
        context["duration"] = "q"
    } else if (noteLength === "H") {
        context["dec"] = 2
        context["duration"] = "h"
    } else if (noteLength === "E") {
        context["dec"] = 0.5
        context["duration"] = "8"
    } else if (noteLength === "W") {
        context["dec"] = 4
        context["duration"] = "w"
    } else if (noteLength === "S") {
        context["dec"] = 0.25
        context["duration"] = "16"
    }
    return context
}

function incFillCount(subdivision, fillCount, fillCountValue) {
    let note = ""
    let increment = ""
    if (subdivision === "Quarter Note") {
        note = subdivision[0]
        increment = String(fillCountValue + 1)
    } else if (subdivision === "Half Note") {
        note = subdivision[0]
        increment = String(fillCountValue + 2)
    } else if (subdivision === "Eighth Note") {
        note = subdivision[0]
        increment = String(fillCountValue + 0.5)
    } else if (subdivision === "Whole Note") {
        note = subdivision[0]
        increment = String(fillCountValue + 4)
    } else if (subdivision === "Sixteenth Note") {
        note = subdivision[0]
        increment =  String(fillCountValue + 0.25)
    }
    return {"note": [note], "fillCount": [increment]}
}

function evalFillLength(remainder) {
    let context = {}
    if (remainder % 0.25 === 0) {
        context["dec"] = 0.25
        context["duration"] = "16"
    } else if (remainder % 0.5 === 0) {
        context["dec"] = 0.5
        context["duration"] = "8"
    } else if (remainder % 1 === 0) {
        context["dec"] = 1
        context["duration"] = "q"
    } else if (remainder % 1 === 0) {
        context["dec"] = 2
        context["duration"] = "h"
    } else if (remainder % 4 === 0) {
        context["dec"] = 4
        context["duration"] = "w"
    }
    return context
}

function parseDrawnnNotes(drawnNotesValue, fillCapacity) {
    let drawnNoteAndLengthList = drawnNotesValue.split(",")
    drawnNoteAndLengthList.pop()
    let drawnNoteLengthValues = []
    let drawnNoteKeyValues = []
    for (let i = drawnNoteAndLengthList.length - 1; i > -1; i--) {
        if (drawnNoteAndLengthList[i].split("-")[1] === String(((fillCapacity / 4)))) {
            let timeValue = drawnNoteAndLengthList[i].split(":")[0]
            let noteAndMeasureKey = drawnNoteAndLengthList[i].split(":")[1]
            let noteKey = noteAndMeasureKey.split("-")[0]
            drawnNoteLengthValues.push(timeValue)
            drawnNoteKeyValues.push(noteKey)
        } else {
            break
        }
    }
    return {drawnNoteLengthValues, drawnNoteKeyValues};
}

function eraseProjectedNotes(fillCapacity) {
    let svgChildNodes = svgArray[((fillCapacity / 4) - 1)].childNodes
    let staticLength = svgChildNodes.length
    for (let i = 0; i < staticLength; i++) {
        let element = svgChildNodes[i]
        if (element !== null && element.nodeName === "g" && element.className !== "vf-stavenote" && element.attributes !== null && element.attributes[0].value !== "note-projection") {
            element.childNodes.forEach((item) => {
                item.attributes[3].value = "0"
            })
        }
    }
}

function drawNote(pX, pY, rects, vexContext, stave, svg, renderer, rendererWidth, rendererHeight, staveX, staveY) {
    let subdivision = document.querySelector("#subdivision").value
    let fillCount = document.getElementById("fill-count")
    let fillCapacity = parseInt(document.querySelector("#fill-capacity").getAttribute("value"))
    let drawnNotes = document.getElementById("drawn-notes")
    let drawnNotesValue = ""
    let fillCountValue = parseFloat(fillCount.value)

    let noteInc = incFillCount(subdivision, fillCount, fillCountValue)
    let note = noteInc["note"]

    if (noteInc["fillCount"] > fillCapacity) {
        alert("Cross-measure melodies not supported yet: fill the measure with the exact note value")
        return
    }

    fillCount.setAttribute("value", noteInc["fillCount"])

    let temp = parseInt(pY)
    for (let rect of rects) {
        if (temp < parseInt(rect.attributes[2].value)) {
            note += ":" + String(rect.attributes[0].value)
            temp = Number.MAX_SAFE_INTEGER
        }
    }

    document.querySelector('#note-group-' + note.split("-")[1]).insertAdjacentHTML('beforeend', `<ellipse id=\"${fillCountValue + note}\" cx=\"0\" cy=\"0\" rx=\"5\" ry=\"4\" opacity=\"1\"/>`)

    drawnNotesValue = drawnNotes.attributes[1].value + (note + ",")


    let synth = new Tone.Synth().toDestination();
    let noteDuration = getSubdivisionLength(subdivision[0])
    synth.triggerAttackRelease(note.split("-")[0].split(":")[1].replace("/", ""), noteDuration, Tone.now())

    Tone.Transport.start(Tone.now());

    let drawnNote = document.getElementById(fillCountValue + note)
    drawnNote.setAttribute("cx", pX)
    drawnNote.setAttribute("cy", pY)

    drawnNotes.attributes[1].value = drawnNotesValue


    let notes = [];
    let dec = 0;
    let duration = ""
    let startIndex = ((fillCapacity / 4) - 1) * 4
    let i = startIndex;
    if (parseFloat(document.getElementById("fill-count").value) === parseFloat(fillCapacity)) {
        let {drawnNoteLengthValues, drawnNoteKeyValues} = parseDrawnnNotes(drawnNotesValue, fillCapacity);
        eraseProjectedNotes(fillCapacity);

        drawnNoteKeyValues.forEach((note, i) => {
            duration = evalNoteLength(drawnNoteLengthValues[i])['duration']
            let newNote = new VF.StaveNote({clef: "treble", keys: [note], duration: duration})
            notes.unshift(newNote)
        })

        document.querySelector("#fill-capacity").setAttribute("value", String(fillCapacity + 4))
        let voice = new VF.Voice({num_beats: 4, beat_value: 4});
        voice.addTickables(notes);
        let formatter = new VF.Formatter().joinVoices([voice]).format([voice], 400);


        vexContext = rendererArray[((fillCapacity / 4) - 1)].getContext()
        let newStaveAttributes = newStave()
        let nStave = newStaveAttributes['stave']
        let nVexContext = newStaveAttributes['vexContext']

        let numberOfSvgs = fillCapacity / 4
        if (numberOfSvgs === 1) {
            document.getElementById("inner-row").style.width = String(rendererWidth * (numberOfSvgs + 1)) + "px"
            document.getElementById("elements").style.width = String(rendererWidth * (numberOfSvgs + 1)) + "px"
        }

        voice.draw(vexContextArray[((fillCapacity / 4) - 1)], staveArray[((fillCapacity / 4) - 1)]);
        nStave.setContext(nVexContext).draw();
        let newSvg = document.querySelector("#boo").lastChild

        rendererArray.push(renderer)
        vexContextArray.push(nVexContext)
        staveArray.push(nStave)
        svgArray.push(newSvg)
        newSvg.addEventListener("click", function (e) {
            let svgNumber = parseInt(e.target.id.split("-")[1]) - 1
            if (!svgNumber) {
                return
            }
            let selector = "#note-projection-" + String(svgNumber + 1)
            let projectionX = document.querySelector(selector).attributes[1].value
            let projectionY = document.querySelector(selector).attributes[2].value
            drawNote(projectionX, projectionY, xRectangles, vexContext, stave, svg, renderer, rendererWidth, rendererHeight, staveX, staveY)
            getMousePosition(e, pt)
        })

        let viewBox = ""

        for (let childSvg of document.querySelector("#boo").childNodes) {
            let bbox = childSvg.getBBox();
            viewBox = [bbox.x, bbox.y, bbox.width, bbox.height].join(" ");
            childSvg.setAttribute("viewBox", viewBox);
        }

        document.querySelector("#boo").children[0].setAttribute("viewBox", viewBox)

        let {
            yRectWidth,
            xRectHeight,
            id,
            inc,
            index,
            xRectangles,
            multiplier,
            letters,
            pt
        } = setupBoundaryParams(newSvg);
        id = numberOfSvgs
        letters = ['c/', 'b/', 'a/', 'g/', 'f/', 'e/', 'd/']
        addNoteBoundaries(numberOfSvgs + 1, yRectWidth, staveX, index, letters, inc, xRectHeight, multiplier, staveY, newSvg, xRectangles, pt);
        let prevNoteProjection = document.getElementById("note-projection-" + String(numberOfSvgs))
        prevNoteProjection.attributes[5].value = 0
        let noteGroupId = "note-group-" + String(numberOfSvgs + 1)
        newSvg.insertAdjacentHTML('beforeend', `<g id=${noteGroupId}></g>`)
        newSvg.insertAdjacentHTML('beforeend', `<ellipse id=${"note-projection-" + String(numberOfSvgs + 1)} cx=\"400\" cy=\"400\" rx=\"5\" ry=\"4\" opacity=\"1\"/>`)

        newSvg.addEventListener("mousemove", function (evt) {
            let svgIndex = parseInt(evt.target.attributes[0].value.split("-")[1])
            let svg = document.querySelector("#boo").childNodes[0]
            let subdivision = document.querySelector('#subdivision').attributes.getNamedItem('value').value
            let elementList = document.elementsFromPoint(evt.clientX, evt.clientY)
            if ((elementList.length === 10 || elementList.length === 11) && elementList[0].attributes.length > 3 && elementList[0].nodeName && elementList[0].nodeName !== "ellipse" && elementList[1].attributes[0].value.split("-")[1]) {
                let hBar = elementList[0]
                let vBar = elementList[1]

                let rectangleNumber = parseInt(vBar.attributes[0].value.split("-")[1].substring(1,))
                if (subdivision[0] === "Q") {
                    if (rectangleNumber !== 16) {
                        vBar = document.querySelector("#yRectangleHtml-" + String(id) + String(Math.floor(rectangleNumber / 4) * 4 + 2))
                    } else {
                        vBar = document.querySelector("#yRectangleHtml-" + String(id) + "14")
                    }
                } else if (subdivision[0] === "H") {
                    if (rectangleNumber !== 16) {
                        vBar = document.querySelector("#yRectangleHtml-" + String(id) + String(Math.floor(rectangleNumber / 8) * 8 + 4))
                    } else {
                        vBar = document.querySelector("#yRectangleHtml-" + String(id) + "12")
                    }
                } else if (subdivision[0] === "E") {
                    if (rectangleNumber !== 16) {
                        vBar = document.querySelector("#yRectangleHtml-" + String(id) + String(Math.floor(rectangleNumber / 2) * 2 + 2))
                    } else {
                        vBar = document.querySelector("#yRectangleHtml-" + String(id) + "15")
                    }
                }
                let xposition = vBar.attributes[1].value
                projectNote(xposition, hBar, staveX, String(numberOfSvgs + 1))
            }
        })
    }
}

