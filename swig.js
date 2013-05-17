//swig.js

//Just Andrew Dutcher fooling around, trying to see if he can expend zero effort at all and come up with a viable replacement for flash on the web using the HTML5 stack.

function workArea(options, callbacks) {
	this.canvas = document.createElement('canvas');
	this.context = this.canvas.getContext('2d');
	this.canvas.style.position = 'absolute';
	this.canvas.style.left = options.left;
	this.canvas.style.top = options.top;
	this.canvas.style.width = options.width;
	this.canvas.style.height = options.height;
	document.body.appendChild(this.canvas);
}


function symbol(layers) {
	this.layers = layers;
}

symbol.prototype.draw = function (dest, frame) {
	
}

function layer(frames) {
	this.frames = frames;
	this.currentFrame = 0;
	this.length = frames.length;
	this.keyframeList = [];
	for (var i = 0; i < this.length; i++) {
		if (typeof frames[i] != 'undefined') {
			this.keyFrameList[this.keyFrameList.length] = i;
		}
	}
	this.currentKeyframe = 0;
}

layer.prototype.seek = function (frameNumber) {
	if (frameNumber == (this.currentFrame + 1)) {
		return this.nextFrame();
	} else if (frameNumber == this.currentFrame) {
		return frameNumber;
	} else if (frameNumber == 0) {
		this.currentFrame = 0;
		this.currentKeyframe = 0;
		return 0;
	} else if (frameNumber >= this.length) {
		this.currentFrame = this.length - 1;
		this.currentKeyframe = this.keyframeList.length - 1;
		return this.currentFrame;
	} else {
		this.currentFrame = frameNumber;
		for (var i = 0; i < this.keyframeList.length; i++) {			//TODO: optimize keyframe finding in seeking
			if (this.currentFrame >= this.keyframeList[i]) {
				this.currentKeyframe = i;
			}
		}
		return frameNumber;
	}
}

layer.prototype.nextFrame = function () {
	this.currentFrame++;
	if ((this.currentKeyframe != this.keyframeList.length-1) && (this.currentFrame == this.keyframeList[this.currentKeyframe + 1])) {
		this.currentKeyframe++;
	} else {
		if (this.frames[this.keyframeList[this.currentKeyframe]].type == 'symbol' && this.frames[this.keyframeList[this.currentKeyframe]].options.play != 'singleFrame') {
						//TODO: initialize subsymbols to proper frames
		}
	}
};



function frame(source, options) {
	if (typeof source == 'undefined') {
		this.type = 'empty';
	} else if (source instanceof HTMLImageElement) {
		this.type = 'image';
		this.options = options;
		this.source = source;
	} else if (source instanceof symbol) {
		this.type = 'symbol';
		this.options = options;
		source.seek(options.symbolFrame);
		this.source = source;
	}
}

frame.prototype.draw = function (dest) {
	if (this.type == 'empty') {
		return;
	}
	if (this.source instanceof HTMLImageElement) {
		dest.context.drawImage(this.source, 0, 0);
	} else if (this.source instanceof symbol) {
		
		//save canvas
		//transform canvas
		//draw item
		//reload canvas
	}
}
