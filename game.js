
$(document).ready(function() {

    PIXI.loader
        .add('sprites/cheburek.json')
        .load(onAssetsLoaded);
});

function onAssetsLoaded() {
    var canvas = $("canvas#game")[0],
        width = +canvas.width,
        height = +canvas.height,
        renderer = PIXI.autoDetectRenderer(width, height, {view: canvas});

    var stage = new PIXI.Container();
    var frames = [];

    for (var i = 0; i < 4; i++) {
        frames.push(PIXI.Texture.fromFrame("cheburek000" + i + ""));
    }

    var cheburek = new PIXI.Sprite(frames[0]);

    cheburek.position.set(300);
    cheburek.anchor.set(0.5);

    stage.addChild(cheburek);


    var S_STAY = 0,
        S_LEFT = 1 << 0,
        S_RIGHT = 1 << 1,
        S_TOP = 1 << 2,
        S_BOTTOM = 1 << 3,
        state = S_STAY;

    var keyMasks = {
        "37": S_LEFT,
        "39": S_RIGHT,
        "38": S_TOP,
        "40": S_BOTTOM
    };

    $(window).keydown(function(e) {
        var mask = keyMasks[e.keyCode];

        if (typeof mask !== "undefined") {
            state |= mask;
        }
    }).keyup(function(e) {
        var mask = keyMasks[e.keyCode];

        if (typeof mask !== "undefined") {
            state &= ~mask;
        }
    });

    var speed = 10;

    function animate() {
        var ch = cheburek.height / 2,
            cw = cheburek.width / 2;

        cheburek.position.y = height - ch;

        var x = cheburek.position.x,
            x1 = x;

        if ((state & S_LEFT) && !(state & S_RIGHT)) {
            cheburek.texture = frames[1];
            x1 = x - speed;
        } else if ((state & S_RIGHT) && !(state & S_LEFT)) {
            cheburek.texture = frames[3];
            x1 = x + speed;
        } else {
            cheburek.texture = frames[0];
        }

        x1 = Math.max(cw, Math.min(width - cw, x1));
        cheburek.position.x = x1;

        window.cheburek = cheburek;

        

        //cheburek.rotation += 0.01;

        // render the stage container
        renderer.render(stage);

        requestAnimationFrame(animate);
    }

    animate();
}




