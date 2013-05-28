//swig.js

//Just Andrew Dutcher fooling around, trying to see if he can expend zero effort at all and come up with a viable replacement for flash animation on the web using the HTML5 stack.

var frameprops = {
    source: {required: true},
    frame: {required: true},
    x: {required: true, integer: true},
    y: {required: true, integer: true},
    scaleX: {default: 1},
    scaleY: {default: 1},
    skewX: {default: 0},
    skewY: {default: 0},
    anchorX: {default: 0, integer: true},
    anchorY: {default: 0, integer: true},
    animated: {default: false},
    animationEase: {default: 0, animate: false, lowBound: -1, highBound: 1},
    alpha: {default: 1, lowBound: 0, highBound: 1},
    rot: {default: 0},
    subSymPlay: {default: 0, lowBound: 0, highBound: 3, integer: true, animate: false},
    subSymStartFrame: {default: 0, lowBound: 0, integer: true, animate: false}
}

function loadSymbolFromTree(tree) {
    var layers = [];
    for (var i = 0; i < tree.layers.length; i++) {     //loop layers
        var frames = [];
        for (var j = 0; j < tree.layers[i].keyframes.length; j++) {        //loop frames
            var key = tree.layers[i].keyframes[j];
            for (var k in frameprops) {
                if (frameprops[k].required && (typeof key[k] == 'undefined')) {
                    console.log('frame missing required attribute '+k);
                    continue;
                } else if (typeof key[k] == 'undefined') {
                    key[k] = frameprops[k].default;
                } else if ((frameprops[k].lowBound && key[k] < frameprops[k].lowBound) || (frameprops[k].highBoundkey && [k] > frameprops[k].highBound)) {
                    console.log('frame attribute '+k+' out of bounds');
                    key[k] = frameprops[k].default;
                }
                if (frameprops[k].integer) {
                    key[k] = Math.floor(key[k]);
                }
            }
            frames[frames.length] = new frame(getSource(tree.layers[i].keyframes[j].source), tree.layers[i].keyframes[j]);
        }
        layers[layers.length] = new layer(frames, tree.layers[i].length);
    }
    return new symbol(layers);
}

function getSource(name) {
    if (typeof name != 'string') {
        console.log('Bad source: '+name.toString());
        return undefined;
    } else if (name == '_empty') {
        return undefined;
    } else {
        var res = resources[name];
        if (res.sym) {
            return loadSymbolFromTree(res.sym);
        } else if (res.img) {
            return res.img;
        } else if (res.id) {
            res.img = document.getElementById(res.id);
            return res.img;
        } else {
            console.log('Bad resource call: '+name);
            return undefined;
        }
    }
}


function run(symbol, dest) {
    var lastDrawn = -1;
    function drawRun() {
        if (lastDrawn != symbol.currentFrame) {
            dest.clear();
            symbol.draw(dest);
            lastDrawn = symbol.currentFrame;
        }
    }
    setInterval(function () {
        symbol.nextFrame();
        requestAnimationFrame(drawRun);
    },Math.ceil(1000/data.fps));
    drawRun();
}


var data = {
    fps: 30,
    layers: [
        {
            length: 120,
            keyframes: [
                {
                    frame: 0,
                    source: 'suns',
                    x: 325,
                    y: 325,
                    subSymPlay: 2,
                    subSymStartFrame: 30,
                    anchorX: 325,
                    anchorY: 225,
                    rot: 0,
                    animated: true
                },
                {
                    frame: 119,
                    source: 'suns',
                    x: 325,
                    y: 325,
                    subSymPlay: 2,
                    subSymStartFrame: 29,
                    anchorX: 325,
                    anchorY: 225,
                    rot: 30
                }
            ]
        }
    ]
};

var resources = {
    sun: {
        id: 'img1'
    },
    suns: {
        sym: {
            layers: [
                {
                    length: 120,
                    keyframes: [
                        {
                            frame: 0,
                            source: 'sun',
                            x: 0,
                            y: 0,
                            animated: true,
                            animationEase: 1,
                            anchorX: 128,
                            anchorY: 128
                        },
                        {
                            frame: 24,
                            source: 'sun',
                            x: 197,
                            y: 97,
                            animated: true,
                            animationEase: -1,
                            alpha: 0.5,
                            rot: 45,
                            anchorX: 128,
                            anchorY: 128
                        },
                        {
                            frame: 48,
                            source: 'sun',
                            x: 394,
                            y: 194,
                            rot: 90,
                            anchorX: 128,
                            anchorY: 128
                        },
                        {
                            frame: 60,
                            source: 'sun',
                            x: 394,
                            y: 194,
                            animated: true,
                            animationEase: 1,
                            rot: 90,
                            anchorX: 128,
                            anchorY: 128
                        },
                        {
                            frame: 84,
                            source: 'sun',
                            x: 197,
                            y: 97,
                            animated: true,
                            animationEase: -1,
                            alpha: 0.25,
                            rot: 45,
                            anchorX: 128,
                            anchorY: 128
                        },
                        {
                            frame: 108,
                            source: 'sun',
                            x: 0,
                            y: 0,
                            anchorX: 128,
                            anchorY: 128
                        }
                    ]
                },
                {
                    length: 60,
                    keyframes: [
                        {
                            frame: 0,
                            source: 'sun',
                            x: 200,
                            y: 180
                        }
                    ]
                }
            ]}
        }
};

window.onload = function () {
    sym = loadSymbolFromTree(data);
    area = new workArea({left:300,top:300,width:650,height:450});
    run(sym,area);
    document.body.style.backgroundColor = 'grey';
};
