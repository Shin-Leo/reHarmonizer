function projectNote(rectangle, coordinates, availableWidth) {
    let divOffset = document.querySelector("#center-col").offsetLeft
    let rect = rectangle.attributes
    let rectId = rect[0].value.split("-")[1]
    let start = parseInt(rect[1].value) * rectId + divOffset + 3
    let barOffset = (parseInt(rectId) - 1) * (availableWidth + parseInt(rect[1].value) + 40)
    let width = String(availableWidth)
    let subdivision = document.querySelector('#subdivision').attributes.getNamedItem('value').value
    let projected_note = document.querySelector("#boo").lastChild.lastChild
    let inc = parseInt(width) / 4
    if (subdivision === "Eighth Note") {
        inc = parseInt(width) / 8
    } else if (subdivision === "Sixteenth Note") {
        inc = parseInt(width) / 16
    }
    let xPos = 0
    let yPos = rect[2].value - 2.5
    if (coordinates.x >= start && coordinates.x <= start + inc) {
        xPos = start + (inc / 2) - divOffset - barOffset
        projected_note.setAttribute("cx", String(xPos))
        projected_note.setAttribute("cy", String(yPos))
        document.getElementById("delete-count").setAttribute("value", "3")
    } else if (coordinates.x > start + inc && coordinates.x <= start + inc * 2) {
        xPos = start + (inc * 2) * (3 / 4) - divOffset - barOffset
        projected_note.setAttribute("cx", String(xPos))
        projected_note.setAttribute("cy", String(yPos))
        document.getElementById("delete-count").setAttribute("value", "2")
    } else if (coordinates.x > start + inc * 2 && coordinates.x <= start + inc * 3) {
        xPos = start + ((inc * 3) * (5 / 6)) - divOffset - barOffset
        projected_note.setAttribute("cx", String(xPos))
        projected_note.setAttribute("cy", String(yPos))
        document.getElementById("delete-count").setAttribute("value", "1")
    } else if (coordinates.x > start + inc * 3 && coordinates.x <= start + inc * 4) {
        xPos = start + (inc * 4) * (7 / 8) - divOffset - barOffset
        projected_note.setAttribute("cx", String(xPos))
        projected_note.setAttribute("cy", String(yPos))
        document.getElementById("delete-count").setAttribute("value", "0")
    } else if (coordinates.x > start + inc * 4 && coordinates.x <= start + inc * 5) {
        xPos = start + (inc * 5) * (9 / 10) - divOffset - barOffset
        projected_note.setAttribute("cx", String(xPos))
        projected_note.setAttribute("cy", String(yPos))
        document.getElementById("delete-count").setAttribute("value", "2")
    } else if (coordinates.x > start + inc * 5 && coordinates.x <= start + inc * 6) {
        xPos = start + ((inc * 6) * (11 / 12)) - divOffset - barOffset
        projected_note.setAttribute("cx", String(xPos))
        projected_note.setAttribute("cy", String(yPos))
        document.getElementById("delete-count").setAttribute("value", "1")
    } else if (coordinates.x > start + inc * 6 && coordinates.x <= start + inc * 7) {
        xPos = start + (inc * 7) * (13 / 14) - divOffset - barOffset
        projected_note.setAttribute("cx", String(xPos))
        projected_note.setAttribute("cy", String(yPos))
        document.getElementById("delete-count").setAttribute("value", "0")
    } else if (coordinates.x > start + inc * 7 && coordinates.x <= start + inc * 8) {
        xPos = start + (inc * 8) * (14 / 15) - divOffset - barOffset
        projected_note.setAttribute("cx", String(xPos))
        projected_note.setAttribute("cy", String(yPos))
        document.getElementById("delete-count").setAttribute("value", "0")
    } else if (coordinates.x > start + inc * 8 && coordinates.x <= start + inc * 9) {
        xPos = start + (inc * 9) * (16 / 17) - divOffset - barOffset
        projected_note.setAttribute("cx", String(xPos))
        projected_note.setAttribute("cy", String(yPos))
        document.getElementById("delete-count").setAttribute("value", "0")
    } else if (coordinates.x > start + inc * 9 && coordinates.x <= start + inc * 10) {
        xPos = start + (inc * 10) * (18 / 19) - divOffset - barOffset
        projected_note.setAttribute("cx", String(xPos))
        projected_note.setAttribute("cy", String(yPos))
        document.getElementById("delete-count").setAttribute("value", "0")
    } else if (coordinates.x > start + inc * 10 && coordinates.x <= start + inc * 11) {
        xPos = start + (inc * 11) * (20 / 21) - divOffset - barOffset
        projected_note.setAttribute("cx", String(xPos))
        projected_note.setAttribute("cy", String(yPos))
        document.getElementById("delete-count").setAttribute("value", "2")
    } else if (coordinates.x > start + inc * 11 && coordinates.x <= start + inc * 12) {
        xPos = start + (inc * 12) * (22 / 23) - divOffset - barOffset
        projected_note.setAttribute("cx", String(xPos))
        projected_note.setAttribute("cy", String(yPos))
        document.getElementById("delete-count").setAttribute("value", "1")
    } else if (coordinates.x > start + inc * 12 && coordinates.x <= start + inc * 13) {
        xPos = start + (inc * 13) * (24 / 25) - divOffset - barOffset
        projected_note.setAttribute("cx", String(xPos))
        projected_note.setAttribute("cy", String(yPos))
        document.getElementById("delete-count").setAttribute("value", "0")
    } else if (coordinates.x > start + inc * 13 && coordinates.x <= start + inc * 14) {
        xPos = start + (inc * 14) * (26 / 27) - divOffset
        projected_note.setAttribute("cx", String(xPos))
        projected_note.setAttribute("cy", String(yPos))
        document.getElementById("delete-count").setAttribute("value", "0")
    } else if (coordinates.x > start + inc * 14 && coordinates.x <= start + inc * 15) {
        xPos = start + (inc * 15) * (28 / 29) - divOffset
        projected_note.setAttribute("cx", String(xPos))
        projected_note.setAttribute("cy", String(yPos))
        document.getElementById("delete-count").setAttribute("value", "0")
    }
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

function addNoteBoundaries(id, yRectWidth, staveX, index, letters, inc, xRectHeight, multiplier, staveY, svg, xRectangles, pt) {
    let yRectangles = []
    for (let i = 0; i < 16; i++) {
        yRectWidth += 20
        let yRectangleHtml = `<rect id=\"${"yRectangleHtml" + id}\" x=\"${yRectWidth + staveX * 0.2}\" y=\"50\" width=\"20\" height=\"100\" style=\"fill:rgb(183,241,222);\" opacity=\"0\">\n"+"</rect>`
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

    xRectangles.forEach((rect) => {
        rect.addEventListener("mousemove", function (e) {
            // let svgIndex = parseInt(e.target.attributes[0].value.split("-")[1]) - 1
            // let temp = e.target.outerHTML.replace("\"+\"", "")
            // let svg = document.querySelector("#boo").childNodes[svgIndex]
            // let rpos  = svg.createSVGRect()
            // console.log()
            // rpos.x = parseInt(e.target.attributes[0].value)
            // rpos.y = parseInt(e.target.attributes[1].value)
            // rpos.width = rpos.height = parseInt(e.target.attributes[2].value)
            //

            // document.querySelector("#boo").childNodes[svgIndex].appendChild(e.target)
            // document.querySelector("#boo").childNodes[svgIndex].insertAdjacentHTML('beforeend', temp)
            projectNote(e.target, getMousePosition(e, pt), staveX - e.target.attributes[1].value)
        })
        rect.addEventListener("mouseleave", function (e) {
            document.querySelector("#note-projection").attributes[5].value = "1"
            projectNote(e.target, getMousePosition(e, pt), staveX - e.target.attributes[1].value)
        })
        svg.addEventListener("mouseleave", function (e) {
            document.querySelector("#note-projection").attributes[5].value = "0"
        })
        // yRectangles.forEach((rect) => {
        //     rect.addEventListener("mousemove", function (e) {
        //         let svgIndex = parseInt(e.target.attributes[0].value.split("-")[1]) - 1
        //         console.log(e.current)
        //         let xRectangle = document.querySelector("#boo").childNodes[svgIndex].lastChild
        //         projectNote(xRectangle, getMousePosition(e, pt), staveX - parseInt(xRectangle.attributes.x))
        //     })
        // })
    })
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
    let svg = document.querySelector("#boo").lastChild

    stave.addClef("treble").addTimeSignature("4/4");

    stave.setContext(vexContext).draw();
    let {yRectWidth, xRectHeight, id, inc, index, xRectangles, multiplier, letters, pt} = setupBoundaryParams(svg);
    addNoteBoundaries(id, yRectWidth, staveX, index, letters, inc, xRectHeight, multiplier, staveY, svg, xRectangles, pt);

    svg.insertAdjacentHTML('beforeend', '<g id="note-group"></g>')
    svg.insertAdjacentHTML('beforeend', `<ellipse id="note-projection" cx=\"400\" cy=\"400\" rx=\"5\" ry=\"4\" opacity=\"1\"/>`)

    svg.addEventListener("click", function (e) {
        let projectionX = document.querySelector("#note-projection").attributes[1].value
        let projectionY = document.querySelector("#note-projection").attributes[2].value
        drawNote(projectionX, projectionY, xRectangles, vexContext, stave, svg, renderer, rendererWidth, rendererHeight, staveX, staveY)
        getMousePosition(e, pt)
    })
    svg.addEventListener("mousemove", function (evt) {
        let svgIndex = parseInt(evt.target.attributes[0].value.split("-")[1]) - 1
        let svg = document.querySelector("#boo").childNodes[0]
        let rpos = svg.createSVGRect()
        rpos.x = evt.clientX
        rpos.y = evt.clientY
        console.log(rpos.x)
        console.log(rpos.y)
        console.log(document.elementsFromPoint(rpos.x, rpos.y))
        rpos.width = 1000
        rpos.height = 1000
        console.log(svg.getIntersectionList(rpos, null))
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
    document.querySelector('#note-group').insertAdjacentHTML('beforeend', `<ellipse id=\"${fillCountValue + note}\" cx=\"0\" cy=\"0\" rx=\"5\" ry=\"4\" opacity=\"1\"/>`)

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
    let fillCapacity = 4
    let deleteCount = 0
    let remainingToFill = fillCapacity - fillCountValue
    if (fillCountValue >= fillCapacity) {
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

        fillCapacity += 4
        vexContext = renderer.getContext()
        let newStaveAttributes = newStave()
        let nStave = newStaveAttributes['stave']
        let nVexContext = newStaveAttributes['vexContext']

        let innerRow = document.querySelector("#inner-row")
        let leftCol = document.querySelector("#left-col")
        let rightCol = document.querySelector("#right-col")
        let numberOfSvgs = fillCapacity / 4
        document.getElementById("inner-row").style.width = String(rendererWidth * numberOfSvgs) + "px"

        voice.draw(vexContext, stave);
        nStave.setContext(nVexContext).draw();
        let newSvg = document.querySelector("#boo").lastChild


        newSvg.addEventListener("click", function (e) {
            let projectionX = document.querySelector("#note-projection").attributes[1].value
            let projectionY = document.querySelector("#note-projection").attributes[2].value
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
        addNoteBoundaries(id, yRectWidth, staveX, index, letters, inc, xRectHeight, multiplier, staveY, newSvg, xRectangles, pt);

        newSvg.insertAdjacentHTML('beforeend', `<ellipse id=${id} cx=\"400\" cy=\"400\" rx=\"5\" ry=\"4\" opacity=\"1\"/>`)
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

