function layer(keyframes, length) {
	this.currentFrame = 0;
	this.frames = [];
	if (keyframes[0].options.frame != 0) {
	    console.log('Can\'t process layer: first keyframe not first frame');
	    return false;
	}
	this.keyframes = keyframes;
	this.length = length;
	for (var i = 0; i < keyframes.length; i++) {
	    this.frames[keyframes[i].options.frame] = i;
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
    return this.keyframes[this.frames[this.currentFrame]];
};

layer.prototype.seek = function (frameNumber) {
	if (frameNumber == this.currentFrame) {
		return frameNumber;
	} else if (frameNumber == 0) {
		this.currentFrame = 0;
		return 0;
	} else if (frameNumber >= this.length) {
		this.currentFrame = this.length - 1;
		return this.currentFrame;
	} else {
		this.currentFrame = frameNumber;
		return frameNumber;
	}
};

layer.prototype.nextFrame = function () {
	return this.seek(this.currentFrame+1);
};

layer.prototype.draw = function (dest) {
    var key = this.getCurrentKeyframe();
    if (key.options.animated) {
        var fraction = (this.currentFrame-this.getCurrentKeyframe().options.frame)/(this.keyframes[this.frames[this.currentFrame]+1].options.frame-this.getCurrentKeyframe().options.frame);
        if (key.options.animationEase != 0) {
            fraction += key.options.animationEase*fraction*(fraction-1);
        }
        key.animateTo(this.keyframes[this.frames[this.currentFrame]+1], fraction).draw(dest);
    } else {
        this.getCurrentKeyframe().draw(dest);
    }
};
