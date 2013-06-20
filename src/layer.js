function layer(keyframes, length) {
	this.currentFrame = -1;
	this.frames = [];
	if (keyframes[0].options.frame != 0) {
	    console.log('Can\'t process layer: first keyframe not first frame');
	    return false;
	}
	this.keyframes = keyframes;
	this.length = length;
	for (var i = 0; i < keyframes.length; i++) {
	    this.frames[keyframes[i].options.frame] = i;
	    this.keyframes[i].parentLayer = this;
	}
	var last;
	for (var i = 0; i < length; i++) {
		if (typeof this.frames[i] != 'undefined') {
			last = this.frames[i];
		} else {
		    this.frames[i] = last;
		}
	}
}

layer.prototype.getCurrentKeyframe = function () {
    return this.currentFrame < this.frames.length ? this.keyframes[this.frames[this.currentFrame]] : new frame();
};

layer.prototype.seek = function (frameNumber) {
    this.goto(frameNumber);
};

layer.prototype.nextFrame = function () {
	this.goto(this.currentFrame + 1);
};

layer.prototype.goto = function (frameNumber) {
	this.currentFrame = frameNumber;
	var key = this.getCurrentKeyframe();
	if (key.options.frame == this.currentFrame && key.options.code) {
		key.options.code(this.parentSymbol);
	}
	if (key.type == 'symbol' && !key.options.subSymInstance) {
	    key.source.seek(calcSymbolFrame(key, frameNumber));
	}
}

layer.prototype.draw = function (dest) {
    var key = this.getCurrentKeyframe();
    if (key.options.animated) {
        var fraction = (this.currentFrame-this.getCurrentKeyframe().options.frame)/(this.keyframes[this.frames[this.currentFrame]+1].options.frame-this.getCurrentKeyframe().options.frame);
        if (key.options.animationEase != 0) {
            fraction += key.options.animationEase*fraction*(fraction-1);
        }
        key.animateTo(this.keyframes[this.frames[this.currentFrame]+1], fraction).draw(dest);
    } else {
        key.draw(dest);
    }
};

function calcSymbolFrame(containingKeyframe, currentFrame) {
    switch (containingKeyframe.options.subSymPlay) {
        case 0:             //single frame
        return containingKeyframe.options.subSymStartFrame;
        case 1:             //play once
        var frm = currentFrame - containingKeyframe.options.frame + containingKeyframe.options.subSymStartFrame;
        if (frm >= containingKeyframe.source.length) {
            frm = containingKeyframe.source.length - 1;
        }
        return frm;
        case 2:             //loop
        return (currentFrame - containingKeyframe.options.frame + containingKeyframe.options.subSymStartFrame) % containingKeyframe.source.length;
    }
}
