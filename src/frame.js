function frame(source, options) {
    this.options = options;
	if (typeof source == 'undefined') {
		this.type = 'empty';
	} else if (source instanceof HTMLImageElement) {
		this.type = 'image';
		this.source = source;
	} else if (source instanceof symbol) {
		this.type = 'symbol';
		source.seek(options.symbolFrame);
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
		this.source.draw(dest);
	}
	dest.unTransform();
};

frame.prototype.animateTo = function (destFrame, fraction) {
    var outopt = {};
    for (var i in this.options) {
        if (typeof this.options[i] == 'number') {
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
