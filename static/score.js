import Vex from '/vexflow/releases/vexflow-debug'

function setup() {
    const vf = new Vex.Flow.Factory({
        renderer: {elementId: 'boo', width: 500, height: 200}
    })

    const score = vf.EasyScore();
    const system = vf.System();

    system.addStave({
        voices: [
            score.voice(score.notes('C#5/q, B4, A4, G#4', {stem: 'up'})),
            score.voice(score.notes('C#4/h, C#4', {stem: 'down'}))
        ]
    }).addClef('treble').addTimeSignature('4/4');

    vf.draw();
}

setup()