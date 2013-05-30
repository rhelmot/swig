function symbol(layers, audios) {
	this.layers = layers;
	this.audios = audios;
	this.length = 0;
	for (var i = 0; i < layers.length; i++) {
	    this.layers[i].parentSymbol = this;
        if (layers[i].length > this.length) {
            this.length = layers[i].length;
        }
    }
    this.currentFrame = -1;
    this.playing = true;
}

symbol.prototype.seek = function (frame) {
    if (frame == this.currentFrame) {
        return frame;
    }
    if (frame >= this.maxFrames) {
        frame = this.maxFrames - 1;
    }
    for (var i = 0; i < this.layers.length; i++) {
        this.layers[i].seek(frame);
    }
    this.currentFrame = frame;
    return frame;
};

symbol.prototype.nextFrame = function () {
    if (this.currentFrame + 1 >= this.length) {
        this.seek(0);
        return;
    } else { 
        for (var i = 0; i < this.layers.length; i++) {
            this.layers[i].nextFrame();
        }
        this.currentFrame++;
    }
    for (var i = 0; i < this.audios.length; i++) {
        if (this.currentFrame == this.audios[i].start) {
            this.audios[i].elem.currentTime = 0;
            this.audios[i].elem.play();
        }
    }
};

symbol.prototype.draw = function (dest) {
	for (var i = this.layers.length - 1; i >= 0; i--) {
        this.layers[i].draw(dest);
    }
};
