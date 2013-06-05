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
	for (var i = 0; i < this.audios.length; i++) {
		processAudio(this.audios[i], this.currentFrame, true);
    }
    return frame;
};

function processAudio(audio, frame, seeking) {
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
				if (!(shouldBe == frame || shouldBe + 1 == frame || shouldBe - 1 || frame)) {
					for (var i = 0; i < this.layers.length; i++) {
						this.layers[i].seek(shouldBe);
					}
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
}

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
        processAudio(this.audios[i], this.currentFrame, false);
    }
};

symbol.prototype.draw = function (dest) {
	for (var i = this.layers.length - 1; i >= 0; i--) {
        this.layers[i].draw(dest);
    }
};
