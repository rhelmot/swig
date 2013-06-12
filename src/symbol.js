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

symbol.prototype.pause = function () {
    this.playing = false;
    for (var i = 0; i < this.audios.length; i++) {
        if (this.audios[i].sync && this.currentFrame >= this.audios[i].start && this.currentFrame < this.audios[i].end) {
            this.audios[i].elem.pause();
        }
    }
};

symbol.prototype.play = function () {
    this.playing = true;
    for (var i = 0; i < this.audios.length; i++) {
        if (this.audios[i].sync && this.currentFrame >= this.audios[i].start && this.currentFrame < this.audios[i].end) {
            this.audios[i].elem.play();
        }
    }
};

symbol.prototype.goto = function (frame) {                              //do not use clientside-- very dangerous unless properly checked!
    this.currentFrame = frame;
	for (var i = 0; i < this.layers.length; i++) {
		this.layers[i].goto(frame);
    }
};

symbol.prototype.seek = function (frame) {
    if (frame == this.currentFrame) {
        return frame;
    }
    if (frame >= this.maxFrames) {
        frame = this.maxFrames - 1;
    }
    this.goto(frame);
    for (var i = 0; i < this.audios.length; i++) {
        this.processAudio(this.audios[i], this.currentFrame, true);
    }
    return frame;
};

symbol.prototype.processAudio = function (audio, frame, seeking) {
	if (audio.sync) {
		if (frame < audio.start || frame >= audio.end) {
			if (!audio.elem.paused) {
				audio.elem.pause();
			}
		} else {
			if (seeking || audio.elem.paused) {
				audio.elem.currentTime = (frame - audio.start) / data.fps;
				audio.elem.play();
			} else {
				var shouldBe = Math.floor((audio.elem.currentTime * data.fps) + audio.start);
				if (!(shouldBe == frame || shouldBe + 1 == frame || shouldBe - 1 == frame)) {
					this.goto(shouldBe);
				}
			}
		}
	} else {
		if (frame == audio.start) {
			audio.elem.currentTime = 0;
			audio.elem.play();
		} else if (!audio.elem.paused && (frame < audio.start || frame >= audio.end)) {
			audio.elem.pause();
		}
	}
};

symbol.prototype.nextFrame = function () {
    if (this.currentFrame + 1 >= this.length) {
        this.seek(0);
        return;
    } else { 
        this.goto(this.currentFrame + 1);
    }
    for (var i = 0; i < this.audios.length; i++) {
        this.processAudio(this.audios[i], this.currentFrame, false);
    }
};

symbol.prototype.draw = function (dest) {
	for (var i = this.layers.length - 1; i >= 0; i--) {
        this.layers[i].draw(dest);
    }
};
