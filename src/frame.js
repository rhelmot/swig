function frame(source, options) {
	if (typeof options == 'undefined') {
		options = {};
	}
    this.options = options;
	if (typeof source == 'undefined') {
		this.type = 'empty';
	} else if (source instanceof HTMLImageElement) {
		this.type = 'image';
		this.source = source;
	} else if (source instanceof symbol) {
		this.type = 'symbol';
		this.source = source;
	}
}

frame.prototype.draw = function (dest) {
	if (this.type == 'empty') {
		return;
	}
	dest.transform(this.options);
	if (this.source instanceof HTMLImageElement) {
		dest.context.drawImage(this.source, -this.options.anchorX, -this.options.anchorY);
	} else if (this.source instanceof symbol) {
	    dest.context.transform(1,0,0,1,-this.options.anchorX, -this.options.anchorY);
		this.source.draw(dest);
	}
	dest.unTransform();
};

frame.prototype.animateTo = function (destFrame, fraction) {
    var outopt = {};
    for (var i in this.options) {
        if (frameprops[i].animate !== false && typeof this.options[i] == 'number' && this.options[i] != destFrame.options[i]) {
            outopt[i] = this.options[i] + ((destFrame.options[i]-this.options[i])*fraction);
            if (frameprops[i].integer) {
                outopt[i] = Math.floor(outopt[i]);
            }
        } else {
            outopt[i] = this.options[i];
        }
    }
    return new frame(this.source, outopt);
};
