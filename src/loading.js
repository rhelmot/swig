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
    	        eval('data = '+fr.result);
    	        if (data) {
    	            data.instances = {};
    	            resolveLibrary();
    	        }
    	    }
	    }
	    fr.readAsText(file);
	}
}

function resolveLibrary() {
	remainingLoads = 0;
	for (var i in data.library) {
		if (typeof data.library[i].image == 'string') {
			var img = document.createElement('img');
			img.src = data.library[i].image;
			data.library[i].image = img;
			(function (libEntry) {                          //closures heck yeah!
				libEntry.image.onload = function () {
					libEntry.loaded = true;
					registerLoaded();
				}
			}(data.library[i]));
			remainingLoads++;
		} else if (typeof data.library[i].audio == 'string') {
			var aud = document.createElement('audio');
			aud.src = data.library[i].audio;
			data.library[i].audio = aud;
			(function (libEntry) {                          //closures heck yeah!
				libEntry.audio.addEventListener('canplaythrough', function () {		//duplicate code HECK YEAH!!
					libEntry.loaded = true;
					registerLoaded();
				}, false);
			}(data.library[i]));
			remainingLoads++;
		}
	}
	if (remainingLoads == 0) {
		remainingLoads++;
		registerLoaded();
	}
}

var remainingLoads = 0;

function registerLoaded() {
	remainingLoads--;
	if (remainingLoads == 0) {
		data.symbol = loadSymbolFromTree(data);
		var deploy = document.getElementById('swig-deploy');
		deploy.innerHTML = '';
		area = new workArea({width:data.width,height:data.height}, data.symbol, deploy);
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
				var whoami = 'symbol '+tree.name+'layer '+(i+1)+' keyframe '+(j+1)+' ';
                if (frameprops[k].required && (typeof key[k] == 'undefined')) {
                    console.log(whoami + 'missing required attribute '+k);
                    continue;
                } else if (typeof key[k] == 'undefined') {
                    key[k] = frameprops[k].default;
                } else if ((frameprops[k].lowBound && key[k] < frameprops[k].lowBound) || (frameprops[k].highBoundkey && [k] > frameprops[k].highBound)) {
                    console.log(whoami+'attribute '+k+' out of bounds');
                    key[k] = frameprops[k].default;
                }
                if (frameprops[k].integer) {
                    key[k] = Math.floor(key[k]);
                }
            }
            frames[frames.length] = new frame(getSource(tree.layers[i].keyframes[j]), tree.layers[i].keyframes[j]);
            if (frames[frames.length-1].type == 'symbol') {
				frames[frames.length-1].source.parentFrame = frames[frames.length-1];
			}
        }
        layers[layers.length] = new layer(frames, tree.layers[i].length);
    }
    if (!tree.audio) {
        tree.audio = [];
    }
    for (var i = 0; i < tree.audio.length; i++) {
        if (tree.audio[i].elem) {
			tree.audio[i].elem = data.library[tree.audio[i].elem].audio;
		} else {
			console.log('Bad audio call '+tree.audio[i].elem.toString());
		}
    }
    return new symbol(layers, tree.audio, tree.callbacks, tree.bounds);
}

function getSource(keyframe) {
    if (typeof keyframe.source != 'string') {
        console.log('Bad source '+keyframe.source.toString());
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
            console.log('Bad resource call '+keyframe.source);
            return undefined;
        }
    }
}

function stuff() {
    document.body.style.backgroundColor = 'grey';
};
