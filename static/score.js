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
    let selector = "note-projection-" + (id)
    let projected_note = document.getElementById(selector)
    let yPos = rect[2].value - 2.5
    projected_note.setAttribute("cx", String(xPos))
    projected_note.setAttribute("cy", String(yPos))
}

document.querySelector("#boo > svg")

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

$(document).ready(function () {
    VF = Vex.Flow;
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
        if ((elementList.length === 10 || elementList.length === 11) && elementList[0].attributes.length > 3) {
            let hBar = elementList[0]
            let vBar = elementList[1]
            let xposition = vBar.attributes[1].value
            projectNote(xposition, hBar, staveX, 1)
        }
    })


    let noteButtons = [...document.querySelector("#note-buttons").children]

    noteButtons.forEach((button) => {
        if (button.nodeName === "BUTTON") {
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

function cursorPoint(evt, pt) {
    pt.x = evt.clientX;
    pt.y = evt.clientY;
    return pt
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

function drawNote(pX, pY, rects, vexContext, stave, svg, renderer, rendererWidth, rendererHeight, staveX, staveY) {
    let subdivision = document.querySelector("#subdivision").getAttribute("value")
    let fillCount = document.querySelector("#fill-count")
    let fillCapacity = parseInt(document.querySelector("#fill-capacity").getAttribute("value"))
    let drawnNotes = document.getElementById("drawn-notes")
    let drawnNotesValue = ""
    let fillCountValue = parseFloat(fillCount.attributes[1].value)
    let note = ""
    if (subdivision === "Quarter Note") {
        note = subdivision[0]
        fillCount.setAttribute("value", String(fillCountValue + 1))
    } else if (subdivision === "Half Note") {
        note = subdivision[0]
        fillCount.setAttribute("value", String(fillCountValue + 2))
    } else if (subdivision === "Eighth Note") {
        note = subdivision[0]
        fillCount.setAttribute("value", String(fillCountValue + 0.5))
    } else if (subdivision === "Whole Note") {
        note = subdivision[0]
        fillCount.setAttribute("value", String(fillCountValue + 4))
    } else if (subdivision === "Sixteenth Note") {
        note = subdivision[0]
        fillCount.setAttribute("value", String(fillCountValue + 0.25))
    }
    fillCountValue = parseInt(fillCount.attributes[1].value)
    let temp = parseInt(pY)
    rects.forEach((rect) => {
        if (temp < parseInt(rect.attributes[2].value)) {
            note += ":" + String(rect.attributes[0].value)
            temp = Number.MAX_SAFE_INTEGER
        }
    })
    console.log('#note-group-' + note.split("-")[1])
    document.querySelector('#note-group-' + note.split("-")[1]).insertAdjacentHTML('beforeend', `<ellipse id=\"${fillCountValue + note}\" cx=\"0\" cy=\"0\" rx=\"5\" ry=\"4\" opacity=\"1\"/>`)

    drawnNotesValue = drawnNotes.attributes[1].value + (note + ",")
    let drawnNote = document.getElementById(fillCountValue + note)
    drawnNote.setAttribute("cx", pX)
    drawnNote.setAttribute("cy", pY)
    note = note.split("/")[note.length - 2]

    drawnNotes.attributes[1].value = drawnNotesValue


    let notes = [];
    let dec = 0;
    let i = 0;
    let duration = ""
    let deleteCount = 0
    let remainingToFill = fillCapacity - fillCountValue
    if (fillCountValue >= fillCapacity) {
        document.querySelector("#fill-capacity").setAttribute("value", String(fillCapacity + 4))
        let drawnNoteAndLengthList = drawnNotesValue.split(",")
        drawnNoteAndLengthList.pop()
        let drawnNoteLengthValues = []
        let drawnNoteKeyValues = []
        for (let note of drawnNoteAndLengthList) {
            let timeValue = note.split(":")[0]
            let noteAndMeasureKey = note.split(":")[1]
            let noteKey = noteAndMeasureKey.split("-")[0]
            drawnNoteLengthValues.push(timeValue)
            drawnNoteKeyValues.push(noteKey)
        }
        while (fillCountValue > 0 && drawnNoteLengthValues.length > 0 && drawnNoteKeyValues.length > 0) {
            note = drawnNoteKeyValues[i]
            let context = evalNoteLength(drawnNoteLengthValues[i])
            dec = context["dec"]
            duration = context["duration"]
            let newNote = new VF.StaveNote({clef: "treble", keys: [note], duration: duration})
            notes.push(newNote)
            fillCountValue -= dec
            i++
        }
        let voice = new VF.Voice({num_beats: 4, beat_value: 4});
        voice.addTickables(notes);
        let formatter = new VF.Formatter().joinVoices([voice]).format([voice], 400);
        let svgChildNodes = svg.childNodes
        let staticLength = svgChildNodes.length
        for (let i = 0; i < staticLength; i++) {
            let element = svgChildNodes[i]
            if (element !== null && element.nodeName === "g" && element.attributes !== null && element.attributes[0].value !== "note-projection") {
                element.childNodes.forEach((item) => {
                    item.attributes[3].value = "0"
                })
            }
        }

        vexContext = renderer.getContext()
        let newStaveAttributes = newStave()
        let nStave = newStaveAttributes['stave']
        let nVexContext = newStaveAttributes['vexContext']

        let numberOfSvgs = fillCapacity / 4
        console.log(numberOfSvgs)
        document.getElementById("inner-row").style.width = String(rendererWidth * (numberOfSvgs + 1)) + "px"

        voice.draw(vexContext, stave);
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
            console.log(svgNumber)
            let selector = "#note-projection-" + String(svgNumber)
            let projectionX = document.querySelector(selector).attributes[1].value
            let projectionY = document.querySelector(selector).attributes[2].value
            let currentRenderer = rendererArray[svgNumber]
            let currentVexContext = vexContextArray[svgNumber]
            let currentStave = staveArray[svgNumber]
            let currentSvg = svgArray[svgNumber]
            console.log(currentRenderer)
            console.log(currentVexContext)
            console.log(currentStave)
            console.log(currentSvg)
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
        id = String(id)
        letters = ['c/', 'b/', 'a/', 'g/', 'f/', 'e/', 'd/']
        addNoteBoundaries(numberOfSvgs + 1, yRectWidth, staveX, index, letters, inc, xRectHeight, multiplier, staveY, newSvg, xRectangles, pt);
        console.log("note-projection-" + String(numberOfSvgs + 1))
        let prevNoteProjection = document.getElementById("note-projection-" + String(numberOfSvgs))
        prevNoteProjection.attributes[5].value = 0
        let noteGroupId = "note-group-" + String(numberOfSvgs + 1)
        newSvg.insertAdjacentHTML('beforeend', `<g id=${noteGroupId}></g>`)
        newSvg.insertAdjacentHTML('beforeend', `<ellipse id=${"note-projection-" + String(numberOfSvgs + 1)} cx=\"400\" cy=\"400\" rx=\"5\" ry=\"4\" opacity=\"1\"/>`)

        newSvg.addEventListener("mousemove", function (evt) {
            let svgIndex = parseInt(evt.target.attributes[0].value.split("-")[1])
            let svg = document.querySelector("#boo").childNodes[0]
            let elementList = document.elementsFromPoint(evt.clientX, evt.clientY)
            if ((elementList.length === 10 || elementList.length === 11) && elementList[0].attributes.length > 3) {
                // console.log(elementList)
                let hBar = elementList[0]
                let vBar = elementList[1]
                // console.log(hBar)
                // console.log(vBar)
                let xposition = vBar.attributes[1].value
                projectNote(xposition, hBar, staveX, String(numberOfSvgs + 1))
            }
        })
        // newSvg.addEventListener("click", function (e) {
        //     let projectionX = document.querySelector("#note-projection-" + id).attributes[1].value
        //     let projectionY = document.querySelector("#note-projection-" + id).attributes[2].value
        //     drawNote(projectionX, projectionY, xRectangles, nVexContext, nStave, newSvg, renderer, rendererWidth, rendererHeight, staveX, staveY)
        //     getMousePosition(e, pt)
        // })
    }
    // code for setting up single note addition
    // let tickContext = new VF.TickContext()
    // let visibleNotes = []
    // else {
    //         const group = vexContext.openGroup()
    //         visibleNotes.push(group)
    //         tickContext.addTickable(newNote)
    //         tickContext.preFormat().setX(200)
    //                 let newNote = new VF.StaveNote({clef: "treble", keys: [note], duration: duration}).setContext(context).setStave(stave)
    //         newNote.draw()
    //         vexContext.closeGroup()
    // }

    /*
    while (remainingToFill !== 0) {
        let context = evalFillLength(remainingToFill)
        dec = context["dec"]
        duration = context["duration"]
        remainingToFill -= dec
        let newNote = new VF.StaveNote({clef: "treble", keys: [note], duration: duration})
        notes.push(newNote)
        deleteCount++
    }

            while (deleteCount !== 0) {
            notes[deleteCount].setStyle({fillStyle: "transparent", strokeStyle: "transparent"})
            deleteCount--;
        }
    */
}

