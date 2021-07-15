$(document).ready(function () {
    VF = Vex.Flow;

    var div = document.getElementById("boo")
    var renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);

    renderer.resize(500, 500);

    var context = renderer.getContext();
    var stave = new VF.Stave(10, 40, 400);

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
    let notes = [
        new VF.StaveNote({clef: "treble", keys: ["c/4"], duration: "q"}),
    ]

    var voice = new VF.Voice({num_beats: 4, beat_value: 4});
    voice.addTickables(notes);

    var formatter = new VF.Formatter().joinVoices([voice]).format([voice], 400);

    voice.draw(context, stave);
        let div = document.getElementById("boo")
}

