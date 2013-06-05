//swig.js

//Just Andrew Dutcher fooling around, trying to see if he can expend zero effort at all and come up with a viable replacement for flash animation on the web using the HTML5 stack.

var data;



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
    subSymStartFrame: {default: 0, lowBound: 0, integer: true, animate: false},
    subSymInstance: {default: undefined, animate: false}
}


var killcode = -1;

function kill() {
	if (killcode >= 0) {
		clearInterval(killcode);
		killcode = -1;
	}
}

function run(symbol, dest) {
    var lastDrawn = -1;
    function drawRun() {
        //if (lastDrawn != symbol.currentFrame) {
            dest.clear();
            symbol.draw(dest);
            lastDrawn = symbol.currentFrame;
        //}
    }
    killcode = setInterval(function () {
        if (symbol.playing) {
            symbol.nextFrame();
        }
        for (var i in data.instances) {
            if (data.instances[i].playing) {
                data.instances[i].nextFrame();
            }
        }
        requestAnimationFrame(drawRun);
    },Math.ceil(1000/data.fps));
    //drawRun();		//don't draw before we run since we init everything at frame -1
}


