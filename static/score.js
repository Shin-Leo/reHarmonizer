function cursorPoint(evt) {
    pt.x = evt.clientX;
    pt.y = evt.clientY;
    return pt.matrixTransform(svg.getScreenCTM().inverse());
}


function projectNote(rect, coordinates, svg) {
    document.getElementById("note-projection").setAttribute("cx", coordinates.x)
    document.getElementById("note-projection").setAttribute("cy", coordinates.y)
    console.log(document.getElementById("note-projection").attributes)
}

$(document).ready(function () {
    VF = Vex.Flow;

    let div = document.getElementById("boo")
    let renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);

    renderer.resize(500, 200);

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
    let yRectangles = []
    let xRectangles = []
    for (let i = 0; i < 16; i++) {
        let yRectangleHtml = `<rect id=\"${"yRectangleHtml" + id}\" x=\"${yRectWidth + staveX * 0.2}\" y=\"50\" width=\"20\" height=\"100\" style=\"fill:rgb(183,241,222);\" opacity=\"0\">\n" 
+
<!--            "              <animate attributeName=\"opacity\" from=\"0\" to=\"1\" begin=\"mouseover\" dur=\"0.5s\" fill=\"freeze\"/>\n" +-->
<!--            "              <animate attributeName=\"opacity\" to=\"0\" begin=\"mouseout\" dur=\"0.5s\" fill=\"freeze\"/>\n" +-->
            "            </rect>`
        let xRectangleHtml;
        if (i % 2) {
            xRectangleHtml = `<rect id=\"${"xRectangleHtml" + id}\" x=\"${staveX * 0.2}\" y=\"${xRectHeight + 1.36 * staveY}\" width=\"300\" height=\"6\" style=\"fill:rgb(183,241,222);\" opacity=\"0\">\n" +
            "              <animate attributeName=\"opacity\" from=\"0\" to=\"1\" begin=\"mouseover\" dur=\"0.5s\" fill=\"freeze\"/>\n" +
            "              <animate attributeName=\"opacity\" to=\"0\" begin=\"mouseout\" dur=\"0.5s\" fill=\"freeze\"/>\n" +
            "            </rect>`
            xRectHeight += 6
        } else {
            xRectangleHtml = `<rect id=\"${"xRectangleHtml" + id}\" x=\"${staveX * 0.2}\" y=\"${xRectHeight + 1.36 * staveY}\" width=\"300\" height=\"4\" style=\"fill:rgb(183,241,222);\" opacity=\"0\">\n" +
            "              <animate attributeName=\"opacity\" from=\"0\" to=\"1\" begin=\"mouseover\" dur=\"0.5s\" fill=\"freeze\"/>\n" +
            "              <animate attributeName=\"opacity\" to=\"0\" begin=\"mouseout\" dur=\"0.5s\" fill=\"freeze\"/>\n" +
            "            </rect>`
            xRectHeight += 4
        }

        svg.insertAdjacentHTML('afterbegin', yRectangleHtml)
        // svg.insertAdjacentHTML('beforeend', xRectangleHtml)
        yRectWidth += 20
        let yRectangle = document.getElementById("yRectangleHtml" + id)
        let xRectangle = document.getElementById("yRectangleHtml" + id)
        xRectangles.push(xRectangle)
        yRectangles.push(yRectangle)
        id += 1
    }
    svg.insertAdjacentHTML('beforeend', `<ellipse id="note-projection" cx=\"400\" cy=\"400\" rx=\"4\" ry=\"3\" opacity=\"1\">`)
    let pt = svg.createSVGPoint();
    yRectangles.forEach((rect) => {
        rect.addEventListener("mousemove", function (e) {
            pt.x = e.target.attribute
            projectNote(rect, getMousePosition(e, pt), svg)
        })
    })
    svg.addEventListener("click", function (e) {
        getMousePosition(e, pt)
    })
})

function addQuarterNote() {

}

function getMousePosition(evt, pt) {
    let cursorPt = cursorPoint(evt, pt);
    console.log("(" + cursorPt.x + ", " + cursorPt.y + ")");
    return cursorPt
}

function cursorPoint(evt, pt) {
    pt.x = evt.clientX;
    pt.y = evt.clientY;
    return pt
}

function drawNote() {
    VF = Vex.Flow;

    let div = document.getElementById("boo")
    let renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);

    renderer.resize(500, 200);

    let context = renderer.getContext();

    let notes = [
        new VF.StaveNote({clef: "treble", keys: ["c/5"], duration: "q"}),
        new VF.StaveNote({clef: "treble", keys: ["d/4"], duration: "q"}),
        new VF.StaveNote({clef: "treble", keys: ["b/4"], duration: "qr"}),
        new VF.StaveNote({clef: "treble", keys: ["c/4", "e/4", "g/4"], duration: "q"})
    ];


// Create a voice in 4/4 and add the notes from above
    let voices = [
        new VF.Voice({num_beats: 4, beat_value: 4}).addTickables(notes)
    ]
// Format and justify the notes to 400 pixels.
    let formatter = new VF.Formatter().joinVoices(voices).format(voices, 400);

// Render voices

    let stave = new VF.Stave(10, 40, 400);

    stave.addClef("treble").addTimeSignature("4/4");

    stave.setContext(context).draw();
    let svg = document.querySelector("#boo > svg")

    voices.forEach(function (v) {
        v.draw(context, stave);
    })
}

