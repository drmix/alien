
$(document).ready(function() {

    PIXI.loader
        .add('sprites/cheburek.json')
        .load(onAssetsLoaded);
});

function onAssetsLoaded() {
    var requestFrame = window.requestAnimationFrame ||
                       window.webkitRequestAnimationFrame ||
                       window.mozRequestAnimationFrame ||
                       window.oRequestAnimationFrame ||
                       window.msRequestAnimationFrame ||
                       function(callback) {
                           setTimeout(function() { callback(new Date().getTime()); }, 1000/60 );
                       };

    var canvas = $("canvas#game")[0],
        width = +canvas.width,
        height = +canvas.height,
        renderer = PIXI.autoDetectRenderer(width, height, {view: canvas});

    var renderTexture1 = new PIXI.RenderTexture(renderer, renderer.width, renderer.height),
        renderTexture2 = new PIXI.RenderTexture(renderer, renderer.width, renderer.height),
        currentTexture = renderTexture1;

    var stage = new PIXI.Container();


    var outputSprite = new PIXI.Sprite(currentTexture);
    outputSprite.anchor.set(0.5);
    stage.addChild(outputSprite);

    var outputSprite2 = new PIXI.Sprite(currentTexture);
    outputSprite2.anchor.set(0.5);
    stage.addChild(outputSprite2);

    var text = new PIXI.Text('Press A, D or Space', {
        font : 'bold italic 20px Arial',
        stroke : '#235c16',
        strokeThickness: 3,
        fill : '#9BC495',
    });
    text.x = 10;
    text.y = 10;
    stage.addChild(text);


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
        S_JUMP = 1 << 2,
        state = S_STAY;

    var keyMasks = {
        "37": S_LEFT,
        "39": S_RIGHT,
        "65": S_LEFT,
        "68": S_RIGHT,
        "32": S_JUMP
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

    var speed = 10,
        dy = 0,
        m = 1,
        jump = -25,
        gravity = -1,
        airResistance = 0.0001,
        swapInterval = 15,
        lastSwapTime = null;


    function animate(time) {
        var ch = cheburek.height / 2,
            cw = cheburek.width / 2;

        var y = cheburek.position.y + dy;

        if (y < ch) {
            y = 0;
            dy = 0;
        } else if (y > height - ch) {
            y = height - ch;
            dy = 0;
        }

        if (y == height - ch && (state & S_JUMP)) {
            dy = jump;
        }

        dy += -dy * airResistance - gravity * m;

        cheburek.position.y = y;


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

        cheburek.rotation = 0.1 * Math.sin(time/1300);


        if (lastSwapTime === null ||
            time < lastSwapTime ||
            time > lastSwapTime + swapInterval)
        {
            console.log(time - lastSwapTime);
            lastSwapTime = time;

            var prevTexture = currentTexture;
            currentTexture = (currentTexture === renderTexture1) ? renderTexture2 : renderTexture1;

            outputSprite.texture = currentTexture;
            outputSprite2.texture = currentTexture;

            prevTexture.render(stage, null, false);
        }

        outputSprite.scale.set(0.9 + 0.2 * Math.sin(time / 800));
        outputSprite.rotation = 0.2 * Math.sin(time/2000);
        outputSprite.position.set(width/2, height/2);
        outputSprite.alpha = 0.9;

        outputSprite2.scale.set(1.1 + 0.2 * Math.sin(-time / 800));
        outputSprite2.rotation = 0.2 * Math.sin(-time/2000);
        outputSprite2.position.set(width/2, height/2);
        outputSprite2.alpha = 0.5;

        renderer.render(stage);

        requestFrame(animate);
    }

    requestFrame(animate);
}




