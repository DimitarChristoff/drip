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
			fontSize: 78
		}),

		extend: particleText,

		say: function(what, delay){
			var i = -1,
				cb = function(line){
					this.setText(line.toUpperCase());
				};

			this.options.clearAfter && what.push('');

			while(what.length){
				setTimeout(cb.bind(this, what.shift()), delay * ++i);
			}
		}
	});

	var s = new storyText(document.getElementById('freezer'));
	s.say('hello peoples,greetz to:,#javascript,#mootools,transitions own'.split(','), 5000);
});