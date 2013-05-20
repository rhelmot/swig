function symbol(layers) {
	this.layers = layers;
	this.length = 0;
	for (var i = 0; i < layers.length; i++) {
        if (layers[i].length > this.length) {
            this.length = layers[i].length;
        }
    }
    this.currentFrame = 0;
}

symbol.prototype.seek = function (frame) {
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
};

symbol.prototype.draw = function (dest) {
	for (var i = 0; i < this.layers.length; i++) {
        this.layers[i].draw(dest);
    }
};
