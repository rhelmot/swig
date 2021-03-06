function workArea(options, callbacks, dest) {
	if (typeof dest == 'undefined') {
		dest = document.body;
	}
	if (typeof callbacks == 'undefined') {
	    callbacks = {};
	}
	this.canvas = document.createElement('canvas');
	this.context = this.canvas.getContext('2d');
	var dummy = {};
	var props = {
        left: {bounds:document.body.clientWidth, default: 0, dest: this.canvas.style},
        top: {bounds:document.body.clientHeight, default: 0, dest: this.canvas.style},
        width: {bounds:document.body.clientWidth, default: 650, dest: this.canvas},
        height: {bounds:document.body.clientHeight, default: 450, dest: this.canvas},
        originX: {bounds:document.body.clientWidth, default: 0, dest: dummy},
        originY: {bounds:document.body.clientHeight, default: 0, dest: dummy}
    };
	for (var i in props) {
	    var val = options[i];
	    if (typeof val == 'undefined') {
	        val = props[i].default;
	    } else if (typeof val == 'string' && val[val.length-1] == '%') {
	        val = props[i].bounds * parseInt(val) / 100;
	    }
	    props[i].dest[i] = val;
	}
	this.origin = {x:dummy.originX, y:dummy.originY};
	this.tpoints = {};
	function callbackFactory(src, func) {
		if (typeof src[func] == 'function') {
			return function (e) {
				return src[func](fixmouseevents(e));
			};
		} else {
			return function () {};
		}
	}
	var callbackNames = ['onmousedown', 'onmousemove', 'onmouseup', 'onmouseout'];
	for (var i = 0; i < callbackNames.length; i++) {
		this.canvas[callbackNames[i]] = callbackFactory(callbacks, callbackNames[i]);
	}
	this.canvas.tabIndex = 1;
	this.canvas.onselectstart = function () { return false; };
	this.canvas.style.outline = 'none';
	this.canvas.workArea = this;									//awwww yeah recursion
	this.context.setTransform(1,0,0,1,this.origin.x,this.origin.y);
	dest.appendChild(this.canvas);
}

workArea.prototype.clear = function () {
    this.context.clearRect(-this.origin.x,-this.origin.y,this.canvas.width,this.canvas.height);
};

workArea.prototype.transform = function (options) {
    this.context.save();
    this.context.transform(options.scaleX, options.skewX, options.skewY, options.scaleY, options.x, options.y);
    this.context.transform(cos(options.rot), -sin(options.rot), sin(options.rot), cos(options.rot), 0, 0);
    this.context.globalAlpha *= options.alpha;
};

workArea.prototype.unTransform = function () {
    this.context.restore();
};

workArea.prototype.drawArrow = function (fromx, fromy, tox, toy) {
    var headlen = 10;   // length of head in pixels
    var angle = Math.atan2(toy-fromy,tox-fromx);
    this.context.beginPath();
    this.context.moveTo(fromx, fromy);
    this.context.lineTo(tox, toy);
    this.context.lineTo(tox-headlen*Math.cos(angle-Math.PI/6),toy-headlen*Math.sin(angle-Math.PI/6));
    this.context.moveTo(tox, toy);
    this.context.lineTo(tox-headlen*Math.cos(angle+Math.PI/6),toy-headlen*Math.sin(angle+Math.PI/6));
    this.context.stroke();
};

workArea.prototype.drawDot = function (centerX, centerY, radius, color, outline) {
	this.context.beginPath();
	this.context.fillStyle = color;
	this.context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    this.context.fill();
	if (outline) {
		this.context.strokeStyle = 'grey';
		this.context.stroke();
	}
};

workArea.prototype.drawX = function (centerX, centerY, radius, color) {
	this.context.beginPath();
	this.context.strokeStyle = color;
	this.context.moveTo(centerX - radius, centerY - radius);
	this.context.lineTo(centerX + radius, centerY + radius);
	this.context.moveTo(centerX - radius, centerY + radius);
	this.context.lineTo(centerX + radius, centerY - radius);
	this.context.stroke();
};

workArea.prototype.onmousedown = function (e) {
	
};

workArea.prototype.onmouseup = function (e) {
	
};

workArea.prototype.onmouseout = function (e) {
	
};

workArea.prototype.onmousemove = function (e) {
	
};


