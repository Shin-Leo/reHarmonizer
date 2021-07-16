function projectNote(rect, coordinates, availableWidth) {
    let start = parseInt(rect[1].value)
    let inc = parseInt(availableWidth) / 4
    let xPos = 0
    if (coordinates.x >= start && coordinates.x <= start + inc) {
        xPos = start + (inc / 2)
        document.getElementById("note-projection").setAttribute("cx", String(xPos))
        document.getElementById("note-projection").setAttribute("cy", String(rect[2].value - 2.5))
        document.getElementById("delete-count").setAttribute("value", "3")
    } else if (coordinates.x > start + inc && coordinates.x <= start + inc * 2) {
        xPos = start + (inc * 2) * (3 / 4)
        document.getElementById("note-projection").setAttribute("cx", String(xPos))
        document.getElementById("note-projection").setAttribute("cy", String(rect[2].value - 2.5))
                document.getElementById("delete-count").setAttribute("value", "2")
    } else if (coordinates.x > start + inc * 2 && coordinates.x <= start + inc * 3) {
        xPos = start + ((inc * 3) * (5 / 6))
        document.getElementById("note-projection").setAttribute("cx", String(xPos))
        document.getElementById("note-projection").setAttribute("cy", String(rect[2].value - 2.5))
        document.getElementById("delete-count").setAttribute("value", "1")
    } else if (coordinates.x > start + inc * 3 && coordinates.x <= start + inc * 4) {
        xPos = start + (inc * 4) * (7 / 8)
        document.getElementById("note-projection").setAttribute("cx", String(xPos))
        document.getElementById("note-projection").setAttribute("cy", String(rect[2].value - 2.5))
        document.getElementById("delete-count").setAttribute("value", "0")
    }
}

$(document).ready(function () {
    VF = Vex.Flow;
    let div = document.getElementById("boo")
    let renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);
    let rendererHeight = 200
    let rendererWidth = 500

    renderer.resize(rendererWidth, rendererHeight);

    let context = renderer.getContext();
    let staveX = 400
    let staveY = 50
    let stave = new VF.Stave(10, staveY, staveX);

    stave.addClef("treble").addTimeSignature("4/4");

    stave.setContext(context).draw();
    let svg = document.querySelector("#boo > svg")
    let yRectWidth = 0
    let xRectHeight = 0
    let id = 1
    let inc = 6
    let index = 0
    let yRectangles = []
    let xRectangles = []
    let multiplier = 1.47
    let letters = ['c/', 'b/', 'a/', 'g/', 'f/', 'e/', 'd/']
    for (let i = 0; i < 16; i++) {
        let yRectangleHtml = `<rect id=\"${"yRectangleHtml" + id}\" x=\"${yRectWidth + staveX * 0.2}\" y=\"50\" width=\"20\" height=\"100\" style=\"fill:rgb(183,241,222);\" opacity=\"0\">\n" 
+
<!--            "              <animate attributeName=\"opacity\" from=\"0\" to=\"1\" begin=\"mouseover\" dur=\"0.5s\" fill=\"freeze\"/>\n" +-->
<!--            "              <animate attributeName=\"opacity\" to=\"0\" begin=\"mouseout\" dur=\"0.5s\" fill=\"freeze\"/>\n" +-->
            "            </rect>`
        let xRectangleHtml;
        index = i % letters.length;
        if (i % 2) {
            xRectangleHtml = `<rect id=\"${letters[index] + String(inc)}\" x=\"${staveX * 0.2}\" y=\"${xRectHeight + multiplier * staveY}\" width=\"300\" height=\"6\" style=\"fill:rgb(183,241,222);\" opacity=\"0\">\n"
 +
<!--            "              <animate attributeName=\"opacity\" from=\"0\" to=\"1\" begin=\"mouseover\" dur=\"0.5s\" fill=\"freeze\"/>\n" +-->
<!--            "              <animate attributeName=\"opacity\" to=\"0\" begin=\"mouseout\" dur=\"0.5s\" fill=\"freeze\"/>\n" +-->
            "            </rect>`
            xRectHeight += 6
        } else {
            xRectangleHtml = `<rect id=\"${letters[index] + String(inc)}\" x=\"${staveX * 0.2}\" y=\"${xRectHeight + multiplier * staveY}\" width=\"300\" height=\"4\" style=\"fill:rgb(183,241,222);\" opacity=\"0\">\n" 
+
<!--            "              <animate attributeName=\"opacity\" from=\"0\" to=\"1\" begin=\"mouseover\" dur=\"0.5s\" fill=\"freeze\"/>\n" +-->
<!--            "              <animate attributeName=\"opacity\" to=\"0\" begin=\"mouseout\" dur=\"0.5s\" fill=\"freeze\"/>\n" +-->
            "            </rect>`
            xRectHeight += 4
        }

        // svg.insertAdjacentHTML('beforeennd', yRectangleHtml)
        svg.insertAdjacentHTML('beforeend', xRectangleHtml)
        yRectWidth += 20
        let yRectangle = document.getElementById(letters[index] + inc)
        let xRectangle = document.getElementById(letters[index] + inc)
        xRectangles.push(xRectangle)
        // yRectangles.push(yRectangle)
        id += 1
        if (letters[index] === letters[0]) {
            inc--;
        }
    }
    svg.insertAdjacentHTML('beforeend', `<ellipse id="note-projection" cx=\"400\" cy=\"400\" rx=\"5\" ry=\"4\" opacity=\"1\">`)
    let pt = svg.createSVGPoint();
    xRectangles.forEach((rect) => {
        rect.addEventListener("mousemove", function (e) {
            projectNote(e.target.attributes, getMousePosition(e, pt), staveX - e.target.attributes[1].value)
        })
        rect.addEventListener("mouseleave", function (e) {
            projectNote(e.target.attributes, getMousePosition(e, pt), staveX - e.target.attributes[1].value)
        })
    });
    svg.addEventListener("click", function (e) {
        let projectionX = document.querySelector("#note-projection").attributes[1].value
        let projectionY = document.querySelector("#note-projection").attributes[2].value
        drawNote(projectionX, projectionY, xRectangles, context, stave)
        getMousePosition(e, pt)
    })
    let quarterNote = document.querySelector("#quarter-note")
    quarterNote.addEventListener("click", function (e) {
        drawNote(e)
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

function drawNote(pX, pY, rects, context, stave) {
    let note = ""
    let temp = parseInt(pY)
    rects.forEach((rect) => {
        if (temp < parseInt(rect.attributes[2].value)) {
            note = rect.attributes[0].value
            temp = Number.MAX_SAFE_INTEGER
        }
    })
    let notes = [
        new VF.StaveNote({clef: "treble", keys: [note], duration: "q"}),
        new VF.StaveNote({clef: "treble", keys: ["b/4"], duration: "qr"}),
        new VF.StaveNote({clef: "treble", keys: ["b/4"], duration: "qr"}),
        new VF.StaveNote({clef: "treble", keys: ["b/4"], duration: "qr"}),
    ];
    let voice = new VF.Voice({num_beats: 4, beat_value: 4});
    voice.addTickables(notes);
    let deleteCount = parseInt(document.querySelector("#delete-count").attributes[1].value)
    console.log(deleteCount)
    while(deleteCount !== 0) {
        notes[deleteCount].setStyle({fillStyle: "transparent", strokeStyle: "transparent"})
        deleteCount--;
    }
    let formatter = new VF.Formatter().joinVoices([voice]).format([voice], 400);
    voice.draw(context, stave);

    let svg = document.querySelector("#boo").childNodes[0].childNodes

}

