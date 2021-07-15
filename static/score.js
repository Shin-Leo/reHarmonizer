$(document).ready(function () {
    VF = Vex.Flow;

    let div = document.getElementById("boo")
    let renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);

    renderer.resize(500, 500);

    let context = renderer.getContext();
    let stave = new VF.Stave(10, 40, 400);

    stave.addClef("treble").addTimeSignature("4/4");

    stave.setContext(context).draw();
    let svg = document.querySelector("#boo > svg")
    let pt = svg.createSVGPoint();
    svg.addEventListener("click", function (e) {
        getMousePosition(e, pt)
    })
})

function addQuarterNote() {

}

function getMousePosition(evt, pt) {
    let cursorpt = cursorPoint(evt, pt);
    console.log("(" + cursorpt.x + ", " + cursorpt.y + ")");
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

    renderer.resize(500, 500);

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

