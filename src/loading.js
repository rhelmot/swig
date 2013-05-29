function clearState() {
	data = false;
	kill();
	var dep = document.getElementById('swig-deploy');
	if (dep) {
		dep.innerHTML = '';
	}
	window.onload();
}

window.onload = function () {
	var deploy = document.getElementById('swig-deploy');
	if (!deploy) {
		console.log('No deployment pad. Canceling.');
		return;
	}
	if (typeof data == 'object') {
	
	} else {
		prompt();
	}
};

function prompt () {
	document.getElementById('swig-deploy').innerHTML = '<input type="file" id="swigfile" /> <input type="button" value="Use" onclick="loadswigfile()"/>';
}

function loadswigfile() {
	var file = document.getElementById('swigfile').files[0];
	if (file) {
	    var fr = new FileReader();
	    fr.onloadend = function () {
	        if (fr.readyState == 2) {
    	        data = JSON.parse(fr.result);
    	        if (data) {
    	            data.instances = {};
    	            var deploy = document.getElementById('swig-deploy');
    	            deploy.innerHTML = '';
                    area = new workArea({left:300,top:300,width:650,height:450}, {}, deploy);
    	            resolveLibrary();
    	        }
    	    }
	    }
	    fr.readAsText(file);
	}
}

var imgdone = false;

function resolveLibrary() {
    if (!imgdone) {
        var innerImgDone = true;
        for (var i in data.library) {
            if (typeof data.library[i].image == 'string') {
                var img = document.createElement('img');
                img.src = data.library[i].image;
                data.library[i].image = img;
                (function (libEntry) {                          //closures heck yeah!
                    libEntry.image.onload = function () {
                        libEntry.loaded = true;
                        resolveLibrary();
                    }
                }(data.library[i]));
            } else if (!data.library[i].loaded && data.library[i].image) {
                innerImgDone = false;
            }
        }
        imgdone = innerImgDone;
    }
    if (imgdone) {
        data.symbol = loadSymbolFromTree(data);
        run(data.symbol, area);
    }
}

function loadSymbolFromTree(tree) {
    var layers = [];
    for (var i = 0; i < tree.layers.length; i++) {     //loop layers
        var frames = [];
        for (var j = 0; j < tree.layers[i].keyframes.length; j++) {        //loop frames
            var key = tree.layers[i].keyframes[j];
            for (var k in frameprops) {
                if (frameprops[k].required && (typeof key[k] == 'undefined')) {
                    console.log('layer '+(i+1)+' keyframe '+(j+1)+' missing required attribute '+k);
                    continue;
                } else if (typeof key[k] == 'undefined') {
                    key[k] = frameprops[k].default;
                } else if ((frameprops[k].lowBound && key[k] < frameprops[k].lowBound) || (frameprops[k].highBoundkey && [k] > frameprops[k].highBound)) {
                    console.log('frame attribute '+k+' out of bounds');
                    key[k] = frameprops[k].default;
                }
                if (frameprops[k].integer) {
                    key[k] = Math.floor(key[k]);
                }
            }
            frames[frames.length] = new frame(getSource(tree.layers[i].keyframes[j]), tree.layers[i].keyframes[j]);
        }
        layers[layers.length] = new layer(frames, tree.layers[i].length);
    }
    return new symbol(layers);
}

function getSource(keyframe) {
    if (typeof keyframe.source != 'string') {
        console.log('Bad source: '+keyframe.source.toString());
        return undefined;
    } else if (keyframe.source == '_empty') {
        return undefined;
    } else {
        var res = data.library[keyframe.source];
        if (res.image) {
            return res.image;
        } else if (res.sym) {
            if (typeof res.common == 'undefined') {
                res.common = loadSymbolFromTree(res.sym);
            }
            if (keyframe.subSymInstance) {
                if (typeof data.instances[keyframe.subSymInstance] == 'undefined') {
                    data.instances[keyframe.subSymInstance] = loadSymbolFromTree(res.sym);
                }
                return data.instances[keyframe.subSymInstance];
            } else {
                return res.common;
            }
        } else {
            console.log('Bad resource call: '+keyframe.source);
            return undefined;
        }
    }
}

function stuff() {
    document.body.style.backgroundColor = 'grey';
};
