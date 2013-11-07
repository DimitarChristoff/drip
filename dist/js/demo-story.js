require.config({
	urlArgs: 'b=' + +new Date
});

define(function(require){
	'use strict';

	String.rot13 = function(str){
		return str.replace(/[a-zA-Z]/g, function(c){
			return String.fromCharCode((c <= 'Z' ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26);
		});
	};

	var particleText = require('../../src/drip'),
		prime = require('components/primish/prime');

	var storyText = prime({

		options: prime.merge(particleText.prototype.options, {
			clearAfter: true,
			fontSize: 110,
			fontFamily: 'Racing Sans One',
			strength: 30,
			delay: 8000,
			colourMap: {
				// drop colours
				0: [170,170,200],
				// over text colours
				1: [200,200,230]
			}
		}),

		extend: particleText,

		timers: [],

		say: function(what, delay){
			delay || (delay = this.options.delay);
			var i = -1,
				cb = function(line){
					this.setText(line.toUpperCase());
				};

			while(this.timers.length)
				clearTimeout(this.timers.shift());

			this.options.clearAfter && what.push('');

			while(what.length){
				this.timers.push(setTimeout(cb.bind(this, what.shift()), delay * ++i));
			}
		}
	});

	var e = document.getElementById('freezer');
	e.width =  document.body.offsetWidth;

	var s = new storyText(e);

	var t = document.getElementById('t'),
		out = function(){
			var val = this.value.split('\n');
			s.say(val.slice());
			window.location.hash = encodeURIComponent(String.rot13(val.join(';')));
		};

	t.addEventListener('change', out, false);

	var text = decodeURIComponent(window.location.hash);
	if (text){
		t.value = String.rot13(text).replace('#', '').split(';').join('\n');
	}

	out.call(t);

	(function(){
		var options = document.querySelector('div.optionsContainer'),
			temp,
			key,
			t,
			iterator = function(key){
				temp = document.createElement('input');
				temp.name = key;
				temp.value = s.options[key];
				temp.placeholder = temp.title = 'Enter ' + key;
				temp.addEventListener('change', function(){
					s.options[key] = this.value;
				});
				options.appendChild(temp);
			};

		for (key in s.options){
			t = typeof s.options[key];
			t !== 'object' && t !== 'boolean' && iterator(key);
		}
	}());

	

});