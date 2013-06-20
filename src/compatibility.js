
function desync(func) {
    setTimeout(func, 0);
}

function sin(t) {
    return Math.sin(t*Math.PI/180);
}

function cos(t) {
    return Math.cos(t*Math.PI/180);
}

function tan(t) {
    return Math.tan(t*Math.PI/180);
}



// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
 
// requestAnimationFrame polyfill by Erik Möller
// fixes from Paul Irish and Tino Zijdel
 
(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

function fixmouseevents(e) {
	return {x: e.pageX - e.target.offsetLeft, y: e.pageY - e.target.offsetTop};
}


function Rectangle(x1, y1, x2, y2, usesizes) {
	this.jwalkerClassName = 'Rectangle';
	this.x1 = x1;
	this.y1 = y1;
	if (usesizes)
	{
		this.width = x2;
		this.height = y2;
		this.x2 = x1 + x2;
		this.y2 = y1 + y2;
	}
	else if (typeof x2 == 'undefined')
	{
		this.x1 = this.y1 = 0;
		this.x2 = this.width = x1;
		this.y2 = this.height = y1;
	}
	else
	{
		this.x2 = x2;
		this.y2 = y2;
		this.width = x2 - x1;
		this.height = y2 - y1;
	}
}
Rectangle.prototype.hitPoint = function (x,y) {
	return x >= this.x1 && x <= this.x2 && y >= this.y1 && y <= this.y2;
}
Rectangle.prototype.hitRect = function (rect) {
	var mx = this.width + rect.width;
	var my = this.height + rect.height;
	var dx = this.x2 - rect.x1;
	var dy = this.y2 - rect.y1;
	return 0 <= dx && dx <= mx && 0 <= dy && dy <= my;
}
