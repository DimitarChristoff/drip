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
		text = decodeURIComponent(window.location.hash),
		pt = new particleText(document.getElementById('freezer'), {
			text: text ? String.rot13(text).replace('#', '') : 'HELLO WORLD'
		});

	(function(){
		var options = document.querySelector('div.optionsContainer'),
			temp,
			t,
			key,
			iterator = function(key){
				temp = document.createElement('input');
				temp.name = key;
				temp.value = pt.options[key];
				temp.placeholder = temp.title = 'Enter ' + key;
				temp.addEventListener('change', function(){
					pt.options[key] = this.value;
				});
				options.appendChild(temp);
			};

		for (key in pt.options){
			t = typeof pt.options[key];
			t !== 'object' && t !== 'boolean' && iterator(key);
		}
	}());


	document.getElementById('setter').addEventListener('change', function(){
		var val = this.value.toUpperCase();
		pt.setText(val);
		window.location.hash = encodeURIComponent(String.rot13(val));
		this.value = '';
	}, false);

	document.getElementById('stop').addEventListener('click', function(){
		var method = pt.frame ? 'stop' : 'start',
			text = pt.frame ? 'start' : 'stop';

		pt[method]();
		this.innerHTML = text;
	}, false);

});